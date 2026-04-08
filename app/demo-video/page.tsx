"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── SCENES ─────────────────────────────────────────────────── */
const SCENES = [
  {
    id:"problem", duration:11, phase:"PROBLEM",
    title:"The $500B Problem",
    narration:"Every year, over 500 billion dollars in counterfeit goods flow through global supply chains. Paper certificates are forged in minutes. Barcodes are trivially cloned. No cryptographic truth layer exists for physical products — until now.",
    visual:"STAT",
    accent:"#e06060",
  },
  {
    id:"economy", duration:14, phase:"VISION",
    title:"The Authentic Economy",
    narration:"The Authentic Economy is a unified trust infrastructure built on three interconnected platforms. AuthiChain anchors every product to the blockchain. QRON delivers that truth as beautiful, scannable art. StrainChain enforces compliance in regulated markets. Together they form the proof-of-origin rails for the physical world.",
    visual:"ECOSYSTEM",
    accent:"#c9a227",
  },
  {
    id:"authichain-home", duration:16, phase:"AUTHICHAIN",
    title:"AuthiChain — The Blockchain Layer",
    url:"https://authichain.com",
    narration:"AuthiChain is the root of the Authentic Economy. Manufacturers register product batches via REST API. An ERC-721 NFT is minted on the Polygon blockchain — immutable, permanent, cryptographically unforgeable. This is the truth anchor that makes everything else possible.",
    visual:"IFRAME",
    accent:"#c9a227",
  },
  {
    id:"authichain-verify", duration:16, phase:"AUTHICHAIN",
    title:"Live Verification in 2.1 Seconds",
    url:"https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E",
    narration:"This is a live blockchain certificate. Scan any product QR code and this page loads in 2.1 seconds — on any smartphone, no app, no hardware. Green means authentic. The certificate ID, manufacturer, batch, and timestamp are immutable on Polygon. No one can alter them.",
    visual:"IFRAME",
    accent:"#22c55e",
  },
  {
    id:"qron-home", duration:15, phase:"QRON",
    title:"QRON — The Delivery Layer",
    url:"https://qron.space",
    narration:"QRON is how AuthiChain certificates reach the physical world. Every blockchain certificate is delivered as a beautiful, scannable QR code — AI-generated in eleven styles. QRON transforms the authentication token from a technical artifact into something brands actually want on their packaging.",
    visual:"IFRAME",
    accent:"#a78bfa",
  },
  {
    id:"qron-order", duration:13, phase:"QRON",
    title:"QRON — AI Art, $9 to $49",
    url:"https://qron.space/order",
    narration:"Nine dollars per design. Forty-nine dollars for a full brand kit. White-label API for agencies. Every QRON code carries an AuthiChain certificate hash — the QR art and the blockchain proof are inseparable. This is the consumer interface of the Authentic Economy.",
    visual:"IFRAME",
    accent:"#a78bfa",
  },
  {
    id:"strainchain", duration:15, phase:"STRAINCHAIN",
    title:"StrainChain — The Compliance Layer",
    url:"https://strainchain.io",
    narration:"StrainChain is AuthiChain applied to the most regulated supply chain in North America — cannabis. Seed to sale tracking, state compliance reporting, batch authentication, and QRON-generated QR codes on every package. StrainChain proves the Authentic Economy protocol works in the hardest possible environment.",
    visual:"IFRAME",
    accent:"#22c55e",
  },
  {
    id:"flow", duration:16, phase:"FLOW",
    title:"How the Three Platforms Connect",
    narration:"Here is how the three platforms work as one. A manufacturer registers a batch in AuthiChain. QRON generates the QR art carrying the certificate. The QR code is printed on the physical product. A consumer, regulator, or customs agent scans it. The Truth Network records the verdict. The Authentic Economy self-enforces.",
    visual:"FLOW",
    accent:"#c9a227",
  },
  {
    id:"dpp", duration:12, phase:"MANDATE",
    title:"EU Digital Product Passport — 2026",
    url:"https://authichain.com/compliance",
    narration:"The EU Digital Product Passport mandate requires blockchain provenance for every product sold in Europe by 2026 — luxury, pharma, automotive, electronics. 400 billion dollars in annual EU imports will legally require exactly what we have already built.",
    visual:"IFRAME",
    accent:"#378ADD",
  },
  {
    id:"traction", duration:13, phase:"TRACTION",
    title:"Built Solo. Zero Capital. Six Months.",
    narration:"Three platforms. Forty Cloudflare Workers. Ninety-nine point nine percent uptime. Over a thousand blockchain certificates on Polygon mainnet. 47 million dollar enterprise pipeline across 172 deals — LVMH, Hermès, Moderna, BMW, L'Oréal. DHS SVIP grant application submitted. DoD APEX Accelerators enrolled.",
    visual:"METRICS",
    accent:"#c9a227",
  },
  {
    id:"ask", duration:11, phase:"ASK",
    title:"The Ask",
    narration:"The Authentic Economy — AuthiChain, QRON, and StrainChain — built by one founder, zero capital, six months. The EU DPP mandate creates forced adoption in 2026. We are the infrastructure layer. We are applying to Y Combinator to move from pre-revenue to first enterprise contract.",
    visual:"CLOSE",
    accent:"#c9a227",
  },
];

const TOTAL = SCENES.reduce((s,x)=>s+x.duration,0);
function pad(n:number){return String(Math.floor(n)).padStart(2,"0")}
function fmt(s:number){return `${Math.floor(s/60)}:${pad(s%60)}`}

const PHASE_COLORS:Record<string,string> = {
  PROBLEM:"#e06060", VISION:"#c9a227", AUTHICHAIN:"#c9a227",
  QRON:"#a78bfa", STRAINCHAIN:"#22c55e", FLOW:"#c9a227",
  MANDATE:"#378ADD", TRACTION:"#c9a227", ASK:"#c9a227",
};

/* ─── ECOSYSTEM DIAGRAM ───────────────────────────────────────── */
function EcosystemVisual({running}:{running:boolean}) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{
    if(!running)return;
    const id=setInterval(()=>setTick(t=>t+1),1200);
    return()=>clearInterval(id);
  },[running]);

  const pulse=(n:number)=>tick%3===n&&running;

  const platforms=[
    {x:160,y:90, label:"AuthiChain", sub:"Blockchain layer",color:"#c9a227",bg:"rgba(201,162,39,.12)",url:"authichain.com"},
    {x:400,y:90, label:"QRON",       sub:"QR art delivery", color:"#a78bfa",bg:"rgba(167,139,250,.12)",url:"qron.space"},
    {x:280,y:230,label:"StrainChain",sub:"Compliance layer", color:"#22c55e",bg:"rgba(34,197,94,.12)",url:"strainchain.io"},
  ];

  const connectors=[
    {x1:230,y1:105,x2:345,y2:105, label:"certificate → QR", color:"#c9a227", pulsing:pulse(0)},
    {x1:185,y1:128,x2:255,y2:218, label:"protocol",          color:"#22c55e", pulsing:pulse(1)},
    {x1:400,y1:128,x2:325,y2:218, label:"QR art",            color:"#a78bfa", pulsing:pulse(2)},
  ];

  const nodes=[
    {x:280,y:52, label:"Manufacturer",color:"rgba(255,255,255,.12)",text:"rgba(255,255,255,.6)"},
    {x:530,y:160,label:"Consumer",    color:"rgba(255,255,255,.08)",text:"rgba(255,255,255,.4)"},
    {x:20, y:160,label:"Regulator",   color:"rgba(255,255,255,.08)",text:"rgba(255,255,255,.4)"},
    {x:280,y:310,label:"Truth Network",color:"rgba(201,162,39,.1)",text:"rgba(201,162,39,.6)"},
  ];

  return(
    <div style={{width:"100%",maxWidth:580,position:"relative"}}>
      <svg viewBox="0 0 560 360" style={{width:"100%",overflow:"visible"}}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,.25)"/>
          </marker>
          {connectors.map((c,i)=>(
            <marker key={i} id={`arr${i}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={c.color}/>
            </marker>
          ))}
        </defs>

        {/* Outer flow arrows */}
        <line x1="280" y1="68" x2="175" y2="85" stroke="rgba(255,255,255,.15)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="460" y1="110" x2="525" y2="145" stroke="rgba(255,255,255,.12)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="85"  y1="110" x2="38" y2="145" stroke="rgba(255,255,255,.12)" strokeWidth="1" markerEnd="url(#arr)"/>
        <line x1="280" y1="255" x2="280" y2="300" stroke="rgba(201,162,39,.3)" strokeWidth="1.5" markerEnd="url(#arr)"/>

        {/* Connectors between platforms */}
        {connectors.map((c,i)=>(
          <g key={i}>
            <line x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={c.pulsing?c.color:"rgba(255,255,255,.12)"}
              strokeWidth={c.pulsing?2:1}
              strokeDasharray={c.pulsing?"none":"4 4"}
              markerEnd={`url(#arr${i})`}
              style={{transition:"all .3s"}}
            />
            <text x={(c.x1+c.x2)/2} y={(c.y1+c.y2)/2-6} fill={c.pulsing?c.color:"rgba(255,255,255,.25)"}
              fontSize="8" textAnchor="middle" style={{transition:"fill .3s"}}>{c.label}</text>
          </g>
        ))}

        {/* Outer nodes */}
        {nodes.map((n,i)=>(
          <g key={i}>
            <rect x={n.x-45} y={n.y-14} width={90} height={28} rx="6" fill={n.color} stroke="rgba(255,255,255,.08)" strokeWidth=".5"/>
            <text x={n.x} y={n.y+5} fill={n.text} fontSize="9.5" textAnchor="middle" fontWeight="500">{n.label}</text>
          </g>
        ))}

        {/* Platform nodes */}
        {platforms.map((p,i)=>(
          <g key={i}>
            <rect x={p.x-70} y={p.y-30} width={140} height={60} rx="10"
              fill={p.bg}
              stroke={p.color}
              strokeWidth={pulse(i)?1.8:.8}
              style={{filter:pulse(i)?`drop-shadow(0 0 8px ${p.color}40)`:""}}
            />
            <text x={p.x} y={p.y-8}  fill={p.color}   fontSize="12" textAnchor="middle" fontWeight="700">{p.label}</text>
            <text x={p.x} y={p.y+8}  fill="rgba(255,255,255,.45)" fontSize="9"  textAnchor="middle">{p.sub}</text>
            <text x={p.x} y={p.y+22} fill={p.color}   fontSize="8.5"textAnchor="middle" opacity=".6">{p.url}</text>
          </g>
        ))}
      </svg>
      <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:".06em",textTransform:"uppercase"}}>
        The Authentic Economy — three platforms, one protocol
      </div>
    </div>
  );
}

/* ─── FLOW DIAGRAM ────────────────────────────────────────────── */
function FlowVisual() {
  const steps=[
    {icon:"🏭",label:"Manufacturer",sub:"registers batch",color:"#888"},
    {icon:"◆", label:"AuthiChain",  sub:"mints NFT on Polygon",color:"#c9a227"},
    {icon:"⬡", label:"QRON",        sub:"generates QR art",color:"#a78bfa"},
    {icon:"📦",label:"Product",     sub:"QR on label",color:"#888"},
    {icon:"📱",label:"Scan",        sub:"any smartphone",color:"#888"},
    {icon:"✓", label:"Authentic",   sub:"Truth recorded",color:"#22c55e"},
  ];
  return(
    <div style={{width:"100%",maxWidth:700}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center",flexWrap:"wrap",gap:0}}>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{
                width:64,height:64,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,
                background:i===1?"rgba(201,162,39,.12)":i===2?"rgba(167,139,250,.12)":i===5?"rgba(34,197,94,.12)":"rgba(255,255,255,.05)",
                border:`1.5px solid ${s.color === "#888"?"rgba(255,255,255,.1)":s.color}`,
              }}>{s.icon}</div>
              <div style={{textAlign:"center",maxWidth:72}}>
                <div style={{fontSize:10.5,fontWeight:700,color:s.color==="888"?"#e5e5e5":s.color,lineHeight:1.2}}>{s.label}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)",marginTop:2}}>{s.sub}</div>
              </div>
            </div>
            {i<steps.length-1&&(
              <div style={{
                width:28,color:"rgba(255,255,255,.2)",textAlign:"center",fontSize:18,
                paddingBottom:24,flexShrink:0
              }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* StrainChain callout */}
      <div style={{marginTop:28,display:"flex",gap:12,justifyContent:"center"}}>
        <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:10,padding:"10px 18px",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#22c55e",marginBottom:2}}>StrainChain</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>AuthiChain + QRON for cannabis compliance</div>
        </div>
        <div style={{background:"rgba(55,138,221,.08)",border:"1px solid rgba(55,138,221,.2)",borderRadius:10,padding:"10px 18px",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#378ADD",marginBottom:2}}>Truth Network</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>Consumer validators earn $QRON per scan</div>
        </div>
        <div style={{background:"rgba(201,162,39,.08)",border:"1px solid rgba(201,162,39,.2)",borderRadius:10,padding:"10px 18px",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#c9a227",marginBottom:2}}>EU DPP</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>All 7 requirements. Live today.</div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────────── */
export default function DemoVideoPage(){
  const [scene,setScene]=useState(0);
  const [sElapsed,setSElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const [voiceName,setVoiceName]=useState("Loading…");
  const [voiceReady,setVoiceReady]=useState(false);
  const [muted,setMuted]=useState(false);
  const [caption,setCaption]=useState<string[]>([]);
  const [wordIdx,setWordIdx]=useState(-1);
  const [fade,setFade]=useState(true);
  const [counters,setCounters]=useState([0,0,0,0,0,0]);
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const synthRef=useRef<SpeechSynthesis|null>(null);
  const voiceRef=useRef<SpeechSynthesisVoice|null>(null);
  const prevRef=useRef(-1);

  const sc=SCENES[scene];
  const totalElapsed=SCENES.slice(0,scene).reduce((s,x)=>s+x.duration,0)+sElapsed;
  const pct=Math.min(100,(totalElapsed/TOTAL)*100);
  const scenePct=sc.duration>0?(sElapsed/sc.duration)*100:0;
  const accent=sc.accent||"#c9a227";

  const pickVoice=useCallback(()=>{
    const s=window.speechSynthesis; synthRef.current=s;
    const vs=s.getVoices(); if(!vs.length)return;
    const p=["Google UK English Male","Microsoft David","Microsoft Guy","Microsoft Christopher","Daniel","Aaron","Alex","Fred"];
    let c:SpeechSynthesisVoice|null=null;
    for(const n of p){c=vs.find(v=>v.name.toLowerCase().includes(n.toLowerCase()))??null;if(c)break;}
    if(!c)c=vs.find(v=>v.lang.startsWith("en")&&/male|david|guy|aaron|alex|daniel|fred|chris/i.test(v.name))??null;
    if(!c)c=vs.find(v=>v.lang.startsWith("en"))??vs[0]??null;
    voiceRef.current=c; setVoiceName(c?.name??"Default"); setVoiceReady(true);
  },[]);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    const s=window.speechSynthesis; synthRef.current=s;
    if(s.getVoices().length)pickVoice();
    else s.addEventListener("voiceschanged",pickVoice,{once:true});
    return()=>{s.cancel();s.removeEventListener("voiceschanged",pickVoice);};
  },[pickVoice]);

  const narrate=useCallback((text:string)=>{
    const s=synthRef.current; if(!s||muted)return;
    s.cancel();
    const words=text.split(/\s+/); setCaption(words); setWordIdx(-1);
    const u=new SpeechSynthesisUtterance(text);
    if(voiceRef.current)u.voice=voiceRef.current;
    u.rate=0.9;u.pitch=0.82;u.volume=1;
    u.onboundary=(e:SpeechSynthesisEvent)=>{
      if(e.name==="word"){const spoken=text.slice(0,e.charIndex+e.charLength);setWordIdx(spoken.trim().split(/\s+/).length-1);}
    };
    u.onend=()=>setWordIdx(-1);
    s.speak(u);
  },[muted]);

  useEffect(()=>{
    if(running){
      timerRef.current=setInterval(()=>{
        setSElapsed(p=>{
          const n=p+1;
          if(n>=SCENES[scene].duration){
            setScene(s=>{
              if(s<SCENES.length-1){setFade(false);setTimeout(()=>setFade(true),100);setSElapsed(0);return s+1;}
              setRunning(false);return s;
            });return 0;
          }return n;
        });
      },1000);
    }else{if(timerRef.current)clearInterval(timerRef.current);}
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[running,scene]);

  useEffect(()=>{
    if(running&&scene!==prevRef.current){
      prevRef.current=scene;setCaption([]);setWordIdx(-1);
      setTimeout(()=>narrate(SCENES[scene].narration),300);
    }
  },[scene,running,narrate]);

  useEffect(()=>{
    if(sc.visual==="METRICS"&&running){
      const t=[47,172,1023,0,40,6];const dur=2200;const s0=Date.now();
      const tick=()=>{const r=Math.min(1,(Date.now()-s0)/dur);const e=1-Math.pow(1-r,3);setCounters(t.map(v=>Math.round(v*e)));if(r<1)requestAnimationFrame(tick);};
      if(running)requestAnimationFrame(tick);
    }
  },[sc.visual,running]);

  function start(){
    setScene(0);setSElapsed(0);prevRef.current=-1;setFade(false);
    setTimeout(()=>setFade(true),80);setRunning(true);
    setTimeout(()=>narrate(SCENES[0].narration),300);
  }
  function pause(){setRunning(false);synthRef.current?.pause();}
  function resume(){setRunning(true);if(!synthRef.current?.speaking)narrate(sc.narration);else synthRef.current?.resume();}
  function reset(){setRunning(false);setScene(0);setSElapsed(0);prevRef.current=-1;synthRef.current?.cancel();setCaption([]);setWordIdx(-1);}
  function jumpTo(i:number){
    setScene(i);setSElapsed(0);prevRef.current=-1;setFade(false);
    setTimeout(()=>setFade(true),80);synthRef.current?.cancel();setCaption([]);setWordIdx(-1);setRunning(false);
  }
  function toggleMute(){setMuted(m=>{if(!m)synthRef.current?.cancel();return!m;});}

  /* phase groups for tab display */
  const phases=[...new Set(SCENES.map(s=>s.phase))];
  const phaseOfScene=SCENES[scene].phase;

  /* captions */
  function Captions(){
    if(!caption.length)return null;
    return(
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 16px 12px",background:"linear-gradient(transparent,rgba(0,0,0,.88))",textAlign:"center",pointerEvents:"none"}}>
        <div style={{fontSize:14.5,lineHeight:1.75,fontWeight:500}}>
          {caption.map((w,i)=>(
            <span key={i} style={{
              color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.4)":"rgba(255,255,255,.8)",
              fontWeight:i===wordIdx?700:400,transition:"color .1s",marginRight:"0.3em",display:"inline-block"
            }}>{w}</span>
          ))}
        </div>
      </div>
    );
  }

  function StatVisual(){
    const [n,setN]=useState(0);
    useEffect(()=>{
      const d=1800,s0=Date.now();
      const t=()=>{const r=Math.min(1,(Date.now()-s0)/d);setN(Math.round(500*r));if(r<1)requestAnimationFrame(t);};
      if(running)requestAnimationFrame(t);else setN(500);
    },[]);
    return(
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"clamp(64px,12vw,108px)",fontWeight:900,color:"#e06060",lineHeight:1,textShadow:"0 0 60px rgba(224,96,96,.3)"}}>
          ${n}B+
        </div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:12,textTransform:"uppercase",letterSpacing:".08em"}}>in counterfeit goods every year</div>
        <div style={{display:"flex",gap:24,justifyContent:"center",marginTop:44,flexWrap:"wrap"}}>
          {[["Paper certs","forged in minutes"],["Barcodes","trivially cloned"],["RFID","$0.50+ per tag, hardware required"]].map(([t,s],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"13px 20px",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:600,color:"#e06060",marginBottom:5}}>{t}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function MetricsVisual(){
    const items=[
      {val:"$"+counters[0]+"M",label:"ACV pipeline"},
      {val:counters[1]+"",label:"enterprise deals"},
      {val:counters[2].toLocaleString(),label:"certs on-chain"},
      {val:"$0",label:"capital raised"},
      {val:counters[4]+"+",label:"CF workers"},
      {val:counters[5]+" mo",label:"solo build"},
    ];
    return(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,width:"100%",maxWidth:580}}>
        {items.map((m,i)=>(
          <div key={i} style={{background:"rgba(201,162,39,.07)",border:"1px solid rgba(201,162,39,.18)",borderRadius:12,padding:"18px 10px",textAlign:"center"}}>
            <div style={{fontSize:28,fontWeight:900,color:"#c9a227",lineHeight:1}}>{m.val}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:6,textTransform:"uppercase",letterSpacing:".07em"}}>{m.label}</div>
          </div>
        ))}
      </div>
    );
  }

  function CloseVisual(){
    return(
      <div style={{textAlign:"center",width:"100%"}}>
        <div style={{fontSize:"clamp(36px,7vw,64px)",fontWeight:900,color:"#c9a227",letterSpacing:".05em",marginBottom:16,textShadow:"0 0 80px rgba(201,162,39,.35)"}}>
          AUTHENTIC ECONOMY
        </div>
        <div style={{color:"rgba(255,255,255,.4)",fontSize:14,marginBottom:40,letterSpacing:".03em"}}>
          Objects have authenticity. People have authenticity reputation.<br/>AI agents enforce authenticity.
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {d:"authichain.com",c:"#c9a227"},
            {d:"qron.space",c:"#a78bfa"},
            {d:"strainchain.io",c:"#22c55e"},
          ].map(({d,c})=>(
            <div key={d} style={{background:`${c}12`,border:`1px solid ${c}40`,borderRadius:10,padding:"12px 22px",color:c,fontSize:14,letterSpacing:".03em"}}>{d}</div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div style={{background:"#080808",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Ambient glow — color shifts with scene */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:700,height:220,
        background:`radial-gradient(ellipse,${accent}0d 0%,transparent 70%)`,
        pointerEvents:"none",zIndex:0,transition:"background 1s"}}/>

      {/* ── TOP BAR ── */}
      <div style={{position:"relative",zIndex:10,padding:"10px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:"0.5px solid rgba(255,255,255,.07)",background:"rgba(8,8,8,.95)",flexWrap:"wrap"}}>
        <a href="/" style={{color:accent,fontWeight:900,fontSize:"1rem",letterSpacing:".12em",textDecoration:"none",flexShrink:0,transition:"color .5s"}}>◆ AUTHENTIC ECONOMY</a>
        <div style={{flex:1,minWidth:120,height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${accent},${accent}cc)`,borderRadius:2,transition:"width .9s linear"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,.3)"}}>{fmt(Math.round(totalElapsed))} / {fmt(TOTAL)}</div>
        <div style={{display:"flex",gap:8,flexShrink:0}}>
          {!running
            ?<button onClick={scene===0&&sElapsed===0?start:resume} disabled={!voiceReady}
                style={{background:accent,color:"#000",border:"none",borderRadius:8,padding:"8px 20px",fontWeight:700,cursor:voiceReady?"pointer":"not-allowed",fontSize:13,opacity:voiceReady?1:.5,transition:"background .5s"}}>
                {scene===0&&sElapsed===0?"▶  Start":"▶  Resume"}
              </button>
            :<button onClick={pause} style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.7)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13}}>⏸  Pause</button>
          }
          <button onClick={toggleMute} style={{background:"transparent",color:muted?accent:"rgba(255,255,255,.3)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:14}}>{muted?"🔇":"🔊"}</button>
          <button onClick={reset} style={{background:"transparent",color:"rgba(255,255,255,.2)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:13}}>↺</button>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.18)",flexShrink:0}}>🎙 {voiceName}</div>
      </div>

      {/* ── SCENE TABS ── */}
      <div style={{position:"relative",zIndex:10,display:"flex",padding:"0 16px",borderBottom:"0.5px solid rgba(255,255,255,.06)",background:"rgba(8,8,8,.9)",overflowX:"auto",flexShrink:0}}>
        {SCENES.map((s,i)=>{
          const isActive=i===scene;
          const isDone=i<scene;
          const c=PHASE_COLORS[s.phase]||"#c9a227";
          return(
            <button key={i} onClick={()=>jumpTo(i)}
              style={{padding:"8px 12px",background:"transparent",border:"none",
                borderBottom:isActive?`1.5px solid ${c}`:"1.5px solid transparent",
                color:isActive?c:isDone?"rgba(34,197,94,.55)":"rgba(255,255,255,.22)",
                cursor:"pointer",fontSize:11,whiteSpace:"nowrap",fontWeight:isActive?700:400,
                transition:"color .2s,border-color .2s"
              }}>
              {isDone?"✓ ":""}{i+1}. {s.title}
            </button>
          );
        })}
        <div style={{position:"absolute",bottom:0,left:0,height:"1.5px",background:`${accent}30`,
          width:`${(scene/SCENES.length+scenePct/100/SCENES.length)*100}%`,transition:"width 1s linear, background .5s"}}/>
      </div>

      {/* ── SPLIT ── */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 340px",minHeight:0}}>

        {/* Visual */}
        <div style={{position:"relative",background:sc.visual==="IFRAME"?"#0d1117":"#080808",
          display:"flex",alignItems:"center",justifyContent:"center",padding:sc.visual==="IFRAME"?0:28,overflow:"hidden",transition:"background .4s"}}>
          <div style={{opacity:fade?1:0,transition:"opacity .25s",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {sc.visual==="IFRAME"&&sc.url&&<iframe src={sc.url} style={{width:"100%",height:"100%",minHeight:440,border:"none"}} title={sc.title}/>}
            {sc.visual==="STAT"&&<StatVisual/>}
            {sc.visual==="ECOSYSTEM"&&<EcosystemVisual running={running}/>}
            {sc.visual==="FLOW"&&<FlowVisual/>}
            {sc.visual==="METRICS"&&<MetricsVisual/>}
            {sc.visual==="CLOSE"&&<CloseVisual/>}
          </div>

          {/* Phase badge */}
          <div style={{position:"absolute",top:14,left:14,background:`${accent}18`,border:`1px solid ${accent}40`,borderRadius:6,padding:"3px 10px",fontSize:9,color:accent,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",transition:"all .5s"}}>
            {sc.phase}
          </div>

          {/* Countdown ring */}
          <div style={{position:"absolute",top:12,right:14,zIndex:5}}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="2.5"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke={accent} strokeWidth="2.5"
                strokeDasharray={`${2*Math.PI*18}`}
                strokeDashoffset={`${2*Math.PI*18*(1-scenePct/100)}`}
                strokeLinecap="round" transform="rotate(-90 22 22)"
                style={{transition:"stroke-dashoffset 1s linear, stroke .5s",filter:`drop-shadow(0 0 4px ${accent}60)`}}/>
              <text x="22" y="27" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="11" fontFamily="monospace">{Math.max(0,sc.duration-sElapsed)}</text>
            </svg>
          </div>

          <Captions/>
        </div>

        {/* Script panel */}
        <div style={{background:"rgba(10,10,10,.98)",borderLeft:"0.5px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 18px",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.2)",marginBottom:5}}>
              {sc.phase} · Scene {scene+1}/{SCENES.length} · {sc.duration}s
            </div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:14}}>{sc.title}</div>
            {sc.url&&<div style={{fontFamily:"monospace",fontSize:9.5,color:`${accent}90`,marginTop:5,wordBreak:"break-all"}}>{sc.url}</div>}
            {/* dots */}
            <div style={{display:"flex",gap:4,marginTop:10}}>
              {SCENES.map((_,i)=>(
                <div key={i} onClick={()=>jumpTo(i)}
                  style={{height:3,flex:1,borderRadius:2,cursor:"pointer",transition:"background .3s",
                    background:i<scene?"#22c55e":i===scene?accent:"rgba(255,255,255,.08)"}}/>
              ))}
            </div>
          </div>

          <div style={{flex:1,padding:"14px 18px",overflowY:"auto"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Narration</div>
            <div style={{fontSize:13.5,lineHeight:1.9,background:`${accent}08`,border:`1px solid ${accent}12`,borderRadius:8,padding:"12px 14px"}}>
              {caption.length>0
                ?caption.map((w,i)=>(
                    <span key={i} style={{
                      color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.35)":"rgba(255,255,255,.7)",
                      fontWeight:i===wordIdx?700:400,transition:"color .1s",marginRight:"0.3em",
                    }}>{w}</span>
                  ))
                :<span style={{color:"rgba(255,255,255,.5)"}}>{sc.narration}</span>
              }
            </div>
          </div>

          <div style={{padding:"12px 18px",borderTop:"0.5px solid rgba(255,255,255,.06)",display:"flex",gap:8}}>
            <button onClick={()=>jumpTo(Math.max(0,scene-1))} disabled={scene===0}
              style={{flex:1,padding:"8px",background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,color:scene===0?"rgba(255,255,255,.12)":"rgba(255,255,255,.5)",cursor:scene===0?"default":"pointer",fontSize:12}}>← Prev</button>
            <button onClick={()=>jumpTo(Math.min(SCENES.length-1,scene+1))} disabled={scene===SCENES.length-1}
              style={{flex:1,padding:"8px",background:accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",fontWeight:700,fontSize:12,opacity:scene===SCENES.length-1?.4:1,transition:"background .5s"}}>Next →</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{position:"relative",zIndex:10,padding:"7px 20px",background:"rgba(8,8,8,.95)",borderTop:"0.5px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",flexShrink:0}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.18)"}}>Loom → Screen + Camera → <strong style={{color:"rgba(255,255,255,.35)"}}>▶ Start</strong> → voice narrates automatically</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.12)"}}>{fmt(TOTAL)} total · {SCENES.length} scenes</div>
        <div style={{marginLeft:"auto",display:"flex",gap:12}}>
          {[{label:"authichain.com",c:"#c9a227"},{label:"qron.space",c:"#a78bfa"},{label:"strainchain.io",c:"#22c55e"}].map(({label,c})=>(
            <a key={label} href={`https://${label}`} target="_blank" rel="noreferrer"
              style={{fontSize:10,color:c,opacity:.5,textDecoration:"none"}}>{label} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
