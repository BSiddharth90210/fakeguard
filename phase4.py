import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

# Load saved model and tokenizer
print("Loading saved BERT model...")
model = AutoModelForSequenceClassification.from_pretrained("models/bert_final")
tokenizer = AutoTokenizer.from_pretrained("models/bert_final")

model.eval()
print("Model loaded!")

def predict(texts):
    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    probs = torch.softmax(outputs.logits, dim=1).numpy()
    return probs

# Test it on a sample
sample = "Scientists confirm climate change is caused by human activity"
result = predict([sample])
print(f"\nSample: {sample}")
print(f"Fake probability:  {result[0][0]:.4f}")
print(f"Real probability:  {result[0][1]:.4f}")
print(f"Prediction: {'REAL' if result[0][1] > result[0][0] else 'FAKE'}")
print("\nPrediction function works!")

# Test with political style news
samples = [
    "Donald Trump signed a new executive order today regarding immigration policy",
    "BREAKING: Hillary Clinton secretly runs a criminal operation from her basement"
]

for sample in samples:
    result = predict([sample])
    print(f"\nText: {sample}")
    print(f"Prediction: {'REAL' if result[0][1] > result[0][0] else 'FAKE'}")
    print(f"Confidence: {max(result[0]):.4f}")

from lime.lime_text import LimeTextExplainer

# Create explainer
explainer_lime = LimeTextExplainer(class_names=["FAKE", "REAL"])

def lime_predict(texts):
    return predict(list(texts))

# Explain a prediction
sample = "Donald Trump signed a new executive order today"
explanation = explainer_lime.explain_instance(
    sample,
    lime_predict,
    num_features=10,
    num_samples=100
)

print("\nLIME Explanation:")
print(f"Text: {sample}")
print("\nTop words pushing the prediction:")
for word, weight in explanation.as_list():
    direction = "→ FAKE" if weight < 0 else "→ REAL"
    print(f"  '{word}': {weight:.4f} {direction}")

print("\nLIME working!")

import shap

# Use a small sample for SHAP
import pandas as pd
test_df = pd.read_csv("data/test.csv")
samples = test_df["text"].head(10).tolist()

# Create SHAP explainer
print("\nRunning SHAP explainability...")
explainer = shap.Explainer(lime_predict, shap.maskers.Text(tokenizer))

shap_values = explainer(samples[:3])

print("\nSHAP Values Shape:", shap_values.shape)
print("\nSHAP working!")

import json
import os

os.makedirs("results", exist_ok=True)

# Save LIME explanation results
lime_results = []
for sample in samples[:5]:
    explanation = explainer_lime.explain_instance(
        sample,
        lime_predict,
        num_features=10,
        num_samples=100
    )
    result = predict([sample])
    lime_results.append({
        "text": sample[:100],
        "prediction": "REAL" if result[0][1] > result[0][0] else "FAKE",
        "confidence": float(max(result[0])),
        "top_words": explanation.as_list()
    })

with open("results/lime_results.json", "w") as f:
    json.dump(lime_results, f, indent=2)

print("Results saved to results/lime_results.json")
print("\nPhase 4 Complete! 🎉")