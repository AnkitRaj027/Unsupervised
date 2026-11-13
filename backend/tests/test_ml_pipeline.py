import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from ml.pipeline import PolarMLPipeline

def test_pipeline():
    print("Initializing ML Pipeline...")
    pipeline = PolarMLPipeline.get_instance()
    assert pipeline.is_initialized, "Pipeline must be initialized"
    assert len(pipeline.df) == 354, "Dataset must have 354 rows"
    print("Dataset successfully loaded & enriched with cluster labels!")
    
    # Check evaluation
    eval_metrics = pipeline.evaluation_results
    assert eval_metrics["silhouette_score"] > 0.15, f"Expected silhouette > 0.15, got {eval_metrics['silhouette_score']}"
    assert eval_metrics["cluster_coherence"] > 0.35, f"Expected coherence > 0.35, got {eval_metrics['cluster_coherence']}"
    assert eval_metrics["coverage"] == 100.0, "Coverage must be 100%"
    print(f"Evaluation metrics validated:")
    print(f"  Silhouette Score: {eval_metrics['silhouette_score']}")
    print(f"  Cluster Coherence: {eval_metrics['cluster_coherence']}")
    print(f"  Coverage: {eval_metrics['coverage']}%")
    print(f"  Random Baseline Silhouette: {eval_metrics['random_baseline_silhouette']}")
    print(f"  Random Baseline Coherence: {eval_metrics['random_baseline_coherence']}")
    
    # Check search engine
    query = "antarctic penguin colony breeding"
    search_res = pipeline.get_resources(query=query, page=1, page_size=5)
    assert search_res["total"] > 0, "Search query should return matching items"
    top_item = search_res["items"][0]
    print(f"Search test passed for '{query}':")
    print(f"  Top Match: [{top_item.resource_id}] {top_item.title} (Score: {top_item.similarity_score})")
    
    # Check filter functionality
    filter_res = pipeline.get_resources(reading_level="beginner", topic="Arctic ecosystems", page=1, page_size=5)
    for item in filter_res["items"]:
        assert item.reading_level.lower() == "beginner"
        assert item.topic == "Arctic ecosystems"
    print(f"Filtering test passed: Found {filter_res['total']} beginner Arctic ecosystem resources.")

    # Check clusters summary
    clusters = pipeline.get_cluster_summaries()
    assert len(clusters) == 10, f"Expected 10 clusters, got {len(clusters)}"
    print(f"Clusters summary test passed: 10 clusters created.")
    for c in clusters[:3]:
        print(f"  Cluster {c.cluster_id}: {c.name} | Coherence: {c.coherence_score} | Terms: {c.top_keywords[:3]}")

    print("\nALL ML TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_pipeline()

