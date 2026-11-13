from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATASET_PATH = DATA_DIR / "polar_science_outreach_dataset_final.csv"

# Root dataset fallback
ROOT_DATASET_PATH = BASE_DIR.parent / "polar_science_outreach_dataset_final.csv"

def get_dataset_path() -> Path:
    if DATASET_PATH.exists():
        return DATASET_PATH
    elif ROOT_DATASET_PATH.exists():
        return ROOT_DATASET_PATH
    raise FileNotFoundError("Polar science dataset not found.")

# Server Settings
APP_TITLE = "Polar Outreach Agent API"
APP_DESCRIPTION = "Intelligent educational resource discovery platform for Polar Science (MoES SIH26063)"
APP_VERSION = "1.0.0"
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

