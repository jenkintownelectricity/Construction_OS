# Data Gap Record Contract

## Purpose
Identifies gaps in available intelligence data that limit analysis quality. Tracks what evidence is needed, the severity of the gap, and whether it has been addressed.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `gap_id` — Unique identifier.
- `title` — Human-readable title.
- `domain` — The domain or topic area where the gap exists.
- `severity` — One of: `critical`, `high`, `medium`, `low`.
- `status` — One of: `open`, `addressed`, `deferred`.

## Validation Rules
- `gap_id` must be globally unique within the intelligence layer.
- `severity` must use risk_levels enum from `shared_enum_registry.json`.
- `status` must use the defined enum values.
- `needed_evidence_types` must use values from the shared evidence_types enum.
- `related_kernel_refs` must include both `kernel` and `entry_id` per entry.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Status transitions: `open` -> `addressed` or `deferred`.
- Critical gaps should be prioritized for resolution.
- When addressed, the resolving evidence should be linked via related records.
