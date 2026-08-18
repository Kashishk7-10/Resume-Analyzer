# PIDE Resume Analyzer - Testing Guide

## Quick Start

### 1. Start the Application
```bash
cd PIDE-ResumeAnalyzer
npm start
```

**Wait for:** "Web is waiting on http://localhost:8081"

### 2. Open in Browser
Visit: **http://localhost:8081**

You should see a **role selection screen** with two buttons:
- 👤 **Job Seeker** - Individual resume submission
- 👨‍💼 **HR Manager** - Bulk candidate ranking

---

## Test Scenario 1: Candidate Portal (Job Seeker)

### Steps:
1. **Click "Job Seeker" button** on role selector
2. **See Home Screen** with:
   - PIDE logo (🏛️) on top left
   - "Pakistan Institute" subtitle
   - "Career Portal" title
   - About PIDE section with stats
   - About section showing 500+ Alumni, 50+ Projects, 20+ Excellence
3. **Click "Apply Now" tab** at bottom
4. **See application interface** with:
   - PIDE header with logo
   - "About PIDE" section
   - "Join Our Team" heading
   - Resume upload box (📄)
   - Job Description upload box (💼) - marked Optional
5. **Upload Resume:**
   - Click on "📎 Click to upload Resume" box
   - Select a PDF/DOC/DOCX/TXT file from your computer
   - Should see filename and word count displayed
6. **(Optional) Upload Job Description:**
   - Click on "📎 Click to upload Job Description" box
   - Select another file
   - Word count should display
7. **Click "🚀 Apply Now" button**
   - See loading spinner: "Analyzing Your Profile..."
   - Wait for analysis (5-10 seconds)
8. **View Results Screen:**
   - Should show:
     - Match score (e.g., "73.5%")
     - Assessment label (Good Fit / Moderate Fit / No Fit)
     - Score breakdown (if available)
   - Can go back to apply again
9. **Check History Tab:**
   - Should show past applications with dates
   - Click to view details

### Expected Behavior:
- ✅ File upload works (shows filename + word count)
- ✅ Removes files with "✕ Remove" button
- ✅ Changes files with "Change Resume" button
- ✅ Analysis completes without errors
- ✅ Results display with score and assessment
- ✅ History tracks applications
- ✅ App maintains PIDE branding throughout

---

## Test Scenario 2: Admin Portal (HR Manager)

### Steps:
1. **Go back to role selector** (from any screen, refresh browser or press Back)
2. **Click "HR Manager" button** on role selector
3. **See Admin Dashboard with:**
   - PIDE logo (🏛️) on header
   - "HR Portal" subtitle
   - "Bulk Ranking" title
   - "Candidate Ranking System" description
4. **Upload Job Description:**
   - Click "📋 Click to upload Job Description"
   - Select a job description file
   - File should show with word count
   - Can change with "Change Job Description" button
5. **Upload Multiple Resumes:**
   - Click "📄 Click to upload Resumes"
   - Select 2-5 resume files (multi-select)
   - Should show "✅ 5 resume(s) uploaded successfully" alert
   - Files listed below with:
     - Filename (with 📄 icon)
     - Word count
     - ✕ Remove button per file
   - Shows counter: "Resumes (5)"
6. **Add More Resumes:**
   - Can click "+ Add More Resumes" to upload additional files
7. **Click "🎯 Rank Candidates (5)" button**
   - See loading: "Analyzing Candidates..."
   - Wait 10-15 seconds for batch processing
8. **See Ranking Results Screen with:**
   - **Statistics cards at top:**
     - 📊 Total candidates
     - 🏆 Top score
     - ✅ Good matches count
   - **Ranked candidate list:**
     - #1 badge (green circle)
     - Candidate name
     - Score as percentage with color (Green/Orange/Red)
     - Filename
   - **Expandable cards:**
     - Click any candidate to expand details
     - Shows: Assessment label, score breakdown, resume preview
     - Action buttons: Share, View Full
9. **Expand Candidate Details:**
   - Click candidate card to expand
   - See score breakdown with visual bars
   - See resume preview (first 200 words)
   - Click "📤 Share" to share results
   - Click "👁 View Full" to see complete resume
10. **Export Results:**
    - Scroll to bottom
    - Click "📥 Export Results as CSV" button
    - Should trigger download/share dialog
11. **Go Back:**
    - Click "← Back to Dashboard" button
    - Returns to upload screen
    - Can upload new batch

### Expected Behavior:
- ✅ Multi-file upload works (supports 5+ files)
- ✅ Files display with word counts
- ✅ Ranking completes without errors
- ✅ Candidates sorted by score (highest first)
- ✅ Expandable cards show full details
- ✅ Color coding works (Green=Good, Orange=Moderate, Red=Low)
- ✅ Share and export functions work
- ✅ Can go back and upload new batch

---

## Test Files to Use

### Sample Resume (create in Notepad or Word):
```
JOHN DEVELOPER
john@email.com | +1-555-1234 | LinkedIn: /in/johndeveloper

SUMMARY
Experienced software engineer with 5+ years in full-stack development, 
specializing in React, Node.js, and cloud architecture. Proven track 
record delivering scalable applications for startups and enterprises.

EXPERIENCE
Senior Developer | Tech Company | 2021-Present
- Led development of React-based SPA serving 100k+ users
- Architected microservices backend with Node.js and MongoDB
- Improved performance by 40% through optimization
- Mentored team of 5 junior developers

Full Stack Developer | StartUp Inc | 2019-2021
- Built e-commerce platform using MERN stack
- Implemented payment integration with Stripe
- Developed admin dashboard for operations team

SKILLS
Languages: JavaScript, Python, Java, SQL
Frameworks: React, Node.js, Express, Flask
Databases: MongoDB, PostgreSQL, Redis
Cloud: AWS, GCP, Docker, Kubernetes

EDUCATION
BS Computer Science | University Name | 2019
GPA: 3.8/4.0
```

### Sample Job Description:
```
JOB POSTING: Senior Full Stack Developer

We're seeking an experienced Full Stack Developer to join our growing team.

REQUIREMENTS
- 5+ years of experience in full-stack web development
- Strong proficiency in React and Node.js
- Experience with RESTful API design
- Solid understanding of databases (SQL and NoSQL)
- Experience with cloud platforms (AWS preferred)
- Excellent communication and team collaboration skills
- Bachelor's degree in Computer Science or related field

RESPONSIBILITIES
- Design and implement scalable web applications
- Collaborate with product team on feature development
- Mentor junior developers
- Participate in code reviews and architecture decisions
- Optimize application performance and security

NICE TO HAVE
- Experience with Docker and Kubernetes
- Background with microservices architecture
- Contributions to open-source projects
- Experience leading technical initiatives
```

---

## Troubleshooting

### Issue: "Cannot read property 'filename' of undefined"
**Solution:** This is expected without backend. Use demo mode - app will still work.

### Issue: File upload shows but doesn't extract
**Solution:** 
- Try a smaller file (< 5MB)
- Make sure file format is PDF/DOC/DOCX/TXT
- Check browser console for errors (Press F12)

### Issue: Results not showing after analysis
**Solution:**
- Wait 10-15 seconds (backend may be starting)
- If still nothing, backend is offline - demo mode should kick in
- Check network tab in developer tools

### Issue: "Metro waiting" but page won't load
**Solution:**
- Browser may be caching. Press `Ctrl+Shift+R` (hard refresh)
- Check http://localhost:8081 is correct
- App usually takes 30-60 seconds to start completely

### Issue: Multiple file select not working
**Solution:**
- Works best in Chrome/Firefox/Safari on desktop
- On mobile, may need to select files one at a time
- Try refreshing browser and trying again

---

## Performance Notes

### Expected Load Times
- **App Startup:** 30-60 seconds (Metro bundling)
- **File Upload:** Instant (local processing)
- **Single Resume Analysis:** 5-10 seconds (demo mode)
- **Bulk Analysis (5 resumes):** 10-20 seconds (demo mode)
- **File Parsing:** Fast (< 2 seconds per file)

### Memory Usage
- **Lightweight:** App uses ~100-200MB RAM
- **Large Files:** PDFs over 10MB may cause slowdowns
- **Multiple Uploads:** Can handle 50+ files in one session

---

## Developer Tools

### Open Developer Console
Press `F12` in browser to see:
- Console logs for debugging
- Network requests to backend
- Storage (AsyncStorage data)
- Performance metrics

### Reload Application
- **Soft Reload:** Press `r` in terminal running `npm start`
- **Hard Reload:** `Ctrl+Shift+R` in browser
- **Full Reset:** Clear browser cache and refresh

### Test Different Roles
1. Select role A, test features
2. Refresh browser or go back to role selector
3. Select role B, test different features
4. Verify each has independent navigation

---

## Acceptance Criteria Checklist

### Candidate Portal ✅
- [ ] Role selector shows two options (Job Seeker, HR Manager)
- [ ] Candidate flow has Home → Apply Now → History tabs
- [ ] Resume upload works for PDF/DOC/DOCX/TXT
- [ ] Optional job description upload functional
- [ ] Results display with score and assessment
- [ ] History tracks past applications
- [ ] All text mentions "2026" not "2024"
- [ ] Developer info shows "Kashish Kumari"
- [ ] PIDE logo visible on header (left side)
- [ ] Website-style design (not pure app tabs)

### Admin Portal ✅
- [ ] HR Manager role selectable from role selector
- [ ] Admin Dashboard shows upload interface
- [ ] Job description upload works
- [ ] Multi-file resume upload works (2+ files)
- [ ] Resume listing shows filenames and word counts
- [ ] "Rank Candidates" button triggers analysis
- [ ] Ranking Results screen shows ranked candidates
- [ ] Candidates sorted by score (highest first)
- [ ] Expandable cards show score breakdown
- [ ] Color coding (Green/Orange/Red) works
- [ ] Share and export functions available
- [ ] Back button returns to dashboard

### General Features ✅
- [ ] No dummy data ("85% accuracy", "8000+ samples")
- [ ] All branding consistent (PIDE)
- [ ] Professional UI with proper styling
- [ ] Error handling with user-friendly messages
- [ ] File size validation (10MB max)
- [ ] Word count display on upload
- [ ] Demo mode works without backend
- [ ] No console errors or warnings

---

## Success Criteria

✅ **Complete when:**
1. Candidate can upload resume and get instant analysis
2. HR can upload bulk resumes and get ranked results
3. Both flows work independently without conflicts
4. App runs stably for 30+ minutes without crashes
5. File parsing works for all supported formats
6. Results display correctly with scores
7. UI is professional and matches PIDE branding

---

**Last Updated:** August 18, 2026  
**Status:** Ready for Testing  
**Report Issues to:** kashishkumari.bscsf22@iba-suk.edu.pk
