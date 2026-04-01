# BARRETT SOURCE LIBRARY POSTURE v0.1

**Authority:** 10-Construction_OS
**Manufacturer:** Barrett Company
**System Family:** SBS Modified Bitumen
**Wave:** 1 — Source Detail Library
**Date:** 2026-04-01

---

## Overview

This document defines the posture of the Barrett manufacturer source detail library within the Construction OS domain. The source library is the canonical truth set from which all downstream capabilities (normalization, assembly modeling, condition resolution, compilation, distribution) derive.

---

## Source Truth Set

### Mapping Configuration
- **Path:** `config/detail_atlas_mapping.barrett.json`
- **Contents:** Layer-to-system mappings, block-to-component normalization rules, regex manufacturer/system detection, condition classification heuristics, template lookup, default assembly constraints
- **Status:** Canonical

### Assembly Primitives (5)
| Detail ID | Condition | Completeness |
|-----------|-----------|-------------|
| barrett_sbs_parapet_ext_001 | parapet_termination | **Complete** — 9 components, 8 constraints, warranty, CSI |
| barrett_sbs_roof_drain_001 | roof_drain | Derived — from condition heuristics |
| barrett_sbs_pipe_pen_001 | pipe_penetration | Derived — from condition heuristics |
| barrett_sbs_wall_trans_001 | roof_to_wall_transition | Derived — from condition heuristics |
| barrett_sbs_edge_term_001 | edge_termination | Derived — from condition heuristics |

### Normalized Example
- **Path:** `examples/normalized/barrett_example_output.json`
- **Contents:** Fully normalized parapet termination with source quantities, dimensions, component mappings, and full lineage chain

### SVG Template
- **Path:** `templates/barrett_parapet_base.svg`
- **Contents:** Parapet termination detail template with structural components, dimension lines, and Detail Atlas branding

---

## Tools

| Tool | Path | Status | Tests |
|------|------|--------|-------|
| Semantic Normalizer | `tools/detail_atlas_normalizer.py` | Proven | 38/38 pass |
| Detail Compiler | `tools/detailatlas_compiler.py` | Proven | Requires reportlab |
| Constraint Validator | `tools/validator.py` | Proven | Integrated with compiler |

---

## Condition Catalog

The Barrett SBS system covers 5 condition types through the condition heuristics configuration:

1. **Parapet Termination** — Wall-to-roof termination with flashing, cant strip, termination bar, metal coping
2. **Roof Drain** — Deck penetration with flashing collar and clamping ring
3. **Pipe Penetration** — Mechanical penetration through membrane
4. **Roof-to-Wall Transition** — Base flashing at wall-to-roof transitions
5. **Edge Termination** — Metal edge termination at roof perimeter

---

## Governance Posture

- **Fail-closed:** Normalizer rejects input if manufacturer, system, or condition cannot be resolved
- **Deterministic:** Same input always produces same assembly ID and node ID (SHA-256 based)
- **Config-driven:** All mappings and heuristics defined in JSON config, not hardcoded
- **Lineage mandatory:** Every output traces to source file, normalizer version, config version, and governance kernel
- **Constraint evaluation precedes execution:** Compiler is blocked when validator returns HALT

---

## Known Gaps

1. Only 1 of 5 assemblies is fully complete (parapet termination)
2. Derived assemblies lack component definitions, constraints, and warranty envelopes
3. No raw DXF/DWG source files are present in the repository (pipeline starts from JSON)
4. No geometry extraction schema exists yet
5. Condition resolution is embedded in config heuristics, not a standalone engine

---

## Next Wave Target

Wave 2 should formalize the geometry extraction schema and document the DXF-to-JSON pipeline contract.
