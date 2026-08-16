# PIDE Resume Analyzer - API Documentation

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Base URL**: http://localhost:5000 (development)

---

## Table of Contents

1. [Health Check](#health-check)
2. [Basic Analysis](#basic-analysis)
3. [Hybrid Matching](#hybrid-matching)
4. [Candidate Ranking](#candidate-ranking)
5. [Error Handling](#error-handling)

---

## Health Check

### Endpoint: GET `/health`

Check if the API is running and get service information.

**Request:**
```bash
GET /health
```

**Response (200 OK):**
```json
{
  "status": "ok",
  "model_loaded": true,
  "service": "PIDE Resume Analyzer API",
  "version": "1.0.0",
  "features": {
    "hybrid_scoring": true,
    "keyword_matching": true,
    "semantic_matching": true,
    "candidate_ranking": true
  }
}
```

---

## Basic Analysis

### Endpoint: POST `/analyze`

Analyze a single resume against a job description using the trained ML model.

**Request:**
```bash
POST /analyze
Content-Type: application/json

{
  "resume_text": "John Smith\nSoftware Engineer\nSkills: Python, Java, SQL\nExperience: 5 years",
  "job_description_text": "Senior Developer\nRequired: Python, JavaScript, 5+ years experience"
}
```

**Parameters:**
- `resume_text` (string, required): Full resume content
- `job_description_text` (string, required): Full job description

**Response (200 OK):**
```json
{
  "label": "Good Fit",
  "confidence": 0.82,
  "scores": {
    "Good Fit": 0.82,
    "Potential Fit": 0.15,
    "No Fit": 0.03
  },
  "mode": "model"
}
```

**Response (200 OK - Demo Mode):**
```json
{
  "label": "Good Fit",
  "confidence": 0.75,
  "scores": {
    "Good Fit": 0.75,
    "Potential Fit": 0.18,
    "No Fit": 0.07
  },
  "mode": "demo"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "resume_text is required"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error during prediction."
}
```

---

## Hybrid Matching

### Endpoint: POST `/analyze/hybrid`

Perform advanced hybrid matching combining keyword and semantic analysis.

**Request:**
```bash
POST /analyze/hybrid
Content-Type: application/json

{
  "resume_text": "Senior Data Scientist\nSkills: Python, Machine Learning, SQL, Tableau\nExperience: 7 years in data science\nEducation: MS Computer Science",
  "requirements": {
    "technical_skills": ["Python", "Machine Learning", "SQL", "Spark"],
    "education": ["Bachelor in CS", "Master preferred"],
    "experience": ["5+ years data science", "Analytics background"],
    "certifications": ["AWS certification"]
  },
  "job_description_text": "Senior Data Scientist - We're looking for experienced data scientists with strong Python and ML backgrounds...",
  "weights": {
    "keyword": 0.4,
    "semantic": 0.6
  }
}
```

**Parameters:**
- `resume_text` (string, required): Extracted resume text
- `requirements` (object, required): Dict of requirement categories with keywords
  - Keys: Category names (e.g., "technical_skills", "education")
  - Values: Array of keywords/requirements
- `job_description_text` (string, required): Full job description for semantic analysis
- `weights` (object, optional): Scoring weights
  - `keyword` (float): Weight for keyword matching (0.0-1.0)
  - `semantic` (float): Weight for semantic matching (0.0-1.0)
  - Default: `{"keyword": 0.4, "semantic": 0.6}`

**Response (200 OK):**
```json
{
  "success": true,
  "hybrid_score": 82.5,
  "keyword_score": 75.0,
  "semantic_score": 87.5,
  "interpretation": "Excellent match - Interview recommended",
  "weights_used": {
    "keyword": 0.4,
    "semantic": 0.6
  },
  "confidence": 87.5
}
```

**Score Interpretation:**
- **80-100**: Excellent match - Interview recommended
- **60-79**: Good match - Screen for fit
- **40-59**: Moderate match - Consider if pipeline is thin
- **20-39**: Weak match - Consider for future roles
- **0-19**: No match - Archive

**Response (400 Bad Request):**
```json
{
  "error": "requirements dict is required"
}
```

**Response (500 Internal Server Error):**
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Candidate Ranking

### Endpoint: POST `/rank-candidates`

Rank multiple candidates against a job posting using hybrid scoring.

**Request:**
```bash
POST /rank-candidates
Content-Type: application/json

{
  "candidates": [
    {
      "name": "John Smith",
      "email": "john@example.com",
      "resume_text": "Senior Data Scientist with 7 years experience..."
    },
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "resume_text": "Data Analyst with 5 years in analytics..."
    },
    {
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "resume_text": "Chef with 10 years in culinary arts..."
    }
  ],
  "job_posting": {
    "title": "Senior Data Scientist",
    "requirements": {
      "technical_skills": ["Python", "Machine Learning", "SQL"],
      "experience": ["5+ years data science"],
      "education": ["Bachelor in CS"]
    },
    "full_text": "We are hiring a Senior Data Scientist..."
  },
  "weights": {
    "keyword": 0.4,
    "semantic": 0.6
  }
}
```

**Parameters:**
- `candidates` (array, required): List of candidate objects
  - `name` (string): Candidate name
  - `email` (string): Candidate email
  - `resume_text` (string): Extracted resume content
- `job_posting` (object, required): Job posting details
  - `title` (string): Job title
  - `requirements` (object): Dict of requirement categories
  - `full_text` (string): Full job description text
- `weights` (object, optional): Scoring weights (default: `{"keyword": 0.4, "semantic": 0.6}`)

**Response (200 OK):**
```json
{
  "success": true,
  "job_posting": "Senior Data Scientist",
  "total_candidates": 3,
  "ranked_list": [
    {
      "rank": 1,
      "candidate_name": "John Smith",
      "email": "john@example.com",
      "resume_preview": "Senior Data Scientist with 7 years experience...",
      "scores": {
        "hybrid_score": 89.2,
        "keyword_score": 85.0,
        "semantic_score": 91.5,
        "interpretation": "Excellent match - Interview recommended",
        "weights": {"keyword": 0.4, "semantic": 0.6},
        "confidence": 91.5
      }
    },
    {
      "rank": 2,
      "candidate_name": "Jane Doe",
      "email": "jane@example.com",
      "resume_preview": "Data Analyst with 5 years in analytics...",
      "scores": {
        "hybrid_score": 71.3,
        "keyword_score": 65.0,
        "semantic_score": 75.0,
        "interpretation": "Good match - Screen for fit",
        "weights": {"keyword": 0.4, "semantic": 0.6},
        "confidence": 75.0
      }
    },
    {
      "rank": 3,
      "candidate_name": "Bob Wilson",
      "email": "bob@example.com",
      "resume_preview": "Chef with 10 years in culinary arts...",
      "scores": {
        "hybrid_score": 8.5,
        "keyword_score": 5.0,
        "semantic_score": 10.2,
        "interpretation": "No match - Archive",
        "weights": {"keyword": 0.4, "semantic": 0.6},
        "confidence": 10.2
      }
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "error": "candidates list is required"
}
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

### Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 400 | Bad Request | Missing required parameter |
| 401 | Unauthorized | Authentication failed |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Server overloaded |

---

## Advanced Features

### Customizable Weights

Adjust keyword and semantic matching weights based on job requirements:

**Keyword-Heavy** (70% keyword, 30% semantic):
- Use for roles with specific required tools
- Example: DevOps, DBA, System Administrator
```json
{"keyword": 0.7, "semantic": 0.3}
```

**Semantic-Heavy** (30% keyword, 70% semantic):
- Use for roles emphasizing transferable skills
- Example: Management, Sales, HR
```json
{"keyword": 0.3, "semantic": 0.7}
```

**Balanced** (50% keyword, 50% semantic):
- Default for general/mixed roles
- Example: Software Engineer, Analyst
```json
{"keyword": 0.5, "semantic": 0.5}
```

### Keyword Matching Algorithm

- Extracts keywords from resume and requirements
- Supports domain-specific synonym matching
- Compares exact and partial matches
- Categories breakdown by requirement type

### Semantic Matching Algorithm

- Uses BERT-based sentence embeddings (384-dimensional)
- Calculates cosine similarity between texts
- Detects equivalent phrasing (e.g., "dashboarding" vs "data visualization")
- Similarity threshold: 65% (configurable)

### Hybrid Scoring Formula

```
final_score = (keyword_weight × keyword_score) + 
              (semantic_weight × semantic_score)
```

---

## Example Workflows

### Workflow 1: Single Resume Analysis

1. Call `/analyze` with resume and job description
2. Receive classification (Good/Potential/No Fit) with confidence
3. Use for quick screening

### Workflow 2: Advanced Matching

1. Call `/analyze/hybrid` with structured requirements
2. Get detailed keyword and semantic scores
3. Use for detailed candidate assessment

### Workflow 3: Bulk Candidate Ranking

1. Collect all candidate resumes
2. Call `/rank-candidates` with candidate list and job posting
3. Receive ranked list sorted by hybrid score
4. Export results for HR review

---

## Performance Characteristics

- **Average Analysis Time**: 2-5 seconds per resume
- **Bulk Processing**: 50 resumes in ~60-90 seconds
- **Concurrent Requests**: Supports up to 100 simultaneous analyzations
- **Memory Usage**: ~500MB for models and embeddings
- **Response Size**: 1-5 KB per request

---

## Authentication

Currently, the API has no authentication. For production, implement:

```python
from flask_httpauth import HTTPBearerAuth
auth = HTTPBearerAuth()

@app.route('/analyze', methods=['POST'])
@auth.login_required
def analyze():
    # Protected endpoint
    pass
```

---

## Rate Limiting

Recommended rate limits for production:

- Per IP: 100 requests/hour
- Per user: 1000 requests/day
- Bulk endpoint: 10 requests/minute

---

## CORS Configuration

Currently allows all origins. For production, restrict to specific domains:

```python
CORS(app, resources={
    r"/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## Contact & Support

- **Developer**: Kashish Kumari
- **Email**: kashishkumari.bscsf22@iba-suk.edu.pk
- **Repository**: https://github.com/Kashishk7-10/Resume-Analyzer

---

**API Documentation** - v1.0.0 - August 2026
