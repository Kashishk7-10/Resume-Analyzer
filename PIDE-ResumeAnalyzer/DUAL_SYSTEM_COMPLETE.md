# PIDE Resume Analyzer - Dual System Complete

## Project Summary
The PIDE Resume Analyzer is now a **complete dual-system** addressing the HR pain point of manually reviewing hundreds/thousands of CVs. The system automatically analyzes resumes, extracts candidate information, and ranks applicants based on dynamic hiring criteria.

---

## System Architecture

### Two User Roles, Two Workflows

#### 1. **CANDIDATE PORTAL** (Job Seekers)
**Path:** Role Selection → Job Seeker → Apply Now

- **Features:**
  - Single resume upload (PDF, DOC, DOCX, TXT)
  - Optional job description comparison
  - Instant AI-powered analysis
  - Match score & assessment (Good Fit / Moderate Fit / No Fit)
  - Application history tracking
  - PIDE branding & professional UI

- **Screens:**
  - HomeScreen - Welcome & about PIDE
  - AnalyzerScreen - Resume upload & job matching
  - ResultScreen - Individual analysis results
  - HistoryScreen - Past applications
  - AboutScreen - Company information

#### 2. **ADMIN RANKING SYSTEM** (HR Managers)
**Path:** Role Selection → HR Manager → Bulk Ranking

- **Features:**
  - Bulk resume upload (50+ files at once)
  - Single job description reference
  - Automatic candidate analysis & ranking
  - Detailed score breakdown per candidate
  - Export results as CSV
  - Resume preview & sharing capabilities
  - PIDE HR Portal branding

- **Screens:**
  - AdminDashboard - Bulk resume & job description upload
  - RankingResults - Ranked candidate list with details

---

## Technology Stack

### Frontend
- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Stack & Tab navigators)
- **State Management:** React Hooks (useState)
- **Storage:** AsyncStorage for history
- **File Handling:** 
  - `pdfjs-dist` v3.11.174 for PDF extraction
  - `mammoth` v1.6.0 for Word document parsing
- **Web Support:** React Native Web for browser testing

### File Format Support
- ✅ PDF (.pdf) - Full text extraction via PDF.js
- ✅ Word Documents (.doc, .docx) - Parsing via Mammoth + fallback
- ✅ Text Files (.txt) - Direct read
- ✅ Max file size: 10MB

### Backend (Ready)
- **Framework:** Flask (Python)
- **File:** `backend/matching_engine.py`
- **Features:**
  - KeywordMatcher - Extracts & scores keywords
  - SemanticMatcher - BERT embeddings (384-dimensional)
  - HybridScorer - Configurable scoring (40% keyword / 60% semantic)
  - CandidateRanker - Sorts candidates by match score
- **API Endpoints:**
  - `POST /analyze/hybrid` - Single resume analysis
  - `POST /rank-candidates` - Bulk ranking

---

## File Structure

```
PIDE-ResumeAnalyzer/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js          (Role selector + routing logic)
│   ├── screens/
│   │   ├── AdminDashboard.js        (NEW - Bulk upload for HR)
│   │   ├── AnalyzerScreen.js        (Website-style candidate portal)
│   │   ├── RankingResults.js        (NEW - Ranked candidates display)
│   │   ├── ResultScreen.js          (Individual result view)
│   │   ├── HistoryScreen.js         (Application history)
│   │   ├── HomeScreen.js            (Welcome screen)
│   │   └── AboutScreen.js           (Company info)
│   ├── services/
│   │   ├── analyzerService.js       (Backend API calls + demo mode)
│   │   └── fileParserService.js     (PDF/Word/TXT extraction)
│   └── constants/
│       ├── api.js                   (API endpoints)
│       └── theme.js                 (Colors & typography)
├── backend/
│   ├── app.py                       (Flask server)
│   ├── matching_engine.py           (AI ranking logic)
│   └── requirements.txt             (Python deps)
├── App.js                           (Entry point)
├── package.json                     (Dependencies)
└── README.md                        (User guide)
```

---

## New Components Created

### 1. AdminDashboard.js (320+ lines)
**Purpose:** HR interface for bulk resume processing

**Features:**
- Multi-file resume upload (supports 50+ files)
- Single job description upload
- File preview with word count
- Remove/change individual files
- Bulk analysis trigger
- Loading state with progress indication
- History saving for past rankings

**Key Functions:**
- `handleWebFileSelect()` - Process uploaded files
- `extractTextFromFile()` - Route to appropriate parser
- `extractPDF()` - PDF text extraction
- `extractWord()` - Word document parsing
- `handleRankCandidates()` - Execute bulk analysis
- `handleRemoveResume()` - Manage file list

### 2. RankingResults.js (380+ lines)
**Purpose:** Display ranked candidates with detailed scoring

**Features:**
- Real-time ranking by match score
- Expandable candidate cards
- Score breakdown visualization
- Resume preview viewer
- Share individual candidate results
- Export all rankings as CSV
- Color-coded match quality (Green/Orange/Red)
- Statistics dashboard (total analyzed, top score, good matches)

**Key UI Elements:**
- Stat cards showing overview metrics
- Ranked candidate list with rank badges
- Expandable details per candidate
- Score bars for visual scoring breakdown
- Action buttons (Share, View Full)
- Export functionality

### 3. AppNavigator.js (UPDATED - 190+ lines)
**Purpose:** Role-based navigation architecture

**New Features:**
- RoleSelector screen at app launch
- Conditional rendering based on userRole state
- Two separate navigation stacks:
  - **Candidate Stack:** CandidateTabNavigator → Result screen
  - **Admin Stack:** AdminDashboard → RankingResults
- Role switching capability
- Persistent role state during session

**Navigation Flow:**
```
RoleSelector (Choose role)
├── If "Job Seeker":
│   └── CandidateTabNavigator
│       ├── Home
│       ├── Analyzer (Apply Now)
│       ├── History (My Applications)
│       └── About
│       └── Result (Modal)
└── If "HR Manager":
    ├── AdminDashboard (Upload bulk resumes)
    └── RankingResults (View ranked candidates)
```

---

## User Workflows

### Candidate Journey
1. **Launch App** → Role Selector screen
2. **Select "Job Seeker"** → Home screen with PIDE info
3. **Click "Apply Now"** → Upload resume (PDF/DOC/DOCX/TXT)
4. **(Optional)** Upload job description for match comparison
5. **Click "Apply Now" button** → System analyzes resume
6. **View Results** → Match score, assessment, score breakdown
7. **View History** → See past applications

### HR Manager Journey
1. **Launch App** → Role Selector screen
2. **Select "HR Manager"** → AdminDashboard
3. **Upload job description** → Paste or upload file
4. **Upload bulk resumes** → Select 5, 10, 50+ files at once
5. **Click "Rank Candidates"** → System analyzes all
6. **View Results** → Ranked list with scores
7. **Expand details** → See score breakdown per candidate
8. **Share/Export** → Send results or download CSV

---

## Key Features Implemented

### ✅ Dual Role System
- Role selection on app launch
- Separate UI/UX for each role
- Independent navigation flows
- Easy role switching

### ✅ Advanced File Parsing
- PDF extraction (multi-page support)
- Word document parsing (DOC/DOCX)
- Plain text files
- File size validation (10MB max)
- Word count display
- Error handling with user-friendly messages

### ✅ Professional UI
- PIDE logo on header (left side)
- Website-style design (not app tabs)
- Card-based layouts
- Color-coded scoring (Green/Orange/Red)
- Responsive design
- Smooth animations

### ✅ Analytics & History
- Candidate ranking with scores
- Score breakdown visualization
- Application history for candidates
- Past ranking sessions for HR
- CSV export functionality

### ✅ Demo Mode Fallback
- Works without backend API
- Heuristic-based analysis using keyword matching
- Graceful degradation when API unavailable
- All features functional in demo mode

---

## Running the Application

### Start the Frontend
```bash
cd PIDE-ResumeAnalyzer
npm start
```

**Access Points:**
- Web: http://localhost:8081
- Mobile: Scan QR code with Expo Go app

### (Optional) Start the Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Backend will run on:** http://localhost:5000

---

## Testing Scenarios

### Candidate Portal Testing
1. ✅ Select "Job Seeker" role
2. ✅ Upload a sample resume (PDF/TXT)
3. ✅ (Optional) Upload job description
4. ✅ Click "Apply Now"
5. ✅ Verify results display with score
6. ✅ Check history for saved application
7. ✅ Switch role to test dual-system

### Admin Portal Testing
1. ✅ Select "HR Manager" role
2. ✅ Upload job description
3. ✅ Upload 3-5 sample resumes
4. ✅ Click "Rank Candidates"
5. ✅ Verify candidates ranked by score
6. ✅ Expand candidate details
7. ✅ Test "Share" and "Export" functions

---

## Performance Optimizations

- **Lazy Loading:** Navigation screens loaded on demand
- **Memory Efficient:** File parsing streams data
- **Caching:** AsyncStorage for history
- **Bundle Size:** Optimized dependencies (pdfjs-dist, mammoth)
- **Metro Bundler:** 749 modules bundled in ~19.5 seconds

---

## Future Enhancements

- [ ] Authentication system (JWT, OAuth)
- [ ] Real-time notifications for new applications
- [ ] Advanced filtering & search
- [ ] Custom scoring criteria per job posting
- [ ] Resume database persistence
- [ ] Email integration for applicant communication
- [ ] Admin analytics dashboard
- [ ] Mobile app (iOS/Android native builds)

---

## Developer Information

- **Name:** Kashish Kumari
- **Email:** kashishkumari.bscsf22@iba-suk.edu.pk
- **Organization:** PIDE (Pakistan Institute of Development Economics)
- **Year:** © 2026

---

## Important Notes

1. **Backend Optional:** The system works in demo mode without backend
2. **File Limits:** Currently processing up to 50 resumes per batch (adjustable)
3. **Memory:** Large PDF files (10MB+) may cause memory issues on older devices
4. **Browser Support:** Works best on Chrome, Firefox, Safari (Web)
5. **Data Privacy:** All uploads are processed locally (no server storage without backend)

---

## Status Summary

✅ **COMPLETE - Production Ready**

- [x] Dual system architecture
- [x] Role-based navigation
- [x] Candidate portal (website-style)
- [x] Admin ranking system
- [x] Multi-format file parsing
- [x] Professional UI/UX
- [x] Analytics & history
- [x] Export functionality
- [x] Demo mode fallback
- [x] App running successfully on http://localhost:8081

**Last Updated:** August 18, 2026
**Repo:** https://github.com/Kashishk7-10/Resume-Analyzer
