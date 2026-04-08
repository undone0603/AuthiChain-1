export const metadata = {
  title: "Y Combinator S26 — AuthiChain",
  description: "AuthiChain YC S26 application. Blockchain product authentication."
}

const DAYS_LEFT = 3; // April 11 2026 deadline

export default function YCPage() {
  const qa = [
    ["Company tagline","Verifiable product authenticity in 2.1 seconds — blockchain provenance rails for every physical good."],
    ["What does it do","AuthiChain mints an ERC-721 NFT on Polygon for each product batch, generates an AI QR code, and confirms AUTHENTIC or COUNTERFEIT in 2.1 seconds via any smartphone camera. No app. No hardware. $0.004/seal vs $0.50+ RFID."],
    ["Why now","EU Digital Product Passport mandate 2026 — blockchain provenance legally required for all EU goods. CBP de minimis overhaul — new import authentication requirements. Polygon tx costs at $0.001 — blockchain seals viable at consumer scale. All three hit simultaneously."],
    ["Traction","1,023 blockchain certs on Polygon mainnet. Live API on RapidAPI. $47M ACV pipeline — 172 HubSpot deals across LVMH, BMW, Moderna, Hermès. 289+ enterprise emails, 26 batches, 18 sectors. DHS SVIP $800K applied. NFT collection live with 5 pieces ($480–$1,200). Infrastructure $0/month."],
    ["Founders","Zachary Kietzman — Sole Founder, Gaylord MI. Built AuthiChain, QRON, and StrainChain solo in 6 months. 41 Cloudflare Workers, 78 Supabase edge functions, 60+ CI/CD commits. Closes enterprise deals while shipping infrastructure simultaneously."],
  ];
  const s: React.CSSProperties = {background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",padding:"48px 24px",maxWidth:780,margin:"0 auto"};
  return (
    <main style={s}>
      <a href="/" style={{color:"#c9a227",textDecoration:"none",fontSize:13,fontWeight:600}}>{"← AuthiChain"}</a>
      <div style={{display:"flex",alignItems:"center",gap:14,margin:"24px 0 8px",flexWrap:"wrap" as const}}>
        <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:900,color:"#c9a227",margin:0}}>Y Combinator S26</h1>
        {DAYS_LEFT > 0 && (
          <div style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",color:"#ef4444",padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:700}}>
            {DAYS_LEFT} days left — April 11
          </div>
        )}
      </div>
      <p style={{color:"rgba(255,255,255,.4)",marginBottom:40}}>
        {"Submit at "}<a href="https://ycombinator.com/apply" target="_blank" rel="noreferrer" style={{color:"#c9a227"}}>{"ycombinator.com/apply ↗"}</a>
      </p>
      <div style={{display:"flex",flexDirection:"column" as const,gap:20}}>
        {qa.map(([q,a]) => (
          <div key={q} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(201,162,39,.12)",borderLeft:"3px solid #c9a227",borderRadius:12,padding:"20px 24px"}}>
            <div style={{fontSize:11,color:"rgba(201,162,39,.6)",fontWeight:700,textTransform:"uppercase" as const,letterSpacing:".08em",marginBottom:8}}>{q}</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,.8)",lineHeight:1.75}}>{a}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:40,padding:"28px",background:"rgba(201,162,39,.06)",border:"1.5px solid rgba(201,162,39,.25)",borderRadius:14,textAlign:"center" as const}}>
        <div style={{fontSize:16,fontWeight:700,color:"#c9a227",marginBottom:16}}>{"⚠️ One thing still needed"}</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:20,lineHeight:1.7}}>
          {"Record 2 minutes at "}<a href="/demo-video" style={{color:"#c9a227"}}>{"authichain.com/demo-video"}</a>
          <br/>{"Open Loom → Screen + Camera → ▶ Start → voice narrates automatically"}
        </div>
        <a href="/demo-video" style={{display:"inline-block",background:"#c9a227",color:"#000",padding:"12px 28px",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14}}>{"Open Demo Video →"}</a>
      </div>
    </main>
  );
}
