import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from models.schemas import Resource, FilterOptions
from config import get_dataset_path
import pandas as pd

def test_dataset_loading_and_schema():
    dataset_path = get_dataset_path()
    assert dataset_path.exists(), "Dataset path must exist"
    
    df = pd.read_csv(dataset_path)
    assert len(df) == 354, f"Expected 354 records, got {len(df)}"
    
    # Test converting a row to Pydantic Resource
    first_row = df.iloc[0]
    keywords_list = [k.strip() for k in str(first_row["keywords"]).split(";") if k.strip()]
    
    resource = Resource(
        resource_id=first_row["resource_id"],
        title=first_row["title"],
        content_type=first_row["content_type"],
        topic=first_row["topic"],
        description=first_row["description"],
        reading_level=first_row["reading_level"],
        target_audience=first_row["target_audience"],
        scientific_complexity=int(first_row["scientific_complexity"]),
        word_count=int(first_row["word_count"]),
        keywords=keywords_list
    )
    
    assert resource.resource_id == "POLAR-0001"
    assert resource.reading_level == "intermediate"
    assert len(resource.keywords) > 0
    print("Schema test passed successfully! First resource:", resource.title)

if __name__ == "__main__":
    test_dataset_loading_and_schema()

