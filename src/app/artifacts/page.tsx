"use client";

import { useState } from "react";
import Link from "next/link";

type ArtifactFormat = "pdf" | "dxf" | "svg";
type ArtifactStatus = "Final" | "In Review" | "Draft";

interface Artifact {
  id: string;
  name: string;
  format: ArtifactFormat;
  size: string;
  project: string;
  created: string;
  pages: number | null;
  status: ArtifactStatus;
}

const ARTIFACTS: Artifact[] = [
  { id: "ART-001", name: "Heritage Plaza — Parapet Details", format: "pdf", size: "2.4 MB", project: "Heritage Plaza Renovation", created: "2026-03-15", pages: 12, status: "Final" },
  { id: "ART-002", name: "Waterfront Tower — Curtain Wall Shop Drawings", format: "dxf", size: "8.1 MB", project: "Waterfront Tower Phase 2", created: "2026-03-12", pages: null, status: "In Review" },
  { id: "ART-003", name: "Metro Station — Roof Plan", format: "svg", size: "1.2 MB", project: "Metro Station Canopy", created: "2026-03-10", pages: null, status: "Final" },
  { id: "ART-004", name: "Heritage Plaza — Window Schedule", format: "pdf", size: "890 KB", project: "Heritage Plaza Renovation", created: "2026-03-08", pages: 4, status: "Final" },
  { id: "ART-005", name: "Airport Terminal — Foundation Details", format: "dxf", size: "5.6 MB", project: "Airport Terminal B Extension", created: "2026-03-05", pages: null, status: "Draft" },
  { id: "ART-006", name: "Library Wing — Masonry Elevations", format: "svg", size: "3.2 MB", project: "Civic Center Library Wing", created: "2026-03-03", pages: null, status: "Final" },
  { id: "ART-007", name: "Industrial Park — Metal Panel Layout", format: "pdf", size: "1.8 MB", project: "Industrial Park Building C", created: "2026-02-28", pages: 8, status: "In Review" },
  { id: "ART-008", name: "Heritage Plaza — Waterproofing Plan", format: "pdf", size: "3.1 MB", project: "Heritage Plaza Renovation", created: "2026-02-25", pages: 6, status: "Final" },
];

const FORMAT_COLORS: Record<ArtifactFormat, string> = { pdf: "#dc2626", dxf: "#2563eb", svg: "#059669" };

const PROJECTS = [...new Set(ARTIFACTS.map((a) => a.project))];

export default function ArtifactsPage() {
  const [filterFormat, setFilterFormat] = useState<ArtifactFormat | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ArtifactStatus | "all">("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const filtered = ARTIFACTS.filter((a) => {
    if (filterFormat !== "all" && a.format !== filterFormat) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterProject !== "all" && a.project !== filterProject) return false;
    return true;
  });

  const selected = ARTIFACTS.find((a) => a.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--wl-primary, #1e3a5f)" }}>Artifacts</h1>
          <p className="text-sm text-brand-text-muted mt-1">Construction documents, drawings, and reference materials</p>
        </div>
        <div className="flex gap-2 text-xs">
          {(["pdf", "dxf", "svg"] as ArtifactFormat[]).map((f) => (
            <span key={f} className="font-mono px-2 py-0.5 rounded text-white text-[10px] font-bold uppercase" style={{ backgroundColor: FORMAT_COLORS[f] }}>
              {ARTIFACTS.filter((a) => a.format === f).length} {f}
            </span>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`mb-6 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : ""
        }`}
        style={{ borderColor: dragOver ? undefined : "var(--wl-border, #e2e8f0)" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <div className="text-sm font-medium text-brand-text-muted">
          Drop files here to upload, or <button className="underline" style={{ color: "var(--wl-secondary)" }}>browse</button>
        </div>
        <div className="text-xs text-brand-text-muted mt-1">PDF, DXF, SVG — up to 50 MB</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-text-muted">Format:</span>
          <div className="flex gap-1">
            {(["all", "pdf", "dxf", "svg"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterFormat(f)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  filterFormat === f ? "text-white" : "text-brand-text-muted hover:bg-gray-100"
                }`}
                style={filterFormat === f ? { backgroundColor: f === "all" ? "var(--wl-primary)" : FORMAT_COLORS[f] } : {}}
              >
                {f === "all" ? "All" : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-text-muted">Status:</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as ArtifactStatus | "all")} className="input-field !w-auto !py-1 text-xs">
            <option value="all">All</option>
            <option value="Final">Final</option>
            <option value="In Review">In Review</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-text-muted">Project:</span>
          <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="input-field !w-auto !py-1 text-xs">
            <option value="all">All Projects</option>
            {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <span className="text-xs text-brand-text-muted self-center ml-auto">{filtered.length} artifacts</span>
      </div>

      {/* Cards + Preview */}
      <div className="flex gap-6">
        <div className={`grid grid-cols-1 gap-4 ${selected ? "md:grid-cols-2 flex-1" : "md:grid-cols-2 xl:grid-cols-3 w-full"}`}>
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedId(selectedId === a.id ? null : a.id)}
              className={`card text-left hover:shadow-md transition-shadow ${selectedId === a.id ? "ring-2 ring-blue-300" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase" style={{ backgroundColor: FORMAT_COLORS[a.format] }}>
                  {a.format}
                </span>
                <span className={`badge ${a.status === "Final" ? "badge-healthy" : a.status === "In Review" ? "badge-degraded" : "badge-unknown"}`}>
                  {a.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold mt-2 mb-1">{a.name}</h3>
              <div className="text-xs text-brand-text-muted mb-3">{a.project}</div>
              <div className="flex items-center justify-between text-xs text-brand-text-muted border-t pt-2" style={{ borderColor: "var(--wl-border)" }}>
                <div className="flex gap-3">
                  <span>{a.size}</span>
                  {a.pages && <span>{a.pages} pages</span>}
                </div>
                <span>{a.created}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Inline Preview */}
        {selected && (
          <div className="w-80 shrink-0 card sticky top-4 h-fit">
            <h3 className="text-sm font-semibold mb-3">Preview</h3>
            <div className="aspect-[8.5/11] bg-gray-50 rounded border flex flex-col items-center justify-center mb-3" style={{ borderColor: "var(--wl-border)" }}>
              <span className="text-3xl font-bold mb-2" style={{ color: FORMAT_COLORS[selected.format] }}>{selected.format.toUpperCase()}</span>
              <span className="text-xs text-brand-text-muted text-center px-4">{selected.name}</span>
              {selected.pages && <span className="text-xs text-brand-text-muted mt-1">{selected.pages} pages</span>}
            </div>
            <div className="space-y-2 text-xs">
              {[
                ["ID", selected.id],
                ["Format", selected.format.toUpperCase()],
                ["Size", selected.size],
                ["Project", selected.project],
                ["Status", selected.status],
                ["Created", selected.created],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-brand-text-muted">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/viewer" className="btn-primary text-xs flex-1 text-center">Open in Viewer</Link>
              <button onClick={() => setSelectedId(null)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
