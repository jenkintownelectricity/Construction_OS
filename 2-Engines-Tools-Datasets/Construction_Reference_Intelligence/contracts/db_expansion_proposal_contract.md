# DB Expansion Proposal Contract

## Purpose
Formalizes a proposal to expand a database zone within the construction intelligence system. Governs growth of the canonical truth zone, reference intelligence zone, or proposal zone.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `proposal_id` — Unique identifier.
- `target_zone` — One of: `canonical_truth_zone`, `reference_intelligence_zone`, `proposal_zone`.
- `title` — Human-readable title.
- `status` — One of: `proposed`, `approved`, `rejected`, `implemented`.
- `proposed_date` — ISO 8601 date of proposal.
- `rationale` — Justification for the zone expansion.

## Validation Rules
- `proposal_id` must be globally unique within the intelligence layer.
- `target_zone` must use the defined enum values.
- `status` must use the defined enum values.
- `proposed_date` must be a valid ISO 8601 date.
- `rationale` must be a non-empty string.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `proposed` -> `approved` or `rejected`; `approved` -> `implemented`.
- Expansion of `canonical_truth_zone` requires highest governance scrutiny.
- All expansions must document impact on existing records and cross-references.
