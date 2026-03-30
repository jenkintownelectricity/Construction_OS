# AI Readiness Posture

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](../doctrine/reference-intelligence-doctrine.md)

## Principle

This repository is designed to be consumed by both human practitioners and AI systems. All intelligence is structured for machine readability while remaining human-auditable. However, AI systems may **read** intelligence — they may not **autonomously mutate** it.

## Machine-Readable Design

### Structured Schemas

All intelligence records conform to JSON schemas defined in the `schemas/` directory. Schema compliance is a validation gate for any record entering `active` status. This ensures:

- Predictable field names and types across all records.
- Enumerated values for categorical fields (control layers, interface zones, confidence levels, failure modes).
- Required vs. optional fields are explicit.
- Cross-references use identifiers, not free text.

### Enumerated Vocabularies

Controlled vocabularies are maintained in shared registries:

- `shared/shared_taxonomy.json` — classification hierarchy
- `shared/shared_enum_registry.json` — enumerated value sets
- `shared/control_layers.json` — 11 control layers
- `shared/interface_zones.json` — 10 interface zones
- `shared/shared_standards_registry.json` — referenced standards
- `shared/shared_evidence_registry.json` — evidence sources
- `shared/shared_risk_registry.json` — risk classifications

AI systems can ingest these registries to understand the vocabulary space without ambiguity.

### Relationship Graphs

Intelligence records cross-reference each other and reference kernel truth by identifier. This creates a traversable graph suitable for:

- Semantic search and retrieval.
- Pattern clustering and similarity analysis.
- Impact analysis (e.g., "if this material is deprecated, what failure patterns reference it?").
- Confidence aggregation across related records.

## No Execution Leakage

This repository contains **no executable code, no APIs, no triggers, no webhooks, no scheduled jobs**. AI systems that consume this intelligence must implement their own execution logic in separate, governed systems. The intelligence layer is a data source, not a runtime.

## AI Consumption Modes

| Mode | Permitted | Description |
|---|---|---|
| **Read** | Yes | AI systems may read, parse, and reason over all records and schemas |
| **Query** | Yes | AI systems may traverse relationships, filter by control layer, search by confidence level |
| **Propose** | Yes | AI systems may generate draft intelligence records for human review |
| **Commit** | No | AI systems may not autonomously commit records to `active` status |
| **Mutate** | No | AI systems may not modify existing committed records |
| **Delete** | No | AI systems may not remove records |

## Proposal Workflow

AI systems may propose new intelligence by:

1. Generating a draft record conforming to the relevant schema.
2. Placing it in the proposal zone (see [DB Expansion Posture](db-expansion-posture.md)).
3. A human reviewer evaluates evidence linkage, confidence justification, and scope alignment.
4. Upon approval, the record transitions to `active` through standard governance.

## Schema Versioning

Schemas are versioned and frozen per baseline (see [FROZEN_SEAMS.md](../system/FROZEN_SEAMS.md)). AI systems should check the schema version of records they consume to ensure compatibility. Schema migrations are explicit and documented.
