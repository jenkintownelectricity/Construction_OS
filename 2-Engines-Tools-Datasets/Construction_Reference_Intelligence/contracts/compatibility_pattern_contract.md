# Compatibility Pattern Contract

## Purpose
Records material and chemistry compatibility assessments between construction materials. Tracks whether combinations are compatible, incompatible, conditional, or unknown, with supporting evidence and conditions.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `pattern_id` — Unique identifier.
- `title` — Human-readable title.
- `status` — One of: `active`, `draft`, `deprecated`, `superseded`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.
- `compatibility_result` — One of: `compatible`, `incompatible`, `conditional`, `unknown`.

## Validation Rules
- `pattern_id` must be globally unique within the intelligence layer.
- `confidence`, `status`, and `compatibility_result` must use defined enum values.
- `material_refs` and `chemistry_refs` should reference valid material/chemistry identifiers.
- `conditions` should describe the specific conditions under which the result applies when `compatibility_result` is `conditional`.
- `evidence_refs` must reference valid `evidence_reference` records.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `draft` -> `active` -> `deprecated` or `superseded`.
- Changes to `compatibility_result` require updated evidence and confidence reassessment.
- Safety-critical incompatibilities should have `high` or `established` confidence before acting upon.
