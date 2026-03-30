# Record Model — Base Intelligence Record

## Purpose

Every intelligence record shares a common base structure. This model defines the fields present on all record types (failure patterns, success patterns, trends, precedents, etc.).

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `entry_id` | string (UUID) | yes | Globally unique identifier for the record. |
| `entry_type` | enum | yes | One of: `failure_pattern`, `success_pattern`, `precedent`, `trend`, `interface_risk`, `climate_observation`, `lifecycle_observation`, `geometry_observation`, `compatibility_pattern`. |
| `title` | string | yes | Human-readable title, concise and descriptive. |
| `summary` | string | yes | Brief narrative summary of the intelligence finding. |
| `status` | enum | yes | One of: `draft`, `active`, `superseded`, `deprecated`. |
| `confidence` | object | yes | References the confidence model — level + basis. |
| `evidence_refs` | array of IDs | yes | At least one link to an evidence record. Empty arrays are invalid for `active` records. |
| `kernel_refs` | array of objects | no | Links to kernel objects (product, assembly, interface zone) by type and ID. |
| `lineage` | object | no | `supersedes` (ID of prior record) and `superseded_by` (ID of replacing record). |
| `tags` | array of strings | no | Free-form tags for discovery (e.g., `TPO`, `parapet`, `freeze-thaw`). |
| `created_at` | ISO 8601 | yes | Creation timestamp. |
| `updated_at` | ISO 8601 | yes | Last-modified timestamp. |
| `author` | string | yes | Creator identity or system process ID. |

## Status Lifecycle

```
draft → active → superseded
                → deprecated
```

- **draft**: Under development, not yet evidence-complete.
- **active**: Evidence-linked, confidence-assigned, available for queries.
- **superseded**: Replaced by a newer record (see supersession_model).
- **deprecated**: Withdrawn due to invalidation; no replacement exists.

## Constraints

1. An `active` record must have at least one `evidence_ref`.
2. A `superseded` record must have a non-null `lineage.superseded_by`.
3. `entry_id` is immutable once assigned.
4. `status` transitions are one-way: `draft` → `active`; `active` → `superseded` or `deprecated`. No reverse transitions.

## Relationships

- Links **to** evidence records via `evidence_refs`.
- Links **to** kernel objects via `kernel_refs`.
- Links **to/from** other intelligence records via `lineage`.
- Contextualized by climate, geometry, and lifecycle context models.
