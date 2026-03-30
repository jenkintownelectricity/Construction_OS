# Database Expansion Proposal Model

## Purpose

Database expansion proposals govern changes to the database zone structure itself. The intelligence system operates across three defined zones, each with distinct ownership and governance. Expanding, restructuring, or adding zones requires formal proposal and approval.

## The Three Zones

| Zone | Owner | Purpose | Write Access |
|---|---|---|---|
| `canonical_truth_zone` | Kernel | Products, assemblies, material properties, standards compliance. Authoritative facts. | Kernel processes only. Intelligence has read-only access. |
| `reference_intelligence_zone` | Intelligence layer | Patterns, trends, evidence, confidence records, context observations. | Intelligence processes with evidence backing. |
| `proposal_zone` | Governance | Ingestion proposals, schema change proposals, expansion proposals. Staging area. | Any authorized proposer; approval-gated. |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `proposal_id` | string (UUID) | yes | Unique identifier. |
| `title` | string | yes | Concise title for the proposed expansion. |
| `proposer` | string | yes | Identity of the person or process submitting the proposal. |
| `proposal_date` | ISO 8601 | yes | When the proposal was submitted. |
| `expansion_type` | enum | yes | `new_zone`, `zone_restructure`, `zone_boundary_change`, `cross_zone_link`, `archive_zone`. |
| `affected_zones` | array of enums | yes | Which zones are affected. |
| `description` | string | yes | Detailed description of the proposed expansion. |
| `rationale` | string | yes | Why the current zone structure is insufficient. Must reference concrete limitations. |
| `governance_impact` | string | yes | How the expansion affects ownership, write access, and approval workflows. |
| `data_migration` | string | no | Required if existing data must move between zones. |
| `approval_status` | enum | yes | `proposed`, `under_review`, `approved`, `rejected`, `deferred`. |
| `reviewer` | string | no | Who reviewed the proposal. |
| `review_date` | ISO 8601 | no | When the review decision was made. |
| `review_notes` | string | no | Reviewer rationale. |

## Expansion Types

- **new_zone** — Create an entirely new database zone (e.g., a `staging_zone` for unvalidated bulk imports).
- **zone_restructure** — Reorganize the internal structure of an existing zone (new tables, new partitions).
- **zone_boundary_change** — Move record types between zones (e.g., promoting proposal-zone artifacts to reference-intelligence-zone).
- **cross_zone_link** — Establish new referential relationships between zones (e.g., intelligence records linking to kernel objects in new ways).
- **archive_zone** — Create or modify an archive zone for superseded, deprecated, or historical records.

## Zone Integrity Principles

1. **Ownership clarity** — Every zone has exactly one owner. Expansion must not create ambiguous ownership.
2. **Write isolation** — The canonical truth zone is never writable by intelligence processes, regardless of expansion.
3. **Read transparency** — All zones are readable by all authorized processes. Expansion must not create opaque silos.
4. **Append-only audit** — Zone boundary changes are logged permanently.

## Constraints

1. Proposals affecting `canonical_truth_zone` require kernel governance approval, not just intelligence-layer approval.
2. `new_zone` proposals must define ownership, write access rules, and retention policy.
3. `zone_boundary_change` proposals must include a `data_migration` plan.
4. The three-zone architecture is the minimum; zones may be added but the original three are permanent.
5. `rationale` must demonstrate that the current structure is insufficient — expansion is not a default response to growth.

## Relationships

- Coordinates with `schema_change_proposal_model` — schema changes may require zone expansion.
- Coordinates with `ingestion_proposal_model` — large ingestions may require staging zone creation.
- References the database zone architecture defined in the v0.1 overview document.
- All expansion proposals live in the `proposal_zone` until approved.
