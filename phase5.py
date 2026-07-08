from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

# ─── Database Setup ───────────────────────────────────────
DB_URL = "postgresql://postgres:Millionaire%4012345@localhost:5432/fakeguard"
engine = create_engine(DB_URL)
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine)

class Prediction(Base):
    __tablename__ = "predictions"
    id         = Column(Integer, primary_key=True, index=True)
    text       = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    timestamp  = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ─── Load Model ───────────────────────────────────────────
print("Loading BERT model...")
tokenizer = AutoTokenizer.from_pretrained("models/bert_final")
model     = AutoModelForSequenceClassification.from_pretrained("models/bert_final")
model.eval()
print("Model loaded! ✅")

# ─── FastAPI App ──────────────────────────────────────────
app = FastAPI(title="FakeGuard API")

class ArticleInput(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "FakeGuard API is running!"}

@app.post("/predict")
def predict(article: ArticleInput):
    # Tokenize and predict
    inputs = tokenizer(
        article.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    with torch.no_grad():
        outputs = model(**inputs)

    probs      = torch.softmax(outputs.logits, dim=1).numpy()[0]
    prediction = "REAL" if probs[1] > probs[0] else "FAKE"
    confidence = float(max(probs))

    # Save to database
    db = SessionLocal()
    db.add(Prediction(
        text       = article.text[:500],
        prediction = prediction,
        confidence = confidence
    ))
    db.commit()
    db.close()

    return {
        "prediction": prediction,
        "confidence": round(confidence * 100, 2),
        "fake_probability": round(float(probs[0]) * 100, 2),
        "real_probability": round(float(probs[1]) * 100, 2)
    }

@app.get("/history")
def history():
    db = SessionLocal()
    predictions = db.query(Prediction).order_by(Prediction.timestamp.desc()).limit(10).all()
    db.close()
    return [
        {
            "id":         p.id,
            "text":       p.text[:100],
            "prediction": p.prediction,
            "confidence": p.confidence,
            "timestamp":  p.timestamp
        }
        for p in predictions
    ]