from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Resource(BaseModel):
    resource_id: str
    title: str
    content_type: str
    topic: str
    description: str
    reading_level: str
    target_audience: str
    scientific_complexity: int
    word_count: int
    keywords: List[str]
    cluster_id: Optional[int] = None
    cluster_label: Optional[str] = None
    similarity_score: Optional[float] = None

class ResourceListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[Resource]

class FilterOptions(BaseModel):
    topics: List[str]
    content_types: List[str]
    reading_levels: List[str]
    target_audiences: List[str]
    complexity_range: Dict[str, int]

class ClusterSummary(BaseModel):
    cluster_id: int
    name: str
    size: int
    top_keywords: List[str]
    dominant_topic: str
    coherence_score: float
    resources: List[Resource]

class EvaluationMetrics(BaseModel):
    silhouette_score: float
    cluster_coherence: float
    coverage: float
    baseline_silhouette_score: float
    baseline_coherence: float
    num_clusters: int
    total_samples: int
    explanation: Dict[str, str]

class DashboardStats(BaseModel):
    total_resources: int
    total_topics: int
    total_clusters: int
    topic_distribution: Dict[str, int]
    audience_distribution: Dict[str, int]
    reading_level_distribution: Dict[str, int]
    complexity_distribution: Dict[int, int]
    content_type_distribution: Dict[str, int]
    avg_word_count: float

