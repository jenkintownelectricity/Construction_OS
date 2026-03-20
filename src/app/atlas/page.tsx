"use client";

import { useState, useRef, useEffect } from "react";

interface GraphNode {
  id: string;
  label: string;
  system: string;
  x: number;
  y: number;
  readiness: "Ready" | "In Progress" | "Review";
}

interface GraphEdge {
  from: string;
  to: string;
  relation: string;
}

const NODES: GraphNode[] = [
  { id: "DF-001", label: "Parapet Wall Assembly", system: "Roof Edge", x: 400, y: 80, readiness: "Ready" },
  { id: "DF-002", label: "Window Head Flashing", system: "Fenestration", x: 180, y: 200, readiness: "Ready" },
  { id: "DF-003", label: "Foundation Waterproofing", system: "Below Grade", x: 100, y: 380, readiness: "In Progress" },
  { id: "DF-004", label: "Curtain Wall Sill", system: "Fenestration", x: 380, y: 250, readiness: "Ready" },
  { id: "DF-005", label: "Roof Membrane Termination", system: "Roofing", x: 600, y: 150, readiness: "Review" },
  { id: "DF-006", label: "Expansion Joint Cover", system: "Structural", x: 550, y: 350, readiness: "Ready" },
  { id: "DF-007", label: "Masonry Through-Wall", system: "Masonry", x: 250, y: 450, readiness: "Ready" },
  { id: "DF-008", label: "Metal Panel Clip", system: "Cladding", x: 650, y: 450, readiness: "In Progress" },
];

const EDGES: GraphEdge[] = [
  { from: "DF-001", to: "DF-005", relation: "terminates_at" },
  { from: "DF-002", to: "DF-004", relation: "integrates_with" },
  { from: "DF-003", to: "DF-006", relation: "transitions_to" },
  { from: "DF-001", to: "DF-006", relation: "intersects" },
  { from: "DF-004", to: "DF-005", relation: "adjacent_to" },
  { from: "DF-003", to: "DF-007", relation: "integrates_with" },
  { from: "DF-006", to: "DF-008", relation: "adjacent_to" },
  { from: "DF-001", to: "DF-002", relation: "connects_to" },
];

const INSTALL_SEQUENCE = [
  { step: 1, detail: "Foundation Waterproofing", action: "Apply membrane below grade" },
  { step: 2, detail: "Masonry Through-Wall", action: "Install through-wall flashing" },
  { step: 3, detail: "Expansion Joint Cover", action: "Install joint sealant and cover" },
  { step: 4, detail: "Curtain Wall Sill", action: "Set sill flashing with weeps" },
  { step: 5, detail: "Window Head Flashing", action: "Install head flashing over frame" },
  { step: 6, detail: "Metal Panel Clip", action: "Mount panel clips to structure" },
  { step: 7, detail: "Roof Membrane Termination", action: "Terminate membrane at edge" },
  { step: 8, detail: "Parapet Wall Assembly", action: "Complete cap flashing and coping" },
];

const STATUS_COLORS: Record<string, string> = {
  "Ready": "#059669",
  "In Progress": "#d97706",
  "Review": "#6366f1",
};

export default function AtlasPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selected = NODES.find((n) => n.id === selectedNode);
  const connectedEdges = selectedNode ? EDGES.filter((e) => e.from === selectedNode || e.to === selectedNode) : [];
  const connectedIds = new Set(connectedEdges.flatMap((e) => [e.from, e.to]));

  // Draw graph on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 540 * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 800, 540);

    // Draw edges
    for (const edge of EDGES) {
      const from = NODES.find((n) => n.id === edge.from);
      const to = NODES.find((n) => n.id === edge.to);
      if (!from || !to) continue;

      const isHighlighted = selectedNode && (edge.from === selectedNode || edge.to === selectedNode);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = isHighlighted ? "#1e3a5f" : "#d1d5db";
      ctx.lineWidth = isHighlighted ? 2.5 : 1;
      ctx.stroke();

      // Edge label
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      ctx.font = "9px system-ui";
      ctx.fillStyle = isHighlighted ? "#1e3a5f" : "#94a3b8";
      ctx.textAlign = "center";
      ctx.fillText(edge.relation, mx, my - 4);
    }

    // Draw nodes
    for (const node of NODES) {
      const isSelected = node.id === selectedNode;
      const isConnected = connectedIds.has(node.id);
      const isHovered = node.id === hoveredNode;
      const dimmed = selectedNode && !isSelected && !isConnected;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? 22 : 18, 0, Math.PI * 2);
      ctx.fillStyle = dimmed ? "#e5e7eb" : (STATUS_COLORS[node.readiness] ?? "#6b7280");
      ctx.globalAlpha = dimmed ? 0.4 : 1;
      ctx.fill();
      if (isSelected || isHovered) {
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Node label
      ctx.font = dimmed ? "10px system-ui" : "11px system-ui";
      ctx.fillStyle = dimmed ? "#94a3b8" : "#0f172a";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + 32);
      ctx.font = "9px system-ui";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(node.id, node.x, node.y + 44);
    }
  }, [selectedNode, hoveredNode, connectedIds]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clicked = NODES.find((n) => Math.hypot(n.x - x, n.y - y) < 20);
    setSelectedNode(clicked ? (clicked.id === selectedNode ? null : clicked.id) : null);
  }

  function handleCanvasMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const hovered = NODES.find((n) => Math.hypot(n.x - x, n.y - y) < 20);
    setHoveredNode(hovered?.id ?? null);
    e.currentTarget.style.cursor = hovered ? "pointer" : "default";
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--wl-primary, #1e3a5f)" }}>Atlas</h1>
        <p className="text-sm text-brand-text-muted mt-1">Interactive detail graph, relationships, and installation sequences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Graph */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--wl-border)" }}>
            <h2 className="text-sm font-semibold">Reference Graph</h2>
            <div className="flex gap-3 text-[10px]">
              {Object.entries(STATUS_COLORS).map(([label, color]) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-brand-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={800}
            height={540}
            className="w-full"
            style={{ height: "540px" }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
          />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Node Detail */}
          {selected ? (
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-brand-text-muted">{selected.id}</span>
                <span className="badge" style={{ backgroundColor: STATUS_COLORS[selected.readiness] + "22", color: STATUS_COLORS[selected.readiness] }}>
                  {selected.readiness}
                </span>
              </div>
              <h3 className="text-base font-semibold">{selected.label}</h3>
              <div className="text-xs text-brand-text-muted mt-0.5 mb-3">{selected.system}</div>
              <h4 className="text-xs font-semibold mb-2">Connections ({connectedEdges.length})</h4>
              <div className="space-y-1.5">
                {connectedEdges.map((e, i) => {
                  const other = NODES.find((n) => n.id === (e.from === selectedNode ? e.to : e.from));
                  return (
                    <div key={i} className="text-xs py-1 border-b last:border-0" style={{ borderColor: "var(--wl-border)" }}>
                      <span className="font-medium">{other?.label}</span>
                      <span className="text-brand-text-muted ml-2 font-mono text-[10px]">{e.relation}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-sm text-brand-text-muted">Click a node in the graph to see details</p>
            </div>
          )}

          {/* Install Sequence */}
          <div className="card">
            <h2 className="text-sm font-semibold mb-3">Install Sequence</h2>
            <div className="space-y-2">
              {INSTALL_SEQUENCE.map((s) => (
                <div key={s.step} className="flex gap-3 text-xs py-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ backgroundColor: "var(--wl-primary, #1e3a5f)" }}>
                    {s.step}
                  </div>
                  <div>
                    <div className="font-medium text-brand-text">{s.detail}</div>
                    <div className="text-brand-text-muted">{s.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
