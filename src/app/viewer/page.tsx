"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type MarkupTool = "select" | "cloud" | "rectangle" | "ellipse" | "pen" | "text" | "dimension" | "stamp" | "highlight" | "arrow";
type StampType = "Approved" | "Rejected" | "Revise & Resubmit" | "For Reference";

interface Markup {
  id: string;
  tool: MarkupTool;
  x: number;
  y: number;
  w: number;
  h: number;
  page: number;
  color: string;
  text?: string;
  stamp?: StampType;
  points?: { x: number; y: number }[];
}

const TOOLS: { id: MarkupTool; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" },
  { id: "cloud", label: "Cloud", icon: "M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" },
  { id: "rectangle", label: "Rectangle", icon: "M3 3h18v18H3z" },
  { id: "ellipse", label: "Ellipse", icon: "M12 5a9 7 0 110 14 9 7 0 010-14z" },
  { id: "pen", label: "Pen", icon: "M12 19l7-7 3 3-7 7-3-3zM18 12l-1.5-1.5M2 22l1-6 15-15 4 4L7 20z" },
  { id: "text", label: "Text", icon: "M4 7V4h16v3M9 20h6M12 4v16" },
  { id: "dimension", label: "Dimension", icon: "M21 3H3M21 21H3M12 3v18M3 12h18" },
  { id: "stamp", label: "Stamp", icon: "M4 15h16v4H4zM8 11h8v4H8zM10 7h4v4h-4z" },
  { id: "highlight", label: "Highlight", icon: "M5 19h14M12 3l7 13H5l7-13z" },
  { id: "arrow", label: "Arrow", icon: "M5 12h14M12 5l7 7-7 7" },
];

const STAMP_TYPES: StampType[] = ["Approved", "Rejected", "Revise & Resubmit", "For Reference"];
const STAMP_COLORS: Record<StampType, string> = {
  "Approved": "#059669",
  "Rejected": "#dc2626",
  "Revise & Resubmit": "#d97706",
  "For Reference": "#2563eb",
};

const MARKUP_COLORS = ["#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2"];

// Mock pages (drawing page representations)
const MOCK_PAGES = Array.from({ length: 8 }, (_, i) => ({
  num: i + 1,
  label: `Sheet ${i + 1}`,
  content: [
    "CURTAIN WALL SYSTEM — SOUTH ELEVATION",
    "TYPICAL MULLION SECTION",
    "STACK JOINT DETAIL",
    "ANCHOR ASSEMBLY",
    "SILL PAN DETAIL",
    "HEAD CONDITION",
    "CORNER DETAIL",
    "SCHEDULE & NOTES",
  ][i] ?? `Sheet ${i + 1}`,
}));

export default function ViewerPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTool, setActiveTool] = useState<MarkupTool>("select");
  const [activeColor, setActiveColor] = useState("#dc2626");
  const [activeStamp, setActiveStamp] = useState<StampType>("Approved");
  const [zoom, setZoom] = useState(100);
  const [markups, setMarkups] = useState<Markup[]>([]);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareOpacity, setCompareOpacity] = useState(50);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Place markup on canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarkup: Markup = {
      id: `m-${Date.now()}`,
      tool: activeTool,
      x, y,
      w: activeTool === "stamp" ? 20 : activeTool === "text" ? 15 : 12,
      h: activeTool === "stamp" ? 6 : activeTool === "text" ? 4 : 8,
      page: currentPage,
      color: activeTool === "stamp" ? STAMP_COLORS[activeStamp] : activeColor,
      stamp: activeTool === "stamp" ? activeStamp : undefined,
      text: activeTool === "text" ? "Comment" : undefined,
    };
    setMarkups((prev) => [...prev, newMarkup]);
    setActiveTool("select");
  }, [activeTool, activeColor, activeStamp, currentPage]);

  const pageMarkups = markups.filter((m) => m.page === currentPage);

  async function handleAIQuery() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "detail_explainer",
          messages: [{ role: "user", content: `[Shop Drawing Context: Sheet ${currentPage} — ${MOCK_PAGES[currentPage - 1]?.content}]\n\n${aiPrompt}` }],
          system: "You are a construction document review assistant. Analyze shop drawings and provide expert feedback on compliance, dimensions, material specs, and installation details.",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text ?? "No response received.");
      } else {
        const data = await res.json();
        setAiResponse(`Error: ${data.error?.message ?? data.error ?? "Request failed"}`);
      }
    } catch {
      setAiResponse("Error: Could not connect to AI service. Configure a provider in AI Settings.");
    }
    setAiLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Thumbnail Strip */}
      {showThumbnails && (
        <div className="w-28 shrink-0 border-r overflow-y-auto p-2 space-y-2" style={{ borderColor: "var(--wl-border, #e2e8f0)", backgroundColor: "var(--wl-surface-alt, #f1f5f9)" }}>
          {MOCK_PAGES.map((p) => (
            <button
              key={p.num}
              onClick={() => setCurrentPage(p.num)}
              className={`w-full rounded border p-1 transition-colors ${
                currentPage === p.num ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="aspect-[8.5/11] bg-white rounded flex items-center justify-center">
                <span className="text-[8px] text-brand-text-muted text-center px-1">{p.content}</span>
              </div>
              <div className="text-[9px] text-center mt-1 text-brand-text-muted">{p.num}</div>
            </button>
          ))}
        </div>
      )}

      {/* Center: Toolbar + Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="border-b px-3 py-1.5 flex items-center gap-2 flex-wrap" style={{ borderColor: "var(--wl-border, #e2e8f0)", backgroundColor: "white" }}>
          {/* Toggle thumbnails */}
          <button onClick={() => setShowThumbnails(!showThumbnails)} className="btn-secondary !px-2 !py-1 text-xs" title="Thumbnails">
            Pages
          </button>

          <div className="w-px h-5 bg-gray-200" />

          {/* Markup tools */}
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={t.label}
              className={`p-1.5 rounded transition-colors ${
                activeTool === t.id ? "text-white" : "text-brand-text-muted hover:bg-gray-100"
              }`}
              style={activeTool === t.id ? { backgroundColor: "var(--wl-primary, #1e3a5f)" } : {}}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
            </button>
          ))}

          {/* Stamp selector */}
          {activeTool === "stamp" && (
            <select value={activeStamp} onChange={(e) => setActiveStamp(e.target.value as StampType)} className="input-field !w-auto !py-1 text-xs">
              {STAMP_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          <div className="w-px h-5 bg-gray-200" />

          {/* Color picker */}
          <div className="flex gap-1">
            {MARKUP_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(c)}
                className={`w-5 h-5 rounded-full border-2 ${activeColor === c ? "border-gray-800" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200" />

          {/* Zoom */}
          <button onClick={() => setZoom((z) => Math.max(25, z - 25))} className="btn-secondary !px-2 !py-1 text-xs">-</button>
          <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(400, z + 25))} className="btn-secondary !px-2 !py-1 text-xs">+</button>
          <button onClick={() => setZoom(100)} className="btn-secondary !px-2 !py-1 text-xs">Fit</button>

          <div className="w-px h-5 bg-gray-200" />

          {/* Compare */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`btn-secondary !px-2 !py-1 text-xs ${compareMode ? "!bg-blue-100 !border-blue-300" : ""}`}
          >
            Compare
          </button>
          {compareMode && (
            <input type="range" min={0} max={100} value={compareOpacity} onChange={(e) => setCompareOpacity(parseInt(e.target.value))} className="w-20" title={`Opacity: ${compareOpacity}%`} />
          )}

          <div className="flex-1" />

          {/* Panel toggles */}
          <button onClick={() => setShowProperties(!showProperties)} className={`btn-secondary !px-2 !py-1 text-xs ${showProperties ? "!bg-blue-100 !border-blue-300" : ""}`}>
            Properties
          </button>
          <button onClick={() => setShowAIPanel(!showAIPanel)} className={`btn-secondary !px-2 !py-1 text-xs ${showAIPanel ? "!bg-blue-100 !border-blue-300" : ""}`}>
            AI Assist
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: "#525659" }}>
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="mx-auto bg-white shadow-xl relative cursor-crosshair"
            style={{
              width: `${(8.5 * zoom / 100) * 96}px`,
              height: `${(11 * zoom / 100) * 96}px`,
              transition: "width 0.2s, height 0.2s",
            }}
          >
            {/* Mock drawing content */}
            <div className="absolute inset-0 p-8 pointer-events-none">
              <div className="border-2 border-gray-300 h-full w-full rounded flex flex-col">
                {/* Title block */}
                <div className="mt-auto border-t-2 border-gray-300 p-3 flex items-end justify-between">
                  <div>
                    <div className="text-[8px] text-gray-400 uppercase tracking-wider">Sheet {currentPage} of {MOCK_PAGES.length}</div>
                    <div className="text-xs font-bold text-gray-600">{MOCK_PAGES[currentPage - 1]?.content}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[7px] text-gray-400">Curtain Wall System</div>
                    <div className="text-[7px] text-gray-400">SD-001 Rev 2</div>
                  </div>
                </div>
                {/* Mock detail lines */}
                <div className="flex-1 p-4">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="border border-dashed border-gray-200 rounded flex items-center justify-center">
                      <span className="text-[8px] text-gray-300">Detail Area A</span>
                    </div>
                    <div className="border border-dashed border-gray-200 rounded flex items-center justify-center">
                      <span className="text-[8px] text-gray-300">Detail Area B</span>
                    </div>
                    <div className="border border-dashed border-gray-200 rounded flex items-center justify-center">
                      <span className="text-[8px] text-gray-300">Detail Area C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compare overlay */}
            {compareMode && (
              <div
                className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed flex items-center justify-center"
                style={{ opacity: compareOpacity / 100 }}
              >
                <span className="text-xs text-blue-500 font-medium">Previous Revision Overlay</span>
              </div>
            )}

            {/* Rendered Markups */}
            {pageMarkups.map((m) => (
              <div
                key={m.id}
                className="absolute flex items-center justify-center text-white text-[9px] font-bold pointer-events-auto cursor-move"
                style={{
                  left: `${m.x}%`,
                  top: `${m.y}%`,
                  width: `${m.w}%`,
                  height: `${m.h}%`,
                  transform: "translate(-50%, -50%)",
                  ...(m.tool === "stamp"
                    ? { backgroundColor: m.color, borderRadius: "4px", opacity: 0.85 }
                    : m.tool === "highlight"
                    ? { backgroundColor: m.color, opacity: 0.25, borderRadius: "2px" }
                    : { border: `2px solid ${m.color}`, borderRadius: m.tool === "ellipse" ? "50%" : m.tool === "cloud" ? "20px" : "2px" }
                  ),
                }}
              >
                {m.stamp && <span>{m.stamp.toUpperCase()}</span>}
                {m.text && <span className="text-[10px]" style={{ color: m.color }}>{m.text}</span>}
                {m.tool === "arrow" && (
                  <svg viewBox="0 0 40 20" className="w-full h-full" stroke={m.color} strokeWidth={2} fill="none">
                    <line x1="0" y1="10" x2="35" y2="10" />
                    <polyline points="30,5 35,10 30,15" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Page nav */}
        <div className="border-t px-4 py-2 flex items-center justify-center gap-3 text-xs" style={{ borderColor: "var(--wl-border, #e2e8f0)", backgroundColor: "white" }}>
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary !px-2 !py-1">Prev</button>
          <span className="font-medium">Page {currentPage} of {MOCK_PAGES.length}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(MOCK_PAGES.length, p + 1))} disabled={currentPage === MOCK_PAGES.length} className="btn-secondary !px-2 !py-1">Next</button>
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <span className="text-brand-text-muted">{pageMarkups.length} markups on this page</span>
          {markups.length > 0 && (
            <button onClick={() => setMarkups([])} className="text-brand-danger text-xs hover:underline ml-2">Clear All</button>
          )}
        </div>
      </div>

      {/* Right Panel: Properties / AI */}
      {(showProperties || showAIPanel) && (
        <div className="w-72 shrink-0 border-l overflow-y-auto" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
          {showProperties && (
            <div className="p-4 border-b" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
              <h3 className="text-sm font-semibold mb-3">Document Properties</h3>
              <div className="space-y-2 text-xs">
                {[
                  ["Document", "SD-001 Curtain Wall System"],
                  ["Format", "PDF"],
                  ["Pages", "8"],
                  ["Size", "12.4 MB"],
                  ["Revision", "2"],
                  ["Status", "In Review"],
                  ["Manufacturer", "YKK AP"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-brand-text-muted">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showProperties && pageMarkups.length > 0 && (
            <div className="p-4 border-b" style={{ borderColor: "var(--wl-border, #e2e8f0)" }}>
              <h3 className="text-sm font-semibold mb-2">Markups ({pageMarkups.length})</h3>
              <div className="space-y-1.5">
                {pageMarkups.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="capitalize">{m.stamp ?? m.text ?? m.tool}</span>
                    </div>
                    <button
                      onClick={() => setMarkups((prev) => prev.filter((x) => x.id !== m.id))}
                      className="text-brand-danger hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showAIPanel && (
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3">AI Assist</h3>
              <p className="text-xs text-brand-text-muted mb-3">
                Ask questions about the current drawing page, check spec compliance, or extract details.
              </p>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {["Summarize this sheet", "Check spec compliance", "Flag discrepancies", "Extract dimensions"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setAiPrompt(q)}
                      className="text-[10px] px-2 py-1 rounded border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: "var(--wl-border, #e2e8f0)" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask about this drawing..."
                  className="input-field !text-xs"
                  rows={3}
                />
                <button onClick={handleAIQuery} disabled={aiLoading || !aiPrompt.trim()} className="btn-primary w-full text-xs">
                  {aiLoading ? "Analyzing..." : "Ask AI"}
                </button>
                {aiResponse && (
                  <div className="mt-2 p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "var(--wl-surface-alt, #f1f5f9)" }}>
                    {aiResponse}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
