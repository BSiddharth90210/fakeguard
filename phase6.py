import time
import requests
import numpy as np

# Test API latency
API_URL = "http://127.0.0.1:8000/predict"

test_articles = [
    "Donald Trump signed a new executive order today",
    "Scientists discover new treatment for cancer",
    "BREAKING: Government secretly controls the weather",
    "Federal Reserve raises interest rates by 0.25%",
    "Aliens have landed in New York City confirmed sources say"
]

print("Benchmarking API response times...")
latencies = []

for article in test_articles:
    start = time.time()
    response = requests.post(API_URL, json={"text": article})
    end = time.time()
    
    latency = (end - start) * 1000  # convert to milliseconds
    latencies.append(latency)
    
    result = response.json()
    print(f"\nText: {article[:50]}...")
    print(f"Prediction: {result['prediction']} ({result['confidence']}% confident)")
    print(f"Latency: {latency:.2f}ms")

print("\n--- Benchmark Summary ---")
print(f"Average latency : {np.mean(latencies):.2f}ms")
print(f"Min latency     : {np.min(latencies):.2f}ms")
print(f"Max latency     : {np.max(latencies):.2f}ms")
print(f"Sub-200ms?      : {'✅ YES' if np.mean(latencies) < 200 else '❌ NO'}")

# Exclude cold start (first request)
warm_latencies = latencies[1:]
print("\n--- Real Performance (excluding cold start) ---")
print(f"Average latency : {np.mean(warm_latencies):.2f}ms")
print(f"Min latency     : {np.min(warm_latencies):.2f}ms")
print(f"Max latency     : {np.max(warm_latencies):.2f}ms")
print(f"Sub-200ms?      : {'✅ YES' if np.mean(warm_latencies) < 200 else '❌ NO'}")

import pandas as pd
import pickle
from sklearn.metrics import accuracy_score, f1_score, classification_report

# Load test data
test_df = pd.read_csv("data/test.csv")

# Load baseline models
with open("models/lr_model.pkl", "rb") as f:
    lr_model = pickle.load(f)
with open("models/xgb_model.pkl", "rb") as f:
    xgb_model = pickle.load(f)
with open("models/tfidf.pkl", "rb") as f:
    tfidf = pickle.load(f)

# Evaluate baselines on test set
import re
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text.strip()

test_df["clean_text"] = test_df["text"].apply(clean_text)
X_test = tfidf.transform(test_df["clean_text"])
y_test = test_df["label"]

lr_preds  = lr_model.predict(X_test)
xgb_preds = xgb_model.predict(X_test)

print("\n--- Final Test Set Results ---")
print(f"Logistic Regression → Accuracy: {accuracy_score(y_test, lr_preds)*100:.2f}% | F1: {f1_score(y_test, lr_preds)*100:.2f}%")
print(f"XGBoost             → Accuracy: {accuracy_score(y_test, xgb_preds)*100:.2f}% | F1: {f1_score(y_test, xgb_preds)*100:.2f}%")
print("\nFinal evaluation done! ✅")