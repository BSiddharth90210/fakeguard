# FakeGuard — AI-Powered Fake News Detection System

A machine learning system that detects fake news using NLP and fine-tuned BERT, with a FastAPI backend, interactive web UI, and LIME/SHAP explainability.

---

## Live Demo

Run locally with one command:

```bash
# Windows
start.bat

# Or manually
uvicorn app:app --host 0.0.0.0 --port 8000
```

Then open **http://localhost:8000** in your browser.

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
| Frontend | HTML, CSS, Vanilla JS |
| Database | PostgreSQL, SQLAlchemy (phase5.py) |
| Hardware | NVIDIA RTX 3050 Laptop GPU |

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Serves the web UI |
| `/health` | GET | API status + which models are loaded |
| `/predict` | POST | Classify a news article (BERT / LR / XGBoost) |
| `/history` | GET | Retrieve the last 10 session predictions |
| `/stats` | GET | Total / fake / real count + avg confidence |
| `/lime` | GET | Pre-computed LIME word-level explanations |
| `/docs` | GET | Auto-generated Swagger UI |

---

## Project Structure

```
fakeguard/
├── static/             # Web frontend
│   ├── index.html      # Main UI — detection, pipeline, LIME, history
│   ├── style.css       # Premium dark-theme CSS
│   └── app.js          # Frontend logic & live API integration
├── data/               # Train, validation, and test splits
├── models/             # Saved ML and BERT models
│   ├── bert_final/     # Fine-tuned BERT (HuggingFace format)
│   ├── lr_model.pkl    # Logistic Regression
│   ├── xgb_model.pkl   # XGBoost
│   └── tfidf.pkl       # TF-IDF vectorizer
├── results/            # LIME explainability outputs
├── app.py              # FastAPI app — serves models + frontend
├── start.bat           # One-click Windows launcher
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

**4. Run the prototype**
```bash
# Windows — double-click start.bat, or:
fakeguard-env\Scripts\uvicorn.exe app:app --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000** for the web UI  
Open **http://localhost:8000/docs** for the interactive Swagger API docs

> **Note:** The app auto-detects whether the BERT model is available and falls back to Logistic Regression if not.

---

## Web UI Features

- **Model switcher** — run predictions with BERT, Logistic Regression, or XGBoost
- **Animated results** — verdict badge, confidence bar, fake/real probability bars
- **Quick examples** — one-click demo inputs (Reuters article, conspiracy theory, financial news)
- **Prediction history** — live session stats (total, fake, real, avg confidence)
- **LIME explainability** — word-level attributions showing *why* the model decided
- **5-step pipeline diagram** — visual walkthrough of the ML architecture

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
- [x] Phase 7 — Interactive web prototype
