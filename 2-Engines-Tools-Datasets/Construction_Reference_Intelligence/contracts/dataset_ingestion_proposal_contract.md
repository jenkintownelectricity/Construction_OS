# Dataset Ingestion Proposal Contract

## Purpose
Formalizes a proposal to ingest an external dataset candidate into the intelligence layer. Tracks the approval workflow from proposal through governance review to ingestion or rejection.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `proposal_id` — Unique identifier.
- `candidate_ref` — Reference to a `dataset_candidate` record.
- `title` — Human-readable title.
- `status` — One of: `proposed`, `approved`, `rejected`, `ingested`.
- `proposed_date` — ISO 8601 date of proposal.

## Validation Rules
- `proposal_id` must be globally unique within the intelligence layer.
- `candidate_ref` must reference a valid `dataset_candidate` record.
- `status` must use the defined enum values.
- `proposed_date` must be a valid ISO 8601 date.
- `governance_approval` should document the approving authority when status is `approved`.
- `ingestion_plan` should be provided before status moves to `approved`.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `proposed` -> `approved` or `rejected`; `approved` -> `ingested`.
- Governance approval is required before ingestion proceeds.
- Rejected proposals must retain rationale for audit purposes.
