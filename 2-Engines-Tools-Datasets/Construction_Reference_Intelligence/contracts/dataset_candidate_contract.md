# Dataset Candidate Contract

## Purpose
Records external dataset candidates identified for potential ingestion into the intelligence layer. Captures source metadata, relevance, quality, and coverage to support ingestion decisions.

## Required Fields
- `schema_version` — Must be `"v1"`.
- `candidate_id` — Unique identifier.
- `title` — Human-readable title.
- `source_type` — One of: `manufacturer`, `lab`, `consultant`, `inspector`, `literature`, `sensor`, `owner`.
- `relevance` — Description of relevance to the intelligence layer.

## Validation Rules
- `candidate_id` must be globally unique within the intelligence layer.
- `source_type` must use the defined enum values matching source_reference source types.
- `url` must be a valid URI when provided.
- `data_quality` and `coverage` should describe fitness for ingestion.
- `additionalProperties` is false; no extra fields permitted.

## Governance Posture
- Revision posture: `revisable_with_audit`.
- Candidates must be evaluated before ingestion via a `dataset_ingestion_proposal`.
- Data quality and provenance must be assessed before approval.
- Candidates may be updated as new information about the dataset becomes available.
