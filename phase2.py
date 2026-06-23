import pandas as pd

# Load saved data
train_df = pd.read_csv("data/train.csv")
val_df   = pd.read_csv("data/val.csv")
test_df  = pd.read_csv("data/test.csv")

print("Train size:", len(train_df))
print("Val size:", len(val_df))
print("Test size:", len(test_df))
print("\nData loaded successfully!")

import re

def clean_text(text):
    text = text.lower()                          # lowercase everything
    text = re.sub(r'https?://\S+', '', text)     # remove URLs
    text = re.sub(r'[^a-zA-Z\s]', '', text)     # remove punctuation & numbers
    text = text.strip()                          # remove extra spaces
    return text

# Apply cleaning to text column
train_df["clean_text"] = train_df["text"].apply(clean_text)
val_df["clean_text"]   = val_df["text"].apply(clean_text)
test_df["clean_text"]  = test_df["text"].apply(clean_text)

print("Sample cleaned text:")
print(train_df["clean_text"][0][:200])
print("\nText cleaning done! ")

from sklearn.feature_extraction.text import TfidfVectorizer

# Create TF-IDF vectorizer
tfidf = TfidfVectorizer(max_features=50000, stop_words='english')

# Fit on training data and transform all splits
X_train = tfidf.fit_transform(train_df["clean_text"])
X_val   = tfidf.transform(val_df["clean_text"])
X_test  = tfidf.transform(test_df["clean_text"])

# Labels
y_train = train_df["label"]
y_val   = val_df["label"]
y_test  = test_df["label"]

print("X_train shape:", X_train.shape)
print("X_val shape:", X_val.shape)
print("\nTF-IDF done!")

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, classification_report

# Train model
print("Training Logistic Regression...")
lr_model = LogisticRegression(max_iter=1000)
lr_model.fit(X_train, y_train)

# Evaluate on validation set
lr_preds = lr_model.predict(X_val)

lr_accuracy = accuracy_score(y_val, lr_preds)
lr_f1       = f1_score(y_val, lr_preds)

print("\n--- Logistic Regression Results ---")
print(f"Accuracy : {lr_accuracy * 100:.2f}%")
print(f"F1 Score : {lr_f1 * 100:.2f}%")
print("\nDetailed Report:")
print(classification_report(y_val, lr_preds))

from xgboost import XGBClassifier

# Train model
print("Training XGBoost...")
xgb_model = XGBClassifier(n_estimators=100, random_state=42)
xgb_model.fit(X_train, y_train)

# Evaluate on validation set
xgb_preds = xgb_model.predict(X_val)

xgb_accuracy = accuracy_score(y_val, xgb_preds)
xgb_f1       = f1_score(y_val, xgb_preds)

print("\n--- XGBoost Results ---")
print(f"Accuracy : {xgb_accuracy * 100:.2f}%")
print(f"F1 Score : {xgb_f1 * 100:.2f}%")
print("\nDetailed Report:")
print(classification_report(y_val, xgb_preds))

import pickle
import os

# Create models folder
os.makedirs("models", exist_ok=True)

# Save models and tfidf vectorizer
with open("models/lr_model.pkl", "wb") as f:
    pickle.dump(lr_model, f)

with open("models/xgb_model.pkl", "wb") as f:
    pickle.dump(xgb_model, f)

with open("models/tfidf.pkl", "wb") as f:
    pickle.dump(tfidf, f)

print("Models saved successfully!")