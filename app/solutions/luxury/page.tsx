export default function SolutionsLuxury() {
  const stats = [
    { v: '92%', l: 'Counterfeit reduction in year 1' },
    { v: '40%', l: 'Increase in post-scan engagement' },
    { v: '2.1s', l: 'Global verification latency' },
    { v: 'L1', l: 'Ethereum-grade finality on Polygon' },
  ];
  
  const features = [
    { icon: '👜', t: 'Individual Item ID', d: 'Every luxury piece receives a unique blockchain digital twin. No two items share an identity.' },
    { icon: '📜', t: 'AI Provenance Stories', d: 'Generative narratives that tell the story of the item from craft to customer, increasing resale value.' },
    { icon: '🖼️', t: 'QRON Art Integration', d: 'Replace ugly square codes with stunning brand-aligned AI art that encodes the certificate.' },
    { icon: '🔔', t: 'Real-time Scan Alerts', d: 'Get notified via webhook the second a customer (or a bad actor) scans your product anywhere in the world.' },
    { icon: '💎', t: 'Collector Passports', d: 'Transfer ownership via NFT. Perfect for high-end watches, handbags, and fine art.' },
    { icon: '🛡️', t: 'Zero-Trust Verification', d: '5-agent AI consensus ensures even sophisticated counterfeiters cannot spoof the system.' },
  ];

  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'80px 32px',background:'#060608',color:'#e5e5e5',fontFamily:"'DM Mono',monospace",minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:80}}>
        <p style={{color:'#C9A227',fontWeight:900,letterSpacing:'.3em',fontSize:11,marginBottom:24,textTransform:'uppercase'}}>Theater 3 · Luxury</p>
        <h1 style={{fontSize:64,fontWeight:900,color:'#fff',lineHeight:0.9,marginBottom:24,textTransform:'uppercase',letterSpacing:'-0.04em'}}>Preserving <span style={{color:'#C9A227'}}>Legacy</span><br/>in the Digital Age</h1>
        <p style={{fontSize:20,color:'#666',maxWidth:640,margin:'0 auto 40px',lineHeight:1.6}}>Protect your heritage from the $500B counterfeit market. AuthiChain provides luxury brands with blockchain-sealed digital identities and cinematic provenance.</p>
        <div style={{display:'flex',gap:20,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/onboarding" style={{padding:'16px 36px',background:'#C9A227',color:'#000',fontWeight:900,textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase',letterSpacing:'.1em'}}>Secure Your Brand →</a>
          <a href="/api-docs" style={{padding:'16px 36px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase',letterSpacing:'.1em'}}>Developer API</a>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:80}}>
        {stats.map((s,i)=><div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,162,39,0.15)',borderRadius:20,padding:32,textAlign:'center'}}><div style={{fontSize:32,fontWeight:900,color:'#C9A227',marginBottom:8,letterSpacing:'-0.02em'}}>{s.v}</div><p style={{color:'#666',fontSize:10,margin:0,textTransform:'uppercase',fontWeight:800,letterSpacing:'.1em'}}>{s.l}</p></div>)}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32}}>
        {features.map((f,i)=><div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:24,padding:32}}><div style={{fontSize:32,marginBottom:20}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:12,fontSize:18,fontWeight:900,textTransform:'uppercase',letterSpacing:'-0.01em'}}>{f.t}</h3><p style={{color:'#666',fontSize:14,lineHeight:1.7}}>{f.d}</p></div>)}
      </div>

      <div style={{marginTop:100,padding:60,borderRadius:32,background:'#111',border:'1px solid rgba(255,255,255,0.05)',textAlign:'center'}}>
         <h2 style={{fontSize:32,fontWeight:900,marginBottom:24,textTransform:'uppercase'}}>See it in action</h2>
         <p style={{color:'#888',marginBottom:40}}>Hermès Birkin 35 Digital Twin Authentication</p>
         <a href="/verify?id=AC-HERM-LUX-MVLN4NH023" style={{padding:'14px 28px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:12,fontSize:14,fontWeight:900,textTransform:'uppercase',letterSpacing:'.1em'}}>Try Live Verification →</a>
      </div>
    </div>
  );
}
