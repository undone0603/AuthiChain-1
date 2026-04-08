"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Scene = {
  id: string; duration: number; bg: string; accent: string;
  visual: string; url?: string; headline: string; sub: string;
  body: string[]; narration: string;
};

const SCENES: Scene[] = [
  {
    id: "problem", duration: 11, bg: "#080808", accent: "#ef4444", visual: "STAT",
    headline: "$500 Billion",
    sub: "in counterfeit goods every year",
    body: ["Paper certificates are forged in minutes.", "Barcodes are trivially cloned.", "No one can prove what\u2019s real."],
    narration: "Five hundred billion dollars. That\u2019s how much counterfeit product moves through the global economy every year. Paper certificates are forged in minutes. Barcodes are cloned. There is no way to prove what\u2019s real \u2014 until now.",
  },
  {
    id: "product", duration: 10, bg: "#0a1a0a", accent: "#22c55e", visual: "PRODUCT",
    headline: "Blue Dream",
    sub: "Emerald Peak Farms \u00b7 Humboldt County, California",
    body: ["Planted February 3rd.", "Harvested March 15th.", "THC 22.4% \u00b7 CBD 0.8%"],
    narration: "This is Blue Dream. Grown by Emerald Peak Farms on fog-kissed ridgelines above Garberville, California. Harvested March 15th after 42 days of flower. This batch exists. It\u2019s real. And from this moment \u2014 StrainChain can prove it.",
  },
  {
    id: "certificate", duration: 12, bg: "#0d1117", accent: "#c9a227", visual: "IFRAME",
    url: "https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E",
    headline: "Minted on the blockchain",
    sub: "The moment it\u2019s harvested",
    body: ["ERC-721 NFT \u00b7 Polygon \u00b7 $0.004", "COA hash \u00b7 METRC \u00b7 Seed-to-sale chain", "Immutable. Permanent. Unforgeable."],
    narration: "The moment this batch is harvested, StrainChain mints a blockchain certificate. Every lab result, every state transfer, every event in this plant\u2019s life \u2014 hashed, signed, and locked to the Polygon blockchain forever. No one can alter it. No one.",
  },
  {
    id: "scan", duration: 11, bg: "#0a0a0a", accent: "#84cc16", visual: "SCAN",
    headline: "2.1 seconds",
    sub: "Any smartphone. No app.",
    body: ["Consumer scans the QR code.", "Blockchain confirms: AUTHENTIC.", "Instant. Certain. Free."],
    narration: "A consumer picks up the package. They scan the QR code with their phone. Two seconds later \u2014 the blockchain confirms it\u2019s authentic. No app to download. No reader to buy. Just a camera, and the truth.",
  },
  {
    id: "art", duration: 11, bg: "#0f0a1a", accent: "#ec4899", visual: "ART",
    headline: "The packaging is art",
    sub: "Verde Studio \u00d7 Emerald Peak Farms",
    body: ["ArtGuard score: 87/100", "Edition: #23 of 50", "Collectible \u2014 long after the product is gone"],
    narration: "The packaging was designed by Verde Studio. Authenticated by ArtGuard. Edition twenty-three of fifty. The cannabis is consumed \u2014 but the art lives on. The NFT proves ownership. The blockchain proves it\u2019s real. A new asset class, born from a plant.",
  },
  {
    id: "network", duration: 10, bg: "#080808", accent: "#38bdf8", visual: "NETWORK",
    headline: "Every scan matters",
    sub: "The Truth Network grows with every product",
    body: ["Consumer votes: AUTHENTIC", "Truth Network records the scan", "The Authentic Economy self-enforces"],
    narration: "Every consumer who scans casts a vote. The Truth Network records it. The Authentic Economy grows stronger with every product, every scan, every proof. Objects have authenticity. AI agents enforce it.",
  },
  {
    id: "close", duration: 10, bg: "#070707", accent: "#c9a227", visual: "CLOSE",
    headline: "The Authentic Economy",
    sub: "Three platforms. One protocol. One truth layer.",
    body: ["StrainChain \u00b7 AuthiChain \u00b7 QRON", "Built solo \u00b7 Zero capital \u00b7 Six months", "Applying to Y Combinator S26"],
    narration: "StrainChain. AuthiChain. QRON. Three platforms built by one founder in six months with zero dollars raised. The truth layer for the physical world. We are applying to Y Combinator to bring this to every product on earth.",
  },
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);
const fmt = (s: number) => String(Math.floor(s / 60)) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

function useVoice(muted: boolean) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [voiceName, setVoiceName] = useState("Loading...");
  const [ready, setReady] = useState(false);
  const [caption, setCaption] = useState<string[]>([]);
  const [wordIdx, setWordIdx] = useState(-1);

  const pick = useCallback(() => {
    const s = window.speechSynthesis;
    synthRef.current = s;
    const vs = s.getVoices();
    if (!vs.length) return;
    const preferred = ["Google UK English Male", "Microsoft David", "Microsoft Guy", "Daniel", "Aaron", "Alex"];
    let c: SpeechSynthesisVoice | null = null;
    for (const n of preferred) {
      c = vs.find((v) => v.name.toLowerCase().includes(n.toLowerCase())) ?? null;
      if (c) break;
    }
    if (!c) c = vs.find((v) => v.lang.startsWith("en")) ?? vs[0] ?? null;
    voiceRef.current = c;
    setVoiceName(c ? c.name : "Default");
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = window.speechSynthesis;
    synthRef.current = s;
    if (s.getVoices().length) pick();
    else s.addEventListener("voiceschanged", pick, { once: true });
    return () => { s.cancel(); s.removeEventListener("voiceschanged", pick); };
  }, [pick]);

  const speak = useCallback((text: string) => {
    const s = synthRef.current;
    if (!s || muted) return;
    s.cancel();
    const words = text.split(/\s+/);
    setCaption(words);
    setWordIdx(-1);
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = 0.88; u.pitch = 0.8; u.volume = 1;
    u.onboundary = (ev) => {
      const e = ev as SpeechSynthesisEvent;
      if (e.name === "word") {
        const sp = text.slice(0, e.charIndex + e.charLength);
        setWordIdx(sp.trim().split(/\s+/).length - 1);
      }
    };
    u.onend = () => setWordIdx(-1);
    s.speak(u);
  }, [muted]);

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setCaption([]);
    setWordIdx(-1);
  }, []);

  return { voiceName, ready, caption, wordIdx, speak, stop, synth: synthRef };
}

function StatVisual({ active }: { active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / 2000);
      setN(Math.round(500 * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active]);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(72px,14vw,140px)", fontWeight: 900, color: "#ef4444", lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 0 80px rgba(239,68,68,.35)" }}>
        ${n}B
      </div>
      <div style={{ fontSize: "clamp(14px,2.5vw,22px)", color: "rgba(255,255,255,.45)", marginTop: 16, letterSpacing: ".12em", textTransform: "uppercase" }}>
        in counterfeit goods every year
      </div>
      <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 52, flexWrap: "wrap" }}>
        {[["Paper certs", "forged in minutes"], ["Barcodes", "trivially cloned"], ["RFID", "$0.50+ per tag"]].map(([t, s]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e06060", marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div style={{ textAlign: "center", maxWidth: 560 }}>
      <div style={{ fontSize: 96, marginBottom: 24, filter: "drop-shadow(0 0 24px rgba(34,197,94,.4))" }}>&#127807;</div>
      <div style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: "#22c55e", marginBottom: 12, textShadow: "0 0 40px rgba(34,197,94,.3)" }}>Blue Dream</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginBottom: 28, letterSpacing: ".06em" }}>Emerald Peak Farms &#183; Humboldt County, CA</div>
      {show && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[["THC", "22.4%"], ["CBD", "0.8%"], ["Harvest", "Mar 15"]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e" }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>{k}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScanVisual({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const ts = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 2400),
      setTimeout(() => setStep(3), 4600),
    ];
    return () => ts.forEach(clearTimeout);
  }, [active]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div style={{ width: 160, borderRadius: 24, border: "2.5px solid rgba(255,255,255,.12)", background: "#0a0a0a", overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,.7)" }}>
        <div style={{ height: 28, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 8, background: "#222", borderRadius: 4 }} />
        </div>
        <div style={{ height: 220, background: step >= 2 ? "linear-gradient(160deg,#0f3d1f,#1a5e30)" : "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "background .8s", padding: 14, position: "relative" }}>
          {step === 0 && <div style={{ color: "rgba(255,255,255,.15)", fontSize: 11 }}>Scanning&#8230;</div>}
          {step === 1 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 100, height: 100, border: "2px solid #84cc16", borderRadius: 8, opacity: .7 }} />
            </div>
          )}
          {step >= 2 && (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>&#10003;</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#22c55e", marginBottom: 4 }}>AUTHENTIC</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", textAlign: "center", lineHeight: 1.5 }}>Blue Dream<br />Emerald Peak Farms<br />Mar 15 2026</div>
            </>
          )}
        </div>
        <div style={{ height: 20, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 34, height: 4, background: "rgba(255,255,255,.12)", borderRadius: 2 }} />
        </div>
      </div>
      {step >= 3 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(36px,7vw,72px)", fontWeight: 900, color: "#84cc16", textShadow: "0 0 40px rgba(132,204,22,.3)" }}>2.1 seconds</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.4)", marginTop: 8, letterSpacing: ".08em" }}>Any smartphone &#183; No app required</div>
        </div>
      )}
    </div>
  );
}

function ArtVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    if (!active) { setShow(false); setGlow(false); return; }
    const t1 = setTimeout(() => setShow(true), 300);
    const t2 = setTimeout(() => setGlow(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);
  const border = glow ? "2px solid #ec4899" : "2px solid rgba(236,72,153,.2)";
  const shadow = glow ? "0 0 40px rgba(236,72,153,.35),0 0 80px rgba(236,72,153,.1)" : "none";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: show ? 1 : 0, transition: "opacity .6s" }}>
      <div style={{ width: 200, borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg,#0d2e1a,#1a4d2e,#0a1f12)", border, boxShadow: shadow, transition: "all .8s" }}>
        <div style={{ height: 120, position: "relative", overflow: "hidden", background: "linear-gradient(160deg,#0f3d1f,#1e6b37)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%,rgba(34,197,94,.5),transparent 60%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>&#127807;</div>
          <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(236,72,153,.9)", borderRadius: 4, padding: "2px 8px", fontSize: 8, fontWeight: 700, color: "#fff" }}>&#127912; RARE ART</div>
          <div style={{ position: "absolute", bottom: 6, right: 8, fontSize: 8, color: "rgba(255,255,255,.5)", fontFamily: "monospace" }}>#23/50</div>
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#22c55e", marginBottom: 2 }}>Blue Dream</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Verde Studio &#183; Humboldt Fog</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#ec4899" }}>87</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>ArtGuard</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>RARE</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>Rarity</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#c9a227" }}>$580</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>Floor</div></div>
          </div>
        </div>
      </div>
      {glow && <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)", textAlign: "center" }}>Art lives on.<br />Long after the product is gone.</div>}
    </div>
  );
}

function NetworkVisual({ active }: { active: boolean }) {
  const [votes, setVotes] = useState(0);
  useEffect(() => {
    if (!active) { setVotes(0); return; }
    let i = 0;
    const id = setInterval(() => { i++; setVotes(i); if (i >= 6) clearInterval(id); }, 800);
    return () => clearInterval(id);
  }, [active]);
  const nodes = [
    { x: 50, y: 20, label: "Humboldt Consumer" },
    { x: 80, y: 45, label: "LA Dispensary" },
    { x: 65, y: 75, label: "Vegas Collector" },
    { x: 30, y: 65, label: "Portland Shop" },
    { x: 15, y: 38, label: "SF Customer" },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "280px", overflow: "visible" }}>
        <circle cx={45} cy={50} r={9} fill="#38bdf8" style={{ filter: "drop-shadow(0 0 6px #38bdf8)" }} />
        <text x={45} y={54} textAnchor="middle" fill="#fff" fontSize={4}>&#10003;</text>
        {nodes.map((n, i) => votes > i && (
          <g key={i}>
            <line x1={n.x} y1={n.y} x2={45} y2={50} stroke="#38bdf8" strokeWidth={0.8} strokeDasharray="2 2" opacity={0.5} />
            <circle cx={n.x} cy={n.y} r={5} fill="rgba(56,189,248,.2)" stroke="rgba(56,189,248,.4)" strokeWidth={1} />
            <text x={n.x} y={n.y - 8} textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize={3.5}>{n.label}</text>
          </g>
        ))}
      </svg>
      <div style={{ textAlign: "center", marginTop: -20 }}>
        <div style={{ fontFamily: "monospace", fontSize: "clamp(32px,6vw,52px)", fontWeight: 900, color: "#38bdf8", textShadow: "0 0 30px rgba(56,189,248,.4)" }}>{votes}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 4 }}>Truth Network votes recorded</div>
      </div>
    </div>
  );
}

function CloseVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div style={{ textAlign: "center", opacity: show ? 1 : 0, transition: "opacity .8s" }}>
      <div style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#c9a227", letterSpacing: ".06em", textShadow: "0 0 60px rgba(201,162,39,.4)", marginBottom: 28 }}>AUTHENTIC ECONOMY</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        {[{ l: "StrainChain", c: "#22c55e", d: "strainchain.io" }, { l: "AuthiChain", c: "#c9a227", d: "authichain.com" }, { l: "QRON", c: "#84cc16", d: "qron.space" }].map(({ l, c, d }) => (
          <div key={l} style={{ background: c + "10", border: "1.5px solid " + c + "40", borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)", letterSpacing: ".06em" }}>Built solo &#183; Zero capital &#183; Six months &#183; Applying to YC S26</div>
    </div>
  );
}

export default function DemoPage() {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fade, setFade] = useState(true);
  const [textPhase, setTextPhase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevRef = useRef(-1);
  const { voiceName, ready, caption, wordIdx, speak, stop, synth } = useVoice(muted);

  const sc = SCENES[scene];
  const totalE = SCENES.slice(0, scene).reduce((s, x) => s + x.duration, 0) + elapsed;
  const pct = Math.min(100, (totalE / TOTAL) * 100);
  const sPct = sc.duration > 0 ? (elapsed / sc.duration) * 100 : 0;

  useEffect(() => {
    if (!running) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setElapsed((p) => {
        const n = p + 1;
        if (n >= SCENES[scene].duration) {
          setScene((s) => {
            const next = s < SCENES.length - 1 ? s + 1 : s;
            if (next !== s) {
              setFade(false); setTextPhase(0);
              setTimeout(() => { setFade(true); setTimeout(() => setTextPhase(1), 300); setTimeout(() => setTextPhase(2), 900); }, 200);
            } else { setRunning(false); }
            return next;
          });
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, scene]);

  useEffect(() => {
    if (running && scene !== prevRef.current) {
      prevRef.current = scene;
      const t = setTimeout(() => speak(SCENES[scene].narration), 300);
      return () => clearTimeout(t);
    }
  }, [scene, running, speak]);

  function doStart() {
    setScene(0); setElapsed(0); prevRef.current = -1;
    setFade(false); setTextPhase(0);
    setTimeout(() => { setFade(true); setTimeout(() => setTextPhase(1), 400); setTimeout(() => setTextPhase(2), 1000); }, 100);
    setRunning(true);
    setTimeout(() => speak(SCENES[0].narration), 500);
  }
  function doPause() { setRunning(false); synth.current?.pause(); }
  function doResume() { setRunning(true); if (!synth.current?.speaking) speak(sc.narration); else synth.current?.resume(); }
  function doReset() { setRunning(false); setScene(0); setElapsed(0); prevRef.current = -1; stop(); setFade(true); setTextPhase(0); }
  function jumpTo(i: number) {
    setScene(i); setElapsed(0); prevRef.current = -1;
    setFade(false); setTextPhase(0);
    setTimeout(() => { setFade(true); setTimeout(() => setTextPhase(1), 300); setTimeout(() => setTextPhase(2), 900); }, 150);
    stop(); setRunning(false);
  }

  const isStart = scene === 0 && elapsed === 0;

  return (
    <div style={{ background: sc.bg, minHeight: "100vh", color: "#e5e5e5", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column", transition: "background 1.2s", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "50vh", background: "radial-gradient(ellipse," + sc.accent + "12 0%,transparent 70%)", pointerEvents: "none", zIndex: 0, transition: "background 1.5s" }} />

      {/* TOP BAR */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, background: "rgba(0,0,0,.3)", backdropFilter: "blur(12px)", borderBottom: "0.5px solid rgba(255,255,255,.06)" }}>
        <a href="/" style={{ color: sc.accent, fontWeight: 900, fontSize: ".85rem", letterSpacing: ".12em", textDecoration: "none", flexShrink: 0, transition: "color 1.2s" }}>&#9670; AUTHICHAIN</a>
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg," + sc.accent + "99," + sc.accent + ")", borderRadius: 2, transition: "width .9s linear,background 1.2s" }} />
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,.25)", flexShrink: 0 }}>{fmt(Math.round(totalE))} / {fmt(TOTAL)}</div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {!running
            ? <button onClick={isStart ? doStart : doResume} disabled={!ready} style={{ background: sc.accent, color: "#000", border: "none", borderRadius: 8, padding: "7px 20px", fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", fontSize: 12, opacity: ready ? 1 : .4, transition: "background 1.2s" }}>{isStart ? "&#9654;  Start" : "&#9654;  Resume"}</button>
            : <button onClick={doPause} style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)", border: "0.5px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>&#9646;&#9646;</button>
          }
          <button onClick={() => setMuted((m) => { if (!m) synth.current?.cancel(); return !m; })} style={{ background: "transparent", color: muted ? sc.accent : "rgba(255,255,255,.3)", border: "0.5px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13, transition: "color 1.2s" }}>{muted ? "&#128263;" : "&#128266;"}</button>
          <button onClick={doReset} style={{ background: "transparent", color: "rgba(255,255,255,.2)", border: "0.5px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 12 }}>&#8635;</button>
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,.15)", flexShrink: 0 }}>&#127897; {voiceName}</div>
      </div>

      {/* SCENE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 24px 120px", position: "relative", zIndex: 10, opacity: fade ? 1 : 0, transition: "opacity .3s" }}>
        <div style={{ position: "absolute", top: 72, left: 24, fontSize: 9, color: "rgba(255,255,255,.2)", textTransform: "uppercase", letterSpacing: ".14em" }}>
          {String(scene + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
        </div>
        <div style={{ position: "absolute", top: 68, right: 24 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="2" />
            <circle cx="20" cy="20" r="16" fill="none" stroke={sc.accent} strokeWidth="2"
              strokeDasharray={String(2 * Math.PI * 16)}
              strokeDashoffset={String(2 * Math.PI * 16 * (1 - sPct / 100))}
              strokeLinecap="round" transform="rotate(-90 20 20)"
              style={{ transition: "stroke-dashoffset 1s linear,stroke 1.2s", filter: "drop-shadow(0 0 4px " + sc.accent + "80)" }} />
            <text x="20" y="25" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="10" fontFamily="monospace">{Math.max(0, sc.duration - elapsed)}</text>
          </svg>
        </div>

        {/* VISUAL AREA */}
        <div style={{ width: "100%", maxWidth: 720, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, minHeight: sc.visual === "IFRAME" ? 380 : 280 }}>
          {sc.visual === "STAT" && <StatVisual active={running && scene === 0} />}
          {sc.visual === "PRODUCT" && <ProductVisual active={running && scene === 1} />}
          {sc.visual === "IFRAME" && sc.url && (
            <div style={{ width: "100%", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.6)", border: "1.5px solid " + sc.accent + "30" }}>
              <iframe src={sc.url} style={{ width: "100%", height: 380, border: "none", display: "block" }} title="Live certificate" />
            </div>
          )}
          {sc.visual === "SCAN" && <ScanVisual active={running && scene === 3} />}
          {sc.visual === "ART" && <ArtVisual active={running && scene === 4} />}
          {sc.visual === "NETWORK" && <NetworkVisual active={running && scene === 5} />}
          {sc.visual === "CLOSE" && <CloseVisual active={running && scene === 6} />}
        </div>

        {/* TEXT */}
        <div style={{ textAlign: "center", maxWidth: 700, opacity: textPhase >= 1 ? 1 : 0, transform: textPhase >= 1 ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s, transform .6s" }}>
          <div style={{ fontSize: "clamp(22px,4.5vw,44px)", fontWeight: 900, color: sc.accent, letterSpacing: ".03em", marginBottom: 10, textShadow: "0 0 40px " + sc.accent + "40", transition: "color 1.2s,text-shadow 1.2s", lineHeight: 1.15 }}>
            {sc.headline}
          </div>
          <div style={{ fontSize: "clamp(13px,2vw,18px)", color: "rgba(255,255,255,.5)", marginBottom: 16, letterSpacing: ".04em" }}>
            {sc.sub}
          </div>
          {textPhase >= 2 && (
            <div style={{ fontSize: "clamp(12px,1.5vw,15px)", color: "rgba(255,255,255,.28)", lineHeight: 1.85 }}>
              {sc.body.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>
      </div>

      {/* CAPTIONS */}
      <div style={{ position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 720, zIndex: 50, textAlign: "center", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {caption.length > 0 && (
          <div style={{ background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)", borderRadius: 10, padding: "8px 18px", fontSize: 14, lineHeight: 1.7 }}>
            {caption.map((w, i) => (
              <span key={i} style={{ color: i === wordIdx ? sc.accent : i < wordIdx ? "rgba(255,255,255,.35)" : "rgba(255,255,255,.8)", fontWeight: i === wordIdx ? 700 : 400, transition: "color .08s", marginRight: ".3em" }}>{w}</span>
            ))}
          </div>
        )}
      </div>

      {/* DOTS */}
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 50, alignItems: "center" }}>
        {SCENES.map((_, i) => (
          <button key={i} onClick={() => jumpTo(i)} style={{ width: i === scene ? 28 : 8, height: 8, borderRadius: 4, background: i === scene ? sc.accent : i < scene ? "rgba(34,197,94,.5)" : "rgba(255,255,255,.15)", border: "none", cursor: "pointer", transition: "all .3s,background 1.2s", padding: 0 }} />
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, padding: "6px 20px", background: "rgba(0,0,0,.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>Loom &#8594; Screen + Camera &#8594; <strong style={{ color: "rgba(255,255,255,.35)" }}>&#9654; Start</strong> &#8594; narrates automatically</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {[{ l: "strainchain.io", c: "#22c55e" }, { l: "authichain.com", c: "#c9a227" }, { l: "qron.space", c: "#84cc16" }].map(({ l, c }) => (
            <a key={l} href={"https://" + l} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: c, opacity: .35, textDecoration: "none" }}>{l} &#8599;</a>
          ))}
        </div>
      </div>
    </div>
  );
}
