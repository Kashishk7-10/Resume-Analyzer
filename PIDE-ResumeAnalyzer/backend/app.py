"""
PIDE Resume Analyzer - Flask Backend API
Serves the trained Random Forest model for resume classification.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import re
import string
import logging

import numpy as np
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# NLTK data
# ---------------------------------------------------------------------------
try:
    STOP_WORDS = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    STOP_WORDS = set(stopwords.words('english'))

# ---------------------------------------------------------------------------
# Flask app
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)  # allow cross-origin requests from the mobile app

# ---------------------------------------------------------------------------
# Model paths  (adjust if your files are elsewhere)
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'rf_model.pkl')
VECTORIZER_RESUME_PATH = os.path.join(BASE_DIR, 'model', 'tfidf_resume.pkl')
VECTORIZER_JOB_PATH = os.path.join(BASE_DIR, 'model', 'tfidf_job.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'model', 'label_encoder.pkl')

# ---------------------------------------------------------------------------
# Load model artifacts
# ---------------------------------------------------------------------------
model = None
tfidf_resume = None
tfidf_job = None
label_encoder = None


def load_model():
    global model, tfidf_resume, tfidf_job, label_encoder
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(VECTORIZER_RESUME_PATH, 'rb') as f:
            tfidf_resume = pickle.load(f)
        with open(VECTORIZER_JOB_PATH, 'rb') as f:
            tfidf_job = pickle.load(f)
        if os.path.exists(LABEL_ENCODER_PATH):
            with open(LABEL_ENCODER_PATH, 'rb') as f:
                label_encoder = pickle.load(f)
        logger.info("Model artifacts loaded successfully.")
    except FileNotFoundError as e:
        logger.warning(f"Model file not found: {e}. Running in DEMO mode.")


load_model()


# ---------------------------------------------------------------------------
# Text preprocessing (must match the preprocessing used during training)
# ---------------------------------------------------------------------------
def preprocess(text: str) -> str:
    """Clean and normalise text."""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)           # remove URLs
    text = re.sub(r'\S+@\S+', '', text)                   # remove emails
    text = re.sub(r'\d+', '', text)                        # remove numbers
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = text.split()
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 2]
    return ' '.join(tokens)


# ---------------------------------------------------------------------------
# Demo classifier (used when model files are absent – for testing only)
# ---------------------------------------------------------------------------
KEYWORDS_GOOD = [
    'experience', 'skills', 'python', 'management', 'engineering', 'analysis',
    'leadership', 'communication', 'bachelor', 'master', 'degree', 'university',
]

KEYWORDS_NO_FIT = [
    'unrelated', 'different', 'irrelevant',
]


def demo_classify(resume_text: str, job_text: str) -> dict:
    """
    Very simple heuristic classification used when the real model is not loaded.
    NOT for production – only for development/testing.
    """
    combined = (resume_text + ' ' + job_text).lower()
    good_score = sum(1 for kw in KEYWORDS_GOOD if kw in combined)
    no_score = sum(1 for kw in KEYWORDS_NO_FIT if kw in combined)

    if no_score >= 2:
        label = 'No Fit'
        probs = {'Good Fit': 0.10, 'Potential Fit': 0.20, 'No Fit': 0.70}
    elif good_score >= 5:
        label = 'Good Fit'
        probs = {'Good Fit': 0.75, 'Potential Fit': 0.18, 'No Fit': 0.07}
    else:
        label = 'Potential Fit'
        probs = {'Good Fit': 0.25, 'Potential Fit': 0.55, 'No Fit': 0.20}

    return {'label': label, 'confidence': probs[label], 'scores': probs}


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'service': 'PIDE Resume Analyzer API',
    })


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json(force=True)

    resume_text = data.get('resume_text', '').strip()
    job_text = data.get('job_description_text', '').strip()

    # ----- Validation -----
    if not resume_text:
        return jsonify({'error': 'resume_text is required'}), 400
    if not job_text:
        return jsonify({'error': 'job_description_text is required'}), 400
    if len(resume_text.split()) < 10:
        return jsonify({'error': 'Resume text is too short. Please provide a complete resume.'}), 400

    # ----- Classify -----
    if model is None:
        # Demo mode
        result = demo_classify(resume_text, job_text)
        result['mode'] = 'demo'
        logger.info(f"[DEMO] Result: {result['label']}")
        return jsonify(result)

    try:
        resume_clean = preprocess(resume_text)
        job_clean = preprocess(job_text)

        # Transform using the same vectorizers used at training time
        X_resume = tfidf_resume.transform([resume_clean])
        X_job = tfidf_job.transform([job_clean])
        X = hstack([X_resume, X_job])

        # Predict
        pred_idx = model.predict(X)[0]
        proba = model.predict_proba(X)[0]

        # Decode label
        if label_encoder is not None:
            label = label_encoder.inverse_transform([pred_idx])[0]
            classes = label_encoder.classes_
        else:
            # Assume classes are stored in model.classes_
            classes = model.classes_
            label = str(classes[pred_idx]) if not isinstance(pred_idx, str) else pred_idx

        scores = {str(cls): float(p) for cls, p in zip(classes, proba)}
        confidence = float(max(proba))

        result = {
            'label': str(label),
            'confidence': confidence,
            'scores': scores,
            'mode': 'model',
        }
        logger.info(f"[MODEL] Result: {label} ({confidence:.2f})")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error during prediction.'}), 500


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    logger.info(f"Starting PIDE Resume Analyzer API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
