import pandas as pd

# Load the data
fake_df = pd.read_csv("Fake.csv")
true_df = pd.read_csv("True.csv")

# Add labels — 0 = Fake, 1 = True
fake_df["label"] = 0
true_df["label"] = 1

# Combine into one dataset
df = pd.concat([fake_df, true_df], ignore_index=True)

# Explore the data
print("Shape:", df.shape)
print("\nColumns:", df.columns.tolist())
print("\nClass Distribution:\n", df["label"].value_counts())
print("\nSample:\n", df.head(3))
print("\nNull values:\n", df.isnull().sum())

# Check exact class counts
print("\nClass Counts:")
print(df["label"].value_counts())
print("\nClass Percentages:")
print(df["label"].value_counts(normalize=True) * 100)

import os

# Create data folder
os.makedirs("data", exist_ok=True)

# Shuffle the dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Split into train, val, test
train_df = df[:35000]
val_df   = df[35000:40000]
test_df  = df[40000:]

# Save to CSV
train_df.to_csv("data/train.csv", index=False)
val_df.to_csv("data/val.csv", index=False)
test_df.to_csv("data/test.csv", index=False)

print("Train size:", len(train_df))
print("Val size:", len(val_df))
print("Test size:", len(test_df))
print("\nData saved successfully!")