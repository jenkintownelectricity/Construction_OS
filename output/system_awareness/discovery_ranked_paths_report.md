# Discovery Ranked Paths Report

## Best Production Path
**Construction_Runtime SVG/DXF Writers + ShopDrawing_Compiler Export Engines**
- `Construction_Runtime/generator/svg_writer.py` — Generates SVG from DrawingInstructionSet
- `Construction_Runtime/generator/dxf_writer.py` — Generates DXF from DrawingInstructionSet
- `ShopDrawing_Compiler/engines/export/pdf_exporter.ts` — PDF export renderer
- Status: IDENTIFIED — requires DrawingInstructionSet adapter from assembly JSON

## Fallback Path
**White Lightning Vision OS Workstation Geometry Engine**
- `10-White-Lightning_Vision_OS/apps/workstation/lib/geometry-engine/` — 7 profiles, 5 generators
- `10-White-Lightning_Vision_OS/apps/workstation/export/` — SVG, DXF, PDF export renderers
- Status: IDENTIFIED — interactive workstation mode

## Emergency Preview Path (ACTIVE)
**Direct SVG Generation from Assembly Truth**
- Assembly JSON records → Parametric SVG generation → PRINT_STANDARD export
- Source: `10-Construction_OS/assemblies/barrett/` + `atlas/global_condition_atlas/`
- Status: ACTIVE — used for emergency delivery

## Repos Actually Used
- `10-Construction_OS` — primary source truth, output target
- `10-White-Lightning_Vision_OS` — geometry engine reference (read-only)
- `Construction_Runtime` — SVG/DXF writer reference (read-only)
- `ShopDrawing_Compiler` — export engine reference (read-only)
- `Construction_Assembly_Kernel` — assembly validation reference
- `Construction_ALEXANDER_Engine` — pattern resolution reference

## Tools Actually Used
- Direct parametric SVG generation (no runtime dependency)
- GitHub MCP push_files / create_or_update_file for deployment
- Python export scripts for PDF/DXF conversion
