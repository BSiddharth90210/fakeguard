\# FakeGuard 🛡️

\### AI-Powered Fake News Detection System



A machine learning system that detects fake news using NLP and BERT,

with a FastAPI backend and PostgreSQL database.



\## Results

| Model | Accuracy | F1 Score |

|---|---|---|

| Logistic Regression | 98.80% | 98.74% |

| XGBoost | 99.80% | 99.79% |

| BERT (fine-tuned) | 99.98% | 99.98% |

| API Latency | 56ms avg | ✅ Sub-200ms |



\## Tech Stack

\- \*\*ML\*\*: Scikit-learn, XGBoost, HuggingFace Transformers (BERT)

\- \*\*Explainability\*\*: LIME, SHAP

\- \*\*Backend\*\*: FastAPI, Uvicorn

\- \*\*Database\*\*: PostgreSQL, SQLAlchemy

\- \*\*Hardware\*\*: NVIDIA RTX 3050 (CUDA)



\## API Endpoints

| Endpoint | Method | Description |

|---|---|---|

| / | GET | Health check |

| /predict | POST | Classify a news article |

| /history | GET | View past predictions |



\## Project Structure

\- phase1.py — Data acquisition and EDA

\- phase2.py — Baseline ML models (TF-IDF + LR, XGBoost)

\- phase3.py — BERT fine-tuning

\- phase4.py — LIME/SHAP explainability

\- phase5.py — FastAPI backend

\- phase6.py — Benchmarking



\## Setup

```bash

python -m venv fakeguard-env

fakeguard-env\\Scripts\\activate

pip install -r requirements.txt

uvicorn phase5:app --reload

```



\## Phases

\- \[x] Phase 1 - Data Setup

\- \[x] Phase 2 - Baseline Models

\- \[x] Phase 3 - BERT Fine-tuning

\- \[x] Phase 4 - Explainability

\- \[x] Phase 5 - FastAPI Backend

\- \[x] Phase 6 - Benchmarking

