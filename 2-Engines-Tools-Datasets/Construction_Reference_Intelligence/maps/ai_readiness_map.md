# AI Readiness Map

## Purpose

Documents how Construction_Reference_Intelligence is structured for machine consumption.
All records are schema-valid, deterministic, and free of execution leakage.

## Schema Design Principles

| Principle               | Implementation                                    |
|------------------------|--------------------------------------------------|
| Machine-readable       | All records are JSON with defined schemas          |
| Typed fields           | Enums for status, confidence, severity, categories |
| Stable identifiers     | Pattern IDs, evidence IDs, kernel refs use fixed formats |
| No prose dependencies  | Structured fields carry meaning; notes are supplemental |
| No execution logic     | Records describe truth — no commands, no triggers  |

## Structured Record Types

| Record Type              | ID Format     | Schema File                          |
|-------------------------|---------------|--------------------------------------|
| Failure pattern          | FP-XX-NNN    | failure_pattern.schema.json           |
| Success pattern          | SP-XX-NNN    | success_pattern.schema.json           |
| Trend record             | TR-XX-NNN    | trend_record.schema.json              |
| Precedent record         | PR-XX-NNN    | precedent_record.schema.json          |
| Data gap record          | DG-XX-NNN    | data_gap_record.schema.json           |
| Confidence evolution     | CE-XX-NNN    | confidence_evolution_record.schema.json|
| Dataset candidate        | DC-XX-NNN    | dataset_candidate.schema.json         |
| Pattern detection        | PD-XX-NNN    | pattern_detection_record.schema.json  |
| Schema change proposal   | SCP-NNN      | schema_change_proposal.schema.json    |
| DB expansion proposal    | DBX-NNN      | db_expansion_proposal.schema.json     |
| Ingestion proposal       | IP-NNN       | dataset_ingestion_proposal.schema.json|

## AI Consumption Guarantees

1. Every record has a `schema_version` field for compatibility tracking.
2. All cross-references use stable IDs — no free-text pointers.
3. Enum fields are closed sets — no ambiguous string values.
4. Confidence levels are explicit: `low | medium | high | established`.
5. Status lifecycle is deterministic: `draft -> active -> superseded | retired`.
6. No embedded instructions, prompts, or executable content in any record.

## Execution Leakage Prevention

- Records contain **observations**, not **actions**.
- Proposals (schema change, DB expansion) are separate record types — clearly bounded.
- No record type triggers automated behavior.

## Query Patterns Supported

- Filter by control layer, interface zone, climate zone, confidence level.
- Cross-reference via kernel_refs to any of the five kernel repositories.
- Aggregate by failure mode, root cause category, severity.
- Temporal queries via lifecycle_stage and date fields.
