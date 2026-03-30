# Evidence Model

## Purpose

Evidence is the bridge between raw sources and intelligence records. Each evidence item extracts a specific finding from one or more sources and makes it citable by intelligence records.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `evidence_id` | string (UUID) | yes | Unique identifier. |
| `evidence_type` | enum | yes | `test_result`, `field_observation`, `statistical_analysis`, `expert_assessment`, `manufacturer_claim`, `failure_forensic`, `performance_data`. |
| `quality_tier` | enum | yes | `high`, `moderate`, `low`. Independent of source quality tier. |
| `source_refs` | array of source IDs | yes | Links to one or more source records. At least one required. |
| `date` | ISO 8601 | yes | Date the evidence was observed or recorded. |
| `summary` | string | yes | Concise statement of what the evidence shows. |
| `quantitative_data` | object | no | Structured numeric data (test values, failure rates, performance metrics). |
| `methodology` | string | no | How the evidence was gathered or derived. |
| `limitations` | string | no | Known limitations or caveats. |
| `geographic_scope` | string | no | Where the evidence applies (climate zone, region). |
| `created_at` | ISO 8601 | yes | When this evidence record was created in the system. |

## Quality Tiers

| Tier | Criteria |
|---|---|
| **high** | Reproducible test data, large sample size, controlled conditions, peer-reviewed methodology. |
| **moderate** | Credible field observations, smaller sample sizes, reasonable methodology with some limitations. |
| **low** | Anecdotal, single-instance, uncontrolled conditions, or opinion-based. |

## Constraints

1. Every evidence record must reference at least one source.
2. `quality_tier` is assessed independently of source `quality_tier` — a secondary source can yield high-quality evidence if the analysis is rigorous.
3. Evidence records are immutable once created. Corrections create new evidence records and the old ones are annotated.
4. `high` quality evidence requires documented methodology.

## Relationships

- Links **to** sources via `source_refs`.
- Referenced **by** intelligence records via `evidence_refs`.
- Multiple intelligence records may reference the same evidence item.
- Evidence quality influences the achievable confidence level on referencing intelligence records (see confidence_model).
