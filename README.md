# 🧠 Smart Resume Analyser

An AI-powered web application that evaluates resumes for **ATS compatibility**, identifies **skill gaps**, matches them to **job roles**, and generates a **downloadable PDF report**.

---

## 🚀 Features

* 📄 Upload resumes (**PDF, DOCX, TXT**)
* 🧠 AI-powered analysis (Gemini)
* 📊 ATS Score with detailed breakdown
* 🎯 Job role matching system
* 🔍 Skills detection (present vs missing)
* ✏️ Actionable improvement suggestions
* 📥 Download full analysis as **PDF report**

---

## 📂 Project Structure

```
Resume_Analyser/
│
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx        # Core UI + logic + PDF generation
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── proxy.cjs          # Backend proxy (Gemini API handler)
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/RoshRaj01/Smart_Resume_Analyser.git
cd smart_resume_analyser
```

### 2. Install Dependencies

```bash
npm install
```

---

## ▶️ Run Frontend

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🔌 Proxy Server Setup (REQUIRED)

Frontend sends requests to:

```
http://localhost:3001/api/analyse
```

So backend **must be running**.

---

### 1. Install Backend Dependencies

```bash
npm install express cors dotenv node-fetch
```

---

### 2. Create `.env`

```env
GEMINI_API_KEY=your_api_key_here
```

---

### 3. Create proxy.cjs

---

### 4. Start Proxy Server

```bash
node proxy.cjs
```

---

## 🧠 How It Works

1. User uploads resume
2. File is processed:

   * PDF → `pdfjs-dist`
   * DOCX → `mammoth`
   * TXT → FileReader
3. Text is trimmed (~8000 chars)
4. Prompt is generated dynamically
5. Sent to proxy server
6. Gemini processes request
7. JSON response returned
8. UI renders:

   * ATS Score
   * Skills
   * Improvements
   * Job match
9. User can download full **PDF report**

---

## 📦 Key Libraries Used

* `pdfjs-dist` → PDF parsing
* `mammoth` → DOCX parsing (fixed implementation)
* `jspdf` → PDF report generation
* `express` → backend server
* `cors` → API handling

---

## 📥 PDF Report Feature

The app generates a structured report including:

* ATS Score + breakdown
* Job match score
* Skills & gaps
* Improvement suggestions
* Final assessment

Saved automatically as:

```
resume-report-<filename>.pdf
```

---

📸 Screenshots

<img width="1919" height="907" alt="Screenshot 2026-03-26 112940" src="https://github.com/user-attachments/assets/e7d9481d-bb18-4b46-8c7c-85654a1b2cb9" />
<img width="1919" height="908" alt="Screenshot 2026-03-26 113004" src="https://github.com/user-attachments/assets/f2926ff4-182f-44e1-841d-b9635b406932" />
<img width="1903" height="910" alt="Screenshot 2026-03-26 113052" src="https://github.com/user-attachments/assets/a5fd7247-9ee3-41d3-b8ec-e308e7ba6de4" />
<img width="1901" height="906" alt="Screenshot 2026-03-26 120242" src="https://github.com/user-attachments/assets/536c747f-3346-4a04-a986-6f72912a5608" />

---

## ⚠️ Important Notes

* Proxy server must be running before analysis
* Gemini API key is required
* Large resumes are truncated for performance

---

## 🔮 Future Improvements

* Resume rewriting with AI
* Multiple resume comparison
* Cloud deployment (Vercel + Render)
* User authentication
* Saved history of reports
