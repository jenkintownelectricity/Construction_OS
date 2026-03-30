# Lifecycle Context Model

## Purpose

Lifecycle context anchors intelligence observations to specific stages in a building system's life. A failure pattern observed during commissioning has different implications than one discovered 20 years into service. This model ensures that intelligence records carry explicit lifecycle stage metadata.

## Lifecycle Stages

| Stage | Description |
|---|---|
| `design` | Architectural/engineering design phase. Decisions about materials, assemblies, and details. |
| `procurement` | Material selection, specification, and purchasing. Substitution risk lives here. |
| `installation` | Field construction. Workmanship quality, sequencing, weather exposure during install. |
| `commissioning` | Pre-occupancy verification. Testing, inspection, punch list resolution. |
| `operation` | Normal service life. Ongoing performance under expected conditions. |
| `maintenance` | Scheduled or reactive maintenance activities. Coating renewal, sealant replacement. |
| `failure` | Active failure event. Leak, material breakdown, structural distress. |
| `replacement` | End-of-life replacement or major renovation. Tear-off, re-roofing, re-cladding. |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `lifecycle_stage` | enum | yes | One of the eight stages above. |
| `stage_relevance` | string | yes | How the intelligence record relates to this stage. |
| `time_in_service` | object | no | `{ years: int, range: [min, max] }` — age of the system when the observation applies. |
| `stage_specific_factors` | array of strings | no | Factors unique to this stage (e.g., "open-time constraints during installation"). |
| `transition_risk` | string | no | Risk introduced during transition between stages (e.g., "design intent lost during value engineering in procurement"). |

## Usage

Lifecycle context is attached to intelligence records as contextual metadata, not as a standalone record type. An intelligence record may reference multiple lifecycle stages when the observation spans phases.

## Stage-Specific Intelligence Patterns

- **Design** — Detailing decisions that create or prevent interface risk.
- **Procurement** — Substitution of specified products with incompatible alternatives.
- **Installation** — Weather-window violations, adhesion failures due to substrate conditions.
- **Commissioning** — Testing reveals latent defects before occupancy.
- **Operation** — Gradual degradation patterns, ponding water, UV exposure effects.
- **Maintenance** — Improper maintenance causing secondary damage; deferred maintenance accelerating failure.
- **Failure** — Root cause classification, forensic investigation findings.
- **Replacement** — Lessons from tear-off conditions, substrate assessment, improved detailing.

## Constraints

1. `lifecycle_stage` must be one of the eight defined stages.
2. Intelligence records with `time_in_service` data should be consistent with the claimed lifecycle stage.
3. Failure patterns should specify whether the failure originated in a prior stage (e.g., installation defect manifesting during operation).

## Relationships

- Contextualizes all intelligence record types.
- Failure patterns and success patterns are most meaningful with lifecycle context.
- Trends may track shifts within specific lifecycle stages (e.g., increasing installation defects).
- Precedents carry lifecycle stage as part of their case narrative.
