# Pattern Detection Record Contract

## Purpose
Records detected emerging patterns or hypotheses derived from intelligence analysis. Tracks the lifecycle of a hypothesis from proposal through review to confirmation or rejection.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `detection_id` — Unique identifier.
- `hypothesis` — The pattern hypothesis statement.
- `status` — One of: `proposed`, `under_review`, `confirmed`, `rejected`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.
- `supporting_records` — Array of record IDs that support the hypothesis.
- `detected_date` — ISO 8601 date of detection.

## Validation Rules
- `detection_id` must be globally unique within the intelligence layer.
- `status` and `confidence` must use defined enum values.
- `supporting_records` must reference valid existing records.
- `detected_date` must be a valid ISO 8601 date.
- A detection should not be `confirmed` with `low` confidence.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `proposed` -> `under_review` -> `confirmed` or `rejected`.
- Confirmed patterns should generate corresponding failure_pattern, success_pattern, or trend records.
- Rejected patterns must retain their record for audit purposes; do not delete.
