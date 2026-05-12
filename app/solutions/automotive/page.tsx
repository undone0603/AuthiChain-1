export const metadata = { title: 'AuthiChain for Automotive — OEM Parts Authentication', description: 'Stop counterfeit parts before they reach the assembly line. AuthiChain authenticates OEM components at manufacture, enabling dealers and consumers to verify instantly.' };
export default function AutomotivePage() {
  const stats = [
    { v: '$75B', l: 'Global counterfeit auto parts market annually' },
    { v: '26M', l: 'Fake auto parts installed in US vehicles each year' },
    { v: '500+', l: 'Deaths attributed to counterfeit airbags since 2009' },
    { v: '$299/mo', l: 'AuthiChain Starter — no $500K enterprise contract required' },
  ];
  const features = [
    { icon: '🏭', t: 'Manufacture-Point Registration', d: 'Each OEM part receives AUTHI-[BRAND]-AUT-* truemark at the production line. Batch API: 50 parts per call.' },
    { icon: '🔍', t: 'Dealer Verification', d: 'Service technicians scan the QR at the point of install. Guardian + Sentinel agents confirm authenticity in <200ms.' },
    { icon: '🤖', t: 'Scout Marketplace Monitor', d: 'Scout agent continuously scans eBay, Amazon, and aftermarket platforms for suspicious listings of your SKUs.' },
    { icon: '📊', t: 'Warranty Intelligence', d: 'Link part authentication to warranty claims. Sentinel detects grey-market parts, voiding fraudulent warranty submissions automatically.' },
    { icon: '🌍', t: 'Supply Chain Visibility', d: 'Archivist traces every part from tier-1 supplier → OEM → dealer → install event. Full chain of custody on Polygon.' },
    { icon: '⚡', t: 'Recall Intelligence', d: 'When a recall is issued, instantly identify all authenticated parts in the field. Reduce recall campaign cost by 40–60%.' },
  ];
  return (
    <div style={{maxWidth:1200,margin:'0 auto',padding:'80px 32px',background:'#060608',color:'#e5e5e5',fontFamily:"'DM Mono',monospace",minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:80}}>
        <p style={{color:'#C9A227',fontWeight:900,letterSpacing:'.3em',fontSize:11,marginBottom:24,textTransform:'uppercase'}}>Theater 3 · Automotive</p>
        <h1 style={{fontSize:64,fontWeight:900,color:'#fff',lineHeight:0.9,marginBottom:24,textTransform:'uppercase',letterSpacing:'-0.04em'}}>Securing the <span style={{color:'#C9A227'}}>Digital Twin</span><br/>of Every Component</h1>
        <p style={{fontSize:20,color:'#666',maxWidth:640,margin:'0 auto 40px',lineHeight:1.6}}>Blockchain-anchored OEM part authentication from the production line to the dealer bay. Stop counterfeits, simplify recalls, and protect consumers in 2.1 seconds.</p>
        <div style={{display:'flex',gap:20,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/onboarding" style={{padding:'16px 36px',background:'#C9A227',color:'#000',fontWeight:900,textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase',letterSpacing:'.1em'}}>Secure Your Fleet →</a>
          <a href="/api-docs" style={{padding:'16px 36px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase',letterSpacing:'.1em'}}>Developer API</a>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20,marginBottom:80}}>
        {stats.map((s,i)=><div key={i} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,162,39,0.15)',borderRadius:20,padding:32,textAlign:'center'}}><div style={{fontSize:32,fontWeight:900,color:'#C9A227',marginBottom:8,letterSpacing:'-0.02em'}}>{s.v}</div><p style={{color:'#666',fontSize:10,margin:0,textTransform:'uppercase',fontWeight:800,letterSpacing:'.1em'}}>{s.l}</p></div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32}}>
        {features.map((f,i)=><div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:24,padding:32}}><div style={{fontSize:32,marginBottom:20}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:12,fontSize:18,fontWeight:900,textTransform:'uppercase',letterSpacing:'-0.01em'}}>{f.t}</h3><p style={{color:'#666',fontSize:14,lineHeight:1.7}}>{f.d}</p></div>)}
      </div>
    </div>
  );
}
