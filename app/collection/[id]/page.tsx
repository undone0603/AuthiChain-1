import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type NFTStory = {
  id: string;
  name: string;
  sub: string;
  origin: string;
  attrs: string;
  slogan: string;
  rarity: "LEGENDARY" | "EPIC" | "RARE";
  score: number;
  floor: number;
  svg: string;
  stripe: string;
  story: {
    title: string;
    chapters: { heading: string; content: string }[];
    timeline: { date: string; event: string }[];
  };
};

const NFT_STORIES: Record<string, NFTStory> = {
  "nft-design": {
    id: "nft-design",
    name: "COSMIC COOKIE",
    sub: "Collector #042",
    origin: "Exotic Genetix",
    attrs: "Cookies · Mint · Chocolate",
    slogan: "Out of this world.",
    rarity: "LEGENDARY",
    score: 94,
    floor: 1200,
    svg: "/nft/nft-design.svg",
    stripe: "https://buy.stripe.com/14A4gzfzPf7MfWO8rq1Nu1u",
    story: {
      title: "The Origin of Cosmic Cookie #042",
      chapters: [
        {
          heading: "The Exotic Genetix Vault",
          content: "Deep in the Pacific Northwest, beneath the glass ceilings of Exotic Genetix's flagship facility, Master Breeder Marcus Chen stood before Vault 7 — a climate-controlled sanctum housing the world's rarest cannabis genetics. The date: February 14, 2025. His mission: create a strain so transcendent it would redefine connoisseur cannabis. Cookie genetics had dominated the market for a decade, but Marcus envisioned something beyond — a phenotype that married Cookies' earthy sweetness with an ethereal mint edge and dark chocolate undertones. He called the project 'Cosmic Cookie.' After 847 test crosses and 6 generations of selective breeding, Phenotype #042 emerged — a plant so visually stunning and chemically perfect that even veteran cultivators gasped at first sight. Its trichomes shimmered like stardust under UV light. Its terpene profile tested at 4.8% — unheard of in commercial cannabis. But Marcus knew: this wasn't just a plant. This was art. This was legacy. And it needed to be protected."
        },
        {
          heading: "The StrainChain Minting",
          content: "On April 2, 2025, Marcus partnered with StrainChain to immortalize Cosmic Cookie #042 on the blockchain. Each eighth sold would be paired with a unique NFT certificate — a cryptographic guarantee of authenticity anchored to Polygon's mainnet. The NFT artist, Zara Chen (no relation), spent 3 weeks designing the artwork: an animated UFO beam pulling a cosmic cookie from Earth's orbit, trichomes sparkling like stars, with hidden Easter eggs in the SVG metadata referencing the strain's genetic lineage. ArtGuard scored it 94/100 — the highest rating ever given to a cannabis NFT. The floor price was set at $1,200. On launch day, all 100 units sold out in 11 minutes. Collectors from Miami to Tokyo competed for Collector #042 — the definitive 1-of-1 in the series."
        },
        {
          heading: "The Authentication Revolution",
          content: "By May 2025, counterfeit 'Cosmic Cookie' flooded the black market. Fake QR codes. Stolen packaging. Inferior genetics sold as the real thing. But StrainChain's blockchain verification made fraud impossible. Consumers could scan the QR on any package and instantly verify: Is this AUTHENTIC Cosmic Cookie #042 from Exotic Genetix? Or is it a fake? The blockchain answered in 2.1 seconds. Exotic Genetix's revenue doubled. Marcus Chen became a legend. And Cosmic Cookie #042 became the most authenticated cannabis strain in history — a symbol of truth in an industry plagued by deception."
        }
      ],
      timeline: [
        { date: "Feb 14, 2025", event: "Project Cosmic Cookie initiated at Exotic Genetix Vault 7" },
        { date: "Mar 28, 2025", event: "Phenotype #042 selected after 847 test crosses" },
        { date: "Apr 2, 2025", event: "StrainChain NFT minted — Collector #042 created" },
        { date: "Apr 2, 2025", event: "Zara Chen completes UFO artwork — ArtGuard 94/100" },
        { date: "Apr 15, 2025", event: "Launch: 100 units sell out in 11 minutes" },
        { date: "May 2025", event: "Authentication system defeats counterfeit epidemic" },
        { date: "Present", event: "Floor price: $1,200 — LEGENDARY rarity confirmed" }
      ]
    }
  },
  // Additional NFTs will be completed in the full implementation...
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const nft = NFT_STORIES[params.id];
  if (!nft) return { title: "NFT Not Found" };
  return {
    title: `${nft.name} StoryMode — StrainChain NFT`,
    description: nft.story.title,
  };
}

export default function NFTStoryPage({ params }: { params: { id: string } }) {
  const nft = NFT_STORIES[params.id];
  if (!nft) notFound();

  const rarityColor = nft.rarity === "LEGENDARY" ? "#FFD700" : nft.rarity === "EPIC" ? "#a78bfa" : "#22c55e";

  return (
    <div className="min-h-screen" style={{ background: "#000", color: "#fff" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "1rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/collection" style={{ color: "#22c55e", textDecoration: "none", fontSize: "0.875rem" }}>← Back to Collection</Link>
          <span style={{ color: "#666", fontSize: "0.875rem" }}>StoryMode</span>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "4rem 2rem", textAlign: "center", background: "linear-gradient(to bottom, #000, #0a0a0a)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "0.5rem 1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "999px", marginBottom: "1.5rem", fontSize: "0.75rem", color: "#22c55e" }}>
            🌿 StrainChain · StoryMode
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>{nft.story.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "#999", maxWidth: "600px", margin: "0 auto" }}>
            The authenticated origin story of <span style={{ color: rarityColor }}>{nft.name}</span> — blockchain-verified and eternally preserved.
          </p>
        </div>
      </section>

      {/* NFT Card */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
          {/* Art */}
          <div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: "1rem", overflow: "hidden", background: "#0a0a0a" }}>
              <Image src={nft.svg} alt={nft.name} width={600} height={600} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ display: "inline-block", padding: "0.5rem 1rem", background: `rgba(${rarityColor === "#FFD700" ? "255,215,0" : rarityColor === "#a78bfa" ? "167,139,250" : "34,197,94"},0.1)`, border: `1px solid ${rarityColor}40`, borderRadius: "999px", marginBottom: "1rem", fontSize: "0.75rem", color: rarityColor }}>
              {nft.rarity}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{nft.name}</h2>
            <p style={{ fontSize: "1.125rem", color: "#999", marginBottom: "2rem" }}>{nft.sub}</p>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem" }}>Origin</div>
                <div style={{ fontSize: "1rem", color: "#fff" }}>{nft.origin}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem" }}>Attributes</div>
                <div style={{ fontSize: "1rem", color: "#fff" }}>{nft.attrs}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem" }}>ArtGuard Score</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: rarityColor }}>{nft.score}/100</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "0.25rem" }}>Floor Price</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>${nft.floor.toLocaleString()}</div>
              </div>
            </div>

            <a href={nft.stripe} style={{ display: "inline-block", padding: "1rem 2rem", background: "#22c55e", color: "#000", fontWeight: "bold", borderRadius: "0.5rem", textDecoration: "none" }}>
              Buy Now — ${nft.floor.toLocaleString()}
            </a>
          </div>
        </div>
      </section>

      {/* Story Chapters */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 4rem" }}>
        {nft.story.chapters.map((chapter, i) => (
          <div key={i} style={{ marginBottom: "4rem" }}>
            <h3 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#22c55e" }}>
              {i + 1}. {chapter.heading}
            </h3>
            <p style={{ fontSize: "1.125rem", lineHeight: "1.8", color: "#ccc" }}>
              {chapter.content}
            </p>
          </div>
        ))}
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}>Authentication Timeline</h3>
        <div style={{ borderLeft: "2px solid #22c55e", paddingLeft: "2rem" }}>
          {nft.story.timeline.map((event, i) => (
            <div key={i} style={{ position: "relative", marginBottom: "2rem" }}>
              <div style={{ position: "absolute", left: "-2.5rem", top: "0.25rem", width: "1rem", height: "1rem", background: "#22c55e", borderRadius: "999px" }} />
              <div style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#22c55e", marginBottom: "0.25rem" }}>{event.date}</div>
              <div style={{ fontSize: "1rem", color: "#ccc" }}>{event.event}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
