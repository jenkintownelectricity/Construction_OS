# Schema Change Proposal Contract

## Purpose
Formalizes a proposal to modify an existing schema definition within the intelligence layer. Ensures schema evolution is governed, traceable, and backward-compatible where possible.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `proposal_id` — Unique identifier.
- `target_schema` — The schema file being proposed for change.
- `title` — Human-readable title.
- `status` — One of: `proposed`, `approved`, `rejected`, `implemented`.
- `proposed_date` — ISO 8601 date of proposal.
- `rationale` — Justification for the schema change.

## Validation Rules
- `proposal_id` must be globally unique within the intelligence layer.
- `target_schema` must reference an existing schema file.
- `status` must use the defined enum values.
- `proposed_date` must be a valid ISO 8601 date.
- `rationale` must be a non-empty string.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `proposed` -> `approved` or `rejected`; `approved` -> `implemented`.
- Breaking changes require migration plan documentation before approval.
- Implemented changes must update the target schema and bump schema_version if needed.
