export default function ProductHuntPage(){
  const features = [
    {icon:"🔗",t:"Blockchain Certificate",d:"ERC-721 NFT on Polygon per product batch. $0.004. Immutable."},
    {icon:"⬡",t:"AI QR Art (QRON)",d:"AI-generated QR codes that are scannable art — unique, branded, alive."},
    {icon:"📱",t:"2.1 Second Verify",d:"Any smartphone. No app. AUTHENTIC or COUNTERFEIT — instant."},
    {icon:"🌿",t:"StrainChain",d:"Cannabis: COA hash, METRC sync, seed-to-sale on-chain, packaging art NFTs."},
    {icon:"🎨",t:"ArtGuard",d:"Packaging art authenticated as collectible NFTs with dual value layer."},
    {icon:"🌍",t:"EU DPP Ready",d:"Blockchain provenance required for all EU imports by 2026. We're the layer."},
  ]
  return(
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      <style>{".ph-btn:hover{opacity:.85;transform:scale(1.02);} .feat-card:hover{border-color:rgba(201,162,39,.5)!important;background:rgba(201,162,39,.06)!important;}"}</style>
      <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px"}}>
        <a href="/" style={{color:"#c9a227",textDecoration:"none",fontSize:13,fontWeight:600}}>← AuthiChain</a>
        <div style={{textAlign:"center",padding:"48px 0 40px"}}>
          <div style={{fontSize:48,marginBottom:16}}>🔗</div>
          <h1 style={{fontSize:"clamp(28px,6vw,52px)",fontWeight:900,marginBottom:12,color:"#c9a227"}}>AuthiChain</h1>
          <p style={{fontSize:18,color:"rgba(255,255,255,.5)",maxWidth:500,margin:"0 auto 32px",lineHeight:1.7}}>
            Blockchain product authentication in 2.1 seconds. Any product. Any smartphone. No hardware.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://www.producthunt.com/posts/authichain" target="_blank" rel="noreferrer"
              className="ph-btn"
              style={{background:"#FF6154",color:"#fff",padding:"13px 28px",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14,display:"flex",alignItems:"center",gap:8,transition:"all .2s"}}>
              ▲ Upvote on Product Hunt
            </a>
            <a href="/demo-video" style={{border:"1px solid rgba(201,162,39,.4)",color:"#c9a227",padding:"13px 24px",borderRadius:10,textDecoration:"none",fontSize:14,transition:"all .2s"}}>
              Watch Demo ↗
            </a>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginBottom:48}}>
          {features.map(({icon,t,d})=>(
            <div key={t} className="feat-card" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(201,162,39,.12)",borderRadius:12,padding:"18px 16px",transition:"all .2s"}}>
              <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
              <div style={{fontWeight:700,color:"#c9a227",marginBottom:4,fontSize:13}}>{t}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",padding:"32px",background:"rgba(201,162,39,.06)",border:"1px solid rgba(201,162,39,.2)",borderRadius:14}}>
          <div style={{fontSize:14,color:"rgba(255,255,255,.5)",marginBottom:20,lineHeight:1.8}}>
            Built solo · 6 months · $0 raised · 1,023+ blockchain certs on Polygon mainnet<br/>
            DHS SVIP $800K applied · Y Combinator S26 applicant · 320+ enterprise emails sent
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            {[["authichain.com","#c9a227"],["qron.space","#84cc16"],["strainchain.io","#22c55e"]].map(([url,c])=>(
              <a key={url} href={`https://${url}`} target="_blank" rel="noreferrer"
                style={{color:c,textDecoration:"none",fontSize:13,fontWeight:600}}>{url} ↗</a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
