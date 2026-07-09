# FakeGuard — AI-Powered Fake News Detection System

A machine learning system that detects fake news using NLP and fine-tuned BERT, with a FastAPI backend, PostgreSQL prediction history, and LIME/SHAP explainability.

---

## Results

| Model | Accuracy | F1 Score |
|---|---|---|
| Logistic Regression (TF-IDF) | 98.80% | 98.74% |
| XGBoost (TF-IDF) | 99.80% | 99.79% |
| BERT (fine-tuned) | **99.98%** | **99.98%** |

**API Performance:** 56ms average response latency (warm requests)

---

## Tech Stack

| Layer | Tools |
|---|---|
| Machine Learning | Scikit-learn, XGBoost |
| Deep Learning | HuggingFace Transformers, PyTorch (CUDA) |
| Explainability | LIME, SHAP |
| Backend | FastAPI, Uvicorn |
| Database | PostgreSQL, SQLAlchemy |
| Hardware | NVIDIA RTX 3050 Laptop GPU |

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check |
| `/predict` | POST | Classify a news article as fake or real |
| `/history` | GET | Retrieve the last 10 predictions from the database |

---

## Project Structure

```
fakeguard/
├── data/               # Train, validation, and test splits
├── models/             # Saved ML and BERT models
├── results/            # LIME explainability outputs
├── phase1.py           # Data acquisition and EDA
├── phase2.py           # Baseline ML models (TF-IDF + LR, XGBoost)
├── phase3.py           # BERT fine-tuning on GPU
├── phase4.py           # LIME and SHAP explainability
├── phase5.py           # FastAPI backend with PostgreSQL
├── phase6.py           # Benchmarking and evaluation
└── requirements.txt    # Project dependencies
```

---

## Setup

**1. Clone the repository**
```bash
git clone https://github.com/BSiddharth90210/fakeguard.git
cd fakeguard
```

**2. Create and activate virtual environment**
```bash
python -m venv fakeguard-env
fakeguard-env\Scripts\activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up PostgreSQL**

Create a database named `fakeguard` and update the `DB_URL` in `phase5.py` with your credentials.

**5. Run the API**
```bash
uvicorn phase5:app --reload
```

The API will be available at `http://127.0.0.1:8000`
Interactive docs at `http://127.0.0.1:8000/docs`

---

## Dataset

[Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset) — Kaggle

- 44,898 labeled news articles (52% fake, 48% real)
- Split: 35,000 train / 5,000 validation / 4,898 test

---

## Phases Completed

- [x] Phase 1 — Data acquisition and EDA
- [x] Phase 2 — Baseline ML models
- [x] Phase 3 — BERT fine-tuning
- [x] Phase 4 — Explainability (LIME/SHAP)
- [x] Phase 5 — FastAPI backend
- [x] Phase 6 — Benchmarking and polish
