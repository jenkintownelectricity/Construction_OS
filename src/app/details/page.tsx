"use client";

import { useState } from "react";
import Link from "next/link";

interface DetailFamily {
  family: string;
  count: number;
  system: string;
  desc: string;
  variants: { name: string; id: string; status: "Verified" | "Draft" | "In Review" }[];
  linkedDrawings: string[];
}

const DETAIL_FAMILIES: DetailFamily[] = [
  {
    family: "Parapet Assemblies", count: 6, system: "Roof Edge",
    desc: "Cap flashing, coping, membrane termination at parapet walls",
    variants: [
      { name: "Standard Parapet — TPO", id: "PW-001-A", status: "Verified" },
      { name: "Standard Parapet — EPDM", id: "PW-001-B", status: "Verified" },
      { name: "High Parapet — TPO", id: "PW-002-A", status: "Draft" },
      { name: "Coped Parapet — Metal", id: "PW-003-A", status: "Verified" },
      { name: "Parapet with Gutter", id: "PW-004-A", status: "In Review" },
      { name: "Parapet Expansion Joint", id: "PW-005-A", status: "Draft" },
    ],
    linkedDrawings: ["SD-002"],
  },
  {
    family: "Window Flashings", count: 8, system: "Fenestration",
    desc: "Head, sill, and jamb flashing for window openings",
    variants: [
      { name: "Head Flashing — Aluminum", id: "WF-001-A", status: "Verified" },
      { name: "Sill Pan — Copper", id: "WF-002-A", status: "Verified" },
      { name: "Jamb Flashing — Flex Wrap", id: "WF-003-A", status: "Draft" },
    ],
    linkedDrawings: ["SD-004"],
  },
  {
    family: "Foundation Waterproofing", count: 4, system: "Below Grade",
    desc: "Membrane systems, drainage board, and protection layers",
    variants: [
      { name: "Sheet Membrane — SBS", id: "FW-001-A", status: "Verified" },
      { name: "Fluid Applied", id: "FW-002-A", status: "In Review" },
    ],
    linkedDrawings: ["SD-006"],
  },
  {
    family: "Curtain Wall Interfaces", count: 7, system: "Fenestration",
    desc: "Sill pans, stack joints, and mullion transitions",
    variants: [
      { name: "Stack Joint — Standard", id: "CW-001-A", status: "Verified" },
      { name: "Corner Mullion", id: "CW-002-A", status: "Draft" },
    ],
    linkedDrawings: ["SD-001"],
  },
  {
    family: "Roof Terminations", count: 5, system: "Roofing",
    desc: "Edge details, penetrations, and membrane terminations",
    variants: [
      { name: "Edge Metal — Gravel Stop", id: "RT-001-A", status: "Verified" },
      { name: "Pipe Penetration", id: "RT-002-A", status: "Verified" },
    ],
    linkedDrawings: ["SD-002"],
  },
  {
    family: "Expansion Joints", count: 4, system: "Structural",
    desc: "Cover plates, sealant joints, and bellows assemblies",
    variants: [
      { name: "Roof Expansion Joint", id: "EJ-001-A", status: "Verified" },
      { name: "Wall Expansion Joint", id: "EJ-002-A", status: "In Review" },
    ],
    linkedDrawings: ["SD-005"],
  },
  {
    family: "Masonry Interfaces", count: 6, system: "Masonry",
    desc: "Through-wall flashings, weep systems, shelf angles",
    variants: [
      { name: "Through-Wall — Copper", id: "MI-001-A", status: "Verified" },
      { name: "Shelf Angle", id: "MI-002-A", status: "Draft" },
    ],
    linkedDrawings: [],
  },
  {
    family: "Metal Panel Systems", count: 5, system: "Cladding",
    desc: "Panel clips, joints, and weather barrier integration",
    variants: [
      { name: "Concealed Fastener", id: "MP-001-A", status: "Verified" },
      { name: "Exposed Fastener", id: "MP-002-A", status: "Draft" },
    ],
    linkedDrawings: ["SD-003"],
  },
];

export default function DetailsPage() {
  const [selectedFamily, setSelectedFamily] = useState<string | null>("Parapet Assemblies");
  const [aiExplaining, setAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");

  const selected = DETAIL_FAMILIES.find((d) => d.family === selectedFamily);

  async function handleAIExplain() {
    if (!selected) return;
    setAiExplaining(true);
    setAiExplanation("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "detail_explainer",
          messages: [{
            role: "user",
            content: `Explain the construction detail family "${selected.family}" (${selected.system}). Cover: what it is, why it matters for building envelope performance, common failure modes, key quality control points, and how variants differ. Keep it concise and professional.`
          }],
          system: "You are a construction detail expert. Explain construction details clearly for project managers and field inspectors.",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.text ?? "No explanation generated.");
      } else {
        setAiExplanation("Error: Configure an AI provider in AI Settings to use this feature.");
      }
    } catch {
      setAiExplanation("Error: Could not connect to AI service.");
    }
    setAiExplaining(false);
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--wl-primary, #1e3a5f)" }}>Details</h1>
        <p className="text-sm text-brand-text-muted mt-1">Detail families, variants, and AI-powered explanations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Families */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Detail Families</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DETAIL_FAMILIES.map((d) => (
              <button
                key={d.family}
                onClick={() => { setSelectedFamily(d.family); setAiExplanation(""); }}
                className={`card text-left hover:shadow-md transition-shadow ${selectedFamily === d.family ? "ring-2 ring-blue-300" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold">{d.family}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: "var(--wl-surface-alt, #f1f5f9)" }}>
                    {d.count} variants
                  </span>
                </div>
                <div className="text-xs text-brand-text-muted mb-2">{d.desc}</div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-unknown">{d.system}</span>
                  {d.linkedDrawings.length > 0 && (
                    <span className="text-[10px] text-brand-text-muted">{d.linkedDrawings.length} shop drawing{d.linkedDrawings.length > 1 ? "s" : ""}</span>
                  )}
                </div>
                {/* Mini drawing preview */}
                <div className="mt-2 h-12 rounded border flex items-center justify-center" style={{ borderColor: "var(--wl-border)", backgroundColor: "var(--wl-surface-alt)" }}>
                  <svg viewBox="0 0 120 40" className="w-24 h-8 text-brand-text-muted opacity-40">
                    <rect x="10" y="5" width="100" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="20" x2="110" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                    <line x1="60" y1="5" x2="60" y2="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Family Detail */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold">{selected.family}</h2>
                  <span className="badge badge-unknown">{selected.system}</span>
                </div>
                <p className="text-xs text-brand-text-muted mb-4">{selected.desc}</p>

                {/* AI Explain Button */}
                <button
                  onClick={handleAIExplain}
                  disabled={aiExplaining}
                  className="btn-primary w-full text-xs mb-3"
                >
                  {aiExplaining ? "Analyzing..." : "Explain This Detail (AI)"}
                </button>

                {aiExplanation && (
                  <div className="p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "var(--wl-surface-alt, #f1f5f9)" }}>
                    {aiExplanation}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="card">
                <h3 className="text-sm font-semibold mb-3">Variants ({selected.variants.length})</h3>
                <div className="space-y-2">
                  {selected.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--wl-border)" }}>
                      <div>
                        <div className="text-sm font-medium">{v.name}</div>
                        <div className="text-xs font-mono text-brand-text-muted">{v.id}</div>
                      </div>
                      <span className={`badge ${v.status === "Verified" ? "badge-healthy" : v.status === "In Review" ? "badge-degraded" : "badge-unknown"}`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Shop Drawings */}
              {selected.linkedDrawings.length > 0 && (
                <div className="card">
                  <h3 className="text-sm font-semibold mb-3">Linked Shop Drawings</h3>
                  {selected.linkedDrawings.map((sd) => (
                    <Link key={sd} href="/shop-drawings" className="flex items-center justify-between py-2 text-sm hover:underline" style={{ color: "var(--wl-secondary)" }}>
                      <span>{sd}</span>
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-8">
              <p className="text-sm text-brand-text-muted">Select a detail family to view variants</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
