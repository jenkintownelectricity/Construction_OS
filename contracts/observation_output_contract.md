# Observation Output Contract

## Purpose

Defines the required structure for observation outputs produced by workers. Observations describe what was found in source documents. They are extracted findings, not canonical truth.

## Required Fields

| Field | Type | Required | Description |
|---|---|---|---|
| worker_id | string | yes | Identifier of the producing worker |
| observation_type | string | yes | Category of observation (e.g., ambiguity, missing_data, conflict, noted_condition, discrepancy) |
| source_reference | string | yes | Document, section, or drawing of origin |
| observed_data | object | yes | Structured representation of what was found |
| confidence_level | float | yes | Confidence in the observation (0.0-1.0) |
| timestamp | string (ISO 8601) | yes | When the observation was produced |

## Semantic Constraints

- Observations describe what was found. They do not assert truth.
- Observations do not imply correctness of the source material.
- Observations do not constitute validation, approval, or compliance determination.
- All observations require governed validation before downstream consumption.

## Handoff Requirements

- Observations must be submitted to a governed validation surface before any downstream consumer may act on them.
- The producing worker must not route observations directly to end consumers.
- Handoff acknowledgment from the validation surface is required.

## Confidence Scoring

- 1.0: Deterministic extraction with no ambiguity in the source.
- 0.7-0.99: High-confidence extraction with minor interpretive judgment.
- 0.4-0.69: Moderate confidence; source material contains ambiguity.
- Below 0.4: Low confidence; observation is flagged for manual review.
