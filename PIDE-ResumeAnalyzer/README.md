# PIDE Resume Analyzer — React Native App

A mobile application for the **Pakistan Institute of Development Economics (PIDE)** that uses an AI-powered Random Forest model to screen resumes against job descriptions.

---

## Project Structure

```
PIDE-ResumeAnalyzer/
├── App.js                          # Entry point
├── app.json                        # Expo configuration
├── package.json                    # JS dependencies
├── babel.config.js
│
├── src/
│   ├── constants/
│   │   ├── theme.js                # Colors, fonts, spacing
│   │   └── api.js                  # Backend URL config
│   ├── services/
│   │   └── analyzerService.js      # Axios API calls
│   ├── navigation/
│   │   └── AppNavigator.js         # React Navigation setup
│   └── screens/
│       ├── HomeScreen.js           # Landing / dashboard
│       ├── AnalyzerScreen.js       # Input form (paste / upload)
│       ├── ResultScreen.js         # Result display with scores
│       ├── HistoryScreen.js        # Past analysis history
│       └── AboutScreen.js          # App info & tech stack
│
└── backend/
    ├── app.py                      # Flask REST API
    ├── export_model.py             # Script to export trained model
    ├── requirements.txt            # Python dependencies
    └── model/                      # (auto-created) .pkl files go here
```

---

## Setup

### 1. Export the trained model

First, export the trained model artifacts from your Jupyter notebook:

```bash
cd PIDE-ResumeAnalyzer/backend
pip install -r requirements.txt
python export_model.py
```

This creates `backend/model/` containing:
- `rf_model.pkl`
- `tfidf_resume.pkl`
- `tfidf_job.pkl`
- `label_encoder.pkl`

### 2. Start the Flask backend

```bash
cd PIDE-ResumeAnalyzer/backend
python app.py
```

The API runs on `http://0.0.0.0:5000`.

**Endpoints:**
- `GET  /health` — health check
- `POST /analyze` — analyze resume vs job description

**Request body:**
```json
{
  "resume_text": "...",
  "job_description_text": "..."
}
```

**Response:**
```json
{
  "label": "Good Fit",
  "confidence": 0.82,
  "scores": {
    "Good Fit": 0.82,
    "Potential Fit": 0.13,
    "No Fit": 0.05
  }
}
```

### 3. Configure the API URL

Edit `src/constants/api.js` and set `BASE_URL`:

| Scenario | URL |
|---|---|
| Android emulator | `http://10.0.2.2:5000` |
| iOS simulator | `http://localhost:5000` |
| Physical device (same network) | `http://192.168.x.x:5000` |
| Production | `https://api.pide.org.pk/...` |

### 4. Install JS dependencies and run

```bash
cd PIDE-ResumeAnalyzer
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

---

## App Screens

| Screen | Description |
|---|---|
| **Home** | PIDE-branded landing with stats and features |
| **Analyzer** | Paste or upload resume & job description |
| **Result** | Classification result with probability breakdown |
| **History** | All past analyses stored locally |
| **About** | Tech stack, model info, disclaimer |

---

## AI Model

- **Algorithm:** Random Forest Classifier (scikit-learn)
- **Accuracy:** 85% on test set
- **Classes:** Good Fit · Potential Fit · No Fit
- **Training data:** 8,000+ resume-job pairs from Hugging Face

---

## Demo Mode

If the `model/` directory is missing or empty, the API automatically falls back to a **keyword-based heuristic** (demo mode). This lets you test the app without the model files. The response will include `"mode": "demo"`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo 51) |
| Navigation | React Navigation v6 |
| HTTP Client | Axios |
| Local Storage | AsyncStorage |
| Backend | Python · Flask |
| ML | scikit-learn · Random Forest |
| Text Processing | NLTK · TF-IDF |

---

## License

MIT License © 2024 PIDE
