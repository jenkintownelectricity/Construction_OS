"use client";

import { useState } from "react";
import Link from "next/link";

type DrawingStatus = "Submitted" | "In Review" | "Approved" | "Rejected" | "Revised";

interface ShopDrawing {
  id: string;
  title: string;
  specSection: string;
  specTitle: string;
  manufacturer: string;
  project: string;
  status: DrawingStatus;
  revision: number;
  submittedDate: string;
  reviewedDate?: string;
  reviewer?: string;
  pages: number;
  size: string;
  comments: { author: string; text: string; date: string; region?: string }[];
  revisions: { rev: number; date: string; notes: string }[];
}

const SHOP_DRAWINGS: ShopDrawing[] = [
  {
    id: "SD-001", title: "Curtain Wall System — South Elevation", specSection: "08 44 13", specTitle: "Glazed Aluminum Curtain Walls",
    manufacturer: "YKK AP", project: "Waterfront Tower Phase 2", status: "In Review", revision: 2, submittedDate: "2026-03-10",
    reviewedDate: undefined, reviewer: "Michael Torres", pages: 24, size: "12.4 MB",
    comments: [
      { author: "Michael Torres", text: "Stack joint detail at level 5 needs clarification — show sealant backup and weep path", date: "2026-03-12", region: "Sheet 8, Detail 3A" },
      { author: "Michael Torres", text: "Verify anchor spacing at wind load zone 3 matches structural calc", date: "2026-03-12", region: "Sheet 12" },
    ],
    revisions: [
      { rev: 1, date: "2026-02-20", notes: "Initial submission" },
      { rev: 2, date: "2026-03-10", notes: "Updated anchor spacing per structural review" },
    ],
  },
  {
    id: "SD-002", title: "Roof Membrane Assembly — Full Plan", specSection: "07 52 16", specTitle: "SBS Modified Bituminous Membrane Roofing",
    manufacturer: "Carlisle SynTec", project: "Heritage Plaza Renovation", status: "Approved", revision: 3, submittedDate: "2026-02-28",
    reviewedDate: "2026-03-14", reviewer: "Sarah Chen", pages: 18, size: "8.7 MB",
    comments: [
      { author: "Sarah Chen", text: "Approved. Parapet termination detail now matches specification.", date: "2026-03-14" },
    ],
    revisions: [
      { rev: 1, date: "2026-01-15", notes: "Initial submission" },
      { rev: 2, date: "2026-02-10", notes: "Revised parapet detail per architect RFI-012" },
      { rev: 3, date: "2026-02-28", notes: "Final corrections to membrane overlap dimensions" },
    ],
  },
  {
    id: "SD-003", title: "Metal Panel Layout — Building C West", specSection: "07 42 43", specTitle: "Composite Metal Wall Panels",
    manufacturer: "ATAS International", project: "Industrial Park Building C", status: "Submitted", revision: 1, submittedDate: "2026-03-18",
    reviewer: undefined, pages: 12, size: "5.2 MB", comments: [],
    revisions: [{ rev: 1, date: "2026-03-18", notes: "Initial submission" }],
  },
  {
    id: "SD-004", title: "Window Assemblies — Type A through E", specSection: "08 51 13", specTitle: "Aluminum Windows",
    manufacturer: "Marvin Windows", project: "Civic Center Library Wing", status: "Rejected", revision: 1, submittedDate: "2026-03-05",
    reviewedDate: "2026-03-09", reviewer: "Lisa Wang", pages: 16, size: "7.1 MB",
    comments: [
      { author: "Lisa Wang", text: "Head flashing detail does not match spec section 07 62 00 requirement for continuous flashing.", date: "2026-03-09", region: "Sheet 4, Detail 2B" },
      { author: "Lisa Wang", text: "Type D window sill pan is missing weep holes. Resubmit with corrected detail.", date: "2026-03-09", region: "Sheet 7" },
    ],
    revisions: [{ rev: 1, date: "2026-03-05", notes: "Initial submission" }],
  },
  {
    id: "SD-005", title: "Expansion Joint Covers — All Locations", specSection: "07 95 13", specTitle: "Expansion Joint Cover Assemblies",
    manufacturer: "Inpro Corporation", project: "Airport Terminal B Extension", status: "Revised", revision: 2, submittedDate: "2026-03-16",
    reviewer: "James Park", pages: 8, size: "3.8 MB",
    comments: [
      { author: "James Park", text: "Revision addresses previous comments. Ready for final review.", date: "2026-03-17" },
    ],
    revisions: [
      { rev: 1, date: "2026-02-25", notes: "Initial submission" },
      { rev: 2, date: "2026-03-16", notes: "Updated fire barrier integration per code review" },
    ],
  },
  {
    id: "SD-006", title: "Below-Grade Waterproofing — Foundation Walls", specSection: "07 11 13", specTitle: "Bituminous Dampproofing",
    manufacturer: "Sika Corporation", project: "Metro Station Canopy", status: "Approved", revision: 1, submittedDate: "2026-03-01",
    reviewedDate: "2026-03-08", reviewer: "Rachel Kim", pages: 10, size: "4.5 MB",
    comments: [
      { author: "Rachel Kim", text: "Approved as submitted. Protection board spec matches.", date: "2026-03-08" },
    ],
    revisions: [{ rev: 1, date: "2026-03-01", notes: "Initial submission" }],
  },
];

const STATUS_COLORS: Record<DrawingStatus, string> = {
  Submitted: "badge-unknown",
  "In Review": "badge-degraded",
  Approved: "badge-healthy",
  Rejected: "badge-unavailable",
  Revised: "badge-misconfigured",
};

const ALL_STATUSES: DrawingStatus[] = ["Submitted", "In Review", "Approved", "Rejected", "Revised"];

export default function ShopDrawingsPage() {
  const [selectedId, setSelectedId] = useState<string | null>("SD-001");
  const [filterStatus, setFilterStatus] = useState<DrawingStatus | "All">("All");

  const filtered = filterStatus === "All"
    ? SHOP_DRAWINGS
    : SHOP_DRAWINGS.filter((d) => d.status === filterStatus);

  const selected = SHOP_DRAWINGS.find((d) => d.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Left: Drawing List */}
      <div className="w-96 shrink-0 border-r flex flex-col" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
        <div className="p-4 border-b" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
          <h1 className="text-lg font-bold" style={{ color: "var(--wl-primary, #1e3a5f)" }}>Shop Drawings</h1>
          <p className="text-xs text-brand-text-muted mt-0.5">Submittal tracking and review</p>
          {/* Filter */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <button
              onClick={() => setFilterStatus("All")}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                filterStatus === "All" ? "text-white" : "text-brand-text-muted hover:bg-gray-100"
              }`}
              style={filterStatus === "All" ? { backgroundColor: "var(--wl-primary, #1e3a5f)" } : {}}
            >
              All ({SHOP_DRAWINGS.length})
            </button>
            {ALL_STATUSES.map((s) => {
              const count = SHOP_DRAWINGS.filter((d) => d.status === s).length;
              if (count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`badge ${filterStatus === s ? STATUS_COLORS[s] : "badge-unknown"} cursor-pointer`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`w-full text-left px-4 py-3 border-b transition-colors ${
                selectedId === d.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              style={{ borderColor: "var(--wl-border, #e2e8f0)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-brand-text-muted">{d.id}</span>
                <span className={`badge ${STATUS_COLORS[d.status]}`}>{d.status}</span>
              </div>
              <div className="text-sm font-medium mb-0.5">{d.title}</div>
              <div className="text-xs text-brand-text-muted">
                {d.specSection} — {d.manufacturer} &middot; Rev {d.revision}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-brand-text-muted">{selected.id}</span>
                  <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                </div>
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <p className="text-sm text-brand-text-muted mt-1">
                  {selected.specSection} — {selected.specTitle}
                </p>
              </div>
              <Link href="/viewer" className="btn-primary text-xs">
                Open in Viewer
              </Link>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Manufacturer", value: selected.manufacturer },
                { label: "Project", value: selected.project },
                { label: "Revision", value: `Rev ${selected.revision}` },
                { label: "Pages", value: `${selected.pages} pages` },
                { label: "Submitted", value: selected.submittedDate },
                { label: "Reviewed", value: selected.reviewedDate ?? "Pending" },
                { label: "Reviewer", value: selected.reviewer ?? "Unassigned" },
                { label: "File Size", value: selected.size },
              ].map((m) => (
                <div key={m.label} className="card !p-3">
                  <div className="text-[10px] uppercase tracking-wider text-brand-text-muted">{m.label}</div>
                  <div className="text-sm font-medium mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Status Workflow */}
            <div className="card mb-6">
              <h3 className="text-sm font-semibold mb-3">Status Workflow</h3>
              <div className="flex items-center gap-2">
                {ALL_STATUSES.filter((s) => s !== "Revised").map((s, i) => {
                  const isCurrent = selected.status === s || (selected.status === "Revised" && s === "Submitted");
                  const isPast = ALL_STATUSES.indexOf(selected.status) > i;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          isCurrent ? "text-white border-transparent" : isPast ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 text-brand-text-muted"
                        }`}
                        style={isCurrent ? { backgroundColor: "var(--wl-primary, #1e3a5f)" } : {}}
                      >
                        {s}
                      </div>
                      {i < 3 && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-text-muted" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review Comments */}
            <div className="card mb-6">
              <h3 className="text-sm font-semibold mb-3">Review Comments ({selected.comments.length})</h3>
              {selected.comments.length === 0 ? (
                <p className="text-sm text-brand-text-muted">No comments yet.</p>
              ) : (
                <div className="space-y-3">
                  {selected.comments.map((c, i) => (
                    <div key={i} className="border rounded-lg p-3" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{c.author}</span>
                        <span className="text-xs text-brand-text-muted">{c.date}</span>
                      </div>
                      {c.region && (
                        <div className="mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--wl-surface-alt, #f1f5f9)" }}>
                            {c.region}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-brand-text-muted">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision History */}
            <div className="card">
              <h3 className="text-sm font-semibold mb-3">Revision History</h3>
              <div className="space-y-2">
                {selected.revisions.map((r) => (
                  <div key={r.rev} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: "var(--wl-primary, #1e3a5f)" }}>
                      {r.rev}
                    </div>
                    <div>
                      <div className="text-xs text-brand-text-muted">{r.date}</div>
                      <div className="text-sm">{r.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-brand-text-muted text-sm">
            Select a shop drawing to view details
          </div>
        )}
      </div>
    </div>
  );
}
