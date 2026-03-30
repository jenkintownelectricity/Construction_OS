# Reference Record Contract

## Purpose
Base record for notes, annotations, and cross-references within the reference intelligence layer. Provides the foundational linking structure between kernel truth and derived intelligence.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `record_id` — Unique identifier. Must not collide with any other record type.
- `record_type` — One of: `reference_note`, `annotation`, `cross_reference`.
- `title` — Human-readable title.
- `status` — One of: `active`, `draft`, `deprecated`, `superseded`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.
- `created_date` — ISO 8601 date.

## Validation Rules
- `record_id` must be globally unique within the intelligence layer.
- `confidence` and `status` must use shared enum values from `shared_enum_registry.json`.
- `control_layers` and `interface_zones` values must match the shared registry enums.
- `kernel_refs` must reference valid kernel entries with both `kernel` and `entry_id`.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `draft` -> `active` -> `deprecated` or `superseded`.
- Supersession must be tracked via a `supersession_record` when status becomes `superseded`.
- All changes must preserve lineage and evidence traceability.
