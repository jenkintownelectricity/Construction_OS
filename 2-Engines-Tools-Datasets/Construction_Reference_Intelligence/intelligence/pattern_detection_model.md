# Pattern Detection Model

## Purpose

Pattern detection is the conceptual model for identifying emerging patterns from accumulated intelligence records. As individual observations (failure reports, field data, test results) accumulate, the system should surface correlations, clusters, and trends that may not be visible from any single record.

## Detection Approaches

| Approach | Description |
|---|---|
| **Frequency clustering** | Multiple failure records at the same interface zone, assembly type, or material suggest a systematic issue. |
| **Temporal clustering** | Observations concentrating within a time window may indicate a manufacturing defect, code change impact, or environmental event. |
| **Geographic clustering** | Patterns appearing in specific climate zones or regions suggest climate- or practice-dependent causation. |
| **Material co-occurrence** | Repeated appearance of the same material pairing in failure or compatibility records. |
| **Cross-record correlation** | Failure patterns, trends, and precedents converging on the same assembly or interface zone. |

## Detection Thresholds

Pattern detection uses configurable thresholds to determine when accumulated observations warrant a new pattern record:

| Parameter | Description | Default |
|---|---|---|
| `min_observations` | Minimum number of related records before flagging a potential pattern. | 3 |
| `time_window_months` | Lookback window for temporal clustering. | 36 |
| `confidence_floor` | Minimum confidence of contributing records to be included. | `low` |
| `geographic_diversity` | Minimum number of distinct regions/zones for non-localized patterns. | 2 |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `detection_id` | string (UUID) | yes | Unique identifier for the detection event. |
| `detection_type` | enum | yes | `frequency_cluster`, `temporal_cluster`, `geographic_cluster`, `material_correlation`, `cross_record`. |
| `contributing_records` | array of IDs | yes | Intelligence records that form the basis of the detected pattern. |
| `detection_date` | ISO 8601 | yes | When the pattern was detected. |
| `proposed_pattern_type` | enum | no | Suggested record type: `failure_pattern`, `trend`, `compatibility_pattern`, etc. |
| `signal_strength` | enum | yes | `weak`, `moderate`, `strong`. |
| `analyst_notes` | string | no | Human interpretation of the detected signal. |
| `action_taken` | enum | no | `new_record_created`, `existing_record_updated`, `dismissed`, `under_review`. |

## Signal Strength

- **weak** — Meets minimum thresholds but could be coincidental. Warrants monitoring.
- **moderate** — Clear clustering with plausible causal hypothesis. Warrants investigation.
- **strong** — Multiple corroborating signals across detection types. Warrants immediate record creation.

## Constraints

1. Pattern detection does not automatically create intelligence records — it produces detection events that require analyst review.
2. Dismissed detections must include a rationale in `analyst_notes`.
3. Detection thresholds are tunable per domain but defaults must be documented.
4. A detection event that leads to a new record should be linked from that record's evidence chain.

## Relationships

- Consumes all intelligence record types as input signals.
- Produces detection events that may lead to new failure patterns, trends, or compatibility patterns.
- Interacts with data gap model — absence of detections in expected areas may indicate data gaps.
- Feeds into confidence evolution — strong detection signals can support confidence upgrades.
