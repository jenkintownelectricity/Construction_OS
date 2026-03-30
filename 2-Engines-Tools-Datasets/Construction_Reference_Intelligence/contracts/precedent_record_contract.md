# Precedent Record Contract

## Purpose
Captures historical construction cases as precedents. Each record documents a specific case with its outcome and lessons learned, linked to kernel truth and supporting evidence.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `precedent_id` — Unique identifier.
- `title` — Human-readable title.
- `status` — One of: `active`, `draft`, `deprecated`, `superseded`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.

## Validation Rules
- `precedent_id` must be globally unique within the intelligence layer.
- `confidence` and `status` must use shared enum values from `shared_enum_registry.json`.
- `case_date` must be a valid ISO 8601 date when provided.
- `evidence_refs` must reference valid `evidence_reference` records.
- `kernel_refs` must include both `kernel` and `entry_id`.
- `lessons` array items must be non-empty strings.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `draft` -> `active` -> `deprecated` or `superseded`.
- Supersession must be tracked via a `supersession_record`.
- Historical accuracy must be maintained; edits must preserve original case facts.
