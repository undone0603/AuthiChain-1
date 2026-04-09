"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   DEMO VIDEO v2 — Rethought from scratch
   Focus: PROCESS + VALUE. Not just the problem.
   
   Act 1  Problem (12s)   — The QR code vulnerability nobody talks about
   Act 2  What is QRON (18s) — AI art + blockchain = unforgeable
   Act 3  The Process (30s)  — 5 steps, you get a file + cert
   Act 4  The ROI (18s)     — $9 vs $500+ design + zero auth
   Act 5  EU DPP (12s)      — 2026 mandate, forced adoption
   Act 6  CTA (14s)         — Try it. $9. qron.space
   Total: ~104s
───────────────────────────────────────────────────────────────── */

const SCENES = [
  {
    id: "problem",
    duration: 12,
    bg: "#080808",
    accent: "#ef4444",
    act: "ACT 1",
    headline: "Your QR code has a problem",
    sub: "Anyone can clone it in 30 seconds",
    bullets: [
      "Competitor scans your code",
      "Redirects it to their product",
      "Puts it on a counterfeit",
      "Your customer scans — and trusts the fake",
    ],
    note: "Standard QR codes are just URLs. No authentication. No proof of origin.",
    narration:
      "Your QR code has a serious problem. Anyone can scan it, grab the URL, and redirect it to a fake. A counterfeit product with your QR code passes every consumer check — because the code itself proves nothing. That's what AuthiChain fixes.",
  },
  {
    id: "what",
    duration: 18,
    bg: "#080f05",
    accent: "#84cc16",
    act: "ACT 2",
    headline: "QRON: AI art + blockchain proof",
    sub: "Every scan is a cryptographic verification",
    bullets: [
      "FLUX.1-dev AI generates the artwork",
      "ControlNet keeps it scannable — pixel clamped",
      "ERC-721 NFT minted on Polygon at manufacture",
      "Consumer scans → AUTHENTIC in 2.1 seconds",
    ],
    note: "Not a sticker. Not a hologram. A blockchain certificate baked into AI artwork.",
    narration:
      "QRON is two things at once: AI-generated artwork and a blockchain authentication certificate. FLUX generates an image — cannabis formations, geometric patterns, lightning arcs — around your QR code. ControlNet keeps every module scannable. The moment it's created, AuthiChain mints a blockchain certificate on Polygon. Consumer scans it — two seconds — authentic confirmed.",
  },
  {
    id: "process",
    duration: 30,
    bg: "#080808",
    accent: "#c9a227",
    act: "ACT 3",
    headline: "How it works — 5 steps",
    sub: "From order to product in 24-72 hours",
    steps: [
      { num: "01", label: "Order at qron.space", detail: "Give us your URL + choose a style. $9 starter." },
      { num: "02", label: "AI generates your artwork", detail: "FLUX.1-dev renders your QR as art. 11 style options." },
      { num: "03", label: "Blockchain cert is minted", detail: "ERC-721 NFT on Polygon. $0.004/certificate." },
      { num: "04", label: "You receive the files", detail: "High-res PNG + SVG + certificate ID + verify URL." },
      { num: "05", label: "Consumer scans → AUTHENTIC", detail: "Any smartphone. No app. 2.1 seconds. On-chain proof." },
    ],
    narration:
      "Five steps. Order at qron dot space — give us your destination URL and pick a style. Starter is nine dollars. AI generates your artwork. AuthiChain mints a blockchain certificate, four tenths of a cent. You receive a high-resolution file — PNG, SVG — plus a certificate ID and a verify URL. Put it on your product. Consumer scans, blockchain confirms AUTHENTIC in two seconds. No app required.",
  },
  {
    id: "roi",
    duration: 18,
    bg: "#050508",
    accent: "#38bdf8",
    act: "ACT 4",
    headline: "The comparison that ends the conversation",
    sub: "Authentication cost per 10,000 products",
    comparisons: [
      { label: "RFID tags", cost: "$5,000–20,000", note: "$0.50–2.00 each. Clonable. Requires reader hardware.", bad: true },
      { label: "Holographic stickers", cost: "$1,000–3,000", note: "$0.10–0.30 each. Forgeable. No digital trail.", bad: true },
      { label: "Designer QR + branding", cost: "$500–2,000", note: "Beautiful. No authentication. Still just a URL.", bad: true },
      { label: "AuthiChain + QRON", cost: "$49", note: "$9 design + $0.004 × 10K certs. Cryptographic proof.", good: true },
    ],
    narration:
      "Cost to authenticate ten thousand products. RFID tags: five to twenty thousand dollars — plus dedicated reader hardware. Holographic stickers: one to three thousand, and still forgeable. A designer QR code and branding package: five hundred to two thousand, beautiful but zero authentication. AuthiChain and QRON: forty-nine dollars. Nine dollar design. Four tenths of a cent per blockchain certificate. Cryptographically impossible to forge.",
  },
  {
    id: "dpp",
    duration: 12,
    bg: "#08080f",
    accent: "#a78bfa",
    act: "ACT 5",
    headline: "EU DPP 2026",
    sub: "Every product sold in Europe needs blockchain provenance",
    bullets: [
      "ESPR mandate — batteries Feb 2027, textiles to follow",
      "Blockchain-verifiable composition, origin, repairability",
      "Non-compliance = market exclusion from EU",
      "AuthiChain is DPP-ready infrastructure",
    ],
    note: "400+ billion dollar forced adoption event. The window to build this before the mandate is now.",
    narration:
      "EU Digital Product Passport. Starting February 2027 for batteries, expanding to all product categories. Every product sold in Europe needs blockchain-verifiable records — composition, origin, repairability, end-of-life. Non-compliance means no European market. AuthiChain is the infrastructure. The mandate makes this not optional.",
  },
  {
    id: "cta",
    duration: 14,
    bg: "#030303",
    accent: "#84cc16",
    act: "ACT 6",
    headline: "Try it for $9",
    sub: "Starter includes 1 AI QR design + blockchain certificate",
    ctaItems: [
      { label: "QRON Starter", price: "$9", detail: "1 design · PNG + SVG · blockchain cert · 3-day delivery" },
      { label: "QRON Pro", price: "$29", detail: "5 designs · 11 styles · 24-hour delivery · priority" },
      { label: "QRON Brand Kit", price: "$49", detail: "Unlimited · commercial license · API access" },
    ],
    note: "qron.space · authichain.com · @qrontoken_bot",
    narration:
      "Try it for nine dollars. QRON starter: one AI-generated QR design, high-res files, blockchain certificate, three-day delivery. Pro at twenty-nine gives you five designs. Brand Kit at forty-nine is unlimited with commercial license and API access. Every design is worth the money — because your QR code stops being a liability and starts being proof.",
  },
];

const TOTAL_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0);

export default function DemoVideoPage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [stepVisible, setStepVisible] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneStartRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const scene = SCENES[sceneIdx];

  // Load voices
  useEffect(() => {
    const load = () => {
      const all = speechSynthesis.getVoices();
      const preferred = all.filter(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Neural") ||
            v.name.includes("Premium") ||
            v.name.includes("Google") ||
            v.name.includes("Microsoft"))
      );
      const list = preferred.length ? preferred : all.filter((v) => v.lang.startsWith("en"));
      setVoices(list);
    };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // Animate steps in the process scene
  useEffect(() => {
    if (scene.id !== "process") { setStepVisible(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStepVisible(i);
      if (i >= 5) clearInterval(t);
    }, 5500);
    return () => clearInterval(t);
  }, [sceneIdx]);

  const speak = useCallback(
    (text: string) => {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.voice = voices[voiceIdx] ?? null;
      u.rate = 0.92;
      u.pitch = 1.0;
      utteranceRef.current = u;
      speechSynthesis.speak(u);
    },
    [voices, voiceIdx]
  );

  const stop = useCallback(() => {
    setRunning(false);
    speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setSceneIdx(0);
    setElapsed(0);
    sceneStartRef.current = 0;
  }, [stop]);

  const goScene = useCallback(
    (idx: number) => {
      if (idx >= SCENES.length) { stop(); return; }
      setSceneIdx(idx);
      sceneStartRef.current = SCENES.slice(0, idx).reduce((s, sc) => s + sc.duration, 0);
      speak(SCENES[idx].narration);
    },
    [speak, stop]
  );

  const start = useCallback(() => {
    if (running) { stop(); return; }
    setRunning(true);
    speak(scene.narration);
    const tick = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.1;
        if (next >= TOTAL_DURATION) {
          clearInterval(tick);
          setRunning(false);
          speechSynthesis.cancel();
          return TOTAL_DURATION;
        }
        // Advance scene
        let cumulative = 0;
        for (let i = 0; i < SCENES.length; i++) {
          cumulative += SCENES[i].duration;
          if (next < cumulative) {
            setSceneIdx((cur) => {
              if (cur !== i) {
                sceneStartRef.current = cumulative - SCENES[i].duration;
                speak(SCENES[i].narration);
                return i;
              }
              return cur;
            });
            break;
          }
        }
        return next;
      });
    }, 100);
    intervalRef.current = tick;
  }, [running, scene.narration, speak, stop]);

  const sceneProgress =
    scene.duration > 0
      ? Math.min(1, (elapsed - sceneStartRef.current) / scene.duration)
      : 0;

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const accent = scene.accent;

  return (
    <div
      style={{
        background: scene.bg,
        minHeight: "100vh",
        color: "#e5e5e5",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.8s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60vw",
          height: "40vh",
          background: `radial-gradient(ellipse, ${accent}18 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 0.8s",
        }}
      />

      {/* ── TOP BAR ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(16px)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{ color: accent, fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.12em", textDecoration: "none", transition: "color 0.5s", flexShrink: 0 }}
        >
          ◆ AUTHICHAIN
        </a>

        {/* Progress bar */}
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", minWidth: 60 }}>
          <div
            style={{
              height: "100%",
              width: `${(elapsed / TOTAL_DURATION) * 100}%`,
              background: `linear-gradient(90deg, ${accent}99, ${accent})`,
              borderRadius: 2,
              transition: "width 0.1s linear, background 0.5s",
            }}
          />
        </div>

        <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
          {fmtTime(elapsed)} / {fmtTime(TOTAL_DURATION)}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={start}
            style={{
              background: running ? "rgba(255,255,255,0.12)" : accent,
              color: running ? "#fff" : "#000",
              border: "none",
              borderRadius: 8,
              padding: "7px 22px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 12,
              transition: "background 0.5s, color 0.5s",
              letterSpacing: "0.03em",
            }}
          >
            {running ? "⏸ Pause" : "▶  Start"}
          </button>
          <button
            onClick={reset}
            style={{ background: "transparent", color: "rgba(255,255,255,0.3)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13 }}
          >
            ↺
          </button>
        </div>

        {/* Voice selector */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setShowVoiceMenu((v) => !v)}
            style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "rgba(255,255,255,0.4)" }}
          >
            🎙{" "}
            <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {voices[voiceIdx]?.name ?? "Loading…"}
            </span>{" "}
            ▾
          </button>
          {showVoiceMenu && voices.length > 0 && (
            <div
              style={{ position: "absolute", top: "120%", right: 0, background: "#111", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "4px 0", zIndex: 200, minWidth: 220, maxHeight: 260, overflowY: "auto" }}
            >
              {voices.map((v, i) => (
                <button
                  key={i}
                  onClick={() => { setVoiceIdx(i); setShowVoiceMenu(false); }}
                  style={{ display: "block", width: "100%", padding: "7px 14px", background: i === voiceIdx ? "rgba(255,255,255,0.08)" : "transparent", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 11, textAlign: "left", cursor: "pointer" }}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN SCENE ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "90px 24px 100px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Scene counter + act label */}
        <div style={{ position: "absolute", top: 72, left: 24, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 9, color: accent, fontWeight: 700, letterSpacing: "0.14em", opacity: 0.7 }}>
            {scene.act}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            {sceneIdx + 1} / {SCENES.length}
          </div>
        </div>

        {/* Scene progress ring */}
        <div style={{ position: "absolute", top: 68, right: 24 }}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke={accent}
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - sceneProgress)}`}
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.5s", filter: `drop-shadow(0 0 4px ${accent}80)` }}
            />
          </svg>
        </div>

        <div style={{ width: "100%", maxWidth: 760 }}>
          {/* Headline */}
          <div
            style={{
              fontSize: "clamp(26px, 5vw, 52px)",
              fontWeight: 900,
              color: accent,
              marginBottom: 10,
              textShadow: `0 0 40px ${accent}40`,
              transition: "color 0.5s, text-shadow 0.5s",
              lineHeight: 1.1,
            }}
          >
            {scene.headline}
          </div>
          <div style={{ fontSize: "clamp(13px, 2vw, 18px)", color: "rgba(255,255,255,0.45)", marginBottom: 32, letterSpacing: "0.04em" }}>
            {scene.sub}
          </div>

          {/* SCENE CONTENT */}

          {/* Bullets (problem, what, dpp) */}
          {scene.bullets && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {scene.bullets.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: 1 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: accent,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${accent}80`,
                    }}
                  />
                  <div style={{ fontSize: "clamp(14px, 2.2vw, 20px)", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{b}</div>
                </div>
              ))}
            </div>
          )}

          {/* Process steps */}
          {scene.steps && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {scene.steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 18,
                    alignItems: "flex-start",
                    opacity: i < stepVisible ? 1 : 0.15,
                    transform: i < stepVisible ? "translateX(0)" : "translateX(-8px)",
                    transition: "opacity 0.5s, transform 0.5s",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: accent,
                      flexShrink: 0,
                      paddingTop: 2,
                      minWidth: 24,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div style={{ fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: "clamp(12px, 1.6vw, 14px)", color: "rgba(255,255,255,0.4)" }}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ROI comparisons */}
          {scene.comparisons && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {scene.comparisons.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    borderRadius: 10,
                    background: c.good ? `${accent}12` : "rgba(255,255,255,0.03)",
                    border: c.good ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.06)",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ fontSize: "clamp(13px, 1.8vw, 16px)", fontWeight: c.good ? 800 : 500, color: c.good ? accent : "rgba(255,255,255,0.6)" }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{c.note}</div>
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 2.5vw, 24px)",
                      fontWeight: 900,
                      color: c.good ? accent : "#ef444499",
                      fontFamily: "monospace",
                      flexShrink: 0,
                    }}
                  >
                    {c.cost}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA items */}
          {scene.ctaItems && (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {scene.ctaItems.map((item, i) => (
                <a
                  key={i}
                  href="https://qron.space"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    minWidth: 160,
                    padding: "18px 16px",
                    background: i === 0 ? `${accent}18` : "rgba(255,255,255,0.04)",
                    border: i === 0 ? `1px solid ${accent}50` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: i === 0 ? accent : "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>
                    {item.price}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? accent : "rgba(255,255,255,0.5)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{item.detail}</div>
                </a>
              ))}
            </div>
          )}

          {/* Note */}
          {scene.note && (
            <div
              style={{
                marginTop: 28,
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderLeft: `3px solid ${accent}60`,
                borderRadius: "0 8px 8px 0",
                fontSize: "clamp(11px, 1.6vw, 14px)",
                color: "rgba(255,255,255,0.35)",
                fontStyle: "italic",
              }}
            >
              {scene.note}
            </div>
          )}
        </div>
      </div>

      {/* ── SCENE DOTS ── */}
      <div
        style={{
          position: "fixed",
          bottom: 44,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          zIndex: 50,
          alignItems: "center",
        }}
      >
        {SCENES.map((sc, i) => (
          <button
            key={i}
            onClick={() => { goScene(i); setElapsed(SCENES.slice(0, i).reduce((s, sc2) => s + sc2.duration, 0)); }}
            title={sc.act}
            style={{
              width: i === sceneIdx ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === sceneIdx ? accent : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "6px 20px",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
          Open Loom → Screen + Camera → <strong style={{ color: "rgba(255,255,255,0.35)" }}>▶ Start</strong> → auto-narrates
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {[
            { href: "https://qron.space", label: "qron.space", color: "#84cc16" },
            { href: "https://authichain.com", label: "authichain.com", color: "#c9a227" },
            { href: "https://strainchain.io", label: "strainchain.io", color: "#22c55e" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 10, color: link.color, opacity: 0.4, textDecoration: "none" }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
