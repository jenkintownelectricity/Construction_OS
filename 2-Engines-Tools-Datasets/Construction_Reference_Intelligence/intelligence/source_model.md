# Source Model

## Purpose

A source represents the origin of information used to construct evidence. Sources are tracked for provenance, credibility, and reuse across multiple evidence items.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `source_id` | string (UUID) | yes | Unique identifier. |
| `source_type` | enum | yes | `manufacturer_data`, `test_report`, `field_observation`, `industry_publication`, `standard_body`, `litigation_record`, `expert_opinion`, `warranty_claim_data`. |
| `title` | string | yes | Descriptive title of the source document or dataset. |
| `publisher` | string | no | Organization or individual that produced the source. |
| `publication_date` | ISO 8601 | no | Date the source was published or recorded. |
| `quality_tier` | enum | yes | `primary`, `secondary`, `tertiary`. |
| `trust_posture` | enum | yes | `trusted`, `provisional`, `contested`, `rejected`. |
| `url` | string | no | External reference URL if available. |
| `citation` | string | yes | Formal citation string for reference. |
| `notes` | string | no | Analyst notes on source limitations or context. |

## Quality Tiers

| Tier | Definition | Examples |
|---|---|---|
| **primary** | Direct observation, original test data, first-party records. | Lab test reports, field forensic investigations, manufacturer test data. |
| **secondary** | Curated summaries, peer-reviewed analysis of primary data. | Industry journal articles, RICOWI reports, published case studies. |
| **tertiary** | Aggregated or indirect references, expert opinion without primary backing. | Trade magazine articles, conference anecdotes, forum discussions. |

## Trust Posture

- **trusted** — Verified provenance, consistent with corroborating sources.
- **provisional** — Plausible but not yet independently corroborated.
- **contested** — Conflicting information exists from comparable sources.
- **rejected** — Found to be inaccurate, retracted, or fraudulently produced.

## Constraints

1. A `rejected` source cannot be the sole backing for any `active` evidence record.
2. `quality_tier` and `trust_posture` are independently assessed — a primary source can be contested.
3. Sources are never deleted; they may be annotated with updated trust posture.

## Relationships

- Referenced by evidence records via `source_refs`.
- A single source may back multiple evidence items across different intelligence records.
