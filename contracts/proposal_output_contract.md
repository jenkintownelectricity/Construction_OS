# Proposal Output Contract

## Purpose

Defines the required structure for proposal outputs produced by workers. Proposals suggest actions or classifications for review. They do not decide.

## Required Fields

| Field | Type | Required | Description |
|---|---|---|---|
| worker_id | string | yes | Identifier of the producing worker |
| proposal_type | string | yes | Category of proposal (e.g., material_classification, substitution_candidate, product_identification) |
| source_reference | string | yes | Document, section, or data source of origin |
| proposed_action | string | yes | What is being proposed |
| supporting_evidence | array | yes | References and data supporting the proposal |
| confidence_level | float | yes | Confidence in the proposal (0.0-1.0) |
| requires_review | boolean | yes | Always `true`. Proposals require governed review before action. |

## Semantic Constraints

- Proposals suggest. They do not decide, approve, or authorize.
- Proposals do not constitute acceptance, procurement direction, or compliance certification.
- The `requires_review` field must always be `true`. No worker may set this to `false`.
- All proposals require governed validation before downstream consumption.

## Handoff Requirements

- Proposals must be submitted to a governed review surface (Construction_Application_OS proposal review or Construction_Runtime validation pipeline).
- The producing worker must not route proposals directly to end consumers.
- Handoff acknowledgment from the review surface is required.

## Confidence Scoring

- 1.0: Reserved for proposals with deterministic supporting evidence. Rare for proposals.
- 0.7-0.99: Strong supporting evidence with minor interpretive judgment.
- 0.4-0.69: Moderate evidence; proposal warrants additional scrutiny.
- Below 0.4: Weak evidence; proposal is flagged for manual review.
