import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EU Digital Product Passport Compliance — AuthiChain',
  description: 'AuthiChain enables EU Digital Product Passport (DPP) compliance via blockchain provenance. 2026-ready, ESPR-compliant, GDPR-compatible.',
}

export default function CompliancePage() {
  return (
    <main style={{background:'#060608',color:'#e5e5e5',minHeight:'100vh',fontFamily:"'DM Mono',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
      `}</style>
      <nav style={{padding:'20px 40px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <a href="/" style={{color:'#c9a227',fontWeight:900,fontSize:'1.1rem',letterSpacing:'.2em',textDecoration:'none',fontFamily:'Syne,sans-serif'}}>◆ AUTHICHAIN</a>
        <a href="/onboarding" style={{background:'#c9a227',color:'#000',padding:'8px 20px',borderRadius:8,fontSize:12,fontWeight:900,textDecoration:'none',textTransform:'uppercase'}}>Onboard Now</a>
      </nav>

      <div style={{maxWidth:1000,margin:'0 auto',padding:'100px 24px 60px',textAlign:'center'}}>
        <p style={{color:'#C9A227',fontWeight:900,letterSpacing:'.3em',fontSize:10,marginBottom:24,textTransform:'uppercase'}}>Theater 4 · Regulatory</p>
        <h1 style={{fontSize:'clamp(2.5rem,6vw,4rem)',fontWeight:900,lineHeight:0.9,marginBottom:28,textTransform:'uppercase',letterSpacing:'-0.03em',fontFamily:'Syne,sans-serif'}}>
          EU Digital Product Passport<br/>
          <span style={{color:'#c9a227'}}>Compliance, Decoded.</span>
        </h1>
        <p style={{color:'#666',fontSize:'1.2rem',lineHeight:1.6,marginBottom:48,maxWidth:750,margin:'0 auto 48px'}}>
          The 2026 mandate is here. AuthiChain provides the L1 truth layer for ESPR compliance — blockchain-anchored, machine-readable, and consumer-ready in minutes.
        </p>
        
        <div style={{background:'rgba(224,96,96,0.05)',border:'1px solid rgba(224,96,96,0.2)',borderRadius:20,padding:'24px 32px',maxWidth:700,margin:'0 auto 64px',display:'flex',gap:20,alignItems:'center',textAlign:'left'}}>
           <div style={{fontSize:32}}>⚠️</div>
           <div>
              <strong style={{color:'#e06060',textTransform:'uppercase',fontSize:12,letterSpacing:'.1em'}}>2026 Implementation Deadline</strong>
              <p style={{color:'#888',fontSize:13,lineHeight:1.5,marginTop:4}}>
                Textiles, electronics, and batteries require digital records by Q3 2026. Non-compliance results in immediate EU market exclusion.
              </p>
           </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginBottom:80}}>
           {[
             { t: 'ESPR Compliant', d: 'Full alignment with Eco-design for Sustainable Products Regulation.', i: '🇪🇺' },
             { t: 'Machine Readable', d: 'REST API & JSON-LD output for seamless ERP integration.', i: '🤖' },
             { t: 'GDPR Native', d: 'Zero-knowledge proofs ensure no personal data is stored on-chain.', i: '🔒' },
           ].map((v,i)=>(
             <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:24,padding:32}}>
                <div style={{fontSize:24,marginBottom:16}}>{v.i}</div>
                <h3 style={{fontSize:16,fontWeight:900,textTransform:'uppercase',marginBottom:12,fontFamily:'Syne,sans-serif'}}>{v.t}</h3>
                <p style={{fontSize:13,color:'#666',lineHeight:1.6}}>{v.d}</p>
             </div>
           ))}
        </div>

        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:80}}>
          <thead>
            <tr style={{textAlign:'left',fontSize:10,fontWeight:900,color:'#444',textTransform:'uppercase',letterSpacing:'.2em'}}>
              <th style={{padding:20,borderBottom:'1px solid #1a1a1a'}}>Requirement</th>
              <th style={{padding:20,borderBottom:'1px solid #1a1a1a'}}>AuthiChain Infrastructure</th>
              <th style={{padding:20,borderBottom:'1px solid #1a1a1a',textAlign:'right'}}>Status</th>
            </tr>
          </thead>
          <tbody style={{fontSize:13}}>
            {[
              ['Unique Item ID','ERC-721 NFT per batch — immutable, globally unique','✓ Active'],
              ['Immutable Ledger','Polygon L1 anchoring — prevents history tampering','✓ Active'],
              ['Circular Economy','Full recycled content & repairability tracking','✓ Active'],
              ['Public Verify','Zero-app QR scan for end consumers','✓ Active'],
              ['Auditor Access','Cryptographic proofs for regulatory review','✓ Active'],
            ].map(([req,sol,status],i)=>(
              <tr key={i}>
                <td style={{padding:20,borderBottom:'1px solid #111',color:'#aaa'}}>{req}</td>
                <td style={{padding:20,borderBottom:'1px solid #111',color:'#fff'}}>{sol}</td>
                <td style={{padding:20,borderBottom:'1px solid #111',textAlign:'right',color:'#22c55e',fontWeight:900}}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{background:'linear-gradient(135deg,rgba(201,162,39,0.05),rgba(6,6,8,1))',border:'1px solid rgba(201,162,39,0.2)',borderRadius:32,padding:80,textAlign:'center'}}>
          <h2 style={{fontSize:32,fontWeight:900,marginBottom:16,textTransform:'uppercase',fontFamily:'Syne,sans-serif'}}>Secure Your Market Access</h2>
          <p style={{color:'#666',marginBottom:40,maxWidth:500,margin:'0 auto 40px'}}>Join 20+ brands already using AuthiChain for EU DPP readiness.</p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
             <a href="/onboarding" style={{padding:'16px 36px',background:'#C9A227',color:'#000',fontWeight:900,textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase'}}>Start Program →</a>
             <a href="/api-docs" style={{padding:'16px 36px',border:'1px solid rgba(255,255,255,0.1)',color:'#fff',textDecoration:'none',borderRadius:12,fontSize:14,textTransform:'uppercase'}}>API Docs</a>
          </div>
        </div>
      </div>

      <footer style={{textAlign:'center',padding:40,color:'#222',fontSize:10,fontWeight:900,textTransform:'uppercase',letterSpacing:'.1em',borderTop:'1px solid #0a0a0a'}}>
        AuthiChain Compliance Hub · © 2026 · Built on Polygon
      </footer>
    </main>
  )
}
