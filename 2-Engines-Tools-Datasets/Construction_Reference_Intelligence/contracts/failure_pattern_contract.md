# Failure Pattern Contract

## Purpose
Documents recurring failure patterns observed across construction assemblies. Links failure modes to root causes, control layers, interface zones, and supporting evidence to enable predictive intelligence.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `pattern_id` — Unique identifier.
- `title` — Human-readable title.
- `status` — One of: `active`, `draft`, `deprecated`, `superseded`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.
- `failure_mode` — Description of the failure mode observed.

## Validation Rules
- `pattern_id` must be globally unique within the intelligence layer.
- `confidence`, `status`, `control_layers`, `interface_zones`, and `lifecycle_stage` must use shared enum values from `shared_enum_registry.json`.
- `root_cause_category` must be one of the nine defined categories (e.g., `material_defect`, `installation_error`).
- `severity` must use risk_levels enum: `critical`, `high`, `medium`, `low`.
- `evidence_refs` must reference valid `evidence_reference` records.
- `kernel_refs` must include both `kernel` and `entry_id`.
- `climate_context` and `geometry_context` must conform to their respective schemas.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `draft` -> `active` -> `deprecated` or `superseded`.
- Supersession must be tracked via a `supersession_record`.
- Confidence changes must be tracked via `confidence_evolution_record`.
- All changes must preserve evidence traceability and lineage.
