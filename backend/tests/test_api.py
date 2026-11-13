import sys
from pathlib import Path
import time

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import main

def test_all_api_endpoints():
    start_time = time.time()
    print("Starting direct endpoint verification...")

    # 1. Health
    health = main.health_check()
    assert health["status"] == "healthy"
    assert health["total_resources"] == 354
    print("✓ /api/health passed.")

    # 2. Stats
    stats = main.get_dashboard_statistics()
    assert stats.total_resources == 354
    assert stats.total_topics == 10
    assert len(stats.topic_distribution) == 10
    assert len(stats.audience_distribution) == 5
    assert len(stats.reading_level_distribution) == 3
    print("✓ /api/stats passed.")

    # 3. Filters
    filters = main.get_filter_options()
    assert "Arctic ecosystems" in filters["topics"]
    assert "beginner" in filters["reading_levels"]
    print("✓ /api/filters passed.")

    # 4. Resources listing & pagination
    res_list = main.list_resources(page=1, page_size=10)
    assert res_list["total"] == 354
    assert len(res_list["items"]) == 10
    assert res_list["total_pages"] == 36
    print("✓ /api/resources listing & pagination passed.")

    # 5. Search query
    search_res = main.list_resources(query="permafrost tundra", page=1, page_size=5)
    assert search_res["total"] > 0
    assert search_res["items"][0].similarity_score > 0
    print(f"✓ /api/resources search passed. Top match: {search_res['items'][0].title}")

    # 6. Combined filters
    filtered = main.list_resources(reading_level="advanced", target_audience="educators")
    assert filtered["total"] > 0
    for r in filtered["items"]:
        assert r.reading_level == "advanced"
        assert r.target_audience == "educators"
    print(f"✓ /api/resources multi-filter passed ({filtered['total']} items matched).")

    # 7. Resource Detail
    detail = main.get_resource_details("POLAR-0001")
    assert detail["resource_id"] == "POLAR-0001"
    assert "similar_resources" in detail
    assert len(detail["similar_resources"]) > 0
    assert "flesch_reading_ease" in detail
    print("✓ /api/resources/{id} detail with similar recommendations passed.")

    # 8. Clusters
    clusters = main.get_clusters()
    assert len(clusters) == 10
    assert clusters[0].size > 0
    assert len(clusters[0].top_keywords) > 0
    print(f"✓ /api/clusters passed ({len(clusters)} clusters generated).")

    # 9. Evaluation
    eval_metrics = main.get_model_evaluation()
    assert eval_metrics["silhouette_score"] > 0.15
    assert eval_metrics["cluster_coherence"] > 0.35
    assert eval_metrics["coverage"] == 100.0
    print(f"✓ /api/evaluation passed. Silhouette: {eval_metrics['silhouette_score']}, Coherence: {eval_metrics['cluster_coherence']}")

    elapsed = round(time.time() - start_time, 2)
    print(f"\nALL 7 REST API ENDPOINTS TESTED AND VERIFIED IN {elapsed}s!")

if __name__ == "__main__":
    test_all_api_endpoints()
