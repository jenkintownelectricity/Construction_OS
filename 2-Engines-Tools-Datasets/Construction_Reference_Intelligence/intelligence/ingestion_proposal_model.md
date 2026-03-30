# Ingestion Proposal Model

## Purpose

Ingestion proposals are formal requests to bring new external datasets into the intelligence layer. They are governance-gated: no dataset is ingested without explicit approval. This model ensures that data quality, licensing, mapping, and impact are assessed before any new data enters the system.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `proposal_id` | string (UUID) | yes | Unique identifier. |
| `title` | string | yes | Concise title describing the proposed ingestion. |
| `dataset_discovery_refs` | array of IDs | yes | Links to one or more `dataset_discovery` records being proposed for ingestion. |
| `proposer` | string | yes | Identity of the person or process submitting the proposal. |
| `proposal_date` | ISO 8601 | yes | When the proposal was submitted. |
| `justification` | string | yes | Why this data should be ingested. References data gaps addressed and intelligence value expected. |
| `data_gap_refs` | array of IDs | no | Data gaps this ingestion would address. |
| `scope` | object | yes | `{ record_types: [string], estimated_records: int, assembly_domains: [string] }`. |
| `quality_plan` | string | yes | How data quality will be validated during ingestion (mapping, deduplication, quality tier assignment). |
| `mapping_plan` | string | yes | How external data fields map to intelligence models (source, evidence, record models). |
| `licensing_status` | enum | yes | `cleared`, `pending_review`, `restricted`, `not_assessed`. |
| `risk_assessment` | string | yes | Potential risks: data quality issues, bias, coverage gaps, licensing conflicts. |
| `approval_status` | enum | yes | `proposed`, `under_review`, `approved`, `rejected`, `deferred`. |
| `reviewer` | string | no | Who reviewed the proposal. |
| `review_date` | ISO 8601 | no | When the review decision was made. |
| `review_notes` | string | no | Reviewer rationale for approval, rejection, or deferral. |
| `implementation_status` | enum | no | `not_started`, `in_progress`, `completed`, `aborted`. |

## Approval Workflow

```
proposed → under_review → approved → implementation (not_started → in_progress → completed)
                        → rejected
                        → deferred
```

## Governance Requirements

1. **Licensing clearance** — `licensing_status` must be `cleared` before approval.
2. **Quality plan** — Must describe validation steps: source verification, deduplication, quality tier assignment, evidence extraction methodology.
3. **Mapping plan** — Must demonstrate how external data maps to intelligence models without schema violations.
4. **Risk assessment** — Must identify potential data quality, bias, or coverage issues.
5. **Reversibility** — Ingestion should be designed so that ingested records can be identified and removed if quality issues are discovered post-ingestion.

## Constraints

1. No dataset may be ingested without an approved proposal.
2. `rejected` proposals must include `review_notes` explaining the decision.
3. `deferred` proposals should specify conditions for reconsideration.
4. Proposals referencing `restricted` licensing status cannot advance to `approved` without legal clearance documentation.
5. Completed ingestions must update the referenced `data_gap` records.

## Relationships

- Links to `dataset_discovery_model` via `dataset_discovery_refs`.
- Links to `data_gap_model` via `data_gap_refs`.
- Upon completion, produces source records, evidence records, and intelligence records.
- Lives in the `proposal_zone` of the database (see `db_expansion_proposal_model`).
- Subject to the same governance authority as schema change proposals.
