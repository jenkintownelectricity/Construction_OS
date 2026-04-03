# Barrett Golden Seed Posture v0.1

## Purpose

This document records the selection rationale, layer inventory, and validation posture for the Barrett RamProof GC golden seed candidate. The golden seed is the single cleanest DXF file from the Barrett library, used as the foundation for layer semantic and ownership classification across the RamProof GC family.

## Golden Seed Selection Rationale

The golden seed candidate was selected from the Barrett DXF cleanliness ranking (`source/barrett/census/barrett_dxf_cleanliness_ranking.md`), which ranked all 74 Barrett DXF files by noise score.

**Selected file:** `202-R00-V01-071416-BARR-RP-RA-01-ROOFASSEMBLY-STD`

**Selection criteria (Rank 1 of 74):**

| Metric             | Value  |
|---------------------|--------|
| Noise Score         | 3.8034 |
| Layer Count         | 8      |
| Entity Count        | 464    |
| Annotation Ratio    | 0.0151 |
| Context Ratio       | 0.9698 |
| Family              | RamProof_GC |

This file has the lowest noise score in the entire Barrett library. Its 8 layers represent a minimal, focused layer set. The annotation ratio of 1.5% means almost no text/dimension clutter. The context ratio of 97% indicates the file is overwhelmingly geometry, which is ideal for establishing clean layer-to-semantic mappings.

## Seed Layer Inventory

The following 11 layers are known from the committed RamProof GC seed map (`config/manufacturer/barrett_layer_semantic_seed_ramproof_gc.json`):

### SYSTEM_OWNED Layers (7 layers)

| Layer Name | Semantic Role | Notes |
|---|---|---|
| RamProof SYSTEM LIQUID | liquid_applied_membrane | Primary membrane component |
| RamProof SYSTEM MESH | reinforcement_mesh | Reinforcement layer |
| Ram Mastic | sealant | Mastic sealant |
| RAM POLY FELT 3.5 FILTER FABRIC | filter_fabric | Filter/separation fabric |
| Drainage Mat | drainage_layer | Drainage composite |
| Protection Course | protection_course | Protection board/course |
| Primer | primer | Surface primer |

### CONTEXT_ONLY Layers (2 layers)

| Layer Name | Semantic Role | Notes |
|---|---|---|
| Others | context_geometry | Default context; NOT junk |
| Defpoints | reference_geometry | AutoCAD reference points |

### ANNOTATION Layers (2 layers)

| Layer Name | Semantic Role | Notes |
|---|---|---|
| Text | annotation | Text entities |
| Dimensions | annotation | Dimension entities |

## Confirmed vs. Requires Validation

### Confirmed from committed evidence

- **Layer names**: All 11 layer names come from the committed seed map (`barrett_layer_semantic_seed_ramproof_gc.json`). These are real layer names observed in the DXF files.
- **Semantic roles**: The semantic role assignments come from the same committed seed map, authored during manufacturer onboarding.
- **Ownership roles**: Ownership assignments (SYSTEM_OWNED, CONTEXT_ONLY, ANNOTATION) come from the committed seed map and are consistent with `config/manufacturer/ownership_class_defaults.json`.
- **Cleanliness ranking**: The ranking was computed from actual DXF JSON census data and is committed to the repo.
- **Family definition**: `source/barrett/definitions/ramproof_gc.definition.json` confirms the RamProof GC system structure, CSI section, and component list.

### Requires local operator validation (LOCAL_OPERATOR_REQUIRED)

- **Golden seed file contents**: The raw DXF JSON (`source/barrett/json/RamProof_GC/202-R00-V01-071416-BARR-RP-RA-01-ROOFASSEMBLY-STD.json`) is gitignored. The actual layer names present in that specific file have not been verified against the seed map in this session.
- **Layer count discrepancy**: The cleanliness ranking reports 8 layers in the golden seed file, but the seed map contains 11 layers. The seed map may include layers from other RamProof GC files. Operator must confirm which of the 11 layers actually appear in the golden seed.
- **Single-occurrence layers**: Any layers that appear in only one file cannot be promoted to global classifications without operator confirmation.
- **Cross-family applicability**: The seed map is RamProof GC specific. Other Barrett families (RT-250, Black_Pearl, PMMA) will have different layer sets.

## Entity Type Defaults

Entity-type-based classification follows `config/manufacturer/dxf_semantic_defaults.json`:

- TEXT, MTEXT, MULTILEADER, DIMENSION --> ANNOTATION
- All geometric entity types (LWPOLYLINE, HATCH, LINE, ARC, CIRCLE, INSERT, SPLINE, POLYLINE, ELLIPSE, POINT) --> CLASSIFY_BY_LAYER
- Fallback for unknown layers: CONTEXT_ONLY
- Fallback for unknown entity types: CONTEXT_ONLY

## Manufacturer Fingerprint Seed

**Barrett Company / RamProof GC patterns observed:**

- Layer naming convention: Product-descriptive names (e.g., "RamProof SYSTEM LIQUID", "RAM POLY FELT 3.5 FILTER FABRIC")
- Mixed case conventions: Some layers use Title Case ("Drainage Mat"), others ALL CAPS ("RAM POLY FELT...")
- System layers map directly to product components in the assembly
- "Others" layer is the catch-all context layer (NOT junk)
- "Defpoints" is standard AutoCAD reference geometry
- Annotation is split across "Text" and "Dimensions" layers
- File naming pattern: `202-R00-V01-071416-BARR-RP-{detail_code}-{detail_type}`
- Family ID pattern: `FAM-BARRETT-RAMPROOF-GC`
- CSI Section: 07 11 13 (single-component fluid-applied waterproofing)

## Honest Posture Statement

This golden seed posture is built entirely from committed evidence in the repository. No layer names, semantic roles, or ownership assignments were fabricated. The seed maps (`config/barrett_layer_semantic_map.seed.json` and `config/barrett_layer_ownership_map.seed.json`) reflect the real RamProof GC layer vocabulary as recorded in the committed seed configuration.

However, full validation is **PARTIAL**:

1. The raw DXF JSON files are gitignored and not available for direct inspection.
2. The 8-layer vs. 11-layer discrepancy between the golden seed file and the full seed map has not been resolved.
3. No entity-level counts per layer have been verified against the golden seed file.
4. Cross-file layer consistency within the RamProof GC family has not been confirmed.

**Status: PARTIAL -- full seed validation requires LOCAL_OPERATOR_REQUIRED**

## Source Files

| Artifact | Path |
|---|---|
| Cleanliness ranking | `source/barrett/census/barrett_dxf_cleanliness_ranking.md` |
| RamProof GC seed map | `config/manufacturer/barrett_layer_semantic_seed_ramproof_gc.json` |
| Family definition | `source/barrett/definitions/ramproof_gc.definition.json` |
| Semantic defaults | `config/manufacturer/dxf_semantic_defaults.json` |
| Ownership defaults | `config/manufacturer/ownership_class_defaults.json` |
| Seed semantic map (output) | `config/barrett_layer_semantic_map.seed.json` |
| Seed ownership map (output) | `config/barrett_layer_ownership_map.seed.json` |
| Golden seed receipt (output) | `receipts/barrett_ingestion/golden_seed_receipt.json` |
