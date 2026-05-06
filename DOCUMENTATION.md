# 🧠 Smart Resume Analyser - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Running the Application](#running-the-application)
7. [How It Works](#how-it-works)
8. [API Documentation](#api-documentation)
9. [File Format Support](#file-format-support)
10. [Features Breakdown](#features-breakdown)
11. [Troubleshooting](#troubleshooting)
12. [Future Improvements](#future-improvements)

---

## Project Overview

**Smart Resume Analyser** is an AI-powered web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS) and career advancement. 

### Key Capabilities:
- 📄 **Multi-format resume upload** (PDF, DOCX, TXT)
- 🧠 **AI-powered analysis** using Google Gemini API
- 📊 **ATS compatibility scoring** with detailed breakdown
- 🎯 **Job role matching** system
- 🔍 **Skills detection** (present vs. missing)
- ✏️ **Actionable improvement suggestions**
- 📥 **PDF report generation** with full analysis

---

## Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          React Frontend (Vite)                   │  │
│  │  - File upload & parsing (PDF/DOCX/TXT)         │  │
│  │  - UI rendering & interactions                   │  │
│  │  - PDF report generation                         │  │
│  │  Port: 5173                                       │  │
│  └──────────────────────────────────────────────────┘  │
│                         ↕↕ HTTP                        │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │    Express Proxy Server (Node.js)    │
        │  - CORS handling                     │
        │  - Gemini API forwarding             │
        │  Port: 3001                          │
        └──────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │    Google Gemini 2.5 Flash API       │
        │  - Resume analysis                   │
        │  - ATS scoring                       │
        │  - Skill detection                   │
        └──────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **pdfjs-dist** | PDF parsing & text extraction |
| **mammoth** | DOCX file parsing |
| **jspdf** | PDF report generation |
| **ESLint** | Code quality & linting |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express 5** | Web server framework |
| **CORS** | Cross-Origin Resource Sharing |
| **dotenv** | Environment variable management |
| **node-fetch** | HTTP client for API calls |

### External Services
| Service | Purpose |
|---------|---------|
| **Google Gemini 2.5 Flash** | AI-powered resume analysis |

---

## Project Structure

```
Smart_Resume_Analyser/
│
├── 📁 node_modules/           # Dependencies
├── 📁 public/                 # Static assets
├── 📁 src/                    # Frontend source code
│   ├── 📄 App.jsx            # Main React component
│   ├── 📄 App.css            # Component styles
│   ├── 📄 main.jsx           # React entry point
│   ├── 📄 index.css          # Global styles
│   └── 📁 assets/            # Images, icons, etc.
│
├── 📁 dist/                   # Build output (created after npm run build)
│
├── 📄 proxy.cjs              # Express backend server
├── 📄 vite.config.js         # Vite configuration
├── 📄 eslint.config.js       # ESLint configuration
├── 📄 package.json           # Dependencies & scripts
├── 📄 .env                   # Environment variables
├── 📄 .gitignore             # Git ignore rules
├── 📄 README.md              # Basic README
└── 📄 DOCUMENTATION.md       # This file
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Google Gemini API Key (free tier available at [Google AI Studio](https://aistudio.google.com))

### Step 1: Clone the Repository

```bash
git clone https://github.com/RoshRaj01/Smart_Resume_Analyser.git
cd Smart_Resume_Analyser
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- React & React DOM
- Vite & build tools
- Express server components
- PDF & DOCX parsing libraries

### Step 3: Obtain Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key in Google Cloud Console
4. Copy the key

### Step 4: Configure Environment Variables

Edit the `.env` file:

```env
# Required: Your Google Gemini API Key
GEMINI_API_KEY=your_actual_api_key_here

# Backend Configuration
BACKEND_PORT=3001
NODE_ENV=development
```

**⚠️ Important:** Never commit `.env` to version control. It's already in `.gitignore`.

---

## Running the Application

### Method 1: Development Mode (Recommended)

**Terminal 1 - Start the backend proxy server:**
```bash
node proxy.cjs
```
Expected output:
```
Proxy running on http://localhost:3001
```

**Terminal 2 - Start the frontend development server:**
```bash
npm run dev
```
Expected output:
```
  VITE v8.x.x
  ➜  Local:   http://localhost:5173/
```

Then open `http://localhost:5173` in your browser.

### Method 2: Production Build

```bash
# Build the frontend
npm run build

# Start the proxy server
node proxy.cjs

# Serve the built app (optional)
npm run preview
```

### Method 3: Docker (Future Enhancement)

Can be containerized for deployment on cloud platforms.

---

## How It Works

### User Flow

```
1. User uploads resume (PDF/DOCX/TXT)
   ↓
2. Frontend parses file:
   - PDF → pdfjs-dist extracts text
   - DOCX → mammoth extracts text
   - TXT → direct FileReader
   ↓
3. Text is processed:
   - Trimmed to ~8000 characters for performance
   - Job role context added from input field
   ↓
4. Dynamic prompt generated:
   "Analyze this resume for ATS compatibility,
    skills, and match to [Job Role]..."
   ↓
5. Request sent to proxy server at /api/analyse
   ↓
6. Express server forwards to Gemini API
   ↓
7. Gemini analyzes and returns JSON:
   {
     "atsScore": 78,
     "atsBreakdown": {...},
     "presentSkills": [...],
     "missingSkills": [...],
     "jobMatch": 82,
     "improvements": [...],
     "assessment": "..."
   }
   ↓
8. Frontend renders results:
   - ATS Score Card
   - Job Match Score
   - Skills Section
   - Improvements List
   ↓
9. User can download PDF report:
   - Full analysis included
   - Formatted professionally
   - Saved as: resume-report-[filename].pdf
```

### Key Processing Steps

#### File Parsing
```javascript
// PDF Processing
const pdfData = await pdfjsLib.getDocument(fileBuffer).promise;
const text = extractTextFromPages(pdfData);

// DOCX Processing
const docResult = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
const text = docResult.value;

// TXT Processing
const text = fileContent;
```

#### Text Trimming
- Resumes exceeding ~8000 characters are trimmed
- Preserves most important information
- Prevents API timeout or excessive token usage

#### Dynamic Prompt Generation
```
User inputs: "Resume content" + "Target Job Role"
App generates: "Analyze this resume for [specific role]..."
```

---

## API Documentation

### Backend Endpoint

#### POST `/api/analyse`

Analyzes a resume using the Gemini API.

**Request:**
```json
{
  "prompt": "Analyze this resume for [job role]: [resume text]..."
}
```

**Response (Success - 200):**
```json
{
  "text": "{\"atsScore\": 78, \"presentSkills\": [...], ...}"
}
```

**Response (Error - 500):**
```json
{
  "error": "API error message or authentication failure"
}
```

**Environment:**
- Requires `GEMINI_API_KEY` in `.env`
- Uses `gemini-2.5-flash` model
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

---

## File Format Support

### PDF Files
- **Library:** pdfjs-dist
- **Supported:** All standard PDF formats
- **Limitation:** Scanned PDFs (image-based) may not work well

### DOCX Files
- **Library:** mammoth
- **Supported:** Microsoft Word .docx format
- **Note:** Formatting is stripped, only text is extracted

### Text Files (.txt)
- **Library:** FileReader API
- **Supported:** Plain text files
- **Encoding:** UTF-8

### NOT Supported
- ❌ PNG, JPG (image-based)
- ❌ DOC (legacy Word format)
- ❌ RTF
- ❌ Google Docs (export as DOCX first)

---

## Features Breakdown

### 1. File Upload & Parsing

**Component:** Drop Zone
- Drag & drop support
- Click to select
- Multiple format support
- File validation

**Technologies:**
- HTML5 File API
- pdfjs-dist
- mammoth
- FileReader API

### 2. AI Analysis

**Powered by:** Google Gemini 2.5 Flash

**Analysis includes:**
- ATS Score (0-100)
- ATS Breakdown (formatting, keywords, sections)
- Skills Detection (present vs missing)
- Job Role Matching Score
- Improvement Suggestions
- Overall Assessment

### 3. Report Generation

**Library:** jspdf

**Report Includes:**
- Resume filename
- Analysis timestamp
- ATS Score with explanation
- Detailed skills breakdown
- Job match analysis
- Top 5 improvements
- Final recommendations

**Format:** PDF, downloadable as `resume-report-[filename].pdf`

### 4. UI/UX Features

**Design System:**
- Custom CSS with CSS variables
- Responsive design (mobile-friendly)
- Dark/light color scheme
- Smooth animations & transitions
- Professional typography (Google Fonts)

**Interactive Elements:**
- Real-time file upload feedback
- Loading state with spinner
- Error handling with user-friendly messages
- Copy-to-clipboard functionality (if needed)
- PDF download trigger

---

## Troubleshooting

### Issue: "Failed to fetch from proxy"

**Solution:**
1. Ensure proxy server is running: `node proxy.cjs`
2. Check if port 3001 is not blocked by firewall
3. Verify CORS is enabled in proxy.cjs
4. Check browser console for specific error

### Issue: "Invalid API Key"

**Solution:**
1. Verify `GEMINI_API_KEY` in `.env` is correct
2. Check key hasn't expired (regenerate if needed)
3. Ensure `.env` file is in project root
4. Restart proxy server after changing `.env`

### Issue: "PDF parsing failed"

**Solution:**
1. Ensure PDF is not corrupted
2. Try converting PDF to different format
3. Check if PDF is scanned (image-based)
4. Use text or DOCX format instead

### Issue: "DOCX file not parsing"

**Solution:**
1. Ensure file is actual .docx (not .doc)
2. Try re-saving in Microsoft Word
3. Check file is not password-protected
4. Use PDF or TXT format as fallback

### Issue: "Response takes too long"

**Solution:**
1. Check internet connection
2. Verify Gemini API quota not exceeded
3. Resume might be too large; try shorter version
4. Check if Gemini API is experiencing downtime

### Issue: "Port 3001/5173 already in use"

**Solution - Change port:**

In `proxy.cjs`:
```javascript
app.listen(3001, () => ...);  // Change 3001 to 3002
```

In `vite.config.js`:
```javascript
server: { port: 5174 }  // Change 5173 to 5174
```

---

## Future Improvements

### Planned Features

1. **Resume Rewriting**
   - AI-powered suggestions to rewrite sections
   - Grammar & clarity improvements
   - Keyword optimization

2. **Multiple Resume Comparison**
   - Compare effectiveness of different versions
   - A/B testing for job applications
   - Ranked scoring

3. **Cloud Deployment**
   - Deploy frontend to Vercel
   - Deploy backend to Render/Railway
   - Production-ready setup

4. **User Authentication**
   - User accounts & login
   - Save analysis history
   - Personal dashboard

5. **Enhanced Reporting**
   - Interactive HTML reports
   - Email report delivery
   - Share reports via link

6. **Advanced Analytics**
   - Track improvements over time
   - Application success rate tracking
   - Job market insights

7. **Job Board Integration**
   - Auto-match to job postings
   - One-click application analysis
   - LinkedIn integration

8. **Multi-language Support**
   - Support for non-English resumes
   - Real-time translation

### Development Roadmap

```
Phase 1 (Current)
├── Basic resume upload & analysis
├── PDF/DOCX/TXT support
├── ATS scoring
└── PDF report generation

Phase 2 (Q3 2026)
├── Resume rewriting feature
├── Multiple resume comparison
└── Enhanced UI/UX

Phase 3 (Q4 2026)
├── Cloud deployment
├── User authentication
└── Analytics dashboard

Phase 4 (Q1 2027)
├── AI-powered resume suggestions
├── Job board integration
└── Advanced reporting
```

---

## Performance Tips

### Optimize Resume Parsing
- Resumes should be 1-2 pages
- Avoid images and complex formatting
- Use standard fonts

### Reduce API Response Time
- Keep resume text under 5000 characters
- Use clear job role description
- Ensure stable internet connection

### Frontend Performance
- Clear browser cache if experiencing lag
- Use Chromium-based browsers for best performance
- Close unnecessary browser tabs

---

## Security Notes

### API Key Safety
- Never share your `GEMINI_API_KEY`
- Don't commit `.env` to version control
- Regenerate key if accidentally exposed
- Consider using Cloud Secret Manager for production

### Data Privacy
- Resumes are sent to Google Gemini API
- Consider privacy implications before uploading sensitive info
- No data is stored by this application
- Each analysis is independent (no history kept locally)

---

## Additional Resources

- [Google Gemini API Docs](https://cloud.google.com/generative-ai/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- [mammoth.js](https://github.com/mwilson/mammoth.js)

---

## License

This project is open source and available under the MIT License.

## Support

For issues or feature requests, please check the GitHub repository issues page or contact the maintainers.

---

**Last Updated:** May 6, 2026  
**Version:** 1.0.0  
**Status:** Active Development
