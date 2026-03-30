# Precedent Model

## Purpose

Precedents are specific historical cases — projects, investigations, litigation outcomes, or documented incidents — that inform current decision-making. Unlike patterns (which aggregate observations), precedents are individual instances with detailed context.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `case_type` | enum | yes | `project_case`, `forensic_investigation`, `litigation`, `warranty_claim`, `research_study`, `product_recall`. |
| `date_range` | object | yes | `{ start: ISO 8601, end: ISO 8601 }` — when the precedent occurred. |
| `location` | object | no | `{ region, state, climate_zone }` — geographic context. |
| `parties` | array of strings | no | Organizations or roles involved (anonymized if needed). |
| `outcome` | string | yes | What happened — the resolution or finding. |
| `lessons` | array of strings | yes | Extracted lessons applicable beyond this specific case. |
| `assembly_involved` | string | no | Assembly or system type central to the precedent. |
| `cost_impact` | string | no | Financial consequences if documented (order of magnitude). |
| `regulatory_impact` | string | no | Whether code changes or industry guidance resulted. |

## Constraints

1. Precedents must be factual and evidence-linked. Hearsay is insufficient — at least one source with `quality_tier` of `primary` or `secondary` is required.
2. `lessons` must be actionable observations, not vague generalizations.
3. Anonymization is acceptable for litigation or proprietary cases, but the underlying facts must be verifiable through evidence.
4. `date_range` is required to anchor the precedent in time.

## Relationships

- References kernel assemblies and products via `kernel_refs`.
- Supported by evidence records (investigation reports, court documents, test results).
- May inform failure patterns, success patterns, or trend observations.
- Contextualized by climate, geometry, and lifecycle models.

## Precedent vs. Pattern

A precedent is a single case. A pattern is an observation derived from multiple cases. Precedents feed into patterns but stand independently as reference intelligence for analogous situations.
