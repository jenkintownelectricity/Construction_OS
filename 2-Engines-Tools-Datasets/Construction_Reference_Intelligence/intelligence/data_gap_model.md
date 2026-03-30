# Data Gap Model

## Purpose

Data gaps identify areas where the intelligence layer lacks sufficient evidence or coverage to make informed observations. Explicitly tracking gaps prevents false confidence from the absence of negative findings and guides prioritization of future data collection efforts.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `gap_id` | string (UUID) | yes | Unique identifier. |
| `gap_type` | enum | yes | `missing_evidence`, `insufficient_coverage`, `stale_data`, `contradictory_data`, `missing_context`, `unresearched_domain`. |
| `subject` | string | yes | What the gap is about (e.g., "long-term performance of adhered TPO at parapet transitions in ASHRAE zone 6A"). |
| `severity` | enum | yes | `low`, `moderate`, `high`, `critical`. |
| `affected_records` | array of IDs | no | Intelligence records whose confidence is limited by this gap. |
| `desired_evidence` | string | yes | Description of what evidence would close or reduce the gap. |
| `potential_sources` | array of strings | no | Known or suspected sources that might contain the needed data. |
| `discovery_method` | enum | yes | `manual_review`, `confidence_audit`, `pattern_detection`, `query_failure`, `external_request`. |
| `status` | enum | yes | `open`, `partially_addressed`, `closed`, `accepted_risk`. |
| `created_at` | ISO 8601 | yes | When the gap was identified. |
| `closed_at` | ISO 8601 | no | When the gap was resolved, if applicable. |
| `resolution_notes` | string | no | How the gap was addressed or why it was accepted as risk. |

## Gap Types

- **missing_evidence** — No evidence exists for a known question or assertion.
- **insufficient_coverage** — Evidence exists but covers too narrow a scope (limited climate zones, single manufacturer, small sample).
- **stale_data** — Available evidence is outdated and may no longer reflect current products or practices.
- **contradictory_data** — Conflicting evidence exists without resolution.
- **missing_context** — Evidence exists but lacks climate, geometry, or lifecycle context needed for applicability.
- **unresearched_domain** — An entire subject area has not been investigated.

## Severity Assessment

- **low** — Gap exists in a peripheral area; does not affect high-priority decisions.
- **moderate** — Gap affects intelligence quality for commonly queried subjects.
- **high** — Gap limits confidence on active records used for decision support.
- **critical** — Gap creates risk of uninformed decisions on safety-relevant topics.

## Constraints

1. `critical` gaps must be linked to an `ingestion_proposal` or an `accepted_risk` justification within 90 days.
2. `closed` gaps must have `resolution_notes` documenting what evidence was obtained.
3. Gaps discovered through `confidence_audit` should reference the audit that found them.
4. Data gaps are never deleted; they transition through status states.

## Relationships

- Links to intelligence records whose confidence is constrained by the gap.
- Feeds into `dataset_discovery_model` — gaps motivate searches for new data sources.
- Feeds into `ingestion_proposal_model` — critical gaps justify ingestion proposals.
- Pattern detection may reveal systematic data gaps across a domain.
