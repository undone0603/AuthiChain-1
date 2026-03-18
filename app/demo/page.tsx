"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import AIStoryPlayer from "@/components/ai-story-player";
import { z } from "zod";

// ------------------------------------------------------------
// ZOD SCHEMAS
// ------------------------------------------------------------

const ClassificationSchema = z.object({
  industry: z.string(),
  confidence: z.number(),
});

const WorkflowSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timestamp: z.string().optional(),
    })
  ),
});

const StorySchema = z.object({
  title: z.string(),
  duration: z.number(),
  transcriptSegments: z.array(
    z.object({
      text: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ------------------------------------------------------------
// PAGE COMPONENT
// ------------------------------------------------------------

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<z.infer<typeof StorySchema> | null>(null);
  const [classification, setClassification] = useState<
    z.infer<typeof ClassificationSchema> | null
  >(null);
  const [workflow, setWorkflow] = useState<z.infer<typeof WorkflowSchema> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/autoflow", {
        method: "POST",
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) {
        throw new Error(`AutoFlow error: ${res.status}`);
      }

      const json = await res.json();

      // Validate
      const parsedClassification = ClassificationSchema.parse(json.classification);
      const parsedWorkflow = WorkflowSchema.parse(json.workflow);
      const parsedStory = StorySchema.parse(json.story);

      setClassification(parsedClassification);
      setWorkflow(parsedWorkflow);
      setStory(parsedStory);
    } catch (err: any) {
      console.error("AutoFlow error:", err);
      setError(err.message || "Unknown error");
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto py-16 space-y-24">
      {/* Upload Section */}
      <section className="w-full flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">AutoFlow™ Story Generator</h2>

        <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/10">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </label>

        {loading && (
          <div className="mt-6 text-white/60 text-center">Processing…</div>
        )}

        {error && (
          <div className="mt-6 text-red-400 text-center">{error}</div>
        )}
      </section>

      {/* Story Player */}
      {story && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
          <AIStoryPlayer
            title={story.title}
            duration={story.duration}
            transcriptSegments={story.transcriptSegments}
            onDownload={() => alert("Download clicked!")}
          />
        </section>
      )}

      {/* Classification + Workflow */}
      {(classification || workflow) && (
        <section className="grid md:grid-cols-2 gap-6 mt-16 pt-16 border-t">
          {classification && (
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Classification</h3>
              <p className="text-3xl font-bold">{classification.industry}</p>
              <p className="text-white/60 mt-2">
                Confidence: {(classification.confidence * 100).toFixed(1)}%
              </p>
            </Card>
          )}

          {workflow && (
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold mb-2">Workflow</h3>
              {workflow.steps.map((step, i) => (
                <div key={i} className="border-b border-white/10 pb-3">
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-white/70 text-sm">{step.description}</div>
                </div>
              ))}
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
