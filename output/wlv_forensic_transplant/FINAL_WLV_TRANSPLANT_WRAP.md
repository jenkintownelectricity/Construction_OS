# WLV Forensic Transplant — Final Wrap

## What WLV Route Contributed
WLV's zone-based composition model (drawing/callout/titleblock zones) informed the v3 renderer layout. However, the specific visual improvements (patterns, hatches, notes, enlarged insets) came from operator-refined SVGs, not WLV code.

## What Was Transplanted
Into `renderers/svg_section_renderer.py` v3:
1. Concrete stipple pattern overlay on substrate layers
2. Insulation diagonal hatch pattern overlay
3. Fleece diagonal pattern with dashed stroke
4. Extension lines from dimension endpoints to geometry
5. Filled numbered callout circles with white text
6. Vertical-sorted callout routing (no crossing)
7. Bordered note boxes for condition-specific warnings
8. Zone-based layout: drawing (0-620px), callouts (700px+), titleblock (bottom)
9. Primer layer style (thin dashed)
10. Membrane fill (#D8D8D8) instead of stroke-only

## What Remains in WLV Only
- Interactive Next.js workstation
- Real-time geometry editing
- 3D preview rendering
- Detail sheet exporter (TS, superseded for batch by Python renderer)

## DEV MODE / Sentinel Surface
Designed as a JSON-based pipeline state inspector. Monitors generator→renderer→export→packet chain. Warns on missing artifacts, duplicate paths, stale outputs. See sentinel_rulebook.json.

## Organization Rules Now Exist
`docs/architecture/GENERATOR_ENGINE_RENDERER_ORGANIZATION_RULES.md` defines:
- generators/ = condition → geometry
- renderers/ = geometry → sheet
- composers/ = future layout/notes (currently in renderer)
- tools/ = export utilities
- No hidden exporters in UI repos

## Parts Candidate for Removal
See `surgical_cleanup_plan.md` — 4 duplicate exporter paths, 2 empty repos, 4 schema-only kernels flagged for archive.

## Is the Canonical Pipeline Stronger Now?
**Yes.** The v3 renderer produces sheets with:
- Real material patterns (stipple, hatch, diagonal)
- Non-crossing callout leaders
- Prominent condition notes
- Better dimension extension lines
- Filled numbered callouts matching architectural convention

Proven on parapet, drain, expansion joint — all 9/9 checks PASS.

## Next Hardening Target
**Enrich the parametric generator** with condition-specific geometry (drain arcs, bellows curves, 3-step diagrams) so the renderer receives richer input geometry to draw.
