import { useState, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0a0a0f;
    --paper: #f5f2eb;
    --cream: #ede8dc;
    --accent: #c8472b;
    --accent2: #2b6cc8;
    --gold: #c9a227;
    --muted: #7a7468;
    --border: #d4cfc4;
    --card: #faf8f4;
  }

  body {
    font-family: 'Syne', sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }

  .header {
    padding: 52px 0 40px;
    border-bottom: 2px solid var(--ink);
    margin-bottom: 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }
  .header-left {}
  .header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .header-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(36px, 5vw, 56px);
    line-height: 1.05;
    font-weight: 400;
    color: var(--ink);
  }
  .header-title em { color: var(--accent); font-style: italic; }
  .header-sub {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    margin-top: 12px;
    line-height: 1.6;
  }
  .header-badge {
    flex-shrink: 0;
    background: var(--ink);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 8px 14px;
    border-radius: 2px;
  }

  .upload-section { margin-bottom: 32px; }
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .drop-zone {
    border: 2px dashed var(--border);
    background: var(--card);
    border-radius: 4px;
    padding: 52px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); background: #fdf6f4; }
  .drop-zone input[type=file] {
    position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .drop-icon { font-size: 36px; margin-bottom: 14px; display: block; }
  .drop-main { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .drop-sub { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); }
  .file-loaded { border: 2px solid var(--ink); background: var(--ink); color: var(--paper); }
  .file-loaded:hover { border-color: var(--ink); background: #1a1a2a; }
  .file-name { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; letter-spacing: 0.02em; }

  .job-row { display: flex; gap: 12px; margin-bottom: 32px; }
  .job-input {
    flex: 1;
    border: 2px solid var(--border);
    background: var(--card);
    border-radius: 4px;
    padding: 14px 18px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
  }
  .job-input::placeholder { color: var(--muted); }
  .job-input:focus { border-color: var(--accent2); }

  .btn {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.04em;
    padding: 14px 28px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover:not(:disabled) { background: #a83520; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-secondary { background: transparent; color: var(--ink); border: 2px solid var(--border); }
  .btn-secondary:hover { border-color: var(--ink); }
  .btn-download { background: var(--ink); color: var(--paper); }
  .btn-download:hover { background: #2a2a3a; transform: translateY(-1px); }

  .loading-card {
    background: var(--card);
    border: 2px solid var(--border);
    border-radius: 4px;
    padding: 48px;
    text-align: center;
  }
  .loading-title { font-family: 'Instrument Serif', serif; font-size: 24px; margin-bottom: 12px; }
  .loading-sub { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); margin-bottom: 32px; }
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 20px;
  }
  .loading-steps { list-style: none; text-align: left; max-width: 300px; margin: 0 auto; }
  .loading-step {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .loading-step.done { color: var(--ink); }
  .step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
  .loading-step.done .step-dot { background: #27a860; }
  .loading-step.active .step-dot { background: var(--accent); animation: pulse 1s infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

  .results { animation: fadeUp 0.5s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .ats-hero {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 32px;
    background: var(--ink);
    color: var(--paper);
    border-radius: 4px;
    padding: 40px;
    margin-bottom: 32px;
    align-items: center;
  }
  .score-ring-wrap { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
  .score-ring { width: 140px; height: 140px; transform: rotate(-90deg); }
  .score-ring-bg { fill: none; stroke: #ffffff22; stroke-width: 10; }
  .score-ring-fill { fill: none; stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
  .score-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .score-num { font-family: 'Instrument Serif', serif; font-size: 42px; line-height: 1; }
  .score-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.6; margin-top: 2px; }
  .ats-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.5; margin-bottom: 8px; }
  .ats-verdict { font-family: 'Instrument Serif', serif; font-size: 28px; margin-bottom: 10px; }
  .ats-desc { font-family: 'DM Mono', monospace; font-size: 12px; opacity: 0.65; line-height: 1.7; }
  .ats-breakdown { margin-top: 20px; display: flex; gap: 16px; flex-wrap: wrap; }
  .ats-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    padding: 5px 12px;
    border-radius: 20px;
    border: 1px solid;
    letter-spacing: 0.06em;
  }

  .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  @media (max-width: 640px) { .cards-grid { grid-template-columns: 1fr; } .ats-hero { grid-template-columns: 1fr; } }

  .result-card { background: var(--card); border: 2px solid var(--border); border-radius: 4px; padding: 28px; }
  .result-card.full { grid-column: 1 / -1; }
  .card-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .card-title .icon { font-size: 16px; }

  .improve-list { list-style: none; }
  .improve-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 10px;
    align-items: start;
    font-size: 14px;
    line-height: 1.6;
  }
  .improve-item:last-child { border-bottom: none; }
  .improve-badge {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .badge-high { background: #fde8e4; color: #c8472b; }
  .badge-med  { background: #fef3cd; color: #a07800; }
  .badge-low  { background: #e8f4ea; color: #27a860; }
  .improve-category {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 3px;
  }

  .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { font-family: 'DM Mono', monospace; font-size: 11px; padding: 5px 12px; border-radius: 2px; letter-spacing: 0.04em; }
  .skill-missing { background: #fde8e4; color: #a83520; border: 1px solid #f5c4bc; }
  .skill-present { background: #e8f4ea; color: #1e7f46; border: 1px solid #b8e0c4; }

  .match-score-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .match-score-big { font-family: 'Instrument Serif', serif; font-size: 52px; line-height: 1; }
  .match-bar-wrap { flex: 1; }
  .match-bar-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); margin-bottom: 6px; letter-spacing: 0.1em; text-transform: uppercase; }
  .match-bar-track { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .match-bar-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .match-verdict { font-size: 15px; font-weight: 700; margin-bottom: 6px; }
  .match-note { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); line-height: 1.65; }

  /* DOWNLOAD BANNER */
  .download-banner {
    margin-top: 32px;
    background: var(--card);
    border: 2px dashed var(--border);
    border-radius: 4px;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .download-banner-title { font-size: 15px; font-weight: 700; margin-bottom: 5px; }
  .download-banner-sub { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
  @media (max-width: 600px) { .download-banner { flex-direction: column; align-items: flex-start; } }

  .reset-row { display: flex; justify-content: center; margin-top: 20px; gap: 12px; flex-wrap: wrap; }

  .error-banner {
    background: #fde8e4;
    border: 2px solid #f5c4bc;
    border-radius: 4px;
    padding: 16px 20px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #a83520;
    margin-bottom: 24px;
  }
`;

function ScoreRing({ score, color }) {
  const r = 55;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="score-ring-wrap">
      <svg className="score-ring" viewBox="0 0 140 140">
        <circle className="score-ring-bg" cx="70" cy="70" r={r} />
        <circle className="score-ring-fill" cx="70" cy="70" r={r}
          stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="score-center">
        <span className="score-num">{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
}

function getScoreColor(s) { return s >= 75 ? "#27a860" : s >= 50 ? "#c9a227" : "#c8472b"; }
function getATSVerdict(s) {
  if (s >= 80) return "Excellent ATS Fit";
  if (s >= 65) return "Good ATS Fit";
  if (s >= 50) return "Moderate ATS Fit";
  if (s >= 35) return "Needs Improvement";
  return "Poor ATS Fit";
}
function getMatchVerdict(s) {
  if (s >= 80) return "Strong Match";
  if (s >= 60) return "Good Match";
  if (s >= 40) return "Partial Match";
  return "Weak Match";
}
function parseJSON(raw) {
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

const LOADING_STEPS = [
  "Parsing resume content",
  "Analysing structure & formatting",
  "Scoring ATS compatibility",
  "Extracting skills & gaps",
  "Matching against job role",
  "Generating recommendations",
];

export default function App() {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const readFile = useCallback(async (f) => {
    const ext = f.name.split(".").pop().toLowerCase();

    // ---- PDF ----
    if (ext === "pdf") {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      return text;
    }

    // ---- DOCX (FIX ADDED HERE) ----
    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const arrayBuffer = await f.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    // ---- TXT ----
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(f);
    });
  }, []);

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext)) {
      setError("Please upload a PDF, DOCX, or TXT file."); return;
    }
    setFile(f); setError("");
    try {
      const text = await readFile(f);
      setFileText(text.slice(0, 8000));
    } catch {
      setFileText(`[File: ${f.name} — content will be analysed by AI]`);
    }
  }, [readFile]);

  const onDrop = useCallback((e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, [handleFile]);
  const onInputChange = useCallback((e) => { handleFile(e.target.files[0]); }, [handleFile]);

  const analyse = async () => {
    if (!file) return;
    setLoading(true); setResult(null); setError(""); setStep(0);
    const advanceStep = (i) => setStep(i);
    try {
      const prompt = `You are an expert resume analyst, ATS specialist, and career coach.

Analyse the following resume${jobRole ? ` for the role: "${jobRole}"` : ""}.

Resume content:
---
${fileText || `[File: ${file.name}]`}
---

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "ats_score": <integer 0-100>,
  "ats_breakdown": { "keywords": <0-100>, "formatting": <0-100>, "readability": <0-100> },
  "ats_summary": "<2-3 sentence summary>",
  "improvements": [{ "priority": "high|medium|low", "category": "Content|Formatting|Structure|Keywords|Impact|Clarity", "suggestion": "<actionable suggestion>" }],
  "present_skills": ["skill1"],
  "missing_skills": ["skill1"],
  "job_match": { "score": <0-100 or null>, "verdict": "<strong|moderate|weak>", "note": "<2-3 sentences>", "key_gaps": ["gap1"], "strengths": ["strength1"] },
  "overall_summary": "<3-4 sentence assessment>"
}
Provide 5-8 improvements. If no job role given, set job_match.score to null.`;

      setTimeout(() => advanceStep(1), 600);
      setTimeout(() => advanceStep(2), 1400);
      setTimeout(() => advanceStep(3), 2400);
      setTimeout(() => advanceStep(4), 3200);
      setTimeout(() => advanceStep(5), 4000);

      const res = await fetch("http://localhost:3001/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(parseJSON(data.text || ""));
    } catch (e) {
      setError("Analysis failed. Please try again. " + (e.message || ""));
    } finally {
      setLoading(false); setStep(-1);
    }
  };

  const reset = () => {
    setFile(null); setFileText(""); setJobRole(""); setResult(null); setError(""); setStep(-1);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── PDF DOWNLOAD ──────────────────────────────────────────────
  const downloadReport = async () => {
    if (!result) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const W = 210, margin = 18, contentW = W - margin * 2;
    let y = 0;

    const C = {
      ink: [10, 10, 15], accent: [200, 71, 43], green: [39, 168, 96],
      gold: [201, 162, 39], muted: [122, 116, 104], border: [212, 207, 196],
      card: [250, 248, 244], white: [255, 255, 255],
    };
    const sc = (s) => s >= 75 ? C.green : s >= 50 ? C.gold : C.accent;

    const checkPage = (needed = 10) => { if (y + needed > 275) { doc.addPage(); y = 18; } };
    const wrapped = (text, x, startY, maxW, lh = 5) => {
      doc.splitTextToSize(text, maxW).forEach((line) => {
        checkPage(lh + 2); doc.text(line, x, startY); startY += lh;
      });
      return startY;
    };

    // Header
    doc.setFillColor(...C.ink);
    doc.rect(0, 0, W, 42, "F");
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...C.muted);
    doc.text("CAREER INTELLIGENCE TOOL  ·  SMART RESUME ANALYSER", margin, 12);
    doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...C.white);
    doc.text("Resume Analysis Report", margin, 26);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(180, 175, 165);
    const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    doc.text(`${dateStr}${file ? "  ·  " + file.name : ""}${jobRole ? "  ·  Role: " + jobRole : ""}`, margin, 35);
    y = 54;

    // ATS block
    doc.setFillColor(...C.card);
    doc.roundedRect(margin, y, contentW, 36, 2, 2, "F");
    doc.setDrawColor(...C.border).setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, 36, 2, 2, "S");
    const cx = margin + 24, cy = y + 18;
    doc.setDrawColor(...sc(result.ats_score)).setLineWidth(3);
    doc.circle(cx, cy, 13, "S");
    doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(...sc(result.ats_score));
    doc.text(String(result.ats_score), cx, cy + 2, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(6).setTextColor(...C.muted);
    doc.text("/ 100", cx, cy + 7, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...C.muted);
    doc.text("ATS COMPATIBILITY SCORE", margin + 42, y + 9);
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...C.ink);
    doc.text(getATSVerdict(result.ats_score), margin + 42, y + 17);
    if (result.ats_breakdown) {
      Object.keys(result.ats_breakdown).forEach((k, i) => {
        const bx = margin + 42 + i * 42;
        doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...C.muted);
        doc.text(k.toUpperCase(), bx, y + 26);
        doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...sc(result.ats_breakdown[k]));
        doc.text(String(result.ats_breakdown[k]), bx, y + 32);
      });
    }
    y += 44;

    if (result.ats_summary) {
      doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...C.muted);
      y = wrapped(result.ats_summary, margin, y, contentW, 5);
      y += 8;
    }

    // Job match
    if (result.job_match && result.job_match.score !== null) {
      checkPage(50);
      doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
      doc.text("JOB ROLE MATCH" + (jobRole ? `  —  ${jobRole.toUpperCase()}` : ""), margin, y);
      y += 4;
      doc.setDrawColor(...C.border).setLineWidth(0.3);
      doc.line(margin, y, margin + contentW, y);
      y += 7;
      doc.setFont("helvetica", "bold").setFontSize(28).setTextColor(...sc(result.job_match.score));
      doc.text(`${result.job_match.score}%`, margin, y + 8);
      doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...C.ink);
      doc.text(getMatchVerdict(result.job_match.score), margin + 28, y + 4);
      doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...C.muted);
      doc.splitTextToSize(result.job_match.note || "", contentW - 28).slice(0, 3)
        .forEach((l, i) => doc.text(l, margin + 28, y + 10 + i * 5));
      y += 28;

      const tagRow = (items, bgRgb, textRgb, label) => {
        if (!items?.length) return;
        checkPage(20);
        doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
        doc.text(label, margin, y); y += 5;
        let tx = margin;
        items.forEach((s) => {
          const tw = doc.getTextWidth(s) + 8;
          if (tx + tw > margin + contentW) { tx = margin; y += 7; checkPage(10); }
          doc.setFillColor(...bgRgb);
          doc.roundedRect(tx, y - 4, tw, 6, 1, 1, "F");
          doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...textRgb);
          doc.text(s, tx + 4, y);
          tx += tw + 4;
        });
        y += 10;
      };
      tagRow(result.job_match.strengths, [232, 244, 234], [30, 127, 70], "KEY STRENGTHS");
      tagRow(result.job_match.key_gaps, [253, 232, 228], [168, 53, 32], "KEY GAPS");
    }

    // Skills
    checkPage(30);
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
    doc.text("SKILLS ANALYSIS", margin, y); y += 4;
    doc.setDrawColor(...C.border).setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y); y += 7;

    const tagRow2 = (items, bgRgb, textRgb, label, limit) => {
      if (!items?.length) return;
      checkPage(20);
      doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
      doc.text(label, margin, y); y += 5;
      let tx = margin;
      (limit ? items.slice(0, limit) : items).forEach((s) => {
        const tw = doc.getTextWidth(s) + 8;
        if (tx + tw > margin + contentW) { tx = margin; y += 7; checkPage(10); }
        doc.setFillColor(...bgRgb);
        doc.roundedRect(tx, y - 4, tw, 6, 1, 1, "F");
        doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...textRgb);
        doc.text(s, tx + 4, y);
        tx += tw + 4;
      });
      y += 12;
    };
    tagRow2(result.present_skills, [232, 244, 234], [30, 127, 70], "DETECTED SKILLS", 12);
    tagRow2(result.missing_skills, [253, 232, 228], [168, 53, 32], "MISSING / RECOMMENDED", null);

    // Improvements
    checkPage(20);
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
    doc.text("IMPROVEMENT SUGGESTIONS", margin, y); y += 4;
    doc.setDrawColor(...C.border).setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y); y += 7;

    (result.improvements || []).forEach((item) => {
      checkPage(16);
      const badgeC = item.priority === "high" ? C.accent : item.priority === "medium" ? C.gold : C.green;
      const bgC = item.priority === "high" ? [253, 232, 228] : item.priority === "medium" ? [254, 243, 205] : [232, 244, 234];
      doc.setFillColor(...bgC);
      doc.circle(margin + 3.5, y - 1.5, 3.5, "F");
      doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...badgeC);
      doc.text(item.priority === "high" ? "!" : item.priority === "medium" ? "~" : "v", margin + 3.5, y + 0.5, { align: "center" });
      doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.muted);
      doc.text((item.category || "").toUpperCase(), margin + 10, y - 2);
      doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...C.ink);
      y = wrapped(item.suggestion || "", margin + 10, y + 3, contentW - 12, 5);
      y += 5;
      doc.setDrawColor(...C.border).setLineWidth(0.2);
      doc.line(margin, y - 2, margin + contentW, y - 2);
      y += 2;
    });

    // Overall summary
    if (result.overall_summary) {
      checkPage(30); y += 4;
      doc.setFillColor(...C.ink);
      doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
      doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.white);
      doc.text("OVERALL ASSESSMENT", margin + 4, y + 5.5);
      y += 14;
      doc.setFont("helvetica", "italic").setFontSize(10).setTextColor(60, 60, 70);
      y = wrapped(result.overall_summary, margin, y, contentW, 6);
      y += 8;
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...C.muted);
      doc.text("Smart Resume Analyser  ·  Powered by Gemini AI", margin, 291);
      doc.text(`Page ${p} of ${pageCount}`, W - margin, 291, { align: "right" });
    }

    doc.save(`resume-report-${file ? file.name.replace(/\.[^.]+$/, "") : "analysis"}.pdf`);
  };
  // ─────────────────────────────────────────────────────────────

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="header-left">
            <div className="header-eyebrow">Career Intelligence Tool</div>
            <h1 className="header-title">Smart <em>Resume</em><br />Analyser</h1>
            <p className="header-sub">ATS scoring · Gap analysis · Job-role matching · AI feedback</p>
          </div>
          <div className="header-badge">Powered by Gemini AI</div>
        </header>

        {error && <div className="error-banner">⚠ {error}</div>}

        {!result && !loading && (
          <>
            <div className="upload-section">
              <div className="section-label">01 — Upload Resume</div>
              <div
                className={`drop-zone${drag ? " drag-over" : ""}${file ? " file-loaded" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
              >
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={onInputChange} />
                {file ? (
                  <>
                    <span className="drop-icon">✓</span>
                    <div className="file-name">{file.name}</div>
                    <div className="drop-sub" style={{color:"#aaa",marginTop:6}}>{(file.size/1024).toFixed(1)} KB · Click to replace</div>
                  </>
                ) : (
                  <>
                    <span className="drop-icon">📄</span>
                    <div className="drop-main">Drop your resume here</div>
                    <div className="drop-sub">PDF, DOCX, or TXT · Click or drag to upload</div>
                  </>
                )}
              </div>
            </div>

            <div className="upload-section">
              <div className="section-label">02 — Target Role (Optional)</div>
              <div className="job-row">
                <input
                  className="job-input"
                  placeholder="e.g. Senior Product Manager, Data Scientist, UX Designer..."
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && file && analyse()}
                />
                <button className="btn btn-primary" disabled={!file} onClick={analyse}>
                  Analyse Resume →
                </button>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="loading-card">
            <div className="spinner" />
            <div className="loading-title">Analysing your resume…</div>
            <div className="loading-sub">Gemini is reading every line carefully</div>
            <ul className="loading-steps">
              {LOADING_STEPS.map((s, i) => (
                <li key={i} className={`loading-step${step > i ? " done" : step === i ? " active" : ""}`}>
                  <span className="step-dot" />{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result && (
          <div className="results">
            <div className="ats-hero">
              <ScoreRing score={result.ats_score} color={getScoreColor(result.ats_score)} />
              <div className="ats-info">
                <div className="ats-eyebrow">ATS Compatibility Score</div>
                <div className="ats-verdict">{getATSVerdict(result.ats_score)}</div>
                <div className="ats-desc">{result.ats_summary}</div>
                {result.ats_breakdown && (
                  <div className="ats-breakdown">
                    {Object.entries(result.ats_breakdown).map(([k, v]) => (
                      <span key={k} className="ats-pill" style={{ borderColor: getScoreColor(v) + "88", color: getScoreColor(v) }}>
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="cards-grid">
              {result.job_match && result.job_match.score !== null && (
                <div className="result-card">
                  <div className="card-title"><span className="icon">🎯</span> Job Role Match{jobRole ? ` — ${jobRole}` : ""}</div>
                  <div className="match-score-row">
                    <div className="match-score-big" style={{color: getScoreColor(result.job_match.score)}}>{result.job_match.score}%</div>
                    <div className="match-bar-wrap">
                      <div className="match-bar-label">Match strength</div>
                      <div className="match-bar-track">
                        <div className="match-bar-fill" style={{ width: `${result.job_match.score}%`, background: getScoreColor(result.job_match.score) }} />
                      </div>
                    </div>
                  </div>
                  <div className="match-verdict">{getMatchVerdict(result.job_match.score)}</div>
                  <div className="match-note">{result.job_match.note}</div>
                  {result.job_match.strengths?.length > 0 && (
                    <div style={{marginTop:14}}>
                      <div className="improve-category" style={{marginBottom:6}}>Key Strengths</div>
                      <div className="skills-grid">
                        {result.job_match.strengths.map((s,i) => <span key={i} className="skill-tag skill-present">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {result.job_match.key_gaps?.length > 0 && (
                    <div style={{marginTop:12}}>
                      <div className="improve-category" style={{marginBottom:6}}>Key Gaps</div>
                      <div className="skills-grid">
                        {result.job_match.key_gaps.map((g,i) => <span key={i} className="skill-tag skill-missing">{g}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="result-card">
                <div className="card-title"><span className="icon">🔍</span> Skills Analysis</div>
                {result.present_skills?.length > 0 && (
                  <div style={{marginBottom:16}}>
                    <div className="improve-category" style={{marginBottom:8}}>Detected Skills</div>
                    <div className="skills-grid">
                      {result.present_skills.slice(0,10).map((s,i) => <span key={i} className="skill-tag skill-present">{s}</span>)}
                    </div>
                  </div>
                )}
                {result.missing_skills?.length > 0 && (
                  <div>
                    <div className="improve-category" style={{marginBottom:8}}>Missing / Recommended</div>
                    <div className="skills-grid">
                      {result.missing_skills.map((s,i) => <span key={i} className="skill-tag skill-missing">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>

              <div className="result-card full">
                <div className="card-title"><span className="icon">✏️</span> Improvement Suggestions</div>
                <ul className="improve-list">
                  {result.improvements?.map((item, i) => (
                    <li key={i} className="improve-item">
                      <span className={`improve-badge badge-${item.priority === "high" ? "high" : item.priority === "medium" ? "med" : "low"}`}>
                        {item.priority === "high" ? "!" : item.priority === "medium" ? "~" : "✓"}
                      </span>
                      <div className="improve-text">
                        <div className="improve-category">{item.category}</div>
                        {item.suggestion}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {result.overall_summary && (
                <div className="result-card full" style={{background:"var(--ink)", color:"var(--paper)", border:"2px solid var(--ink)"}}>
                  <div className="card-title" style={{color:"#aaa"}}><span className="icon">💬</span> Overall Assessment</div>
                  <p style={{fontFamily:"'Instrument Serif', serif", fontSize:18, lineHeight:1.7, opacity:0.9}}>{result.overall_summary}</p>
                </div>
              )}
            </div>

            {/* ── DOWNLOAD BANNER ── */}
            <div className="download-banner">
              <div>
                <div className="download-banner-title">📥 Download Full Report</div>
                <div className="download-banner-sub">Save a formatted PDF with all scores, skills, gaps & suggestions</div>
              </div>
              <button className="btn btn-download" onClick={downloadReport}>
                ↓ Download PDF Report
              </button>
            </div>

            <div className="reset-row">
              <button className="btn btn-secondary" onClick={reset}>← Analyse Another Resume</button>
              <button className="btn btn-primary" onClick={() => setResult(null)}>Re-analyse with Different Role</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}