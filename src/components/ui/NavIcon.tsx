"use client";

// Minimal inline SVG icons — no dependency needed
const ICONS: Record<string, string> = {
  grid: "M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z",
  map: "M9 2L3 5v16l6-3 6 3 6-3V2l-6 3-6-3zM9 5.5v13M15 5.5v13",
  folder: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  blueprint: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16",
  factory: "M2 20h20M5 20V8l4 3V8l4 3V4h6v16",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 110 6 3 3 0 010-6z",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6",
  wrench: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  scan: "M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M7 12h10M12 7v10",
  cpu: "M4 4h16v16H4zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3",
  palette: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.1 2.5-.3.5-.1.9-.6.9-1.1 0-.3-.1-.6-.3-.8-.2-.3-.3-.6-.3-.9 0-.8.7-1.5 1.5-1.5H18c3.3 0 6-2.7 6-6 0-5.5-5.4-9.4-12-9.4z",
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const d = ICONS[name];
  if (!d) return null;

  // Some icons use strokes (map, layers, eye), others use fill
  const strokeIcons = new Set(["map", "layers", "eye", "file", "wrench", "scan"]);
  const useStroke = strokeIcons.has(name);

  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "w-4 h-4"}
      fill={useStroke ? "none" : "currentColor"}
      stroke={useStroke ? "currentColor" : "none"}
      strokeWidth={useStroke ? 2 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
