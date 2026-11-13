import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
from sklearn.metrics.pairwise import cosine_similarity
from ml.preprocessor import clean_text

class PolarSearchEngine:
    def __init__(self, vectorizer, tfidf_matrix):
        self.vectorizer = vectorizer
        self.tfidf_matrix = tfidf_matrix

    def search(
        self,
        query: str,
        df: pd.DataFrame,
        top_k: int = 50,
        min_similarity: float = 0.02
    ) -> List[Dict[str, Any]]:
        """
        Calculates Cosine Similarity between user query vector and all resource vectors.
        Returns sorted list of matching records with similarity scores.
        """
        cleaned_query = clean_text(query)
        if not cleaned_query:
            # If query is empty, return empty list (or all records caller decides)
            return []
        
        query_vec = self.vectorizer.transform([cleaned_query])
        
        # Check if query contains any known vocabulary terms
        if query_vec.nnz == 0:
            return []
            
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Filter indices above threshold
        ranked_indices = np.argsort(similarities)[::-1]
        results = []
        for idx in ranked_indices:
            score = float(similarities[idx])
            if score < min_similarity:
                break
            results.append({
                "index": int(idx),
                "similarity_score": round(score, 4),
                "resource_id": df.iloc[idx]["resource_id"]
            })
            if len(results) >= top_k:
                break
                
        return results

    def find_similar_resources(
        self,
        resource_index: int,
        df: pd.DataFrame,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Finds the nearest neighbors for a specific resource based on Cosine Similarity.
        """
        if resource_index < 0 or resource_index >= self.tfidf_matrix.shape[0]:
            return []
            
        target_vec = self.tfidf_matrix[resource_index]
        similarities = cosine_similarity(target_vec, self.tfidf_matrix).flatten()
        
        # Exclude self
        similarities[resource_index] = -1.0
        
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        results = []
        for idx in top_indices:
            score = float(similarities[idx])
            if score <= 0:
                continue
            row = df.iloc[idx]
            results.append({
                "resource_id": row["resource_id"],
                "title": row["title"],
                "topic": row["topic"],
                "reading_level": row["reading_level"],
                "target_audience": row["target_audience"],
                "scientific_complexity": int(row["scientific_complexity"]),
                "similarity_score": round(score, 4)
            })
            
        return results

