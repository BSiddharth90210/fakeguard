import pandas as pd

# Load saved data
train_df = pd.read_csv("data/train.csv")
val_df   = pd.read_csv("data/val.csv")
test_df  = pd.read_csv("data/test.csv")

print("Train size:", len(train_df))
print("Val size:", len(val_df))
print("Test size:", len(test_df))
print("\nData loaded successfully! ")

from transformers import AutoTokenizer

# Load BERT tokenizer
print("Loading BERT tokenizer...")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Test it on a sample sentence
sample = "This news article is completely fake!"
tokens = tokenizer(sample, truncation=True, max_length=64)
print("\nSample tokens:", tokens)
print("\nTokenizer loaded!")

def tokenize_data(texts, labels):
    encodings = tokenizer(
        list(texts),
        truncation=True,
        padding=True,
        max_length=128,
        return_tensors="pt"
    )
    return encodings, list(labels)

print("Tokenizing data...")
train_encodings, train_labels = tokenize_data(train_df["text"], train_df["label"])
val_encodings, val_labels     = tokenize_data(val_df["text"], val_df["label"])
test_encodings, test_labels   = tokenize_data(test_df["text"], test_df["label"])

print("Tokenization done!")

import torch
from torch.utils.data import Dataset

class FakeNewsDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels    = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

# Create datasets
train_dataset = FakeNewsDataset(train_encodings, train_labels)
val_dataset   = FakeNewsDataset(val_encodings, val_labels)
test_dataset  = FakeNewsDataset(test_encodings, test_labels)

print("Sample item keys:", train_dataset[0].keys())
print("\nDataset created!")

from transformers import AutoModelForSequenceClassification

# Load BERT model with 2 output labels (Fake / Real)
print("Loading BERT model...")
model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=2
)

print("\nBERT model loaded!")

from transformers import TrainingArguments, Trainer
from sklearn.metrics import accuracy_score, f1_score
import numpy as np

# Define metrics
def compute_metrics(pred):
    labels = pred.label_ids
    preds  = np.argmax(pred.predictions, axis=1)
    acc    = accuracy_score(labels, preds)
    f1     = f1_score(labels, preds)
    return {"accuracy": acc, "f1": f1}

# Training arguments
training_args = TrainingArguments(
    output_dir="models/bert",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    load_best_model_at_end=True,
    report_to="none",
    logging_steps=100,
    fp16=True,
)
print("Training arguments set!")

# Create Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
)

# Train!
print("Starting BERT training...")
trainer.train()

print("\nTraining complete!")

# Save the best model
model.save_pretrained("models/bert_final")
tokenizer.save_pretrained("models/bert_final")

print("BERT model saved! ")