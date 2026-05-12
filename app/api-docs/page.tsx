'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Terminal, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react'

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/verify',
    desc: 'Verify a product by ID (SKU, serial, or AC-ID).',
    example: 'curl https://authichain.com/api/v1/verify?id=PROD-123'
  },
  {
    method: 'POST',
    path: '/register',
    desc: 'Register a new product batch and mint metadata NFTs.',
    example: 'curl -X POST https://authichain.com/api/v1/register -d \'{"brand": "Acme"}\''
  },
  {
    method: 'GET',
    path: '/provenance',
    desc: 'Retrieve full supply chain event history for a product.',
    example: 'curl https://authichain.com/api/v1/provenance?id=PROD-123'
  }
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-xs overflow-x-auto text-zinc-300">
        {code}
      </pre>
      <button 
        onClick={copy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-900 border border-zinc-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-800"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-500" />}
      </button>
    </div>
  )
}

export default function DeveloperHub() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
               <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <span className="font-black uppercase tracking-widest text-sm">AuthiChain <span className="text-zinc-600">Dev</span></span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="#docs" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Documentation</Link>
             <Link href="#api" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">API Reference</Link>
             <Link href="/portal" className="btn-gold px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">Get API Key</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        {/* Hero */}
        <div className="max-w-3xl mb-24">
          <Badge className="bg-gold/10 text-gold border-gold/20 mb-6 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
            API-First Infrastructure
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
            The Truth Layer <span className="text-zinc-700">for Developers</span>
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed mb-10 max-w-2xl">
            Integrate blockchain-backed product authentication into any app in minutes. 
            No complex smart contract knowledge required. Just REST.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="btn-gold px-8 rounded-xl font-black uppercase text-xs tracking-widest">
              Create Developer Account
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900 px-8 rounded-xl font-black uppercase text-xs tracking-widest">
              Read Docs <ExternalLink className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rapid Integration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Verify in 2.1s</h2>
            <p className="text-zinc-500 mb-8 leading-relaxed">
              Our 5-agent AI consensus engine validates product provenance across multiple nodes. 
              Get cryptographic proof of authenticity with a single GET request.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Zap, t: 'Sub-millisecond Latency', d: 'Edge-optimized verification via Cloudflare.' },
                { icon: Globe, t: 'Cross-Chain Support', d: 'Anchored on Polygon/Base, readable everywhere.' },
                { icon: Cpu, t: 'IoT Ready', d: 'Native support for NFC chips and thermal seals.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm mb-1">{item.t}</h4>
                    <p className="text-xs text-zinc-600">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 bg-gold/5 blur-3xl rounded-full" />
             <div className="relative bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900 bg-zinc-900/50">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                   <span className="text-[10px] text-zinc-600 font-mono ml-2">verify_product.py</span>
                </div>
                <div className="p-6">
                   <CodeBlock code={`import requests

# Verify a luxury watch via AuthiChain API
response = requests.get(
  "https://authichain.com/api/v1/verify",
  params={"id": "AC-ROLEX-SUB-2026-X8"},
  headers={"X-API-Key": "your_test_key"}
)

data = response.json()
if data['authentic']:
    print(f"Verified! Trust Score: {data['trust_score']}")
    print(f"L1 Anchor: {data['blockchain']['txHash']}")`} />
                </div>
             </div>
          </div>
        </div>

        {/* API Reference Strip */}
        <div id="api" className="mb-32">
           <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Core Endpoints</h2>
              <Link href="/docs/rapidapi-openapi.yaml" className="text-xs text-gold flex items-center gap-2 hover:underline">
                 <BookOpen className="w-4 h-4" /> Download OpenAPI Spec
              </Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ENDPOINTS.map((ep, i) => (
                <Card key={i} className="bg-zinc-950 border-zinc-900 hover:border-gold/30 transition-all group">
                   <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                         <Badge className="bg-zinc-900 text-zinc-400 border-zinc-800 font-mono">
                            {ep.method}
                         </Badge>
                         <span className="text-xs font-mono text-zinc-700">{ep.path}</span>
                      </div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-300">
                         {ep.path.slice(1)}
                      </CardTitle>
                      <CardDescription className="text-xs text-zinc-500">
                         {ep.desc}
                      </CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                        <CodeBlock code={ep.example} />
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Bottom CTA */}
        <section className="relative rounded-[3rem] border border-zinc-900 bg-zinc-950 p-12 md:p-24 overflow-hidden text-center">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gold/10 blur-[120px] rounded-full" />
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
                 Start Building <br/> <span className="text-gold italic">The Authentic Economy</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                 <Button size="lg" className="btn-gold px-12 py-8 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl">
                    Get Free API Access
                 </Button>
                 <Button size="lg" variant="outline" className="border-zinc-800 bg-black hover:bg-zinc-900 px-12 py-8 rounded-2xl font-black uppercase text-sm tracking-[0.2em]">
                    Enterprise Setup
                 </Button>
              </div>
              <p className="mt-12 text-zinc-600 text-xs font-bold uppercase tracking-widest">
                 100 free verifications / month • No Credit Card • Scale as you grow
              </p>
           </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 py-12 bg-black">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <span className="font-black text-xs uppercase tracking-[0.3em] text-zinc-700">AuthiChain Protocol Hub</span>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
               <Link href="/terms" className="hover:text-white">Terms</Link>
               <Link href="/privacy" className="hover:text-white">Privacy</Link>
               <Link href="mailto:dev@authichain.com" className="hover:text-white">API Support</Link>
            </div>
         </div>
      </footer>
    </div>
  )
}
