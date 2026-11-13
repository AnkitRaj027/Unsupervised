import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
from pathlib import Path

from config import get_dataset_path
from ml.preprocessor import compute_readability_metrics
from ml.clustering import PolarClusterModel
from ml.search import PolarSearchEngine
from ml.evaluation import evaluate_clustering_performance
from models.schemas import Resource, ClusterSummary, EvaluationMetrics, DashboardStats

class PolarMLPipeline:
    _instance: Optional["PolarMLPipeline"] = None

    def __init__(self, n_clusters: int = 10):
        self.n_clusters = n_clusters
        self.df: Optional[pd.DataFrame] = None
        self.cluster_model: Optional[PolarClusterModel] = None
        self.search_engine: Optional[PolarSearchEngine] = None
        self.evaluation_results: Optional[Dict[str, Any]] = None
        self.is_initialized = False

    @classmethod
    def get_instance(cls) -> "PolarMLPipeline":
        if cls._instance is None:
            cls._instance = PolarMLPipeline()
            cls._instance.initialize()
        return cls._instance

    def initialize(self) -> "PolarMLPipeline":
        """
        Loads the dataset, calculates readability statistics, fits the TF-IDF K-Means model,
        enriches data with cluster metadata, and initializes the search engine.
        """
        dataset_path = get_dataset_path()
        self.df = pd.read_csv(dataset_path)
        
        # 1. Linguistic & Readability analysis
        readability_records = [
            compute_readability_metrics(desc) for desc in self.df["description"]
        ]
        self.df["flesch_reading_ease"] = [r["flesch_reading_ease"] for r in readability_records]
        self.df["heuristic_reading_level"] = [r["heuristic_estimated_level"] for r in readability_records]
        
        # 2. Fit unsupervised clustering model
        self.cluster_model = PolarClusterModel(n_clusters=self.n_clusters, random_state=42)
        self.cluster_model.fit(self.df)
        
        # 3. Enrich DataFrame with cluster assignments and names
        self.df["cluster_id"] = self.cluster_model.cluster_labels
        cluster_summaries = self.cluster_model.get_cluster_summary()
        id_to_name = {c["cluster_id"]: c["name"] for c in cluster_summaries}
        self.df["cluster_label"] = self.df["cluster_id"].map(id_to_name)
        
        # 4. Initialize Search Engine
        self.search_engine = PolarSearchEngine(
            vectorizer=self.cluster_model.vectorizer,
            tfidf_matrix=self.cluster_model.tfidf_matrix
        )
        
        # 5. Compute rigorous evaluation metrics
        self.evaluation_results = evaluate_clustering_performance(
            tfidf_matrix=self.cluster_model.tfidf_matrix,
            cluster_labels=self.cluster_model.cluster_labels,
            n_clusters=self.n_clusters,
            total_samples=len(self.df)
        )
        
        self.is_initialized = True
        return self

    def get_resources(
        self,
        query: Optional[str] = None,
        topic: Optional[str] = None,
        content_type: Optional[str] = None,
        reading_level: Optional[str] = None,
        target_audience: Optional[str] = None,
        complexity: Optional[int] = None,
        cluster_id: Optional[int] = None,
        sort_by: str = "default",
        page: int = 1,
        page_size: int = 12
    ) -> Dict[str, Any]:
        """
        Filters, searches, sorts, and paginates educational resources.
        """
        if not self.is_initialized:
            self.initialize()
            
        filtered_df = self.df.copy()
        
        # Free-text TF-IDF search
        similarity_map = {}
        if query and query.strip():
            search_results = self.search_engine.search(query.strip(), self.df, top_k=200)
            if not search_results:
                # Query yielded zero matches
                return {
                    "total": 0,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": 0,
                    "items": []
                }
            matching_indices = [r["index"] for r in search_results]
            similarity_map = {r["resource_id"]: r["similarity_score"] for r in search_results}
            filtered_df = filtered_df.iloc[matching_indices]
            
        # Metadata Filters
        if topic and topic.strip():
            filtered_df = filtered_df[filtered_df["topic"].str.lower() == topic.strip().lower()]
        if content_type and content_type.strip():
            filtered_df = filtered_df[filtered_df["content_type"].str.lower() == content_type.strip().lower()]
        if reading_level and reading_level.strip():
            filtered_df = filtered_df[filtered_df["reading_level"].str.lower() == reading_level.strip().lower()]
        if target_audience and target_audience.strip():
            filtered_df = filtered_df[filtered_df["target_audience"].str.lower() == target_audience.strip().lower()]
        if complexity is not None:
            filtered_df = filtered_df[filtered_df["scientific_complexity"] == complexity]
        if cluster_id is not None:
            filtered_df = filtered_df[filtered_df["cluster_id"] == cluster_id]

        # Sorting
        if sort_by == "relevance" and similarity_map:
            # Already sorted by similarity
            pass
        elif sort_by == "complexity_asc":
            filtered_df = filtered_df.sort_values(by="scientific_complexity", ascending=True)
        elif sort_by == "complexity_desc":
            filtered_df = filtered_df.sort_values(by="scientific_complexity", ascending=False)
        elif sort_by == "word_count_desc":
            filtered_df = filtered_df.sort_values(by="word_count", ascending=False)
        elif sort_by == "title_asc":
            filtered_df = filtered_df.sort_values(by="title", ascending=True)
        else:
            # Default sorting by resource_id
            filtered_df = filtered_df.sort_values(by="resource_id", ascending=True)
            
        total_items = len(filtered_df)
        total_pages = max(1, (total_items + page_size - 1) // page_size)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        page_records = filtered_df.iloc[start_idx:end_idx]
        items = []
        for _, row in page_records.iterrows():
            kw_list = [k.strip() for k in str(row["keywords"]).split(";") if k.strip()]
            r = Resource(
                resource_id=row["resource_id"],
                title=row["title"],
                content_type=row["content_type"],
                topic=row["topic"],
                description=row["description"],
                reading_level=row["reading_level"],
                target_audience=row["target_audience"],
                scientific_complexity=int(row["scientific_complexity"]),
                word_count=int(row["word_count"]),
                keywords=kw_list,
                cluster_id=int(row["cluster_id"]),
                cluster_label=str(row["cluster_label"]),
                similarity_score=similarity_map.get(row["resource_id"])
            )
            items.append(r)
            
        return {
            "total": total_items,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "items": items
        }

    def get_resource_by_id(self, resource_id: str) -> Optional[Dict[str, Any]]:
        if not self.is_initialized:
            self.initialize()
            
        matches = self.df[self.df["resource_id"] == resource_id]
        if matches.empty:
            return None
            
        row_idx = matches.index[0]
        row = matches.iloc[0]
        kw_list = [k.strip() for k in str(row["keywords"]).split(";") if k.strip()]
        
        # Find similar resources via TF-IDF cosine similarity
        similar_items = self.search_engine.find_similar_resources(row_idx, self.df, top_k=4)
        
        resource_data = {
            "resource_id": row["resource_id"],
            "title": row["title"],
            "content_type": row["content_type"],
            "topic": row["topic"],
            "description": row["description"],
            "reading_level": row["reading_level"],
            "target_audience": row["target_audience"],
            "scientific_complexity": int(row["scientific_complexity"]),
            "word_count": int(row["word_count"]),
            "keywords": kw_list,
            "cluster_id": int(row["cluster_id"]),
            "cluster_label": str(row["cluster_label"]),
            "flesch_reading_ease": float(row["flesch_reading_ease"]),
            "heuristic_reading_level": str(row["heuristic_reading_level"]),
            "similar_resources": similar_items
        }
        return resource_data

    def get_cluster_summaries(self) -> List[ClusterSummary]:
        if not self.is_initialized:
            self.initialize()
        raw_summaries = self.cluster_model.get_cluster_summary()
        results = []
        for summary in raw_summaries:
            c_id = summary["cluster_id"]
            # get top 3 sample resources for this cluster
            c_df = self.df[self.df["cluster_id"] == c_id].head(3)
            sample_resources = []
            for _, row in c_df.iterrows():
                kw_list = [k.strip() for k in str(row["keywords"]).split(";") if k.strip()]
                sample_resources.append(Resource(
                    resource_id=row["resource_id"],
                    title=row["title"],
                    content_type=row["content_type"],
                    topic=row["topic"],
                    description=row["description"],
                    reading_level=row["reading_level"],
                    target_audience=row["target_audience"],
                    scientific_complexity=int(row["scientific_complexity"]),
                    word_count=int(row["word_count"]),
                    keywords=kw_list,
                    cluster_id=c_id,
                    cluster_label=summary["name"]
                ))
            results.append(ClusterSummary(
                cluster_id=c_id,
                name=summary["name"],
                size=summary["size"],
                top_keywords=summary["top_keywords"],
                dominant_topic=summary["dominant_topic"],
                coherence_score=summary["coherence_score"],
                resources=sample_resources
            ))
        return results

    def get_filter_options(self) -> Dict[str, Any]:
        if not self.is_initialized:
            self.initialize()
        return {
            "topics": sorted(self.df["topic"].unique().tolist()),
            "content_types": sorted(self.df["content_type"].unique().tolist()),
            "reading_levels": ["beginner", "intermediate", "advanced"],
            "target_audiences": sorted(self.df["target_audience"].unique().tolist()),
            "complexity_range": {"min": 1, "max": 5}
        }

    def get_dashboard_stats(self) -> DashboardStats:
        if not self.is_initialized:
            self.initialize()
            
        return DashboardStats(
            total_resources=len(self.df),
            total_topics=int(self.df["topic"].nunique()),
            total_clusters=self.n_clusters,
            topic_distribution=self.df["topic"].value_counts().to_dict(),
            audience_distribution=self.df["target_audience"].value_counts().to_dict(),
            reading_level_distribution=self.df["reading_level"].value_counts().to_dict(),
            complexity_distribution={int(k): int(v) for k, v in self.df["scientific_complexity"].value_counts().to_dict().items()},
            content_type_distribution=self.df["content_type"].value_counts().to_dict(),
            avg_word_count=round(float(self.df["word_count"].mean()), 1)
        )

