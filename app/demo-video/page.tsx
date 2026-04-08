"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const SCENES = [
  {
    id: "hook",
    duration: 13,
    title: "The Problem",
    url: null,
    visual: "STAT",
    narration: "Counterfeiting costs the global economy over 500 billion dollars a year. Paper certificates and barcodes are trivially forged. There is no cryptographic way to verify a physical product is real — until now.",
  },
  {
    id: "solution",
    duration: 16,
    title: "How AuthiChain Works",
    url: null,
    visual: "FLOW",
    narration: "AuthiChain creates a blockchain certificate for every product batch. A manufacturer registers via API. An NFT is minted on the Polygon blockchain. An AI QR code is printed on the label. Any smartphone scans it — and receives an authentic or counterfeit result in 2.1 seconds. No app. No hardware.",
  },
  {
    id: "live",
    duration: 20,
    title: "Live Blockchain Verification",
    url: "https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E",
    visual: "IFRAME",
    narration: "This is a real AuthiChain certificate on the live blockchain. Scan the QR code on any product label, and this page loads in 2.1 seconds. Green means authentic. The certificate ID, manufacturer, and timestamp are immutable on Polygon — no one can alter them.",
  },
  {
    id: "dpp",
    duration: 13,
    title: "EU Digital Product Passport",
    url: "https://authichain.com/compliance",
    visual: "IFRAME",
    narration: "The EU Digital Product Passport mandate requires blockchain provenance for every product sold in Europe by 2026. That is 400 billion dollars in annual EU imports that will legally require this. AuthiChain delivers all seven requirements — live today.",
  },
  {
    id: "qron",
    duration: 13,
    title: "QRON — The QR Art Platform",
    url: "https://qron.space/order",
    visual: "IFRAME",
    narration: "QRON is our AI QR art platform. Every AuthiChain certificate is delivered as a beautiful, scannable QR code — eleven styles, nine dollars per design. This is the product that makes blockchain authentication something brands actually want on their packaging.",
  },
  {
    id: "traction",
    duration: 15,
    title: "Traction",
    url: null,
    visual: "METRICS",
    narration: "Built solo in six months with zero dollars raised. Forty Cloudflare Workers, ninety-nine point nine percent uptime, over 1000 blockchain certificates issued. 47 million dollar pipeline — LVMH, Hermès, Moderna, BMW. DHS SVIP 800 thousand dollar grant application submitted. DoD APEX Accelerators enrolled.",
  },
  {
    id: "close",
    duration: 12,
    title: "The Ask",
    url: null,
    visual: "CLOSE",
    narration: "AuthiChain, QRON, and StrainChain — built by one founder, zero capital, six months. The EU DPP mandate creates forced adoption in 2026. We are built for this exact moment. We are applying to Y Combinator to move from pre-revenue to first enterprise contract.",
  },
];

const TOTAL_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0);

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function DemoVideoPage() {
  const [scene, setScene] = useState(0);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [voiceName, setVoiceName] = useState("Loading...");
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sc = SCENES[scene];
  const totalElapsed = SCENES.slice(0, scene).reduce((s, x) => s + x.duration, 0) + sceneElapsed;
  const pct = Math.min(100, (totalElapsed / TOTAL_DURATION) * 100);

  // ── Voice selection ──────────────────────────────────────────────
  const pickVoice = useCallback(() => {
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    const voices = synth.getVoices();
    if (!voices.length) return;

    // Priority order for natural deep male voices
    const preferred = [
      "Google UK English Male",
      "Microsoft David",
      "Microsoft Guy",
      "Microsoft Christopher",
      "Daniel",       // macOS deep British male
      "Aaron",        // macOS
      "Alex",         // macOS classic
      "Fred",         // macOS deep
      "Thomas",       // French but deep
    ];

    let chosen: SpeechSynthesisVoice | null = null;
    for (const name of preferred) {
      chosen = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase())) ?? null;
      if (chosen) break;
    }
    // Fallback: any male-sounding English voice
    if (!chosen) {
      chosen = voices.find(v => v.lang.startsWith("en") && /male|david|guy|aaron|alex|daniel|fred|chris/i.test(v.name)) ?? null;
    }
    // Final fallback: first English voice
    if (!chosen) {
      chosen = voices.find(v => v.lang.startsWith("en")) ?? voices[0] ?? null;
    }

    voiceRef.current = chosen;
    setVoiceName(chosen?.name ?? "Default");
    setVoiceReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    synthRef.current = synth;
    // Chrome loads voices async
    if (synth.getVoices().length) {
      pickVoice();
    } else {
      synth.addEventListener("voiceschanged", pickVoice, { once: true });
    }
    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", pickVoice);
    };
  }, [pickVoice]);

  // ── Narrate current scene ────────────────────────────────────────
  const narrate = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth || muted) return;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utt.voice = voiceRef.current;
    utt.rate = 0.92;   // slightly slower = more gravitas
    utt.pitch = 0.85;  // lower pitch = male, authoritative
    utt.volume = 1.0;
    utterRef.current = utt;
    synth.speak(utt);
  }, [muted]);

  // ── Timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSceneElapsed(prev => {
          const next = prev + 1;
          if (next >= SCENES[scene].duration) {
            setScene(s => {
              if (s < SCENES.length - 1) {
                setSceneElapsed(0);
                return s + 1;
              }
              setRunning(false);
              return s;
            });
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, scene]);

  // ── Narrate on scene change ──────────────────────────────────────
  const prevScene = useRef(-1);
  useEffect(() => {
    if (running && scene !== prevScene.current) {
      prevScene.current = scene;
      narrate(SCENES[scene].narration);
    }
  }, [scene, running, narrate]);

  function start() {
    setScene(0); setSceneElapsed(0);
    prevScene.current = -1;
    setRunning(true);
    // Small delay so state settles before narration fires
    setTimeout(() => narrate(SCENES[0].narration), 200);
  }

  function pause() {
    setRunning(false);
    synthRef.current?.pause();
  }

  function resume() {
    setRunning(true);
    synthRef.current?.resume();
    if (synthRef.current && !synthRef.current.speaking) narrate(sc.narration);
  }

  function reset() {
    setRunning(false); setScene(0); setSceneElapsed(0);
    prevScene.current = -1;
    synthRef.current?.cancel();
  }

  function jumpTo(i: number) {
    setScene(i); setSceneElapsed(0);
    prevScene.current = -1;
    synthRef.current?.cancel();
    setRunning(false);
  }

  function toggleMute() {
    setMuted(m => {
      if (!m) synthRef.current?.cancel();
      return !m;
    });
  }

  // ── Visuals ──────────────────────────────────────────────────────
  function FlowVisual() {
    const steps = ["API register","NFT minted","QR on label","Smartphone scan","AUTHENTIC ✓"];
    return (
      <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:32}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",justifyContent:"center",gap:0}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div style={{background:i===steps.length-1?"rgba(34,197,94,.15)":"rgba(201,162,39,.1)",border:`1px solid ${i===steps.length-1?"#22c55e":"#c9a227"}`,borderRadius:8,padding:"10px 16px",color:i===steps.length-1?"#22c55e":"#c9a227",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>
                {s}
              </div>
              {i<steps.length-1&&<div style={{color:"#444",margin:"0 8px",fontSize:18}}>→</div>}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,width:"100%",maxWidth:560}}>
          {[["$0.004","per seal — 125x cheaper than RFID"],["2.1s","verification on any smartphone"],["Zero","app or hardware required"]].map(([v,l],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",borderRadius:10,padding:"16px 12px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:900,color:"#e5e5e5"}}>{v}</div>
              <div style={{fontSize:11,color:"#555",marginTop:6}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function MetricsVisual() {
    const m=[["$47M","ACV Pipeline"],["172","Enterprise Deals"],["1,023+","Certs Issued"],["$0","Capital Raised"],["40+","CF Workers"],["6 mo","Solo Build"]];
    return(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,width:"100%",maxWidth:580}}>
        {m.map(([v,l],i)=>(
          <div key={i} style={{background:"rgba(201,162,39,.08)",border:"1px solid rgba(201,162,39,.2)",borderRadius:10,padding:"16px 10px",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:900,color:"#c9a227"}}>{v}</div>
            <div style={{fontSize:11,color:"#666",marginTop:5,textTransform:"uppercase",letterSpacing:".06em"}}>{l}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{background:"#0a0a0a",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column"}}>

      {/* Top bar */}
      <div style={{padding:"10px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid #1a1a1a",background:"#0d0d0d",flexWrap:"wrap"}}>
        <a href="/" style={{color:"#c9a227",fontWeight:900,fontSize:"1rem",letterSpacing:".1em",textDecoration:"none",flexShrink:0}}>◆ AUTHICHAIN</a>

        {/* Progress */}
        <div style={{flex:1,minWidth:120,height:4,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:4,width:`${pct}%`,background:"#c9a227",borderRadius:2,transition:"width .8s"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:12,color:"#444",flexShrink:0}}>{formatTime(Math.round(totalElapsed))} / {formatTime(TOTAL_DURATION)}</div>

        {/* Controls */}
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {!running
            ? <button onClick={scene===0&&sceneElapsed===0?start:resume}
                disabled={!voiceReady}
                style={{background:"#c9a227",color:"#000",border:"none",borderRadius:8,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:13,opacity:voiceReady?1:.5}}>
                {scene===0&&sceneElapsed===0?"▶  Start":"▶  Resume"}
              </button>
            : <button onClick={pause} style={{background:"#222",color:"#aaa",border:"1px solid #333",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:13}}>⏸  Pause</button>
          }
          <button onClick={toggleMute} title={muted?"Unmute":"Mute"} style={{background:"transparent",color:muted?"#c9a227":"#555",border:"1px solid #222",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:13}}>
            {muted?"🔇":"🔊"}
          </button>
          <button onClick={reset} style={{background:"transparent",color:"#555",border:"1px solid #222",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:13}}>↺</button>
        </div>

        {/* Voice badge */}
        <div style={{fontSize:11,color:"#333",flexShrink:0}}>🎙 {voiceName}</div>
      </div>

      {/* Scene tabs */}
      <div style={{display:"flex",padding:"0 20px",borderBottom:"1px solid #1a1a1a",overflowX:"auto",background:"#0d0d0d"}}>
        {SCENES.map((s,i)=>(
          <button key={i} onClick={()=>jumpTo(i)}
            style={{padding:"9px 13px",background:"transparent",border:"none",
              borderBottom:i===scene?"2px solid #c9a227":"2px solid transparent",
              color:i===scene?"#c9a227":i<scene?"#3B6D11":"#444",
              cursor:"pointer",fontSize:12,whiteSpace:"nowrap",fontWeight:i===scene?600:400}}>
            {i<scene?"✓ ":""}{i+1}. {s.title}
          </button>
        ))}
      </div>

      {/* Content split */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 360px",minHeight:400}}>

        {/* Visual panel */}
        <div style={{background:sc.url?"#0d1117":"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>

          {sc.visual==="IFRAME"&&sc.url&&(
            <iframe src={sc.url} style={{width:"100%",height:"100%",minHeight:420,border:"none",borderRadius:8}} title={sc.title}/>
          )}

          {sc.visual==="STAT"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(56px,10vw,96px)",fontWeight:900,color:"#c9a227",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>$500B+</div>
              <div style={{fontSize:18,color:"#888",marginTop:12}}>in counterfeit goods every year</div>
              <div style={{marginTop:48,display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap"}}>
                {[["Paper certs","Easily forged"],["Barcodes","Trivially cloned"],["RFID","$0.50+ + hardware"]].map(([t,s],i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#e06060"}}>{t}</div>
                    <div style={{fontSize:12,color:"#444",marginTop:4}}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sc.visual==="FLOW"&&<FlowVisual/>}
          {sc.visual==="METRICS"&&<MetricsVisual/>}

          {sc.visual==="CLOSE"&&(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(36px,7vw,64px)",fontWeight:900,color:"#c9a227",letterSpacing:".04em",marginBottom:16}}>AUTHICHAIN</div>
              <div style={{color:"#555",fontSize:15,marginBottom:40}}>Blockchain provenance for every physical good.</div>
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                {["authichain.com","qron.space","strainchain.io"].map(d=>(
                  <div key={d} style={{background:"rgba(201,162,39,.08)",border:"1px solid rgba(201,162,39,.2)",borderRadius:8,padding:"10px 20px",color:"#c9a227",fontSize:14}}>{d}</div>
                ))}
              </div>
            </div>
          )}

          {/* Scene countdown */}
          <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.7)",border:"1px solid #333",borderRadius:6,padding:"4px 10px",fontFamily:"monospace",fontSize:12,color:"#444"}}>
            {Math.max(0, sc.duration - sceneElapsed)}s
          </div>
        </div>

        {/* Script panel */}
        <div style={{background:"#0d0d0d",borderLeft:"1px solid #1a1a1a",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #1a1a1a"}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".08em",color:"#333",marginBottom:5}}>Scene {scene+1} / {SCENES.length}</div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:14}}>{sc.title}</div>
            <div style={{fontSize:11,color:"#444",marginTop:3}}>{sc.duration}s</div>
          </div>

          {/* Narration text */}
          <div style={{flex:1,padding:"18px",overflowY:"auto"}}>
            <div style={{fontSize:13,color:"#555",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>Narration</div>
            <div style={{fontSize:14,lineHeight:1.85,color:"#aaa",background:"rgba(201,162,39,.04)",border:"1px solid rgba(201,162,39,.1)",borderRadius:8,padding:"14px"}}>
              {sc.narration}
            </div>
            {sc.url&&(
              <div style={{marginTop:16,padding:"10px 12px",background:"rgba(55,138,221,.06)",border:"1px solid rgba(55,138,221,.15)",borderRadius:8}}>
                <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Live URL</div>
                <a href={sc.url} target="_blank" rel="noreferrer" style={{color:"#378ADD",fontSize:11,fontFamily:"monospace",wordBreak:"break-all"}}>{sc.url}</a>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={{padding:"12px 18px",borderTop:"1px solid #1a1a1a",display:"flex",gap:8}}>
            <button onClick={()=>jumpTo(Math.max(0,scene-1))} disabled={scene===0}
              style={{flex:1,padding:"8px",background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:8,color:scene===0?"#333":"#777",cursor:scene===0?"default":"pointer",fontSize:13}}>← Prev</button>
            <button onClick={()=>jumpTo(Math.min(SCENES.length-1,scene+1))} disabled={scene===SCENES.length-1}
              style={{flex:1,padding:"8px",background:"#c9a227",border:"none",borderRadius:8,color:"#000",cursor:scene===SCENES.length-1?"default":"pointer",fontWeight:700,fontSize:13}}>Next →</button>
          </div>
        </div>
      </div>

      {/* Bottom status */}
      <div style={{padding:"8px 20px",background:"#0d0d0d",borderTop:"1px solid #1a1a1a",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <div style={{fontSize:12,color:"#333"}}>
          🎬 Open Loom → Screen + Camera → hit <strong style={{color:"#555"}}>▶ Start</strong> → voice narrates automatically
        </div>
        <div style={{fontSize:12,color:"#333"}}>Total: <strong style={{color:"#555"}}>{formatTime(TOTAL_DURATION)}</strong></div>
        <a href="https://chrome.google.com/webstore/detail/loom/liecbddmkiiihnedobmlmillhodjkdmb" target="_blank" rel="noreferrer"
          style={{fontSize:12,color:"#c9a227",marginLeft:"auto"}}>Get Loom extension ↗</a>
      </div>
    </div>
  );
}
