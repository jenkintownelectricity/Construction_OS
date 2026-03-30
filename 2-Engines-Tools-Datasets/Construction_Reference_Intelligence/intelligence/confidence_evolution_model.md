# Confidence Evolution Model

## Purpose

Confidence is not static. As new evidence arrives, existing evidence is challenged, or time passes without validation, the confidence level of an intelligence record should change. This model defines how confidence evolves over time and how that evolution is tracked historically.

## Evolution Triggers

| Trigger | Effect |
|---|---|
| New supporting evidence added | Confidence may increase if evidence quality thresholds are met. |
| Evidence invalidated or retracted | Confidence must be re-evaluated and may decrease. |
| Corroborating record published | Independent confirmation may elevate confidence. |
| Contradictory evidence discovered | Confidence decreases or record is flagged for review. |
| Time decay — no new validation | Long-dormant records are flagged; confidence may be downgraded. |
| Standards or code change | Contextual relevance shifts; review required. |
| Supersession of underlying records | Dependent confidence assessments must be re-evaluated. |

## Confidence History Record

Each confidence change is logged as an immutable entry:

| Field | Type | Required | Description |
|---|---|---|---|
| `entry_id` | string | yes | The intelligence record whose confidence changed. |
| `change_date` | ISO 8601 | yes | When the change occurred. |
| `prior_level` | enum | yes | Previous confidence level. |
| `new_level` | enum | yes | Updated confidence level. |
| `trigger` | string | yes | What caused the re-evaluation. |
| `basis` | string | yes | Reasoning for the new level assignment. |
| `reviewer` | string | yes | Who or what process performed the review. |
| `evidence_snapshot` | object | no | Count and quality distribution of evidence at time of change. |

## Time Decay Policy

Intelligence records without new evidence or review activity within a defined window are flagged:

- **24 months without review** — Record is flagged for staleness review.
- **36 months without new evidence** — Confidence may be downgraded by one level unless the finding is classified as `established` with multi-year validation.
- `established` records are exempt from automatic decay but still subject to periodic review.

## Upgrade and Downgrade Paths

```
low → medium    Requires: additional evidence meeting medium-level thresholds.
medium → high   Requires: evidence count and quality meeting high-level thresholds.
high → established  Requires: multi-year track record, standards-body recognition, or widespread validation.

established → high  Trigger: contradictory evidence, changed conditions.
high → medium       Trigger: key evidence invalidated.
medium → low        Trigger: supporting evidence retracted or contradicted.
low → (deprecated)  Trigger: record no longer supportable; deprecated via status change.
```

## Constraints

1. Every confidence change must produce a history record. No silent changes.
2. Downgrades require explicit `basis` explaining what changed.
3. Automated time-decay downgrades must be logged with `trigger: "time_decay"`.
4. Confidence history is append-only and immutable.

## Relationships

- Extends the confidence model with temporal tracking.
- Interacts with the evidence model — evidence additions/removals trigger re-evaluation.
- Interacts with the supersession model — superseded records freeze their confidence history.
- Feeds into pattern detection — systematic confidence downgrades may indicate a data quality issue.
