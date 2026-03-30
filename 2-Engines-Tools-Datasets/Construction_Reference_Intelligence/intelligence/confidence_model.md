# Confidence Model

## Purpose

Confidence quantifies how well-supported an intelligence record is. It prevents unsubstantiated claims from reaching the same status as rigorously evidenced findings.

## Confidence Levels

| Level | Definition | Evidence Requirement |
|---|---|---|
| **low** | Preliminary observation, limited supporting data. | At least one evidence item of any quality. |
| **medium** | Supported by multiple evidence items or moderate-quality data. | Two or more evidence items, at least one `moderate` quality or above. |
| **high** | Strong evidentiary support, corroborated across sources. | Three or more evidence items, at least two `high` quality. Methodology documented. |
| **established** | Industry-accepted, extensively validated over time. | Meets `high` criteria plus long-term validation (multi-year track record or standards-body recognition). |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `level` | enum | yes | `low`, `medium`, `high`, `established`. |
| `basis` | string | yes | Human-readable explanation of why this level was assigned. |
| `evidence_count` | integer | yes | Number of supporting evidence items. |
| `highest_evidence_quality` | enum | yes | Best quality tier among linked evidence (`high`, `moderate`, `low`). |
| `last_reviewed` | ISO 8601 | yes | When confidence was last assessed. |
| `review_notes` | string | no | Notes from the last confidence review. |

## Constraints

1. Confidence level `high` or `established` is unreachable without at least two `high`-quality evidence items.
2. Confidence must be re-evaluated when new evidence is linked or existing evidence is revised.
3. Confidence can decrease — if evidence is invalidated, confidence must be downgraded.
4. The `basis` field is mandatory and must describe the reasoning, not just restate the level.

## Relationship to Evidence

- Confidence is computed from the set of evidence items linked to an intelligence record.
- Evidence quality tiers directly constrain achievable confidence levels.
- See `confidence_evolution_model` for how confidence changes over time.

## Auditability

Every confidence assignment is logged with timestamp, prior level, new level, and basis. This log is append-only and supports governance review.
