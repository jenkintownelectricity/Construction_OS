# WLV Forensic Trace Report

## What WLV Did Better
WLV's export renderers (SVGExportRenderer.ts, detail_sheet_exporter.ts) use a **zone-based composition model**: drawing zone, title block zone, notes zone. This produces cleaner sheet layout than rendering everything into one flat coordinate space.

However, WLV's renderers do NOT contain:
- Pattern/hatch rendering (no concrete stipple, no insulation hatch)
- Non-crossing leader logic
- Condition-specific note boxes
- Enlarged detail insets

## What Actually Made the Earlier White Packet Better
The stronger white Barrett PMMA sheets (07-10) were refined by **direct operator editing**, not by WLV code. The operator added:
1. `<pattern>` defs — concrete-stipple, insulation-hatch, fleece-diagonal, tile-hatch, mortar-dots
2. Enlarged detail insets (crack control joint has zoomed joint view)
3. 3-step sequence diagrams (outside corner has STEP 1/2/3 boxes)
4. Bellows with accordion profile (expansion joint)
5. Drooping loose-laid fleece curve (expansion joint)
6. Layer bracket notation (tile overburden)
7. Prominent note boxes (HYPPOCOAT 250, RELIEF CUT, DO NOT BRIDGE)

## What Was Transplanted Into Canonical Renderer
From operator-refined SVG patterns:
- Concrete stipple pattern overlay on substrate rects
- Insulation diagonal hatch pattern overlay
- Fleece diagonal pattern for fleece elements
- Note box rendering with bordered boxes
- Extension lines from dimension endpoints to geometry
- Numbered callout circles (filled black with white number)
- Vertical-sorted callout routing to prevent leader crossing

From WLV zone model (concept only):
- Drawing zone (left 620px) + callout zone (right from x=700) + titleblock zone (bottom 56px)

## What Should Remain in WLV Only
- Interactive workstation UI (Next.js app)
- Real-time geometry editing
- 3D preview rendering
- Interactive callout placement

## What Should NOT Be Copied
- WLV's PDFExportRenderer.ts (just an HTML wrapper, less capable than cairosvg)
- WLV's SVGExportRenderer.ts composition (already superseded by v3 renderer)
