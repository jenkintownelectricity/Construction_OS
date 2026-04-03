# Barrett DXF Semantic Taxonomy v0.2

**Date:** 2026-04-03
**Authority:** 10-Construction_OS (domain execution plane)
**Supersedes:** docs/manufacturer/dxf-semantic-taxonomy-v0.1.md

## Purpose

Lock the semantic classification framework for all Barrett DXF-derived geometry entities.
This taxonomy governs how raw DXF JSON entities are classified during additive enrichment.
All enrichment is ADDITIVE --- raw JSON is never mutated.

---

## Three Ownership Classes

### 1. SYSTEM_OWNED

Geometry belonging to the manufacturer's roofing / waterproofing assembly. These entities
represent materials and components that the Barrett system is responsible for.

**Barrett examples:**
- RamProof GC liquid-applied membrane
- RamTough 250 hot-applied membrane
- Black Pearl sheet membrane and adhesive
- RamFlash PMMA membrane, fleece, primer, catalyst
- Protection Course boards
- Ram Mastic sealant
- RAM POLY FELT 3.5 filter fabric
- Drainage Mat
- Reinforcement mesh

**Rule:** If the layer name matches a known Barrett product name or system component,
classify as SYSTEM_OWNED. Never promote to SYSTEM_OWNED without evidence.

### 2. CONTEXT_ONLY

Geometry shown for readability and installation context but NOT owned by the Barrett system.

**Barrett examples:**
- Substrate / structural slab / concrete deck
- Backup wall / masonry / CMU / foundation wall
- Overburden / pavers / ballast
- Steel framing / structural elements
- Insulation (when not system-specified)
- "Others" layer --- always CONTEXT_ONLY (context_geometry role)
- "Defpoints" layer --- always CONTEXT_ONLY (reference_geometry role)

**Rule:** If the layer is not a known system component and is not annotation, classify as
CONTEXT_ONLY. "Others" defaults to context_geometry. "Defpoints" defaults to reference_geometry.

### 3. ANNOTATION

Textual, callout, leader, and dimension content. Not geometry.

**Barrett examples:**
- TEXT / MTEXT entities (any layer)
- MULTILEADER entities (any layer)
- DIMENSION entities (any layer)
- "Text" layer
- "Dimensions" layer
- Note callouts

**Rule:** TEXT, MTEXT, MULTILEADER, and DIMENSION entity types are ALWAYS ANNOTATION
regardless of layer name. This is a hard rule with no override.

---

## Complete Semantic Role Inventory

### SYSTEM_OWNED Roles

| Role | Description | Barrett Layer Examples |
|------|-------------|----------------------|
| membrane | Sheet or monolithic waterproofing membrane | RAM Black Pearl Sheet, RamProof GC, RamTough 250, RT-250, Membrane |
| liquid_applied_membrane | Fluid-applied (cold or hot) membrane specifically | RamProof SYSTEM LIQUID |
| flashing | Base, counter, through-wall, or detail flashing | RamFlash, PMMA |
| primer | Primer or adhesive applied before membrane | Primer, RamFlash PMMA Primer |
| fleece | Polyester fleece reinforcement layer | Fleece, RamFlash Fleece |
| reinforcement_mesh | Embedded reinforcement mesh in fluid-applied systems | RamProof SYSTEM MESH |
| topcoat | Topcoat layer in multi-coat systems | (layer pattern: *topcoat*) |
| basecoat | Basecoat layer in multi-coat systems | (layer pattern: *basecoat*) |
| protection_course | Board or sheet protecting the membrane | Protection Course |
| sealant | Mastic, caulk, or sealant at transitions | Ram Mastic |
| filter_fabric | Filter fabric over drainage layer | RAM POLY FELT 3.5 FILTER FABRIC |
| drainage_layer | Drainage mat or composite drainage layer | Drainage Mat |
| transition | Cant strips, fillets at plane changes | (layer pattern: *cant*) |
| termination | Termination bars, mechanical fastening at edges | (layer pattern: *termination*, *term bar*) |

### CONTEXT_ONLY Roles

| Role | Description | Barrett Layer Examples |
|------|-------------|----------------------|
| substrate | Structural deck, slab, or base surface | Substrate, Concrete, Structural Slab |
| slab | Concrete slab specifically | (layer pattern: *slab*) |
| wall | Backup wall, masonry, CMU, foundation wall | Wall, Foundation Wall, Masonry |
| overburden | Pavers, ballast, or overburden above system | Overburden |
| insulation | Thermal insulation (when not system-specified) | Insulation |
| structure | Steel framing, structural elements | Structural, Steel |
| context_geometry | General context not otherwise classified | Others |
| reference_geometry | Reference / construction points | Defpoints |

### ANNOTATION Roles

| Role | Description | Barrett Layer Examples |
|------|-------------|----------------------|
| annotation | All text, dimensions, leaders, callouts | Text, Dimensions, MULTILEADER |

---

## Entity Type Defaults

Entity type classification takes precedence over layer-based classification for annotation types.

| Entity Type | Default Ownership | Default Semantic Role | Override Allowed |
|-------------|------------------|----------------------|-----------------|
| TEXT | ANNOTATION | annotation | No |
| MTEXT | ANNOTATION | annotation | No |
| MULTILEADER | ANNOTATION | annotation | No |
| DIMENSION | ANNOTATION | annotation | No |
| LWPOLYLINE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| HATCH | CLASSIFY_BY_LAYER | (by layer) | Yes |
| LINE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| ARC | CLASSIFY_BY_LAYER | (by layer) | Yes |
| CIRCLE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| INSERT | CLASSIFY_BY_LAYER | (by layer) | Yes |
| SPLINE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| POLYLINE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| ELLIPSE | CLASSIFY_BY_LAYER | (by layer) | Yes |
| POINT | CLASSIFY_BY_LAYER | (by layer) | Yes |

---

## Barrett Product Families

### Black Pearl (FAM-BARRETT-BLACK-PEARL)
- **Type:** Cold-applied rubberized asphalt sheet system
- **CSI:** 07 11 13
- **Known owned layers:** RAM Black Pearl Sheet, Black Pearl, Protection Course
- **Key roles:** membrane, primer, protection_course

### RamFlash PMMA (FAM-BARRETT-PMMA)
- **Type:** PMMA-based flashing and detail system
- **CSI:** 07 62 00
- **Known owned layers:** PMMA, RamFlash, Fleece, Primer
- **Key roles:** membrane, flashing, fleece, primer

### RamProof GC (FAM-BARRETT-RAMPROOF-GC)
- **Type:** Single-component cold fluid-applied elastomeric membrane
- **CSI:** 07 11 13
- **Known owned layers:** RamProof GC, RamProof, Membrane, RamProof SYSTEM LIQUID, RamProof SYSTEM MESH, Ram Mastic, RAM POLY FELT 3.5 FILTER FABRIC, Drainage Mat, Protection Course, Primer
- **Key roles:** liquid_applied_membrane, reinforcement_mesh, sealant, filter_fabric, drainage_layer, protection_course, primer

### RamTough 250 (FAM-BARRETT-RT250)
- **Type:** Hot fluid-applied rubberized asphalt membrane
- **CSI:** 07 11 13
- **Known owned layers:** RamTough 250, RT-250, RT250, Membrane, Protection Course
- **Key roles:** membrane, primer, protection_course
- **Note:** Often paired with PMMA for flashing details

---

## Progressive Ingestion Context

Semantic enrichment follows a progressive ingestion strategy:

1. **GOLDEN_SEED (1 file):** Cleanest file per family. Full manual validation.
   All layer-to-role mappings are confirmed by operator.
2. **CLEAN_5 (5 files):** Low-noise files. Automated enrichment with operator spot-check.
3. **MODERATE_5 (5 files):** Medium-noise files. Automated enrichment, flag new layers.
4. **NOISY_10 (10 files):** High-noise files. Automated enrichment, expect new/ambiguous layers.
5. **REMAINDER:** Bulk processing. Automated enrichment with anomaly flagging.

**Single-occurrence layer rule:** A layer name that appears in only one file within a family
cannot be promoted to a global classification for that family without explicit operator
confirmation. It may be a drafting artifact, a one-off layer, or a misnamed layer.

---

## Enrichment Posture

1. Raw DXF JSON is READ-ONLY --- never modified
2. Semantic enrichment is ADDITIVE --- stored in separate *.semantic.json files
3. Enrichment references source JSON by file path and entity index
4. Lineage traces back to original DXF file path
5. Output goes to `source/barrett/json_semantic/<family>/`
6. Schema: `schemas/dxf_entity_semantic_enrichment.schema.json`

---

## Ambiguity Handling

- If a layer cannot be classified by name pattern: default CONTEXT_ONLY / unclassified_context
- If an entity type is unknown: default CONTEXT_ONLY / unclassified_context
- Flag ambiguous classifications for operator review
- Never silently promote CONTEXT_ONLY to SYSTEM_OWNED without evidence
- "Others" is CONTEXT_ONLY / context_geometry (NOT junk)
- "Defpoints" is CONTEXT_ONLY / reference_geometry

---

## Config and Schema References

- Taxonomy: `docs/BARRETT_DXF_SEMANTIC_TAXONOMY_v0.2.md` (this file)
- Previous: `docs/manufacturer/dxf-semantic-taxonomy-v0.1.md`
- Enrichment schema: `schemas/dxf_entity_semantic_enrichment.schema.json`
- Per-record schema: `schemas/manufacturer/dxf_semantic_enrichment_record.schema.json`
- Layer semantic map: `config/barrett_layer_semantic_map.json`
- Ownership role map: `config/barrett_ownership_role_map.json`
- Entity type defaults: `config/barrett_entity_type_defaults.json`
- Semantic defaults: `config/manufacturer/dxf_semantic_defaults.json`
- Ownership classes: `config/manufacturer/ownership_class_defaults.json`
- RamProof GC seed: `config/manufacturer/barrett_layer_semantic_seed_ramproof_gc.json`
- Family definitions: `source/barrett/definitions/*.definition.json`

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | 2026-04-02 | Initial taxonomy with generic layer patterns |
| v0.2 | 2026-04-03 | Added all Barrett family definitions. Added liquid_applied_membrane, reinforcement_mesh, filter_fabric, drainage_layer, reference_geometry roles. Added entity defaults table. Added progressive ingestion context. Added Barrett-specific layer examples. Separated primer from primer_adhesive. Added slab, basecoat, topcoat as distinct roles. |
