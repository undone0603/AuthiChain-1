"use client";
export default function CollectionPage(){
  return(
    <div dangerouslySetInnerHTML={{__html:`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Voyage Bloom × NFT Collection</title>
<style>
:root{--gold:#FFD700;--dark:#070707;--mid:#111;--border:rgba(255,255,255,.07)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--dark);color:#e5e5e5;font-family:system-ui,sans-serif;min-height:100vh;overflow-x:hidden}

/* HEADER */
.header{padding:40px 24px 32px;text-align:center;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
.header::before{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:600px;height:200px;background:radial-gradient(ellipse,rgba(255,215,0,.12) 0%,transparent 70%);pointer-events:none}
.coll-label{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.3);margin-bottom:10px}
.coll-title{font-size:clamp(22px,5vw,44px);font-weight:900;color:var(--gold);letter-spacing:.06em;text-shadow:0 0 40px rgba(255,215,0,.3);margin-bottom:6px}
.coll-sub{font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px}
.stats{display:flex;gap:28px;justify-content:center;flex-wrap:wrap}
.stat{text-align:center}.stat-v{font-size:18px;font-weight:700;color:var(--gold)}.stat-l{font-size:10px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em;margin-top:2px}

/* GRID */
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;padding:28px;max-width:1400px;margin:0 auto}
@media(min-width:900px){
  .grid{grid-template-columns:repeat(3,1fr)}
  .featured{grid-column:span 2;grid-row:span 1}
}

/* CARD */
.card{background:var(--bg,#111);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s;cursor:pointer}
.card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 30px var(--accent,rgba(255,215,0,.2));border-color:var(--accent,rgba(255,215,0,.3))}
.card-art{position:relative;overflow:hidden;background:#000;aspect-ratio:1/1}
.featured .card-art{aspect-ratio:auto;height:440px}
.svg-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
.svg-wrap svg{width:100%;height:100%;display:block}
.card-badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,.75);border:1px solid var(--accent,#FFD700);color:var(--accent,#FFD700);font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:3px 9px;border-radius:4px;backdrop-filter:blur(4px)}
.art-score{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.7);color:#ec4899;font-size:8px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:4px;border:1px solid rgba(236,72,153,.3)}

/* META */
.card-meta{padding:14px 16px}
.card-name{font-size:14px;font-weight:800;color:#e5e5e5;letter-spacing:.05em;margin-bottom:2px}
.card-edition{font-size:10px;color:rgba(255,255,255,.35);font-family:monospace;margin-bottom:6px}
.card-origin{font-size:10px;color:var(--accent,#FFD700);margin-bottom:6px;font-weight:600}
.card-attrs{font-size:10px;color:rgba(255,255,255,.4);margin-bottom:6px;line-height:1.5}
.card-slogan{font-size:10px;font-style:italic;color:rgba(255,255,255,.3);margin-bottom:10px;line-height:1.5}
.card-footer{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.card-rarity{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:3px 9px;border-radius:4px;border:1px solid}
.card-floor{font-size:14px;font-weight:900;color:var(--gold)}
.sc-badge{font-size:9px;color:rgba(34,197,94,.6);font-weight:600}

/* FOOTER */
.footer{text-align:center;padding:28px;color:rgba(255,255,255,.15);font-size:11px;border-top:1px solid var(--border)}
.footer a{color:rgba(255,215,0,.4);text-decoration:none}
</style>
</head>
<body>
<div class="header">
  <div class="coll-label">Voyage Bloom × Dr. Dankenstein</div>
  <div class="coll-title">BAGIEZ / MYLES HIGH</div>
  <div class="coll-sub">Cannabis NFT Art Collection · StrainChain Verified · Polygon Mainnet</div>
  <div class="stats">
    <div class="stat"><div class="stat-v">5</div><div class="stat-l">Pieces</div></div>
    <div class="stat"><div class="stat-v">$3,820</div><div class="stat-l">Total Floor</div></div>
    <div class="stat"><div class="stat-v">89</div><div class="stat-l">Avg Art Score</div></div>
    <div class="stat"><div class="stat-v">Polygon</div><div class="stat-l">Chain</div></div>
    <div class="stat"><div class="stat-v">100%</div><div class="stat-l">SC Verified</div></div>
  </div>
</div>
<div class="grid">
<div class="card  featured" style="--accent:#3DF5B3;--bg:#0A1E2E;" data-idx="0">
  <div class="card-art">
    <div class="svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  
  <defs>
    <linearGradient id="cc-cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0A1E2E" />
      <stop offset="50%" stop-color="#1B3045" />
      <stop offset="100%" stop-color="#0A1E2E" />
    </linearGradient>
    <radialGradient id="cc-glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#3DF5B3" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#3DF5B3" stop-opacity="0" />
    </radialGradient>
    <filter id="cc-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  
  <rect width="800" height="800" fill="url(#cc-cosmicGradient)" />
  
  
  <g id="cc-stars">
    <circle cx="100" cy="100" r="2" fill="white" />
    <circle cx="200" cy="150" r="1.5" fill="white" />
    <circle cx="300" cy="90" r="2" fill="white" />
    <circle cx="400" cy="130" r="1" fill="white" />
    <circle cx="500" cy="200" r="1.5" fill="white" />
    <circle cx="600" cy="120" r="2" fill="white" />
    <circle cx="700" cy="180" r="1" fill="white" />
    <circle cx="150" cy="250" r="1.5" fill="white" />
    <circle cx="250" cy="220" r="1" fill="white" />
    <circle cx="350" cy="270" r="2" fill="white" />
    <circle cx="450" cy="320" r="1" fill="white" />
    <circle cx="550" cy="290" r="1.5" fill="white" />
    <circle cx="650" cy="350" r="2" fill="white" />
    <circle cx="750" cy="310" r="1" fill="white" />
    
    
    <circle cx="120" cy="330" r="3" fill="white" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="420" cy="210" r="3" fill="white" opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <circle cx="680" cy="280" r="3" fill="white" opacity="0.7">
      <animate attributeName="opacity" values="0.7;0.2;0.7" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="230" cy="400" r="3" fill="white" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3.5s" repeatCount="indefinite" />
    </circle>
  </g>

  
  <path d="M0,550 L100,500 L200,530 L300,480 L400,520 L500,470 L600,520 L700,490 L800,530 L800,800 L0,800 Z" fill="#152238" />
  
  
  <circle cx="400" cy="350" r="150" fill="url(#cc-glowGradient)" opacity="0.5" />

  
  <g filter="url(#cc-glow)">
    
    <ellipse cx="400" cy="370" rx="120" ry="35" fill="#D8D8D8" stroke="#212121" stroke-width="2" />
    
    
    <ellipse cx="400" cy="350" rx="80" ry="30" fill="#8c8c8c" stroke="#212121" stroke-width="2" />
    
    
    <ellipse cx="400" cy="330" rx="40" ry="25" fill="#3DF5B3" stroke="#212121" stroke-width="2" opacity="0.7" />
    
    
    <circle cx="340" cy="370" r="8" fill="#3DF5B3" opacity="0.9" />
    <circle cx="370" cy="375" r="8" fill="#3DF5B3" opacity="0.9" />
    <circle cx="400" cy="375" r="8" fill="#3DF5B3" opacity="0.9" />
    <circle cx="430" cy="375" r="8" fill="#3DF5B3" opacity="0.9" />
    <circle cx="460" cy="370" r="8" fill="#3DF5B3" opacity="0.9" />

    
    <path d="M370,370 L320,600 L480,600 L430,370" fill="#3DF5B3" opacity="0.3" />
  </g>

  
  <g id="cc-cookies">
    <circle cx="380" cy="480" r="30" fill="#C87137" />
    <circle cx="385" cy="475" r="5" fill="#341C0C" />
    <circle cx="370" cy="490" r="5" fill="#341C0C" />
    <circle cx="395" cy="495" r="5" fill="#341C0C" />
    <circle cx="375" cy="465" r="5" fill="#341C0C" />
    
    <circle cx="420" cy="530" r="25" fill="#C87137" />
    <circle cx="425" cy="525" r="4" fill="#341C0C" />
    <circle cx="415" cy="540" r="4" fill="#341C0C" />
    <circle cx="430" cy="545" r="4" fill="#341C0C" />
    <circle cx="410" cy="520" r="4" fill="#341C0C" />
    
    
    <rect x="385" cy="440" width="20" height="10" rx="3" fill="white" />
    <rect x="405" cy="500" width="15" height="8" rx="2" fill="white" />
  </g>

  
  <g id="cc-title" filter="url(#cc-glow)">
    <path id="cc-titleBanner" d="M200,110 Q400,70 600,110 Q600,140 400,160 Q200,140 200,110 Z" fill="#1B3045" stroke="#3DF5B3" stroke-width="3" />
    <text x="400" y="130" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="#3DF5B3" text-anchor="middle" filter="url(#cc-glow)">COSMIC COOKIE</text>
    
    <path id="cc-subtitleBanner" d="M250,650 Q400,620 550,650 Q550,670 400,690 Q250,670 250,650 Z" fill="#1B3045" stroke="#3DF5B3" stroke-width="3" />
    <text x="400" y="665" font-family="Arial, sans-serif" font-size="38" font-weight="bold" fill="#3DF5B3" text-anchor="middle" filter="url(#cc-glow)">COLLECTOR #042</text>
  </g>
  
  
  <g id="cc-metadata" transform="translate(30, 730)">
    <rect x="0" y="0" width="200" height="40" rx="5" fill="#0A1E2E" stroke="#3DF5B3" stroke-width="1" />
    <text x="10" y="25" font-family="Courier, monospace" font-size="14" fill="#3DF5B3">MINT: 0x42F...</text>
  </g>
</svg></div>
    <div class="card-badge">LEGENDARY</div>
    <div class="art-score">ArtGuard 94/100</div>
  </div>
  <div class="card-meta">
    <div class="card-name">COSMIC COOKIE</div>
    <div class="card-edition">Collector #042</div>
    <div class="card-origin">Exotic Genetix</div>
    <div class="card-attrs">Cookies · Mint · Chocolate</div>
    <div class="card-slogan">"Out of this world."</div>
    <div class="card-footer">
      <div class="card-rarity" style="color:#FFD700;border-color:#FFD70040;background:#FFD70012">LEGENDARY</div>
      <div class="card-floor">$1200</div>
    </div>
    <div class="sc-badge">🌿 StrainChain Verified</div>
  </div>
</div>
<div class="card" style="--accent:#71d16e;--bg:#1a2e1a;" data-idx="1">
  <div class="card-art">
    <div class="svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  
  <defs>
    <linearGradient id="wm-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b6b" />
      <stop offset="50%" stop-color="#9eff6b" />
      <stop offset="100%" stop-color="#6bfff7" />
    </linearGradient>
    <filter id="wm-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  
  <rect width="800" height="800" fill="url(#wm-bg-gradient)" opacity="0.8" />
  
  
  <g opacity="0.15">
    <path d="M0,0 h800 v800 h-800 z" fill="none" stroke="#ffffff" stroke-width="3" />
    <path d="M0,80 h800 M0,160 h800 M0,240 h800 M0,320 h800 M0,400 h800 M0,480 h800 M0,560 h800 M0,640 h800 M0,720 h800" stroke="#ffffff" stroke-width="1" />
    <path d="M80,0 v800 M160,0 v800 M240,0 v800 M320,0 v800 M400,0 v800 M480,0 v800 M560,0 v800 M640,0 v800 M720,0 v800" stroke="#ffffff" stroke-width="1" />
  </g>
  
  
  <rect x="120" y="120" width="560" height="560" rx="20" ry="20" fill="#ffffff" opacity="0.9" />
  
  
  <g transform="translate(150, 220)">
    <rect x="0" y="0" width="500" height="80" rx="10" ry="10" fill="#71d16e" />
    <text x="250" y="55" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff">WATERMELON ZMARTINI</text>
  </g>
  
  
  <g transform="translate(150, 320)">
    <text x="250" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#333333">(WATERMELON MIMOSA X ZOAP)</text>
  </g>
  
  
  <g transform="translate(150, 370)">
    <text x="250" y="0" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">ATTRIBUTES: SMARTIES, SOUR PATCH</text>
    <text x="250" y="30" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#333333">WATERMELON, AND IRISH SPRING</text>
  </g>
  
  
  <g transform="translate(400, 480)">
    
    <g transform="translate(-120, 0)">
      <path d="M0,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0" fill="#ff6b6b" />
      <path d="M10,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0" fill="#91f086" />
      <circle cx="35" cy="-15" r="5" fill="#222222" />
      <circle cx="65" cy="-15" r="5" fill="#222222" />
      <path d="M35,15 q15,20 30,0" fill="none" stroke="#222222" stroke-width="3" />
      <path d="M20,-15 l-10,-10 M80,-15 l10,-10" stroke="#91f086" stroke-width="3" />
    </g>
    
    
    <g transform="translate(70, 0)">
      <path d="M-20,-50 h40 v30 l25,50 a10,10 0 0,1 -90,0 l25,-50 z" fill="#f7f7f7" stroke="#444444" stroke-width="2" />
      <path d="M-15,-10 l30,0 l15,30 a30,30 0 0,1 -60,0 z" fill="#ff6b6b" opacity="0.8" />
      <circle cx="-5" cy="5" r="5" fill="#ffffff" opacity="0.7" />
      <circle cx="15" cy="-5" r="3" fill="#ffffff" opacity="0.7" />
      <circle cx="-10" cy="15" r="4" fill="#ffffff" opacity="0.7" />
      <circle cx="-5" cy="-25" r="5" fill="#222222" />
      <circle cx="5" cy="-25" r="5" fill="#222222" />
      <path d="M-5,-10 q10,10 10,0" fill="none" stroke="#222222" stroke-width="2" />
    </g>
  </g>
  
  
  <g transform="translate(400, 600)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-style="italic" font-size="18" text-anchor="middle" fill="#333333">"IN THE END, WE'RE ALL JUST LOOKING</text>
    <text x="0" y="25" font-family="Arial, sans-serif" font-style="italic" font-size="18" text-anchor="middle" fill="#333333">FOR A SPARK."</text>
  </g>
  
  
  <g transform="translate(400, 680)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#444444">VOYAGE BLOOM EXCLUSIVE • NFT #000665</text>
  </g>
  
  
  <rect x="120" y="120" width="560" height="560" rx="20" ry="20" fill="none" stroke="#71d16e" stroke-width="5" />
  
  
  <g transform="translate(600, 220)">
    <rect x="-75" y="-25" width="150" height="50" rx="5" ry="5" fill="#71d16e" />
    <text x="0" y="5" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#ffffff">DR. DANKENSTEIN</text>
  </g>
  
  
  <g filter="url(#wm-glow)">
    <path d="M150,100 h80 l15,40 h-110 z" fill="#ffd700" />
    <text x="190" y="125" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#333333">NFT</text>
  </g>

  
  <g transform="translate(700, 700)" opacity="0.3">
    <path d="M0,0 l-20,-40 l-10,0 l-10,-20 l-15,0 l-10,-20" fill="none" stroke="#444444" stroke-width="3" />
    <circle cx="-20" cy="-40" r="5" fill="none" stroke="#444444" stroke-width="1" />
    <circle cx="-40" cy="-60" r="5" fill="none" stroke="#444444" stroke-width="1" />
    <circle cx="-65" cy="-80" r="5" fill="none" stroke="#444444" stroke-width="1" />
  </g>
</svg></div>
    <div class="card-badge">RARE</div>
    <div class="art-score">ArtGuard 87/100</div>
  </div>
  <div class="card-meta">
    <div class="card-name">WATERMELON ZMARTINI</div>
    <div class="card-edition">#000665</div>
    <div class="card-origin">Dr. Dankenstein × Voyage Bloom</div>
    <div class="card-attrs">Smarties · Sour Patch Watermelon · Irish Spring</div>
    <div class="card-slogan">"In the end, we're all just looking for a spark."</div>
    <div class="card-footer">
      <div class="card-rarity" style="color:#22c55e;border-color:#22c55e40;background:#22c55e12">RARE</div>
      <div class="card-floor">$580</div>
    </div>
    <div class="sc-badge">🌿 StrainChain Verified</div>
  </div>
</div>
<div class="card" style="--accent:#f48fb1;--bg:#2a1040;" data-idx="2">
  <div class="card-art">
    <div class="svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  
  <defs>
    <linearGradient id="jr-bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9575cd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7e57c2;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="jr-jellyGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#f48fb1;stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:#f48fb1;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  
  <rect width="800" height="800" fill="url(#jr-bgGradient)"/>
  
  
  <circle cx="400" cy="400" r="200" fill="url(#jr-jellyGlow)">
    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
  </circle>
  
  
  <path d="M300 250 L300 550 C300 600 500 600 500 550 L500 250 Z" fill="#e8eaf6" opacity="0.7" stroke="#7986cb" stroke-width="5"/>
  
  
  <path d="M290 250 L510 250 L510 230 L290 230 Z" fill="#ef5350" stroke="#c62828" stroke-width="3"/>
  <ellipse cx="400" cy="230" rx="110" ry="15" fill="#ef5350" stroke="#c62828" stroke-width="3"/>
  
  
  <path d="M320 270 L320 520 C320 560 480 560 480 520 L480 270 Z" fill="#f48fb1" opacity="0.9">
    <animate attributeName="d" 
             values="M320 270 L320 520 C320 560 480 560 480 520 L480 270 Z;
                     M320 270 L320 520 C320 565 480 565 480 520 L480 270 Z;
                     M320 270 L320 520 C320 560 480 560 480 520 L480 270 Z" 
             dur="6s" 
             repeatCount="indefinite"/>
  </path>
  
  
  <circle cx="360" cy="350" r="15" fill="#aed581" opacity="0.9" />
  <circle cx="420" cy="380" r="20" fill="#aed581" opacity="0.9" />
  <circle cx="380" cy="450" r="18" fill="#aed581" opacity="0.9" />
  <circle cx="440" cy="470" r="12" fill="#aed581" opacity="0.9" />
  <circle cx="350" cy="420" r="10" fill="#aed581" opacity="0.9" />
  
  
  <ellipse cx="370" cy="380" rx="20" ry="25" fill="white" stroke="#7986cb" stroke-width="2">
    <animate attributeName="ry" values="25;20;25" dur="5s" repeatCount="indefinite" />
  </ellipse>
  <ellipse cx="430" cy="380" rx="20" ry="25" fill="white" stroke="#7986cb" stroke-width="2">
    <animate attributeName="ry" values="25;20;25" dur="5s" repeatCount="indefinite" />
  </ellipse>
  
  
  <circle cx="370" cy="380" r="8" fill="#333">
    <animate attributeName="cy" values="380;375;380" dur="5s" repeatCount="indefinite" />
  </circle>
  <circle cx="430" cy="380" r="8" fill="#333">
    <animate attributeName="cy" values="380;375;380" dur="5s" repeatCount="indefinite" />
  </circle>
  
  
  <circle cx="345" cy="415" r="15" fill="#e91e63" opacity="0.5" />
  <circle cx="455" cy="415" r="15" fill="#e91e63" opacity="0.5" />
  
  
  <path d="M370 440 Q400 470 430 440" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round">
    <animate attributeName="d" 
             values="M370 440 Q400 470 430 440;
                     M370 445 Q400 480 430 445;
                     M370 440 Q400 470 430 440" 
             dur="6s" 
             repeatCount="indefinite"/>
  </path>
  
  <rect x="385" y="440" width="10" height="10" fill="white" rx="2" ry="2" />
  <rect x="405" y="440" width="10" height="10" fill="white" rx="2" ry="2" />
  
  
  <circle cx="330" cy="300" r="4" fill="#f8bbd0" opacity="0.8">
    <animate attributeName="cy" values="300;310;300" dur="4s" repeatCount="indefinite" />
  </circle>
  <circle cx="470" cy="330" r="5" fill="#f8bbd0" opacity="0.8">
    <animate attributeName="cy" values="330;340;330" dur="5s" repeatCount="indefinite" />
  </circle>
  <circle cx="360" cy="500" r="6" fill="#f8bbd0" opacity="0.8">
    <animate attributeName="cy" values="500;510;500" dur="6s" repeatCount="indefinite" />
  </circle>
  <circle cx="440" cy="510" r="3" fill="#f8bbd0" opacity="0.8">
    <animate attributeName="cy" values="510;520;510" dur="3.5s" repeatCount="indefinite" />
  </circle>
  
  
  <text x="400" y="630" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">JARED #001</text>
  
  
  <text x="400" y="670" font-family="Arial, sans-serif" font-size="18" fill="#e0e0e0" text-anchor="middle">ATTRIBUTES: GRAPE JELLO, KIWI, AND TIRES</text>
  <text x="400" y="700" font-family="Arial, sans-serif" font-size="18" fill="#e0e0e0" text-anchor="middle">ORIGIN: HUMBOLDT SEED COMPANY</text>
  
  
  <text x="400" y="130" font-family="Arial, sans-serif" font-size="24" font-style="italic" fill="white" text-anchor="middle">"ROLL WITH THE BEST–YOU CAN'T SQUASH THIS VIBE."</text>
</svg></div>
    <div class="card-badge">EPIC</div>
    <div class="art-score">ArtGuard 91/100</div>
  </div>
  <div class="card-meta">
    <div class="card-name">JARED</div>
    <div class="card-edition">#001</div>
    <div class="card-origin">Humboldt Seed Company</div>
    <div class="card-attrs">Grape Jello · Kiwi · Tires</div>
    <div class="card-slogan">"Roll with the best — you can't squash this vibe."</div>
    <div class="card-footer">
      <div class="card-rarity" style="color:#a78bfa;border-color:#a78bfa40;background:#a78bfa12">EPIC</div>
      <div class="card-floor">$840</div>
    </div>
    <div class="sc-badge">🌿 StrainChain Verified</div>
  </div>
</div>
<div class="card" style="--accent:#90caf9;--bg:#0d1929;" data-idx="3">
  <div class="card-art">
    <div class="svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  
  <defs>
    <linearGradient id="bb-bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#213355" />
      <stop offset="100%" stop-color="#14213d" />
    </linearGradient>
    
    
    <linearGradient id="bb-diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f7fa" />
      <stop offset="20%" stop-color="#bbdefb" />
      <stop offset="40%" stop-color="#90caf9" />
      <stop offset="60%" stop-color="#81d4fa" />
      <stop offset="80%" stop-color="#b3e5fc" />
      <stop offset="100%" stop-color="#e1f5fe" />
    </linearGradient>
    
    
    <filter id="bb-smoke" x="-50%" y="-50%" width="200%" height="200%">
      <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
  
  
  <rect width="800" height="800" fill="url(#bb-bgGradient)" />
  
  
  <circle cx="400" cy="400" r="300" fill="none" stroke="#FFD700" stroke-width="2" opacity="0.3" />
  <circle cx="400" cy="400" r="250" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.2" />
  
  
  <path d="M0 650 L150 550 L300 620 L450 520 L600 600 L750 530 L800 550 L800 800 L0 800 Z" fill="#5D4037" opacity="0.7" />
  
  
  <circle cx="200" cy="650" r="30" fill="#3F51B5" opacity="0.7" />
  <circle cx="250" cy="670" r="25" fill="#3F51B5" opacity="0.8" />
  <circle cx="180" cy="690" r="20" fill="#3F51B5" opacity="0.6" />
  
  
  <g transform="translate(400, 350)">
    
    <path d="M0 -150 L120 0 L0 150 L-120 0 Z" fill="url(#bb-diamondGradient)" stroke="#FFFFFF" stroke-width="3" />
    <path d="M0 -150 L120 0 L0 0 Z" fill="#FFFFFF" opacity="0.6" />
    <path d="M0 0 L-120 0 L0 150 Z" fill="#FFFFFF" opacity="0.3" />
    <path d="M0 0 L120 0 L0 150 Z" fill="#90CAF9" opacity="0.5" />
    
    
    <circle cx="-40" cy="-20" r="15" fill="#000000" />
    <circle cx="40" cy="-20" r="15" fill="#000000" />
    <circle cx="-40" cy="-20" r="5" fill="#FFFFFF" />
    <circle cx="40" cy="-20" r="5" fill="#FFFFFF" />
    
    
    <path d="M-50 30 Q0 80 50 30" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round" />
  </g>
  
  
  <g filter="url(#bb-smoke)" opacity="0.3">
    <path d="M300 300 Q400 200 500 300 T700 300" fill="none" stroke="#FFFFFF" stroke-width="10" />
    <path d="M300 320 Q400 220 500 320 T700 320" fill="none" stroke="#FFFFFF" stroke-width="8" />
    <path d="M300 340 Q400 240 500 340 T700 340" fill="none" stroke="#FFFFFF" stroke-width="6" />
  </g>
  
  
  <circle cx="600" cy="650" r="20" fill="#F06292" />
  <circle cx="650" cy="670" r="15" fill="#BA68C8" />
  <circle cx="630" cy="620" r="18" fill="#4CAF50" />
  
  
  <text x="400" y="550" font-family="Arial, sans-serif" font-weight="bold" font-size="40" fill="#FFFFFF" text-anchor="middle">BLING BLAOW</text>
  
  
  <text x="400" y="600" font-family="Arial, sans-serif" font-size="20" fill="#FFD700" text-anchor="middle">DIESEL · BLUEBERRIES · CANDY</text>
  
  
  <text x="400" y="650" font-family="Arial, sans-serif" font-style="italic" font-size="24" fill="#FFFFFF" text-anchor="middle">"PUFF, PUFF, FACET"</text>
  
  
  <text x="400" y="720" font-family="Arial, sans-serif" font-size="16" fill="#CCCCCC" text-anchor="middle">ORIGIN: COMPOUND GENETICS</text>
  <text x="400" y="750" font-family="Arial, sans-serif" font-size="16" fill="#CCCCCC" text-anchor="middle">A VOYAGE BLOOM EXCLUSIVE</text>
</svg></div>
    <div class="card-badge">EPIC</div>
    <div class="art-score">ArtGuard 89/100</div>
  </div>
  <div class="card-meta">
    <div class="card-name">BLING BLAOW</div>
    <div class="card-edition">Voyage Bloom Exclusive</div>
    <div class="card-origin">Compound Genetics</div>
    <div class="card-attrs">Diesel · Blueberries · Candy</div>
    <div class="card-slogan">"Puff, puff, facet."</div>
    <div class="card-footer">
      <div class="card-rarity" style="color:#a78bfa;border-color:#a78bfa40;background:#a78bfa12">EPIC</div>
      <div class="card-floor">$720</div>
    </div>
    <div class="sc-badge">🌿 StrainChain Verified</div>
  </div>
</div>
<div class="card" style="--accent:#84ffff;--bg:#1a1a1a;" data-idx="4">
  <div class="card-art">
    <div class="svg-wrap"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  
  <rect width="800" height="800" fill="#2d2d2d"/>
  
  
  <circle cx="400" cy="400" r="250" fill="#84ffff" opacity="0.15"/>
  
  
  <path d="M280 500 Q400 200 520 500 Z" fill="#444" stroke="#333" stroke-width="5"/>
  
  
  <path d="M300 480 Q400 220 500 480 Z" fill="none" stroke="#ff5722" stroke-width="30"/>
  <path d="M320 460 Q400 240 480 460 Z" fill="none" stroke="#ffeb3b" stroke-width="30"/>
  <path d="M340 440 Q400 260 460 440 Z" fill="none" stroke="#8bc34a" stroke-width="30"/>
  <path d="M360 420 Q400 280 440 420 Z" fill="none" stroke="#03a9f4" stroke-width="30"/>
  <path d="M380 400 Q400 300 420 400 Z" fill="none" stroke="#9c27b0" stroke-width="30"/>
  
  
  <rect x="370" y="500" width="60" height="40" fill="#8d6e63" stroke="#5d4037" stroke-width="3" rx="5" ry="5"/>
  <line x1="370" y1="500" x2="310" y2="480" stroke="#795548" stroke-width="2"/>
  <line x1="430" y1="500" x2="490" y2="480" stroke="#795548" stroke-width="2"/>
  
  
  <circle cx="400" cy="350" r="70" fill="#fffde7"/>
  
  
  <rect x="320" y="350" width="160" height="15" fill="#ffca28" rx="5" ry="5"/>
  
  
  <ellipse cx="360" cy="350" rx="30" ry="25" fill="none" stroke="#ff6f00" stroke-width="5"/>
  <ellipse cx="440" cy="350" rx="30" ry="25" fill="none" stroke="#ff6f00" stroke-width="5"/>
  <ellipse cx="360" cy="350" rx="25" ry="20" fill="#b3e5fc"/>
  <ellipse cx="440" cy="350" rx="25" ry="20" fill="#b3e5fc"/>
  
  
  <ellipse cx="360" cy="350" rx="10" ry="15" fill="#333"/>
  <ellipse cx="440" cy="350" rx="10" ry="15" fill="#333"/>
  <circle cx="365" cy="345" r="3" fill="white"/>
  <circle cx="445" cy="345" r="3" fill="white"/>
  
  
  <path d="M370 380 Q400 410 430 380" fill="none" stroke="#333" stroke-width="5" stroke-linecap="round"/>
  
  
  <path d="M320 400 Q300 420 280 410" fill="none" stroke="#fffde7" stroke-width="8" stroke-linecap="round"/>
  <path d="M480 400 Q500 420 520 410" fill="none" stroke="#fffde7" stroke-width="8" stroke-linecap="round"/>
  
  
  <polygon points="400,580 430,620 400,660 370,620" fill="#84ffff" stroke="#4dd0e1" stroke-width="2">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
  </polygon>
  
  
  <circle cx="400" cy="570" r="5" fill="white">
    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="440" cy="620" r="3" fill="white">
    <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="400" cy="670" r="4" fill="white">
    <animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="0.7s" repeatCount="indefinite"/>
  </circle>
  <circle cx="360" cy="620" r="3" fill="white">
    <animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="1.1s" repeatCount="indefinite"/>
  </circle>
  
  
  <text x="400" y="730" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">MYLES HIGH #001</text>
  
  
  <text x="400" y="770" font-family="Arial, sans-serif" font-size="18" fill="#bbbbbb" text-anchor="middle">ATTRIBUTES: SKITTLES AND GAS | ORIGIN: FIYA FARMER</text>
  
  
  <text x="400" y="100" font-family="Arial, sans-serif" font-size="24" font-style="italic" fill="white" text-anchor="middle">"PREZZURE MAKES DIAMONDS"</text>
</svg></div>
    <div class="card-badge">RARE</div>
    <div class="art-score">ArtGuard 85/100</div>
  </div>
  <div class="card-meta">
    <div class="card-name">MYLES HIGH</div>
    <div class="card-edition">#001</div>
    <div class="card-origin">Fiya Farmer</div>
    <div class="card-attrs">Skittles · Gas</div>
    <div class="card-slogan">"Prezzure makes diamonds."</div>
    <div class="card-footer">
      <div class="card-rarity" style="color:#22c55e;border-color:#22c55e40;background:#22c55e12">RARE</div>
      <div class="card-floor">$480</div>
    </div>
    <div class="sc-badge">🌿 StrainChain Verified</div>
  </div>
</div></div>
<div class="footer">
  <a href="https://strainchain.io">strainchain.io</a> · <a href="https://authichain.com">authichain.com</a> · <a href="https://qron.space">qron.space</a><br>
  All pieces authenticated by StrainChain TRUmark · ArtGuard validated · BTC Ordinal anchored
</div>
</body></html>` }}/>
  );
}
