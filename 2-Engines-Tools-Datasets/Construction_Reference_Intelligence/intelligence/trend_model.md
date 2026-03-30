# Trend Model

## Purpose

Trends capture directional shifts observed across the building envelope domain — changes in failure frequency, material adoption, practice evolution, or performance characteristics over time. Trends are time-series-oriented observations, not single-point findings.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `trend_direction` | enum | yes | `increasing`, `decreasing`, `stable`, `emerging`, `reversing`. |
| `trend_subject` | string | yes | What is trending (e.g., "TPO membrane failure at parapet terminations"). |
| `metric` | string | no | Quantifiable metric being tracked (e.g., "failure rate per 1000 installations"). |
| `observation_window` | object | yes | `start_date` and `end_date` (ISO 8601) defining the observation period. |
| `data_points` | array of objects | no | Time-series entries: `{ date, value, source_ref }`. |
| `affected_systems` | array of strings | no | CSI subsections or assembly types affected. |
| `driver_hypothesis` | string | no | Hypothesized cause of the trend (e.g., "thinner membrane gauges in value-engineering"). |
| `geographic_scope` | string | no | Regional applicability if not nationwide. |

## Trend Directions

- **increasing** — Metric is rising over the observation window.
- **decreasing** — Metric is falling.
- **stable** — No statistically meaningful change.
- **emerging** — Too few data points for direction, but a new pattern is appearing.
- **reversing** — Previously established direction has changed.

## Constraints

1. `observation_window` must span at least two data points in time.
2. An `emerging` trend cannot have confidence above `medium`.
3. Trend records should be periodically re-evaluated; stale trends (no update in 24 months) are flagged for review.
4. `driver_hypothesis` is explicitly labeled as hypothesis, not established cause.

## Relationships

- References kernel objects (products, materials, assemblies) via `kernel_refs`.
- Supported by evidence records that provide individual data points.
- May correlate with failure patterns or success patterns.
- Contextualized by climate, geometry, and lifecycle context.

## Time-Series Posture

Trends are inherently temporal. The `data_points` array provides the raw time-series, while `trend_direction` is the interpreted summary. Consumers should verify that the direction claim is consistent with the underlying data.
