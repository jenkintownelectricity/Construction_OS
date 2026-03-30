# Confidence Evolution Contract

## Purpose
Tracks the full history of confidence level changes for a target record. Provides an audit trail of how confidence evolved over time with supporting evidence and rationale at each step.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `record_id` — Unique identifier for this evolution record.
- `target_record_id` — The record whose confidence is being tracked.
- `history` — Array of confidence change entries, each requiring `date`, `confidence`, and `basis`.

## Validation Rules
- `record_id` must be globally unique within the intelligence layer.
- `target_record_id` must reference an existing record.
- Each `history` entry must include `date` (ISO 8601), `confidence` (from shared enum), and `basis` (rationale string).
- Optional `evidence_ref` and `note` fields are permitted per history entry.
- History entries should be ordered chronologically.
- `additionalProperties` is false at both the record and history-entry level.

## Governance Posture
- Revision posture: `append_only`.
- History entries must not be deleted or modified after creation.
- Each confidence change on a target record should produce a new history entry here.
- One evolution record per target record; do not create duplicates.
