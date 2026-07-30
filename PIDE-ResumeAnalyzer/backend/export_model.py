"""
Export Model Script
===================
Run this script from your Jupyter notebook environment (or Colab) AFTER
training to export the model artifacts needed by the Flask API.

Usage:
    python export_model.py

It expects the trained objects to already be in memory (or re-trains them).
Adjust the paths and variable names to match your notebook.
"""

import os
import pickle
import pandas as pd
import numpy as np
import re
import string
import nltk
from nltk.corpus import stopwords
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from scipy.sparse import hstack

nltk.download('stopwords', quiet=True)
STOP_WORDS = set(stopwords.words('english'))

# ---------------------------------------------------------------------------
# 1. Load and preprocess data
#    Adjust the path to your combined CSV file.
# ---------------------------------------------------------------------------
DATA_PATH = '../AI-Resume-Analyzer/resume_job_fit_combined.csv'

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
print(f"  Shape: {df.shape}")
print(f"  Columns: {list(df.columns)}")
print(f"  Label distribution:\n{df['label'].value_counts()}")


def preprocess(text: str) -> str:
    """Must match the preprocessing in app.py exactly."""
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = text.split()
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 2]
    return ' '.join(tokens)


print("Preprocessing text...")
df['resume_clean'] = df['resume_text'].apply(preprocess)
df['job_clean'] = df['job_description_text'].apply(preprocess)

# ---------------------------------------------------------------------------
# 2. Encode labels
# ---------------------------------------------------------------------------
le = LabelEncoder()
df['label_enc'] = le.fit_transform(df['label'])
print(f"  Classes: {le.classes_}")

# ---------------------------------------------------------------------------
# 3. TF-IDF vectorisation
# ---------------------------------------------------------------------------
print("Fitting TF-IDF vectorizers...")
tfidf_resume = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
tfidf_job = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))

X_resume = tfidf_resume.fit_transform(df['resume_clean'])
X_job = tfidf_job.fit_transform(df['job_clean'])
X = hstack([X_resume, X_job])
y = df['label_enc'].values

# ---------------------------------------------------------------------------
# 4. Train / evaluate
# ---------------------------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Training Random Forest...")
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=5,
    n_jobs=-1,
    random_state=42,
)
rf.fit(X_train, y_train)

accuracy = rf.score(X_test, y_test)
print(f"  Test accuracy: {accuracy:.4f}")

# ---------------------------------------------------------------------------
# 5. Export artifacts
# ---------------------------------------------------------------------------
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model')
os.makedirs(OUT_DIR, exist_ok=True)

print(f"Saving artifacts to {OUT_DIR} ...")

with open(os.path.join(OUT_DIR, 'rf_model.pkl'), 'wb') as f:
    pickle.dump(rf, f)

with open(os.path.join(OUT_DIR, 'tfidf_resume.pkl'), 'wb') as f:
    pickle.dump(tfidf_resume, f)

with open(os.path.join(OUT_DIR, 'tfidf_job.pkl'), 'wb') as f:
    pickle.dump(tfidf_job, f)

with open(os.path.join(OUT_DIR, 'label_encoder.pkl'), 'wb') as f:
    pickle.dump(le, f)

print("Done! Files saved:")
for fname in ['rf_model.pkl', 'tfidf_resume.pkl', 'tfidf_job.pkl', 'label_encoder.pkl']:
    fpath = os.path.join(OUT_DIR, fname)
    size = os.path.getsize(fpath) / 1024
    print(f"  {fname}  ({size:.1f} KB)")
