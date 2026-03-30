# Dataset Discovery Model

## Purpose

Dataset discovery identifies and evaluates candidate external datasets for potential ingestion into the intelligence layer. This model catalogs known data sources that could fill gaps, improve confidence, or expand coverage — without yet committing to ingest them.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `discovery_id` | string (UUID) | yes | Unique identifier. |
| `dataset_name` | string | yes | Descriptive name of the candidate dataset. |
| `source_organization` | string | yes | Who owns or publishes the data. |
| `dataset_type` | enum | yes | `manufacturer_data`, `test_results`, `failure_database`, `warranty_claims`, `field_survey`, `research_publication`, `litigation_records`, `inspection_reports`, `weather_data`, `standards_body_data`. |
| `description` | string | yes | What the dataset contains and its scope. |
| `estimated_volume` | string | no | Approximate size or record count. |
| `coverage` | object | no | `{ geographic: string, temporal: string, assembly_types: [string] }`. |
| `quality_assessment` | enum | yes | `high`, `moderate`, `low`, `unknown`. |
| `access_method` | enum | yes | `public`, `licensed`, `partnership`, `proprietary`, `restricted`. |
| `access_notes` | string | no | Licensing terms, cost, API availability, or contact information. |
| `relevance_to_gaps` | array of gap IDs | no | Data gaps this dataset could address. |
| `evaluation_status` | enum | yes | `identified`, `under_evaluation`, `recommended`, `not_recommended`, `ingestion_proposed`. |
| `evaluator_notes` | string | no | Assessment of data quality, relevance, and ingestion feasibility. |
| `discovered_at` | ISO 8601 | yes | When this dataset was identified. |

## Dataset Types

- **manufacturer_data** — Product specifications, test data, compatibility matrices, installation guides.
- **test_results** — Independent lab testing (wind uplift, fire, water penetration, accelerated aging).
- **failure_database** — Aggregated failure/defect records from forensic firms, consultants, or insurers.
- **warranty_claims** — Manufacturer or third-party warranty claim data revealing failure patterns.
- **field_survey** — Systematic field condition assessments (e.g., RICOWI hail surveys).
- **research_publication** — Academic or industry research papers with primary data.
- **litigation_records** — Court filings, expert reports, and settlement data from construction defect cases.
- **inspection_reports** — Third-party inspection and quality assurance reports.
- **weather_data** — Climate and weather event data for correlation with performance observations.
- **standards_body_data** — Code-change rationale, committee research, and ballot comments.

## Evaluation Criteria

When assessing a candidate dataset, consider:

1. **Relevance** — Does it address known data gaps or expand coverage of priority domains?
2. **Quality** — Is the data methodology documented? Is provenance traceable?
3. **Accessibility** — Can the data be legally and practically obtained?
4. **Volume** — Is there enough data to be statistically meaningful?
5. **Freshness** — Is the data current or historically relevant?
6. **Compatibility** — Can it be mapped to existing intelligence models?

## Constraints

1. Discovery records do not authorize ingestion — that requires an `ingestion_proposal`.
2. `proprietary` or `restricted` datasets require legal review before ingestion proposal.
3. `recommended` status should include documented evaluation criteria scores.
4. Datasets linked to `relevance_to_gaps` should reference valid `data_gap` records.

## Relationships

- Driven by `data_gap_model` — gaps motivate discovery efforts.
- Feeds into `ingestion_proposal_model` — recommended datasets become ingestion candidates.
- Source quality assessment informs the `source_model` quality tier upon ingestion.
- Multiple discovery records may feed a single ingestion proposal (composite datasets).
