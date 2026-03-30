# Schema Change Proposal Model

## Purpose

Schema change proposals govern modifications to intelligence model definitions, field structures, enumerations, and validation rules. Schema evolution is append-only in rationale and governance-gated. No schema modification occurs without a formal proposal, review, and approval.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `proposal_id` | string (UUID) | yes | Unique identifier. |
| `title` | string | yes | Concise title for the proposed change. |
| `proposer` | string | yes | Identity of the person or process submitting the proposal. |
| `proposal_date` | ISO 8601 | yes | When the proposal was submitted. |
| `affected_models` | array of strings | yes | Which model files are affected (e.g., `["failure_model", "record_model"]`). |
| `change_type` | enum | yes | `add_field`, `modify_field`, `add_enum_value`, `modify_constraint`, `add_model`, `deprecate_field`, `structural_change`. |
| `description` | string | yes | Detailed description of what changes and why. |
| `rationale` | string | yes | Why this change is needed. Must reference evidence, data gaps, or operational requirements. |
| `backward_compatibility` | enum | yes | `compatible`, `breaking`, `migration_required`. |
| `migration_plan` | string | no | Required if `backward_compatibility` is `breaking` or `migration_required`. |
| `impact_assessment` | string | yes | Which existing records, queries, or processes are affected. |
| `approval_status` | enum | yes | `proposed`, `under_review`, `approved`, `rejected`, `deferred`. |
| `reviewer` | string | no | Who reviewed the proposal. |
| `review_date` | ISO 8601 | no | When the review decision was made. |
| `review_notes` | string | no | Reviewer rationale. |
| `implementation_version` | string | no | Target schema version for implementation (e.g., `v0.2`). |

## Change Types

- **add_field** — New field added to an existing model. Typically backward-compatible.
- **modify_field** — Change to field type, constraints, or semantics. May require migration.
- **add_enum_value** — New value added to an existing enumeration. Usually backward-compatible.
- **modify_constraint** — Change to validation rules (e.g., making an optional field required).
- **add_model** — Entirely new model file added to the intelligence layer.
- **deprecate_field** — Field marked for removal in a future version. Must not break existing records.
- **structural_change** — Changes to relationships between models or fundamental model organization.

## Append-Only Rationale

Every schema change proposal and its outcome are permanently recorded. This creates an auditable history of why the schema is shaped the way it is. Even rejected proposals are retained — they document considered and declined alternatives.

## Constraints

1. `breaking` changes require a `migration_plan` that addresses all existing records.
2. `rationale` must be substantive — "improvement" or "cleanup" is insufficient.
3. Schema changes must not violate the kernel-observing principle (intelligence never modifies kernel schemas).
4. Proposals that affect `shared_standards_registry.json` or other shared artifacts must be coordinated across the family.
5. `approved` proposals must specify `implementation_version`.

## Review Criteria

Reviewers evaluate proposals against:

1. **Necessity** — Is there a demonstrated need backed by evidence or operational experience?
2. **Compatibility** — What is the impact on existing data and consumers?
3. **Consistency** — Does the change align with existing model patterns and naming conventions?
4. **Scope** — Is the change appropriately scoped, or should it be broader/narrower?
5. **Reversibility** — Can the change be undone if it proves problematic?

## Relationships

- Lives in the `proposal_zone` of the database.
- May be triggered by `data_gap` findings or `pattern_detection` signals.
- Affects all models in the intelligence layer.
- Coordinates with `db_expansion_proposal_model` when structural database changes are needed.
