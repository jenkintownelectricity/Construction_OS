# Construction Reference Intelligence — v0.1

## Purpose

The Construction Reference Intelligence layer provides accumulated observational knowledge about CSI Division 07 (Building Envelope Systems). It **observes** kernel truth but does **not** own or override it. The kernel remains the authoritative source for product data, assembly definitions, and standards compliance. Intelligence adds pattern recognition, failure analysis, trend detection, and confidence-tracked guidance on top of kernel facts.

## Scope — v0.1

v0.1 covers the foundational models required to store, link, and reason about building-envelope intelligence:

| Category | Models |
|---|---|
| Core record infrastructure | record, source, evidence, confidence, supersession |
| Observation patterns | failure, success_pattern, precedent, trend, compatibility_pattern |
| Contextual dimensions | interface_risk, lifecycle_context, climate_context, geometry_context |
| Evolution & detection | confidence_evolution, pattern_detection, data_gap |
| Governance & expansion | dataset_discovery, ingestion_proposal, schema_change_proposal, db_expansion_proposal |
| External references | standards_reference (citation-only, linked to shared_standards_registry) |

## Design Principles

1. **Evidence-linked** — Every intelligence record must reference at least one evidence item. No unsupported assertions.
2. **Confidence-tracked** — All records carry an explicit confidence level with basis tracking.
3. **Append-only lineage** — Records are never deleted; they are superseded. Full lineage is preserved.
4. **Kernel-observing** — Intelligence references kernel objects (products, assemblies, interfaces) by ID but never modifies them.
5. **Governance-gated expansion** — New datasets, schema changes, and database zone expansions require formal proposals and approval.

## Relationship to Kernel

- Intelligence records reference kernel objects via `kernel_refs` (product IDs, assembly IDs, interface zone IDs).
- Intelligence does not duplicate kernel data; it annotates, correlates, and interprets it.
- When intelligence contradicts kernel truth, a `data_gap` or `schema_change_proposal` is raised — never an override.

## Database Zones

| Zone | Ownership | Contents |
|---|---|---|
| canonical_truth_zone | Kernel | Products, assemblies, standards compliance |
| reference_intelligence_zone | Intelligence layer | Patterns, trends, evidence, confidence records |
| proposal_zone | Governance | Ingestion proposals, schema changes, expansion requests |

## Status

v0.1 — initial model definitions. No production data loaded. Models are descriptive (markdown), not yet code-enforced schemas.
