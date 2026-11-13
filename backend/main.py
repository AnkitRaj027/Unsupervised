import os
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from config import APP_TITLE, APP_DESCRIPTION, APP_VERSION, CORS_ORIGINS
from ml.pipeline import PolarMLPipeline
from models.schemas import (
    Resource,
    ResourceListResponse,
    FilterOptions,
    ClusterSummary,
    EvaluationMetrics,
    DashboardStats,
)

# Startup / Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the ML pipeline on server start
    pipeline = PolarMLPipeline.get_instance()
    app.state.pipeline = pipeline
    print(f"Polar Outreach Agent ML Pipeline initialized with {len(pipeline.df)} resources.")
    yield

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS + ["*"],  # Allow local development and standard dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_pipeline() -> PolarMLPipeline:
    return PolarMLPipeline.get_instance()

@app.get("/api/health", tags=["System"])
def health_check():
    pipeline = get_pipeline()
    return {
        "status": "healthy",
        "app": APP_TITLE,
        "version": APP_VERSION,
        "dataset_loaded": pipeline.is_initialized,
        "total_resources": len(pipeline.df) if pipeline.df is not None else 0
    }

@app.get("/api/stats", response_model=DashboardStats, tags=["Analytics"])
def get_dashboard_statistics():
    """
    Returns authentic dataset statistics: totals, category breakdowns, and distributions.
    """
    pipeline = get_pipeline()
    return pipeline.get_dashboard_stats()

@app.get("/api/filters", response_model=FilterOptions, tags=["Discovery"])
def get_filter_options():
    """
    Returns available filter choices for topics, content types, audiences, and reading levels.
    """
    pipeline = get_pipeline()
    return pipeline.get_filter_options()

@app.get("/api/resources", response_model=ResourceListResponse, tags=["Discovery"])
def list_resources(
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
):
    """
    Multi-faceted search, filter, sort, and paginate through educational resources.
    """
    pipeline = get_pipeline()
    result = pipeline.get_resources(
        query=query,
        topic=topic,
        content_type=content_type,
        reading_level=reading_level,
        target_audience=target_audience,
        complexity=complexity,
        cluster_id=cluster_id,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )
    return result

@app.get("/api/resources/{resource_id}", tags=["Discovery"])
def get_resource_details(resource_id: str):
    """
    Returns comprehensive details for a single resource, including readability metrics
    and top ML-recommended similar resources.
    """
    pipeline = get_pipeline()
    resource = pipeline.get_resource_by_id(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail=f"Resource '{resource_id}' not found.")
    return resource

@app.get("/api/clusters", response_model=List[ClusterSummary], tags=["Thematic Exploration"])
def get_clusters():
    """
    Returns all unsupervised thematic clusters, their representative keywords,
    coherence scores, and sample resources.
    """
    pipeline = get_pipeline()
    return pipeline.get_cluster_summaries()

@app.get("/api/evaluation", tags=["Evaluation & Methodology"])
def get_model_evaluation():
    """
    Returns real, computed machine learning clustering evaluation metrics,
    including Silhouette Score, Cluster Coherence, Coverage, and Baselines.
    """
    pipeline = get_pipeline()
    if not pipeline.is_initialized:
        pipeline.initialize()
    return pipeline.evaluation_results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

