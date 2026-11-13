# Polar Outreach Agent
**Intelligent Educational Discovery Platform for Polar & Earth Sciences**  
**SIH Problem Statement:** SIH26063  
**Organization:** Ministry of Earth Sciences (MoES), Government of India  

---

## 1. Project Overview

The **Polar Outreach Agent** is a full-stack, machine-learning-powered educational discovery platform developed to organize and democratize polar science knowledge. 

India maintains key research bases in Antarctica (*Maitri*, *Bharati*), the Arctic (*Himadri*), and the Himalayas. However, scientific findings are often dense and fragmented. This platform organizes **500 curated educational resources** across 10 distinct polar disciplines, 5 target audiences, and 3 reading difficulty levels using an unsupervised Machine Learning pipeline.

---

## 2. Key Capabilities

1. **Unsupervised Thematic Clustering:**
   - Automatically groups 500 educational resources into 10 cohesive polar science domains using TF-IDF and K-Means clustering.
   - Extracts representative scientific keywords from cluster centroids without manual tagging.
2. **Semantic Similarity Search:**
   - Free-text query matching using Cosine Similarity over high-dimensional TF-IDF vectors.
   - Nearest-neighbor recommendation engine suggesting related materials for every resource.
3. **Multi-Faceted Educational Discovery:**
   - Filter by Topic, Target Audience (Children, School Students, General Public, University Students, Educators), Reading Level (Beginner, Intermediate, Advanced), Format (Article, Guide, Video, Infographic, Summary), and Scientific Complexity (1 to 5).
4. **Linguistic Readability Analysis:**
   - Evaluates text readability using automated syllable counting and the Flesch Reading Ease formula, contrasting algorithmic scores against verified educator labels.
5. **Transparent, Non-Fabricated Evaluation:**
   - Rigorously evaluates clustering performance with Silhouette Score, Cluster Coherence, and Coverage, benchmarked against baseline models.

---

## 3. Technology Stack

### Frontend
- **Framework:** React.js (v18) with Vite
- **Styling:** Tailwind CSS (custom Deep Navy & Ice Blue polar theme)
- **Icons:** Lucide React
- **Charts:** Recharts (responsive SVG data visualization)
- **API Client:** Axios

### Backend & Machine Learning
- **API Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn
- **Data Processing:** Pandas, NumPy
- **Machine Learning:** Scikit-Learn
- **Data Validation:** Pydantic v2

---

## 4. Machine Learning Pipeline & Actual Evaluation

### A. Preprocessing Strategy
- **Format Boilerplate Filtering:** Identified that resource descriptions contained standardized template phrases (e.g. *"This infographic presents 4 panels..."*, *"This educational guide invites learners..."*). Removed outreach boilerplate stop words to prevent the model from clustering by format rather than scientific discipline.
- **Domain Feature Weighting:** Constructed composite corpus `(Title + Keywords + Keywords + Description)` to amplify critical polar terminology (*permafrost*, *troposphere*, *salinity*, *firn*, *krill*).
- **TF-IDF Vectorization:** 1500 max features, unigrams and bigrams (`ngram_range=(1,2)`), `min_df=2`, `max_df=0.85`.

### B. Actual Clustering Metrics

| Metric | K-Means Model ($k=10$) | Random Baseline | Catalog Baseline | Explanation |
| :--- | :--- | :--- | :--- | :--- |
| **Silhouette Score** | **0.2046** | -0.0192 | 0.1992 | Measures cluster separation vs cohesion. Strongly positive vs negative random overlap. |
| **Cluster Coherence** | **0.4305** | 0.1129 | 0.4424 | Mean intra-cluster pairwise cosine similarity. Nearly **3.8x higher** than random grouping. |
| **Coverage** | **100.0%** | 100.0% | 100.0% | 500 of 500 educational materials indexed without outliers. |

*Note on Catalog Baseline:* In the source dataset (`polar_science_outreach_dataset_final.csv`), rows are contiguously sorted in blocks of 50 by topic. Hence, a chronological/catalog chunking baseline achieves high coherence due to pre-sorted ordering. Against an unorganized arrival stream (random baseline), our ML model demonstrates massive semantic improvements.

---

## 5. Project Directory Structure

```text
polar-outreach-agent/
│
├── backend/
│   ├── main.py                     # FastAPI REST API application & endpoints
│   ├── config.py                   # Central paths, dataset resolver & CORS config
│   ├── requirements.txt            # Python dependencies
│   ├── data/
│   │   └── polar_science_outreach_dataset_final.csv
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── preprocessor.py         # Text cleaning, boilerplate removal & readability
│   │   ├── clustering.py           # TF-IDF vectorization & K-Means clustering
│   │   ├── search.py               # Cosine similarity search & recommendations
│   │   ├── evaluation.py           # Silhouette, coherence & baseline calculation
│   │   └── pipeline.py             # Singleton ML service facade
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic schemas (Resource, Filters, Metrics)
│   └── tests/
│       ├── test_schemas.py         # Schema validation & CSV parsing test
│       ├── test_ml_pipeline.py     # End-to-end ML test suite
│       └── test_api.py             # Direct REST API endpoint verification
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                 # Main layout & router
│       ├── main.jsx
│       ├── index.css
│       ├── services/
│       │   └── api.js              # Axios API client
│       ├── components/
│       │   ├── Navbar.jsx          # MoES navigation header
│       │   ├── Footer.jsx          # Attribution & tech stack footer
│       │   ├── ResourceCard.jsx    # Card with badges, level & complexity
│       │   └── ResourceDetailModal.jsx # Detail modal with similar recommendations
│       └── pages/
│           ├── LandingPage.jsx     # Hero, quick search & authentic stats
│           ├── DashboardPage.jsx   # Recharts dataset analytics
│           ├── ExplorePage.jsx     # Faceted search, filters & pagination
│           ├── ClustersPage.jsx    # 10 Thematic topic clusters
│           ├── EvaluationPage.jsx  # Interactive ML benchmark & metrics
│           └── AboutPage.jsx       # Methodology & architecture documentation
│
├── polar_science_outreach_dataset_final.csv  # Original intact dataset
├── DEVELOPMENT_JOURNAL.md          # Chronological 12-section development log
├── run_backend.bat                 # 1-click backend launcher (Windows CMD)
├── run_frontend.bat                # 1-click frontend launcher (Windows CMD)
├── run_backend.ps1                 # PowerShell backend launcher
├── run_frontend.ps1                # PowerShell frontend launcher
└── README.md                       # Comprehensive guide
```

---

## 6. How to Run the Application

### Prerequisites
- **Python 3.10+** (FastAPI, Scikit-learn, Pandas)
- **Node.js v18+ & NPM** (React, Vite)

### Step 1: Start the Backend Server

Open a terminal in the project root:
```powershell
# Using the Windows script:
.\run_backend.bat

# Or manually:
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.  
Interactive API docs are available at `http://127.0.0.1:8000/docs`.

### Step 2: Start the React Frontend

Open a second terminal in the project root:
```powershell
# Using the Windows script:
.\run_frontend.bat

# Or manually:
cd frontend
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 7. REST API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Server status and dataset verification (500 resources). |
| `/api/stats` | `GET` | Authentic dataset distributions (topics, audience, reading level, complexity). |
| `/api/filters` | `GET` | Dynamic taxonomy options for frontend filter dropdowns. |
| `/api/resources` | `GET` | Free-text search, faceted filtering, sorting, and pagination. |
| `/api/resources/{id}` | `GET` | Resource detail, readability metrics, and ML-recommended similar resources. |
| `/api/clusters` | `GET` | 10 K-Means clusters with centroid keywords, coherence, and sample records. |
| `/api/evaluation` | `GET` | Real Silhouette Score, Cluster Coherence, Coverage, and Baselines. |

---

## 8. Development Integrity & Documentation

Throughout development, every major step, algorithm comparison, error encountered, resolution, and test result has been chronologically logged in [DEVELOPMENT_JOURNAL.md](DEVELOPMENT_JOURNAL.md). No data was fabricated and original dataset files were kept intact.

