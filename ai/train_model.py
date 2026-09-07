import os
import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# PATH CONFIGURATION
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "dataset",
    "mood_dataset.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "mood_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    MODEL_DIR,
    "vectorizer.pkl"
)


# ==========================================
# CREATE MODEL FOLDER
# ==========================================

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ==========================================
# LOAD DATASET
# ==========================================

print("Loading dataset...")

df = pd.read_csv(
    DATASET_PATH
)

print(
    f"Total samples: {len(df)}"
)


# ==========================================
# CLEAN DATASET
# ==========================================

df = df.dropna(
    subset=["text", "mood"]
)


# ==========================================
# INPUT AND OUTPUT
# ==========================================

X = df["text"]
y = df["mood"]


# ==========================================
# DISPLAY MOOD CLASSES
# ==========================================

print("\nMood classes:")

print(
    sorted(y.unique())
)


# ==========================================
# SPLIT DATA
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ==========================================
# TF-IDF
# ==========================================

print("\nCreating TF-IDF vectors...")

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2)
)


X_train_vectorized = vectorizer.fit_transform(
    X_train
)

X_test_vectorized = vectorizer.transform(
    X_test
)


# ==========================================
# TRAIN MODEL
# ==========================================

print("\nTraining Logistic Regression model...")

model = LogisticRegression(
    max_iter=1000,
    random_state=42
)


model.fit(
    X_train_vectorized,
    y_train
)


# ==========================================
# PREDICTION
# ==========================================

predictions = model.predict(
    X_test_vectorized
)


# ==========================================
# ACCURACY
# ==========================================

accuracy = accuracy_score(
    y_test,
    predictions
)


# ==========================================
# RESULTS
# ==========================================

print("\n============================")
print("MODEL RESULTS")
print("============================")

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    MODEL_PATH
)


# ==========================================
# SAVE VECTORIZER
# ==========================================

joblib.dump(
    vectorizer,
    VECTORIZER_PATH
)


# ==========================================
# SUCCESS
# ==========================================

print("\n============================")
print("MODEL SAVED SUCCESSFULLY")
print("============================")

print(
    f"Model saved at: {MODEL_PATH}"
)

print(
    f"Vectorizer saved at: {VECTORIZER_PATH}"
)