# Success Pattern Model

## Purpose

Success patterns document construction approaches, material combinations, and detailing practices that have demonstrated consistent, reliable performance over time. They represent the positive counterpart to failure patterns.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `practice_description` | string | yes | Clear description of the successful approach. |
| `performance_metric` | string | no | How success is measured (e.g., "zero leaks over 15-year service life"). |
| `validated_conditions` | object | no | Climate zones, geometry types, and exposure conditions where success is documented. |
| `assembly_context` | string | yes | The assembly or subsystem where this pattern applies. |
| `critical_factors` | array of strings | yes | Factors that must be present for the pattern to succeed (e.g., "primer applied within 4 hours of membrane"). |
| `failure_mode_addressed` | array of IDs | no | Links to failure patterns this success pattern mitigates. |
| `track_record` | object | no | `{ years_observed: int, sample_size: string, geographic_scope: string }`. |
| `limitations` | string | no | Known boundaries — where this pattern does NOT apply. |
| `installer_skill_requirement` | enum | no | `standard`, `specialized`, `expert`. |

## Constraints

1. A success pattern with confidence `high` or `established` must have a documented `track_record` spanning at least 5 years.
2. `critical_factors` must be explicit — vague entries like "good workmanship" are insufficient.
3. `limitations` should be populated whenever `validated_conditions` is narrow.
4. Success patterns should reference the failure modes they prevent, when known.

## Relationships

- References kernel assemblies and products via `kernel_refs`.
- Links to failure patterns via `failure_mode_addressed` (inverse relationship).
- Contextualized by climate, geometry, and lifecycle models.
- May be supported by precedent records documenting specific successful projects.

## Usage Guidance

Success patterns are not prescriptive specifications. They are intelligence observations about what has worked. Consumers must verify applicability to their specific project conditions, climate zone, and code requirements. The kernel and applicable standards remain authoritative for compliance.
