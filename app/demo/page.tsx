"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import AIStoryPlayer from "@/components/ai-story-player";
import { sampleTranscript } from "@/components/ai-story-player/sample-transcript";

// ------------------------------------------------------------
// CINEMATIC CAROUSEL
// ------------------------------------------------------------

const industries = [
  { title: "Agriculture", confidence: 0.92, preview: "Optimizing crop authenticity and supply chain trust." },
  { title: "Cannabis", confidence: 0.89, preview: "Strain verification and compliant retail provenance." },
  { title: "Pharmaceuticals", confidence: 0.94, preview: "Batch-level traceability and anti-counterfeit validation." },
  { title: "Luxury Goods", confidence: 0.91, preview: "Authenticating high‑value items with digital provenance." },
  { title: "Electronics", confidence: 0.87, preview: "Component‑level verification and warranty integrity." },
  { title: "Food & Beverage", confidence: 0.90, preview: "Ingredient origin tracking and fraud prevention." },
  { title: "Logistics", confidence: 0.85, preview: "Chain‑of‑custody automation and real‑time verification." },
  { title: "Cosmetics", confidence: 0.88, preview: "Formula authenticity and retail compliance." },
  { title: "Supplements", confidence: 0.89, preview: "Ingredient verification and regulatory alignment." },
  { title: "Apparel", confidence: 0.86, preview: "Brand authenticity and resale provenance." },
];

function CinematicCarousel() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hoverRef = useRef(false);

  const next = () => setIndex((prev) => (prev + 1) % industries.length);
  const prev = () => setIndex((prev) => (prev - 1 + industries.length) % industries.length);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!hoverRef.current) next();
    }, 4000);

    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  return (
    <section
      className="relative w-full flex flex-col items-center py-20 select-none"
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
    >
      <h2 className="text-3xl font-bold text-center mb-12">
        Industries AutoFlow™ Understands Instantly
      </h2>

      <div className="relative w-full max-w-4xl overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {industries.map((item, i) => (
            <div key={i} className="min-w-full px-8 flex flex-col items-center text-center">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-xl">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 mb-4">{item.preview}</p>
                <div className="text-sm font-mono text-white/60">
                  Confidence: {(item.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full"
        >
          ›
        </button>
      </div>

      <div className="flex gap-2 mt-6">
        {industries.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "bg-white w-6" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// LIVE CLASSIFICATION DEMO
// ------------------------------------------------------------

function LiveClassificationDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const classify = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Classification error:", err);
    }

    setLoading(false);
  };

  return (
    <section className="w-full py-20 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center mb-10">
        Live Industry Classification
      </h2>

      <div className="w-full max-w-3xl space-y-6">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            classify(e.target.value);
          }}
          placeholder="Paste product description, SKU text, or supply chain notes..."
          className="w-full h-40 p-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        />

        <div className="flex justify-center">
          <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/10">
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const text = await file.text();
                setInput(text);
                classify(text);
              }}
            />
          </label>
        </div>

        {loading && <div className="text-center text-white/60">Classifying…</div>}

        {result && !loading && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <h3 className="text-xl font-semibold text-center">Classification Result</h3>

            <div className="text-center text-3xl font-bold">{result.industry}</div>

            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-400 h-full transition-all"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

            <div className="text-center text-white/60 text-sm">
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">AutoFlow™ Preview</h4>
              <p className="text-white/70 text-sm">
                {result.autoflow_preview ||
                  "AutoFlow reasoning will appear here once connected to your pipeline."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// PAGE LAYOUT
// ------------------------------------------------------------

export default function DemoPage() {
  return (
    <div className="container mx-auto py-16 space-y-24">

      {/* Cinematic Carousel */}
      <CinematicCarousel />

      {/* Live Classification Demo */}
      <LiveClassificationDemo />

      {/* AI Story Player */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">AI Story Player</h2>
          <p className="text-muted-foreground">
            Interactive audio storytelling with synchronized transcripts and waveform visualization
          </p>
        </div>

        <AIStoryPlayer
          title="The Journey of Your Organic Spinach"
          duration={59}
          transcriptSegments={sampleTranscript}
          onDownload={() => alert("Download clicked!")}
        />
      </section>

      {/* Usage Instructions */}
      <section className="mt-16 pt-16 border-t space-y-6">
        <h2 className="text-2xl font-bold">Usage Instructions</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Product Classification Card</h3>
            <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
              @/components/product-classification-card
            </code>
            <p className="text-sm text-muted-foreground">
              Import and use with category tree, confidence score, and detected features data.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Seed-to-Sale Timeline</h3>
            <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
              @/components/seed-to-sale-timeline
            </code>
            <p className="text-sm text-muted-foreground">
              Import and provide an array of checkpoints with blockchain verification data.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">AI Story Player</h3>
            <code className="text-xs bg-muted px-2 py-1 rounded block mb-2">
              @/components/ai-story-player
            </code>
            <p className="text-sm text-muted-foreground">
              Import and provide transcript segments with timing for auto-sync functionality.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
