import os
# Suppress loky CPU core count warning on Windows
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.metrics.pairwise import cosine_similarity

from ml.preprocessor import build_combined_corpus, OUTREACH_BOILERPLATE

class PolarClusterModel:
    def __init__(self, n_clusters: int = 10, random_state: int = 42):
        self.n_clusters = n_clusters
        self.random_state = random_state
        
        # Build custom stop word list combining English defaults and outreach format boilerplate
        default_stops = list(TfidfVectorizer(stop_words="english").get_stop_words())
        self.stop_words = list(set(default_stops).union(OUTREACH_BOILERPLATE))
        
        self.vectorizer = TfidfVectorizer(
            stop_words=self.stop_words,
            max_features=1500,
            ngram_range=(1, 2),
            min_df=2,
            max_df=0.85
        )
        self.kmeans = KMeans(
            n_clusters=self.n_clusters,
            random_state=self.random_state,
            n_init=10
        )
        self.is_fitted = False
        self.feature_names = []
        self.tfidf_matrix = None
        self.cluster_labels = []
        self.cluster_metadata = {}

    def fit(self, df: pd.DataFrame) -> "PolarClusterModel":
        """
        Fits TF-IDF vectorizer and K-Means clustering on the polar dataset corpus.
        """
        corpus = [
            build_combined_corpus(row["title"], row["description"], row["keywords"])
            for _, row in df.iterrows()
        ]
        
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
        self.feature_names = np.array(self.vectorizer.get_feature_names_out())
        self.cluster_labels = self.kmeans.fit_predict(self.tfidf_matrix)
        self.is_fitted = True
        
        # Build metadata, coherence, and labels for each cluster
        self._build_cluster_metadata(df)
        return self

    def _build_cluster_metadata(self, df: pd.DataFrame):
        cos_matrix = cosine_similarity(self.tfidf_matrix)
        
        for c in range(self.n_clusters):
            # Top representative keywords from the cluster centroid
            centroid = self.kmeans.cluster_centers_[c]
            top_term_indices = centroid.argsort()[-8:][::-1]
            top_terms = [str(self.feature_names[i]) for i in top_term_indices]
            
            # Cluster indices & coherence
            c_indices = np.where(self.cluster_labels == c)[0]
            cluster_size = len(c_indices)
            
            if cluster_size > 1:
                c_sims = cos_matrix[np.ix_(c_indices, c_indices)]
                triu_idx = np.triu_indices(cluster_size, k=1)
                coherence = float(np.mean(c_sims[triu_idx]))
            else:
                coherence = 1.0
                
            # Dominant ground-truth topic in this cluster
            cluster_df = df.iloc[c_indices]
            dominant_topic = str(cluster_df["topic"].mode().iloc[0]) if not cluster_df.empty else "General Polar Science"
            
            # Format clean title for the cluster
            name = f"{dominant_topic} Focus ({', '.join(top_terms[:3]).title()})"
            
            self.cluster_metadata[c] = {
                "cluster_id": c,
                "name": name,
                "size": cluster_size,
                "dominant_topic": dominant_topic,
                "top_keywords": top_terms,
                "coherence_score": round(coherence, 4)
            }

    def get_cluster_summary(self) -> List[Dict[str, Any]]:
        return [self.cluster_metadata[c] for c in range(self.n_clusters)]

    def get_silhouette_score(self) -> float:
        if not self.is_fitted:
            raise ValueError("Model is not fitted yet.")
        return float(silhouette_score(self.tfidf_matrix, self.cluster_labels))

    def get_overall_coherence(self) -> float:
        if not self.cluster_metadata:
            return 0.0
        scores = [meta["coherence_score"] for meta in self.cluster_metadata.values()]
        return round(float(np.mean(scores)), 4)

    def get_coverage(self) -> float:
        # K-Means partitions 100% of samples into clusters
        return 100.0

