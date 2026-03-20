"use client";

import { useState } from "react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: "measurement" | "compliance" | "reporting" | "planning";
  status: "active" | "placeholder";
}

const TOOLS: Tool[] = [
  { id: "takeoff", name: "Takeoff Calculator", description: "Quantity takeoff for linear, area, and count measurements from drawings", category: "measurement", status: "active" },
  { id: "spec-checker", name: "Spec Checker", description: "AI checks drawing details against specification requirements", category: "compliance", status: "active" },
  { id: "condition-report", name: "Condition Reporter", description: "Generate formatted condition reports from observation data", category: "reporting", status: "active" },
  { id: "detail-compare", name: "Detail Comparator", description: "Compare two detail variants side-by-side for differences", category: "compliance", status: "active" },
  { id: "rfi-drafter", name: "RFI Drafter", description: "AI-assisted Request for Information drafting from context", category: "reporting", status: "active" },
  { id: "punch-list", name: "Punch List Generator", description: "Generate punch lists from open observations per project", category: "reporting", status: "active" },
  { id: "sequencer", name: "Assembly Sequencer", description: "Interactive installation sequence builder with drag-and-drop", category: "planning", status: "active" },
  { id: "material-calc", name: "Material Calculator", description: "Estimate material quantities from detail parameters", category: "measurement", status: "active" },
  { id: "qc-checklist", name: "QC Checklist Builder", description: "Create quality control checklists per assembly type", category: "compliance", status: "active" },
  { id: "weather", name: "Weather Overlay", description: "Weather data impact on installation schedule", category: "planning", status: "placeholder" },
];

const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "measurement", label: "Measurement" },
  { id: "compliance", label: "Compliance" },
  { id: "reporting", label: "Reporting" },
  { id: "planning", label: "Planning" },
];

const CAT_COLORS: Record<string, string> = {
  measurement: "#2563eb",
  compliance: "#059669",
  reporting: "#d97706",
  planning: "#7c3aed",
};

// Individual tool UIs
function TakeoffCalculator() {
  const [items, setItems] = useState([
    { desc: "Parapet cap flashing", type: "Linear", qty: 340, unit: "LF" },
    { desc: "Roof membrane", type: "Area", qty: 12500, unit: "SF" },
    { desc: "Expansion joint covers", type: "Linear", qty: 85, unit: "LF" },
    { desc: "Window units Type A", type: "Count", qty: 24, unit: "EA" },
  ]);
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Takeoff Calculator</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--wl-border)" }}>
            <th className="text-left py-2 font-medium">Description</th>
            <th className="text-left py-2 font-medium">Type</th>
            <th className="text-right py-2 font-medium">Quantity</th>
            <th className="text-left py-2 pl-2 font-medium">Unit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b" style={{ borderColor: "var(--wl-border)" }}>
              <td className="py-2">{item.desc}</td>
              <td className="py-2"><span className="badge badge-unknown">{item.type}</span></td>
              <td className="py-2 text-right font-mono">{item.qty.toLocaleString()}</td>
              <td className="py-2 pl-2 text-brand-text-muted">{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn-secondary text-xs mt-3" onClick={() => setItems([...items, { desc: "New item", type: "Count", qty: 0, unit: "EA" }])}>
        + Add Item
      </button>
    </div>
  );
}

function SpecChecker() {
  const [specText, setSpecText] = useState("07 62 00 — Sheet Metal Flashing and Trim:\n- Minimum 24 ga galvanized steel\n- Continuous head flashing at all window openings\n- End dams required at all terminations\n- Minimum 4\" overlap at laps");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  async function check() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "observation_classifier",
          messages: [{ role: "user", content: `Check the following specification requirements against common shop drawing issues and list compliance gaps:\n\n${specText}` }],
          system: "You are a construction specification compliance checker. Analyze spec text and identify potential non-compliance issues in shop drawings.",
        }),
      });
      if (res.ok) { const d = await res.json(); setResult(d.text ?? "No issues found."); }
      else { setResult("Error: Configure an AI provider in Settings."); }
    } catch { setResult("Error: Could not reach AI service."); }
    setLoading(false);
  }
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Spec Checker</h3>
      <textarea value={specText} onChange={(e) => setSpecText(e.target.value)} className="input-field text-xs" rows={6} />
      <button className="btn-primary text-xs mt-2" onClick={check} disabled={loading}>
        {loading ? "Checking..." : "Check Compliance"}
      </button>
      {result && <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "var(--wl-surface-alt)" }}>{result}</div>}
    </div>
  );
}

function ConditionReporter() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "assembly_summarizer",
          messages: [{ role: "user", content: "Generate a formal condition report summary for Heritage Plaza Renovation based on these observations:\n- Flashing at parapet intersection: membrane lap only 2 inches (code requires 4\")\n- Window head flashing discontinuous at mullion, no end dam at left jamb\n- Sealant joint at curtain wall exceeds manufacturer max width\nFormat as a professional condition report with findings and recommendations." }],
          system: "You are a construction condition report writer. Generate clear, professional condition reports from field observations.",
        }),
      });
      if (res.ok) { const d = await res.json(); setReport(d.text ?? "No report generated."); }
      else { setReport("Error: Configure an AI provider in Settings."); }
    } catch { setReport("Error: Could not reach AI service."); }
    setLoading(false);
  }
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Condition Reporter</h3>
      <p className="text-xs text-brand-text-muted mb-3">Generate a formatted condition report from recent observations.</p>
      <button className="btn-primary text-xs" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Report — Heritage Plaza"}
      </button>
      {report && <div className="mt-3 p-4 rounded-lg text-xs leading-relaxed whitespace-pre-wrap border" style={{ borderColor: "var(--wl-border)" }}>{report}</div>}
    </div>
  );
}

function RFIDrafter() {
  const [context, setContext] = useState("SD-004 Window Assemblies: Head flashing detail does not match spec section 07 62 00 requirement for continuous flashing. Type D window sill pan missing weep holes.");
  const [rfi, setRfi] = useState("");
  const [loading, setLoading] = useState(false);
  async function draft() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capability: "manufacturer_note_drafter",
          messages: [{ role: "user", content: `Draft a formal RFI (Request for Information) based on this shop drawing review finding:\n\n${context}\n\nFormat as a professional RFI with subject, question, reference documents, and suggested resolution.` }],
          system: "You are a construction RFI drafter. Write clear, professional Requests for Information.",
        }),
      });
      if (res.ok) { const d = await res.json(); setRfi(d.text ?? "No RFI generated."); }
      else { setRfi("Error: Configure an AI provider in Settings."); }
    } catch { setRfi("Error: Could not reach AI service."); }
    setLoading(false);
  }
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">RFI Drafter</h3>
      <textarea value={context} onChange={(e) => setContext(e.target.value)} className="input-field text-xs" rows={4} />
      <button className="btn-primary text-xs mt-2" onClick={draft} disabled={loading}>{loading ? "Drafting..." : "Draft RFI"}</button>
      {rfi && <div className="mt-3 p-4 rounded-lg text-xs leading-relaxed whitespace-pre-wrap border" style={{ borderColor: "var(--wl-border)" }}>{rfi}</div>}
    </div>
  );
}

function PunchListGenerator() {
  const openObs = [
    { id: "OBS-0147", detail: "Flashing at parapet intersection", severity: "High" },
    { id: "OBS-0146", detail: "Sealant joint at curtain wall", severity: "Medium" },
    { id: "OBS-0144", detail: "Window head flashing continuity", severity: "High" },
    { id: "OBS-0143", detail: "Below-grade waterproofing overlap", severity: "Medium" },
    { id: "OBS-0141", detail: "Metal panel clip spacing", severity: "High" },
    { id: "OBS-0140", detail: "Masonry through-wall flashing", severity: "Medium" },
  ];
  const [checked, setChecked] = useState<Set<string>>(new Set());
  function toggle(id: string) {
    setChecked((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Punch List Generator</h3>
      <p className="text-xs text-brand-text-muted mb-3">Open observations for Heritage Plaza Renovation ({openObs.length} items)</p>
      <div className="space-y-2">
        {openObs.map((obs) => (
          <label key={obs.id} className="flex items-center gap-3 py-2 border-b cursor-pointer" style={{ borderColor: "var(--wl-border)" }}>
            <input type="checkbox" checked={checked.has(obs.id)} onChange={() => toggle(obs.id)} className="rounded" />
            <span className="text-xs font-mono text-brand-text-muted w-16">{obs.id}</span>
            <span className={`text-sm flex-1 ${checked.has(obs.id) ? "line-through text-brand-text-muted" : ""}`}>{obs.detail}</span>
            <span className={`badge ${obs.severity === "High" ? "badge-unavailable" : "badge-degraded"}`}>{obs.severity}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 text-xs text-brand-text-muted">{checked.size} of {openObs.length} resolved</div>
    </div>
  );
}

function AssemblySequencer() {
  const [steps, setSteps] = useState([
    { id: "1", detail: "Foundation Waterproofing", action: "Apply membrane below grade" },
    { id: "2", detail: "Expansion Joint Cover", action: "Install joint sealant and cover" },
    { id: "3", detail: "Curtain Wall Sill", action: "Set sill flashing with weeps" },
    { id: "4", detail: "Window Head Flashing", action: "Install head flashing over frame" },
    { id: "5", detail: "Roof Membrane Termination", action: "Terminate membrane at edge" },
    { id: "6", detail: "Parapet Wall Assembly", action: "Complete cap flashing and coping" },
  ]);
  function moveUp(i: number) {
    if (i === 0) return;
    setSteps((s) => { const n = [...s]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; });
  }
  function moveDown(i: number) {
    if (i >= steps.length - 1) return;
    setSteps((s) => { const n = [...s]; [n[i], n[i + 1]] = [n[i + 1], n[i]]; return n; });
  }
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Assembly Sequencer</h3>
      <p className="text-xs text-brand-text-muted mb-3">Drag steps to reorder the installation sequence.</p>
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 py-2 px-3 rounded-lg border" style={{ borderColor: "var(--wl-border)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: "var(--wl-primary, #1e3a5f)" }}>{i + 1}</div>
            <div className="flex-1">
              <div className="text-sm font-medium">{s.detail}</div>
              <div className="text-xs text-brand-text-muted">{s.action}</div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => moveUp(i)} disabled={i === 0} className="btn-secondary !px-1.5 !py-0.5 text-xs disabled:opacity-30">Up</button>
              <button onClick={() => moveDown(i)} disabled={i >= steps.length - 1} className="btn-secondary !px-1.5 !py-0.5 text-xs disabled:opacity-30">Dn</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialCalculator() {
  const [length, setLength] = useState(340);
  const [waste, setWaste] = useState(10);
  const materials = [
    { name: "24 ga. Galv. Steel Flashing", rate: 1.0, unit: "LF", unitCost: 4.25 },
    { name: "Sealant — Sikaflex 15LM", rate: 0.1, unit: "tubes", unitCost: 8.50 },
    { name: "Fasteners — #12 Pancake Head", rate: 2.0, unit: "EA", unitCost: 0.15 },
    { name: "Butyl Tape — 1\" x 50'", rate: 0.02, unit: "rolls", unitCost: 22.00 },
  ];
  const factor = 1 + waste / 100;
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Material Calculator</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-medium block mb-1">Linear Footage</label>
          <input type="number" value={length} onChange={(e) => setLength(parseInt(e.target.value) || 0)} className="input-field text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Waste Factor (%)</label>
          <input type="number" value={waste} onChange={(e) => setWaste(parseInt(e.target.value) || 0)} className="input-field text-sm" />
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--wl-border)" }}>
            <th className="text-left py-2 font-medium">Material</th>
            <th className="text-right py-2 font-medium">Qty</th>
            <th className="text-right py-2 font-medium">Cost</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => {
            const qty = Math.ceil(length * m.rate * factor);
            return (
              <tr key={m.name} className="border-b" style={{ borderColor: "var(--wl-border)" }}>
                <td className="py-2">{m.name}</td>
                <td className="py-2 text-right font-mono">{qty} {m.unit}</td>
                <td className="py-2 text-right font-mono">${(qty * m.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="py-2">Total</td>
            <td />
            <td className="py-2 text-right font-mono">
              ${materials.reduce((sum, m) => sum + Math.ceil(length * m.rate * factor) * m.unitCost, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function QCChecklistBuilder() {
  const checks = [
    { item: "Substrate clean and dry", checked: true },
    { item: "Primer applied per manufacturer spec", checked: true },
    { item: "Membrane overlap meets minimum (4\")", checked: false },
    { item: "End dams installed at terminations", checked: false },
    { item: "Fastener spacing per wind zone", checked: true },
    { item: "Sealant joint width within tolerance", checked: false },
    { item: "Weep holes clear and unobstructed", checked: true },
    { item: "Protection board installed", checked: false },
  ];
  const [items, setItems] = useState(checks);
  function toggle(i: number) {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, checked: !item.checked } : item));
  }
  const done = items.filter((i) => i.checked).length;
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">QC Checklist — Parapet Assembly</h3>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-2 rounded-full bg-gray-200">
          <div className="h-2 rounded-full transition-all" style={{ width: `${(done / items.length) * 100}%`, backgroundColor: "var(--wl-primary, #1e3a5f)" }} />
        </div>
        <span className="text-xs font-mono">{done}/{items.length}</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <label key={i} className="flex items-center gap-3 py-1.5 cursor-pointer">
            <input type="checkbox" checked={item.checked} onChange={() => toggle(i)} className="rounded" />
            <span className={`text-sm ${item.checked ? "line-through text-brand-text-muted" : ""}`}>{item.item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DetailComparator() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Detail Comparator</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="card !p-3">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--wl-primary)" }}>Variant A: Standard Parapet — TPO</div>
          <div className="aspect-[4/3] bg-gray-50 rounded border flex items-center justify-center" style={{ borderColor: "var(--wl-border)" }}>
            <div className="text-center text-xs text-brand-text-muted">
              <div>Cap flashing: 24 ga steel</div>
              <div>Membrane: TPO 60 mil</div>
              <div>Height: 18&quot;</div>
              <div>Overlap: 4&quot;</div>
            </div>
          </div>
        </div>
        <div className="card !p-3">
          <div className="text-xs font-semibold mb-2" style={{ color: "var(--wl-primary)" }}>Variant B: Standard Parapet — EPDM</div>
          <div className="aspect-[4/3] bg-gray-50 rounded border flex items-center justify-center" style={{ borderColor: "var(--wl-border)" }}>
            <div className="text-center text-xs text-brand-text-muted">
              <div>Cap flashing: 24 ga steel</div>
              <div>Membrane: EPDM 60 mil</div>
              <div>Height: 18&quot;</div>
              <div>Overlap: 6&quot;</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 card !p-3">
        <div className="text-xs font-semibold mb-2">Differences</div>
        <div className="space-y-1 text-xs">
          <div className="flex gap-2"><span className="badge badge-degraded">Changed</span> Membrane type: TPO → EPDM</div>
          <div className="flex gap-2"><span className="badge badge-degraded">Changed</span> Overlap: 4&quot; → 6&quot;</div>
        </div>
      </div>
    </div>
  );
}

function WeatherPlaceholder() {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Weather Overlay</h3>
      <div className="card !p-6 text-center">
        <div className="text-4xl mb-2">&#9925;</div>
        <p className="text-sm text-brand-text-muted">Weather data integration is planned for a future release.</p>
        <p className="text-xs text-brand-text-muted mt-1">This tool will overlay weather forecasts on installation schedules to identify risk windows.</p>
        <span className="badge badge-unknown mt-3">Placeholder</span>
      </div>
    </div>
  );
}

const TOOL_COMPONENTS: Record<string, () => React.ReactNode> = {
  "takeoff": () => <TakeoffCalculator />,
  "spec-checker": () => <SpecChecker />,
  "condition-report": () => <ConditionReporter />,
  "detail-compare": () => <DetailComparator />,
  "rfi-drafter": () => <RFIDrafter />,
  "punch-list": () => <PunchListGenerator />,
  "sequencer": () => <AssemblySequencer />,
  "material-calc": () => <MaterialCalculator />,
  "qc-checklist": () => <QCChecklistBuilder />,
  "weather": () => <WeatherPlaceholder />,
};

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("all");

  const filtered = filterCat === "all" ? TOOLS : TOOLS.filter((t) => t.category === filterCat);

  if (activeTool) {
    const tool = TOOLS.find((t) => t.id === activeTool);
    const Component = TOOL_COMPONENTS[activeTool];
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        <button onClick={() => setActiveTool(null)} className="text-xs font-medium mb-4 hover:underline flex items-center gap-1" style={{ color: "var(--wl-secondary, #2d5f8a)" }}>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
          Back to Tools
        </button>
        <div className="card">
          {Component ? Component() : <p>Tool not found</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--wl-primary, #1e3a5f)" }}>Tools</h1>
        <p className="text-sm text-brand-text-muted mt-1">Construction analysis, compliance, and reporting tools</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCat === c.id ? "text-white" : "text-brand-text-muted hover:bg-gray-100 border"
            }`}
            style={filterCat === c.id ? { backgroundColor: "var(--wl-primary, #1e3a5f)" } : { borderColor: "var(--wl-border)" }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="card text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-semibold text-white capitalize"
                style={{ backgroundColor: CAT_COLORS[tool.category] }}
              >
                {tool.category}
              </span>
              {tool.status === "placeholder" && <span className="badge badge-unknown">Placeholder</span>}
            </div>
            <h3 className="text-sm font-semibold mt-1">{tool.name}</h3>
            <p className="text-xs text-brand-text-muted mt-1">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
