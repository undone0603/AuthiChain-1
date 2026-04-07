import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EU Digital Product Passport Compliance — AuthiChain',
  description: 'AuthiChain enables EU Digital Product Passport (DPP) compliance for manufacturers and brands. Blockchain-verified provenance, tamper-proof digital records, 2026-ready.',
  alternates: { canonical: 'https://authichain.com/compliance' },
  openGraph: {
    title: 'EU DPP Compliance — AuthiChain',
    description: 'Be 2026-ready. AuthiChain delivers EU Digital Product Passport compliance via blockchain provenance.',
  },
};

const requirements = [
  ['Unique product identifier', 'ERC-721 NFT per batch — globally unique, on Polygon blockchain'],
  ['Tamper-proof digital record', 'Immutable blockchain ledger — cannot be altered by any party'],
  ['Supply chain provenance', 'Full manufacturer → distributor → consumer chain on-ledger'],
  ['Lifecycle data', 'Timestamped scan events, transfer history, cert issuance log'],
  ['Consumer-accessible verification', 'QR scan → instant verify on any smartphone, no app required'],
  ['Machine-readable format', 'REST API (OpenAPI 3.0), JSON-LD metadata, W3C DID compatible'],
  ['Long-term auditability', 'Blockchain records are permanent — no expiration, no deletion'],
];

const features = [
  { icon: '🔐', title: 'Cryptographic Immutability', body: 'Once written to Polygon, a product record cannot be altered, backdated, or deleted — by anyone. Mathematically provable, not policy-based.' },
  { icon: '⚡', title: '2.1-Second Verification', body: 'EU inspectors and consumers verify product authenticity in under 2.1 seconds via standard smartphone. No hardware required.' },
  { icon: '🌍', title: 'Cross-Border Trust', body: 'Polygon blockchain is globally accessible. Any EU customs authority, retailer, or consumer can verify provenance without relying on the manufacturer's own systems.' },
  { icon: '💶', title: '$0.004 Per Product', body: 'AuthiChain seals cost a fraction of RFID or NFC alternatives. Enterprise pricing available for high-volume manufacturing runs.' },
  { icon: '🔗', title: 'W3C DID Standard', body: 'AuthiChain uses W3C Decentralized Identifiers — the emerging global standard for verifiable credentials. Future-proof and interoperable.' },
  { icon: '📋', title: 'GDPR Compatible', body: 'Only cryptographic hashes are written to the blockchain — no personal data on-ledger. Sensitive product data stays in your systems.' },
];

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans">
      <nav className="px-10 py-5 flex items-center border-b border-[#c9a22720]">
        <a href="https://authichain.com" className="text-[#c9a227] font-black text-lg tracking-widest no-underline">◆ AUTHICHAIN</a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="inline-block bg-[#c9a22715] border border-[#c9a22760] text-[#c9a227] px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          EU Compliance Ready
        </span>
        <h1 className="text-5xl font-black leading-tight mb-5">
          EU Digital Product Passport<br />
          <span className="text-[#c9a227]">Compliance — Solved.</span>
        </h1>
        <p className="text-[#888] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          The EU DPP mandate requires brands to provide tamper-proof digital records for every product by 2026.
          AuthiChain delivers this via blockchain provenance — already built, already live.
        </p>
        <div className="bg-[#a32d2d18] border border-[#a32d2d60] rounded-xl px-8 py-5 max-w-2xl mx-auto text-sm leading-relaxed">
          <strong className="text-[#e06060]">⚠️ 2026 Implementation Deadlines Approaching</strong>
          <p className="text-[#aaa] mt-2">EU DPP regulations under the Ecodesign for Sustainable Products Regulation (ESPR) require digital product records for textiles, electronics, batteries, and high-value goods. Non-compliance risks exclusion from EU markets.</p>
        </div>
      </section>

      {/* Requirements Table */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-[#c9a227] mb-2">What EU DPP Requires</h2>
        <p className="text-[#666] text-sm mb-8">Every product sold in the EU must carry a verifiable digital record</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#c9a22715]">
                <th className="text-left text-[#c9a227] text-xs uppercase tracking-widest px-4 py-3 border-b border-[#c9a22730]">Requirement</th>
                <th className="text-left text-[#c9a227] text-xs uppercase tracking-widest px-4 py-3 border-b border-[#c9a22730]">AuthiChain Solution</th>
                <th className="text-left text-[#c9a227] text-xs uppercase tracking-widest px-4 py-3 border-b border-[#c9a22730]">Status</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map(([req, sol], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-[#ffffff05]' : ''}>
                  <td className="px-4 py-4 text-[#aaa] font-medium border-b border-[#ffffff08]">{req}</td>
                  <td className="px-4 py-4 text-[#ccc] border-b border-[#ffffff08]">{sol}</td>
                  <td className="px-4 py-4 border-b border-[#ffffff08]"><span className="text-[#22c55e] font-bold">✓ Live</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-[#c9a227] mb-2">Why Blockchain Is the Right Architecture</h2>
        <p className="text-[#666] text-sm mb-10">Traditional databases cannot meet EU DPP&apos;s tamper-proof requirements</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-[#111] border border-[#c9a22725] rounded-2xl p-7">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-base mb-3">{f.title}</h3>
              <p className="text-[#777] text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-br from-[#1b3a5c99] to-[#0a0a0a] border border-[#c9a22750] rounded-2xl px-10 py-14 text-center">
          <h2 className="text-3xl font-black mb-4">Be <span className="text-[#c9a227]">2026-Ready</span> Now</h2>
          <p className="text-[#888] mb-8 leading-relaxed">Implementation takes days, not months. AuthiChain&apos;s API integrates with existing ERP and PLM systems. Start your EU DPP compliance program before your competitors.</p>
          <a href="/portal" className="inline-block bg-[#c9a227] text-black font-black px-9 py-4 rounded-xl text-base mr-3 mb-3 hover:bg-[#e8c547] transition-colors">
            Start Compliance Program
          </a>
          <a href="mailto:z@authichain.com?subject=EU DPP Compliance Inquiry" className="inline-block border-2 border-[#c9a227] text-[#c9a227] font-black px-9 py-4 rounded-xl text-base mb-3 hover:bg-[#c9a22715] transition-colors">
            Talk to a Human
          </a>
          <p className="text-[#444] text-xs mt-5">Live API demo: authichain.com/api/v1/health</p>
        </div>
      </section>

      <footer className="text-center py-8 text-[#333] text-xs border-t border-[#1a1a1a]">
        © 2026 AuthiChain, Inc. &nbsp;·&nbsp;
        <a href="https://authichain.com" className="text-[#444]">Home</a> &nbsp;·&nbsp;
        <a href="https://authichain.com/api/v1/verify" className="text-[#444]">Live Verify</a> &nbsp;·&nbsp;
        <a href="mailto:z@authichain.com" className="text-[#444]">z@authichain.com</a>
      </footer>
    </main>
  );
}
