# Dataset Candidate to Ingestion Map

## Purpose

Documents how dataset candidates flow through evaluation to ingestion proposals.
Candidate discovery is separate from ingestion approval — this map traces the full path.

## Flow

```
Data gap identified (DG-XX-NNN)
  --> External source discovered
    --> dataset_candidate created (DC-XX-NNN)
      --> Evaluation (quality, coverage, licensing)
        --> dataset_ingestion_proposal created (IP-NNN)
          --> Governance review
            --> approved --> ingested
            --> rejected (with rationale)
```

## Candidate Evaluation Criteria

| Criterion          | Description                                        | Weight |
|-------------------|----------------------------------------------------|--------|
| Relevance         | Direct applicability to intelligence domain         | High   |
| Data quality      | Completeness, accuracy, consistency                 | High   |
| Coverage          | Breadth of Division 07 topics covered               | Medium |
| Format            | Machine-readability, structured vs. unstructured    | Medium |
| Licensing         | Availability for use, redistribution constraints    | High   |
| Freshness         | Currency of data, update frequency                  | Medium |
| Source trust       | Reputation and reliability of data source           | High   |

## Source Types and Ingestion Complexity

| Source Type     | Typical Format    | Ingestion Complexity | Example                     |
|----------------|-------------------|---------------------|-----------------------------|
| Manufacturer   | PDF, spreadsheet  | Medium              | Compatibility charts         |
| Lab            | Structured data   | Low                 | Test result databases        |
| Consultant     | Reports, PDFs     | High                | Forensic investigation files |
| Literature     | Published papers  | Medium              | Journal article datasets     |
| Sensor         | Time-series data  | Low-Medium          | Building monitoring systems  |
| Inspector      | Forms, reports    | Medium              | Inspection databases         |

## Candidate-to-Proposal Linkage

```
dataset_ingestion_proposal.candidate_ref -> "DC-XX-NNN"
```

Each ingestion proposal references exactly one dataset candidate.
One candidate may generate multiple proposals if partial ingestion is preferred.

## Boundaries

- Candidates are tracked regardless of approval outcome — rejected candidates remain on record.
- Ingestion proposals must include a rationale and a governance approval path.
- No dataset is ingested without a formal proposal.
