import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EU Digital Product Passport Compliance — AuthiChain',
  description: 'AuthiChain enables EU Digital Product Passport (DPP) compliance via blockchain provenance. 2026-ready, ESPR-compliant, GDPR-compatible.',
}

export default function CompliancePage() {
  return (
    <main style={{background:'#0a0a0a',color:'#e5e5e5',minHeight:'100vh',fontFamily:'system-ui,sans-serif'}}>
      <nav style={{padding:'20px 40px',borderBottom:'1px solid rgba(201,162,39,.2)'}}>
        <a href="/" style={{color:'#c9a227',fontWeight:900,fontSize:'1.1rem',letterSpacing:'.1em',textDecoration:'none'}}>◆ AUTHICHAIN</a>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'72px 24px 48px',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'rgba(201,162,39,.12)',border:'1px solid rgba(201,162,39,.4)',color:'#c9a227',padding:'6px 18px',borderRadius:20,fontSize:'.8rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:28}}>
          EU Compliance Ready
        </div>
        <h1 style={{fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:900,lineHeight:1.1,marginBottom:20}}>
          EU Digital Product Passport<br/>
          <span style={{color:'#c9a227'}}>Compliance — Solved.</span>
        </h1>
        <p style={{color:'#888',fontSize:'1.1rem',lineHeight:1.7,marginBottom:48,maxWidth:700,margin:'0 auto 48px'}}>
          The EU Digital Product Passport mandate requires brands to provide tamper-proof digital records for every product by 2026. AuthiChain delivers this via blockchain provenance — already built, already live.
        </p>
        <div style={{background:'rgba(163,45,45,.12)',border:'1px solid rgba(163,45,45,.4)',borderRadius:12,padding:'20px 28px',maxWidth:620,margin:'0 auto 56px'}}>
          <strong style={{color:'#e06060'}}>⚠️ 2026 Implementation Deadlines Approaching</strong>
          <p style={{color:'#aaa',fontSize:'.9rem',lineHeight:1.6,margin:'8px 0 0'}}>
            EU DPP regulations under ESPR require digital product records for textiles, electronics, batteries, and high-value goods. Non-compliance risks exclusion from EU markets.
          </p>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px 56px'}}>
        <h2 style={{color:'#c9a227',fontSize:'1.5rem',fontWeight:700,marginBottom:8}}>What EU DPP Requires</h2>
        <p style={{color:'#666',marginBottom:40}}>Every product sold in the EU must carry a verifiable digital record</p>

        <table style={{width:'100%',borderCollapse:'collapse',marginBottom:56}}>
          <thead>
            <tr style={{background:'rgba(201,162,39,.1)'}}>
              {['Requirement','AuthiChain Solution','Status'].map(h=>(
                <th key={h} style={{textAlign:'left',padding:'12px 16px',color:'#c9a227',fontSize:'.8rem',textTransform:'uppercase',borderBottom:'1px solid rgba(201,162,39,.2)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Unique product identifier','ERC-721 NFT per batch — globally unique, Polygon blockchain','✓ Live'],
              ['Tamper-proof digital record','Immutable blockchain ledger — cannot be altered by any party','✓ Live'],
              ['Supply chain provenance','Full manufacturer → distributor → consumer chain on-ledger','✓ Live'],
              ['Consumer-accessible verification','QR scan → instant verify on any smartphone, no app required','✓ Live'],
              ['Machine-readable format','REST API (OpenAPI 3.0), JSON-LD, W3C DID compatible','✓ Live'],
              ['Long-term auditability','Blockchain records are permanent — no expiration, no deletion','✓ Live'],
              ['GDPR compatibility','Only cryptographic hashes on-chain — no personal data','✓ Live'],
            ].map(([req,sol,status],i)=>(
              <tr key={i} style={{background:i%2===0?'rgba(255,255,255,.02)':'transparent'}}>
                <td style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.05)',color:'#aaa',fontWeight:500}}>{req}</td>
                <td style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.05)',color:'#e5e5e5'}}>{sol}</td>
                <td style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,.05)',color:'#22c55e',fontWeight:700}}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{background:'linear-gradient(135deg,rgba(27,58,92,.6),rgba(10,10,10,.8))',border:'1px solid rgba(201,162,39,.3)',borderRadius:20,maxWidth:700,margin:'0 auto',padding:'52px 40px',textAlign:'center'}}>
          <h2 style={{fontSize:'1.8rem',fontWeight:900,marginBottom:14}}>Be <span style={{color:'#c9a227'}}>2026-Ready</span> Now</h2>
          <p style={{color:'#888',marginBottom:32,lineHeight:1.6}}>Implementation takes days, not months. AuthiChain integrates with existing ERP and PLM systems via REST API.</p>
          <a href="/portal" style={{display:'inline-block',background:'#c9a227',color:'#000',padding:'16px 36px',borderRadius:10,fontWeight:800,textDecoration:'none',margin:'0 8px 12px'}}>
            Start Compliance Program
          </a>
          <a href="mailto:z@authichain.com?subject=EU DPP Compliance" style={{display:'inline-block',background:'transparent',border:'2px solid #c9a227',color:'#c9a227',padding:'14px 32px',borderRadius:10,fontWeight:700,textDecoration:'none',margin:'0 8px 12px'}}>
            Talk to Us
          </a>
        </div>
      </div>

      <footer style={{textAlign:'center',padding:32,color:'#333',fontSize:'.8rem',borderTop:'1px solid #1a1a1a'}}>
        © 2026 AuthiChain, Inc. ·{' '}
        <a href="/" style={{color:'#444'}}>Home</a> ·{' '}
        <a href="/api/v1/health" style={{color:'#444'}}>Live API</a> ·{' '}
        <a href="mailto:z@authichain.com" style={{color:'#444'}}>z@authichain.com</a>
      </footer>
    </main>
  )
}
