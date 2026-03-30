# Trend Record Contract

## Purpose
Tracks directional trends observed in construction intelligence data. Captures whether a phenomenon is increasing, decreasing, stable, emerging, or declining over time with supporting data points.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `trend_id` — Unique identifier.
- `title` — Human-readable title.
- `status` — One of: `active`, `draft`, `deprecated`, `superseded`.
- `confidence` — One of: `low`, `medium`, `high`, `established`.
- `direction` — One of: `increasing`, `decreasing`, `stable`, `emerging`, `declining`.

## Validation Rules
- `trend_id` must be globally unique within the intelligence layer.
- `confidence`, `status`, and `direction` must use defined enum values.
- `data_points` items must contain `date` (ISO 8601) and `value` fields; no additional properties.
- `evidence_refs` must reference valid `evidence_reference` records.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `draft` -> `active` -> `deprecated` or `superseded`.
- Trend direction changes should be accompanied by updated evidence and confidence adjustments.
- Data points should be append-only; historical data points must not be altered.
