# Standards Reference Model

## Purpose

This model defines how intelligence records reference building codes, test standards, and industry specifications. References are by **citation only** — no standards text is reproduced. All standard references resolve to entries in `shared_standards_registry.json`, which is the single source of truth for standards metadata across the construction-kernel family.

## Design Principle

Standards are copyrighted documents. This system never duplicates standards content. Intelligence records may observe that a standard is relevant to a finding, that a failure pattern relates to a code requirement, or that a trend correlates with a standards change — but the standard itself is referenced, not quoted.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `standard_ref_id` | string | yes | Reference ID matching an entry in `shared_standards_registry.json` (e.g., `ASTM_D4637`). |
| `citation` | string | yes | Formal citation string (e.g., "ASTM D4637/D4637M — Standard Specification for EPDM Sheet"). |
| `relevance_type` | enum | yes | `compliance_requirement`, `test_method`, `design_guidance`, `classification_basis`, `performance_benchmark`. |
| `section_reference` | string | no | Specific section, clause, or table within the standard (e.g., "Section 6.2.1"). |
| `relationship_note` | string | no | How this standard relates to the intelligence record (e.g., "Failure pattern occurs when Section 6.2.1 adhesion requirements are not met"). |
| `edition_year` | string | no | Specific edition referenced, if version-sensitive. |

## Relevance Types

- **compliance_requirement** — The standard imposes mandatory requirements relevant to the intelligence finding.
- **test_method** — The standard defines a test procedure used to generate evidence.
- **design_guidance** — The standard provides recommended practices relevant to the observation.
- **classification_basis** — The standard defines classification categories used by the intelligence record.
- **performance_benchmark** — The standard establishes performance thresholds referenced by the record.

## Constraints

1. Every `standard_ref_id` must resolve to a valid entry in `shared_standards_registry.json`.
2. No standards text beyond short citation strings may be stored in intelligence records.
3. When a standard is revised, intelligence records referencing the old edition should be reviewed and potentially superseded.
4. `section_reference` should be as specific as practicable to support traceability.

## Relationships

- Links to `shared_standards_registry.json` via `standard_ref_id`.
- Embedded within intelligence records as part of contextual metadata.
- Failure patterns, success patterns, and compatibility patterns frequently reference test standards and code requirements.
- Standards changes may drive trend observations (e.g., new energy code requirements changing insulation practices).

## Non-Duplication Posture

This model enforces the family-wide rule: standards knowledge is referenced, never owned. If intelligence suggests a standards gap or conflict, the appropriate action is a `schema_change_proposal` or `data_gap` record — not an amendment to standards references.
