"""
FakeGuard — AI-Powered Fake News Detection API
Prototype backend with BERT (primary) and TF-IDF fallback models.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime
import numpy as np
import pickle
import re
import os
import json

# ─── Attempt to load BERT model ──────────────────────────────
BERT_AVAILABLE = False
try:
    import torch
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    print("Loading BERT model...")
    bert_tokenizer = AutoTokenizer.from_pretrained("models/bert_final")
    bert_model     = AutoModelForSequenceClassification.from_pretrained("models/bert_final")
    bert_model.eval()
    BERT_AVAILABLE = True
    print("[OK] BERT model loaded!")
except Exception as e:
    print(f"[WARN] BERT not available: {e}")
    print("       Falling back to TF-IDF + Logistic Regression")

# ─── Load TF-IDF baseline models ─────────────────────────────
print("Loading baseline models...")
with open("models/lr_model.pkl", "rb") as f:
    lr_model = pickle.load(f)
with open("models/xgb_model.pkl", "rb") as f:
    xgb_model = pickle.load(f)
with open("models/tfidf.pkl", "rb") as f:
    tfidf = pickle.load(f)
print("[OK] Baseline models loaded!")

# ─── Load LIME results ────────────────────────────────────────
lime_results = []
try:
    with open("results/lime_results.json", "r") as f:
        lime_results = json.load(f)
except Exception:
    pass

# ─── In-memory prediction history ────────────────────────────
prediction_history = []

# ─── Helper: clean text ──────────────────────────────────────
def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text.strip()

# ─── FastAPI App ──────────────────────────────────────────────
app = FastAPI(title="FakeGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (frontend)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# ─── Request / Response Models ────────────────────────────────
class ArticleInput(BaseModel):
    text: str
    model: str = "bert"   # "bert" | "lr" | "xgb"

# ─── Endpoints ────────────────────────────────────────────────

@app.get("/")
def root():
    if os.path.exists("static/index.html"):
        return FileResponse("static/index.html")
    return {"message": "FakeGuard API is running!", "bert_available": BERT_AVAILABLE}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "bert_available": BERT_AVAILABLE,
        "models": ["bert", "lr", "xgb"] if BERT_AVAILABLE else ["lr", "xgb"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/predict")
def predict(article: ArticleInput):
    text    = article.text
    cleaned = clean_text(text)

    # ── BERT prediction ───────────────────────────────────────
    if article.model == "bert" and BERT_AVAILABLE:
        inputs = bert_tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )
        import torch
        with torch.no_grad():
            outputs = bert_model(**inputs)
        probs      = torch.softmax(outputs.logits, dim=1).numpy()[0]
        prediction = "REAL" if probs[1] > probs[0] else "FAKE"
        confidence = float(max(probs))
        fake_prob  = float(probs[0])
        real_prob  = float(probs[1])
        model_used = "BERT (fine-tuned)"

    # ── Logistic Regression prediction ───────────────────────
    elif article.model == "lr" or (article.model == "bert" and not BERT_AVAILABLE):
        X      = tfidf.transform([cleaned])
        pred   = lr_model.predict(X)[0]
        proba  = lr_model.predict_proba(X)[0]
        prediction = "REAL" if pred == 1 else "FAKE"
        confidence = float(max(proba))
        fake_prob  = float(proba[0])
        real_prob  = float(proba[1])
        model_used = "Logistic Regression (TF-IDF)"

    # ── XGBoost prediction ────────────────────────────────────
    else:
        X      = tfidf.transform([cleaned])
        pred   = xgb_model.predict(X)[0]
        proba  = xgb_model.predict_proba(X)[0]
        prediction = "REAL" if pred == 1 else "FAKE"
        confidence = float(max(proba))
        fake_prob  = float(proba[0])
        real_prob  = float(proba[1])
        model_used = "XGBoost (TF-IDF)"

    # ── Save to history ───────────────────────────────────────
    record = {
        "id":          len(prediction_history) + 1,
        "text":        text[:200],
        "prediction":  prediction,
        "confidence":  round(confidence * 100, 2),
        "fake_prob":   round(fake_prob * 100, 2),
        "real_prob":   round(real_prob * 100, 2),
        "model_used":  model_used,
        "timestamp":   datetime.utcnow().isoformat()
    }
    prediction_history.insert(0, record)
    if len(prediction_history) > 50:
        prediction_history.pop()

    return record

@app.get("/history")
def history():
    return prediction_history[:10]

@app.get("/lime")
def get_lime():
    return lime_results

@app.get("/stats")
def stats():
    if not prediction_history:
        return {"total": 0, "fake": 0, "real": 0, "avg_confidence": 0}
    total      = len(prediction_history)
    fake_count = sum(1 for p in prediction_history if p["prediction"] == "FAKE")
    real_count = total - fake_count
    avg_conf   = round(sum(p["confidence"] for p in prediction_history) / total, 2)
    return {
        "total":          total,
        "fake":           fake_count,
        "real":           real_count,
        "avg_confidence": avg_conf
    }

# ─── Gradio Wrapper for Hugging Face Spaces ───────────────────
import gradio as gr

def dummy_gradio_fn(text):
    return "The FakeGuard backend is running. Please use the React frontend or /docs for API details."

demo = gr.Interface(
    fn=dummy_gradio_fn,
    inputs="text",
    outputs="text",
    title="FakeGuard API Status"
)

# Mount the Gradio app onto the FastAPI app
app = gr.mount_gradio_app(app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
