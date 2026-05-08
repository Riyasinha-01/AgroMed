import { useState } from "react";
import axios from "axios";
import {
  Leaf, Microscope, Upload, CheckCircle2,
  AlertTriangle, XCircle, Droplets,
  ShieldCheck, Flower2, FlaskConical, Eye,
} from "lucide-react";

/* ─────────────────────────────────────────
   Status config
───────────────────────────────────────── */
const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  healthy: { color: "#2f5e3a", bg: "#d8ead8", icon: <CheckCircle2 size={13} />, label: "Healthy" },
  warning: { color: "#9a6200", bg: "#fdf0d0", icon: <AlertTriangle size={13} />, label: "Warning" },
  danger:  { color: "#8c2a1c", bg: "#fde0da", icon: <XCircle size={13} />,      label: "Danger"  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? statusConfig.warning;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
      textTransform: "uppercase", padding: "3px 9px",
      borderRadius: 99, border: `1px solid ${cfg.color}33`,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function ResultBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="result-block">
      <div className="result-block-label">{label}</div>
      {children}
    </div>
  );
}

function TagList({ items, color }: { items: string[]; color?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
      {items.map((item, i) => (
        <span key={i} style={{
          fontSize: 11, fontWeight: 500,
          background: color ?? "white",
          border: "1px solid var(--border)",
          borderRadius: 8, padding: "4px 10px",
          color: "var(--text)",
        }}>{item}</span>
      ))}
    </div>
  );
}

function BulletList({ items, icon }: { items: string[]; icon: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
      {items?.map((item: string, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
          <span style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Plant Disease Result
───────────────────────────────────────── */
function PlantResult({ r }: { r: any }) {
  return (
    <div className="result-wrap">
      <div className="result-header">
        <div className="result-badge">
          <CheckCircle2 size={17} />
        </div>
        <div>
          <div className="result-h">{r.diagnosis}</div>
          <div style={{ marginTop: 5 }}><StatusBadge status={r.status} /></div>
        </div>
      </div>

      {/* Confidence */}
      <ResultBlock label="Confidence">
        <div className="conf-row" style={{ marginBottom: 6, marginTop: 4 }}>
          <span className="conf-label">AI Confidence</span>
          <span className="conf-value">{r.confidence}%</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${r.confidence}%` }} />
        </div>
      </ResultBlock>

      {/* Cause & Why */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ResultBlock label="Cause">
          <p className="block-text">{r.cause}</p>
        </ResultBlock>
        <ResultBlock label="Why it Happens">
          <p className="block-text">{r.why}</p>
        </ResultBlock>
      </div>

      {/* Prevention */}
      <ResultBlock label="Prevention">
        <BulletList items={r.prevention} icon={<ShieldCheck size={12} color="var(--green)" />} />
      </ResultBlock>

      {/* Treatment */}
      <ResultBlock label="Treatment">
        <BulletList items={r.treatment} icon={<Droplets size={12} color="var(--peach)" />} />
      </ResultBlock>

      {/* Fertilizers & Pesticides */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ResultBlock label="Fertilizers">
          <TagList items={r.fertilizers ?? []} color="var(--sage-lt)" />
        </ResultBlock>
        <ResultBlock label="Pesticides">
          <TagList items={r.pesticides ?? []} color="var(--peach-lt)" />
        </ResultBlock>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Seed Analysis Result
───────────────────────────────────────── */
function SeedResult({ r }: { r: any }) {
  return (
    <div className="result-wrap">
      <div className="result-header">
        <div className="result-badge">
          <Flower2 size={17} />
        </div>
        <div>
          <div className="result-h">Seed Quality: {r.prediction}</div>
          <div style={{ marginTop: 5 }}><StatusBadge status={r.status} /></div>
        </div>
      </div>

      {/* Confidence */}
      <ResultBlock label="Confidence">
        <div className="conf-row" style={{ marginBottom: 6, marginTop: 4 }}>
          <span className="conf-label">AI Confidence</span>
          <span className="conf-value">{r.confidence}%</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${r.confidence}%` }} />
        </div>
      </ResultBlock>

      {/* Message */}
      <ResultBlock label="Assessment">
        <p className="block-text" style={{ marginTop: 4 }}>{r.message}</p>
      </ResultBlock>

      {/* Recommendations */}
      <ResultBlock label="Recommendations">
        <BulletList items={r.recommendations} icon={<ShieldCheck size={12} color="var(--green)" />} />
      </ResultBlock>

      {/* CV Features */}
      {r.features && (
        <ResultBlock label="Vision Features">
          <div className="features-grid" style={{ marginTop: 8 }}>
            {[
              { key: "hue",        icon: <Eye size={13} color="var(--sage)" /> },
              { key: "saturation", icon: <Droplets size={13} color="var(--peach)" /> },
              { key: "texture",    icon: <FlaskConical size={13} color="var(--soil)" /> },
            ].map(({ key, icon }) => (
              <div className="feat-chip" key={key}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{icon}</div>
                <div className="feat-key">{key}</div>
                <div className="feat-val">{r.features[key].toFixed(1)}</div>
              </div>
            ))}
          </div>
        </ResultBlock>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main App
───────────────────────────────────────── */
function App() {
  const [mode, setMode] = useState<"plant" | "seed">("plant");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFile = (e: any) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const endpoint =
        mode === "plant"
          ? "https://agromed.onrender.com/plant-disease"
          : "https://agromed.onrender.com/seed-analysis";
          // ? "http://127.0.0.1:8000/plant-disease"
          // : "http://127.0.0.1:8000/seed-analysis";
      const response = await axios.post(endpoint, formData);
      setResult(response.data);
    } catch (error) {
      console.log(error);
      alert("Backend not responding");
    }
    setLoading(false);
  };

  const switchMode = (m: "plant" | "seed") => {
    setMode(m); setResult(null); setFile(null); setPreview("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Lora:ital,wght@0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --peach:    #f4a97f;
          --peach-lt: #fde8d8;
          --sage:     #8aab8a;
          --sage-lt:  #d8ead8;
          --sand:     #e8dcc8;
          --sand-lt:  #f7f3ec;
          --soil:     #7a5c44;
          --bark:     #3d2b1f;
          --cream:    #fdf8f2;
          --border:   #e2d9ce;
          --text:     #2e1f14;
          --muted:    #9a8578;
          --green:    #4a8c5c;
          --green-dk: #2f5e3a;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text);
          min-height: 100vh;
        }

        /* NAVBAR */
        .nav {
          background: rgba(253,248,242,0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          padding: 0 24px; height: 54px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; }
        .nav-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 600; color: var(--bark); letter-spacing: -0.2px; }
        .nav-sub   { font-size: 10px; color: var(--muted); line-height: 1; margin-top: 1px; }

        /* toggle */
        .toggle { background: var(--sand); border-radius: 10px; padding: 3px; display: flex; gap: 2px; }
        .toggle-btn {
          border: none; cursor: pointer; border-radius: 8px;
          padding: 5px 14px; font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
          transition: all 0.2s; background: transparent; color: var(--muted);
        }
        .toggle-btn.active { background: white; color: var(--green-dk); box-shadow: 0 1px 4px rgba(0,0,0,0.10); }
        .toggle-btn:not(.active):hover { color: var(--text); background: rgba(255,255,255,0.5); }

        /* MAIN */
        .main { max-width: 920px; margin: 0 auto; padding: 20px 16px 48px; }
        .heading { margin-bottom: 16px; }
        .heading h1 { font-family: 'Lora', serif; font-size: clamp(20px,4vw,26px); font-weight: 600; color: var(--bark); letter-spacing: -0.4px; margin-bottom: 3px; }
        .heading p  { font-size: 12px; color: var(--muted); }

        /* LAYOUT */
        .layout { display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start; }
        @media (max-width: 700px) {
          .layout { grid-template-columns: 1fr; }
          .nav-sub { display: none; }
        }

        /* CARD */
        .card { background: white; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }

        /* UPLOAD */
        .upload-label { display: block; cursor: pointer; }
        .upload-area {
          height: 175px; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          border-bottom: 1px solid var(--border);
          background: var(--sand-lt); transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .upload-area:hover { background: var(--peach-lt); }
        .upload-area img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .upload-icon-wrap {
          width: 46px; height: 46px; border-radius: 13px;
          background: linear-gradient(135deg, var(--peach-lt), var(--sand));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 8px; border: 1px solid var(--border);
        }
        .upload-text { font-size: 12px; font-weight: 600; color: var(--soil); margin-bottom: 2px; }
        .upload-sub  { font-size: 11px; color: var(--muted); }

        /* TIPS */
        .tips { padding: 14px 16px; }
        .tips-label { font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
        .tip-row { display: flex; align-items: center; gap: 8px; padding: 4px 0; }
        .tip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--sage); flex-shrink: 0; }
        .tip-text { font-size: 12px; color: var(--text); }

        /* BUTTON */
        .analyze-btn {
          width: 100%; padding: 12px; border: none; cursor: pointer; border-radius: 12px;
          background: linear-gradient(135deg, var(--green), var(--green-dk));
          color: white; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 12px;
        }
        .analyze-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .analyze-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* SPINNER */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.9; }
          50%  { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(0.85); opacity: 0.9; }
        }
        .spinner-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 48px 24px; }
        .spinner-graphic { position: relative; width: 58px; height: 58px; display: flex; align-items: center; justify-content: center; }
        .spinner-ring { position: absolute; inset: 0; border-radius: 50%; border: 2.5px solid var(--sage-lt); border-top-color: var(--green); animation: spin 0.85s linear infinite; }
        .spinner-ring-outer { position: absolute; inset: -8px; border-radius: 50%; border: 1.5px solid var(--peach-lt); border-right-color: var(--peach); animation: spin 1.4s linear infinite reverse; }
        .spinner-dot { width: 9px; height: 9px; border-radius: 50%; background: linear-gradient(135deg, var(--peach), var(--sage)); animation: pulse-ring 1.4s ease-in-out infinite; }
        .spinner-label { font-size: 13px; font-weight: 600; color: var(--soil); }
        .spinner-sub   { font-size: 11px; color: var(--muted); margin-top: -6px; }

        /* EMPTY STATE */
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 24px; gap: 8px; }
        .empty-icon { width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, var(--sage-lt), var(--sand-lt)); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
        .empty-title { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; color: var(--bark); }
        .empty-sub   { font-size: 11px; color: var(--muted); max-width: 180px; line-height: 1.5; }

        /* RESULT */
        .result-wrap { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .result-header { display: flex; align-items: flex-start; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .result-badge { width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; background: linear-gradient(135deg, var(--sage), var(--green)); display: flex; align-items: center; justify-content: center; color: white; }
        .result-h { font-family: 'Lora', serif; font-size: 15px; font-weight: 600; color: var(--bark); line-height: 1.3; }

        .result-block { background: var(--sand-lt); border: 1px solid var(--border); border-radius: 12px; padding: 11px 13px; }
        .result-block-label { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
        .block-text { font-size: 12px; color: var(--text); line-height: 1.6; margin-top: 2px; }

        /* confidence */
        .conf-row { display: flex; justify-content: space-between; align-items: center; }
        .conf-label { font-size: 11px; font-weight: 600; color: var(--soil); }
        .conf-value { font-size: 15px; font-weight: 700; color: var(--green-dk); }
        .bar-track { width: 100%; height: 6px; background: var(--sand); border-radius: 99px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--sage), var(--green)); transition: width 0.9s cubic-bezier(.16,1,.3,1); }

        /* features chips */
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
        .feat-chip { background: white; border: 1px solid var(--border); border-radius: 10px; padding: 9px 6px; text-align: center; }
        .feat-key  { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 3px; }
        .feat-val  { font-size: 13px; font-weight: 700; color: var(--bark); }

        /* scrollable right panel */
        .result-card { max-height: calc(100vh - 110px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--sand) transparent; }
        .result-card::-webkit-scrollbar { width: 4px; }
        .result-card::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 99px; }
      `}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo">
          <img src="/logo.png" alt="AgroMed"
            style={{ width: 30, height: 30, borderRadius: 8, objectFit: "contain" }} />
          <div>
            <div className="nav-title">AgroMed</div>
            <div className="nav-sub">Smart Diagnostics</div>
          </div>
        </div>

        <div className="toggle">
          <button className={`toggle-btn ${mode === "plant" ? "active" : ""}`} onClick={() => switchMode("plant")}>
            <Leaf size={12} /> Plant
          </button>
          <button className={`toggle-btn ${mode === "seed" ? "active" : ""}`} onClick={() => switchMode("seed")}>
            <Microscope size={12} /> Seed
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">
        <div className="heading">
          <h1>{mode === "plant" ? "Crop Disease Analysis" : "Seed Quality Analysis"}</h1>
          <p>Upload an image — our AI will diagnose it instantly.</p>
        </div>

        <div className="layout">

          {/* LEFT */}
          <div>
            <div className="card">
              <label className="upload-label">
                <div className="upload-area">
                  {preview
                    ? <img src={preview} alt="preview" />
                    : <>
                        <div className="upload-icon-wrap">
                          <Upload size={20} color="var(--soil)" />
                        </div>
                        <div className="upload-text">Drop image or click to browse</div>
                        <div className="upload-sub">JPG, PNG supported</div>
                      </>
                  }
                </div>
                <input type="file" style={{ display: "none" }} onChange={handleFile} accept="image/*" />
              </label>

              <div className="tips">
                <div className="tips-label">Tips for best results</div>
                {[
                  "Clear close-up photos work best",
                  "Use natural lighting",
                  "Keep affected area visible",
                  "Avoid blurry or off-topic images",
                ].map((tip, i) => (
                  <div className="tip-row" key={i}>
                    <div className="tip-dot" />
                    <span className="tip-text">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="analyze-btn" onClick={analyzeImage} disabled={!file || loading}>
              {loading ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M8 2 A6 6 0 0 1 14 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Analyzing…
                </>
              ) : mode === "plant" ? "Analyze Crop" : "Analyze Seed"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="card result-card">
            {!result ? (
              loading ? (
                <div className="spinner-wrap">
                  <div className="spinner-graphic">
                    <div className="spinner-ring-outer" />
                    <div className="spinner-ring" />
                    <div className="spinner-dot" />
                  </div>
                  <div className="spinner-label">Analyzing image…</div>
                  <div className="spinner-sub">This takes just a moment</div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Microscope size={22} color="var(--sage)" />
                  </div>
                  <div className="empty-title">Results appear here</div>
                  <div className="empty-sub">Upload an image and tap Analyze to begin.</div>
                </div>
              )
            ) : result.type === "plant_disease" ? (
              <PlantResult r={result} />
            ) : (
              <SeedResult r={result} />
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default App;