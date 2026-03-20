# Command: mark-transfer-ready

## Command Name

`mark-transfer-ready`

## Description

Marks a specific slice as transfer-ready, indicating it has passed all nine transfer gate conditions and is eligible for promotion consideration. Transfer readiness is a formal milestone that certifies the slice's reflected functionality is stable, tested, documented, and operationally proven to a level sufficient for potential absorption into the kernel core.

This is a high-bar gate — all nine conditions must be independently verified and evidenced. Transfer readiness does not automatically trigger promotion; it signals eligibility for the separate promotion evaluation process.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is ACTIVE**: The mirror must be in ACTIVE lifecycle state.
3. **Slice exists and is ACTIVE**: The specified `slice_id` must reference an ACTIVE slice in `mirror-slices-registry.json` belonging to the mirror.
4. **All 9 transfer gate conditions met**: Each of the following gates must be satisfied:
   - **Gate 1 — Parity Verified**: Slice parity score >= 0.95 with at least 3 consecutive PASS reviews.
   - **Gate 2 — Drift Free**: No OPEN drift records of any severity for this slice.
   - **Gate 3 — Operational Stability**: Slice has been ACTIVE for a minimum operational period (default: 90 days) with no unplanned disables.
   - **Gate 4 — Test Coverage**: Automated test coverage >= 90% for all reflected functionality.
   - **Gate 5 — Documentation Complete**: Integration documentation, API specifications, and runbooks are complete and current.
   - **Gate 6 — Performance Validated**: Slice meets performance SLAs (latency, throughput, error rate) for at least 30 consecutive days.
   - **Gate 7 — Security Reviewed**: Security review completed within the last 180 days with no unresolved findings.
   - **Gate 8 — Consumer Adoption**: At least 2 downstream consumers are actively using the slice's functionality.
   - **Gate 9 — Rollback Tested**: A rollback procedure has been documented and tested within the last 90 days.
5. **Operator authorization**: The operator must have `transfer:mark-ready` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror containing the slice. | Must exist in mirrors-registry.json with state ACTIVE. |
| `slice_id` | string | The slice to mark as transfer-ready. | Must exist in mirror-slices-registry.json in ACTIVE state. |
| `gate_evidence` | object | Evidence for all 9 transfer gates. Must contain keys `parity_verified`, `drift_free`, `operational_stability`, `test_coverage`, `documentation_complete`, `performance_validated`, `security_reviewed`, `consumer_adoption`, `rollback_tested`. Each key maps to an evidence object with `satisfied` (boolean), `evidence_ref` (string), `verified_by` (string), `verified_at` (ISO 8601 timestamp). | All 9 gates must have `satisfied: true`. |
| `assessor` | string | Identity of the transfer readiness assessor. | Must match pattern `^[a-z0-9-]+/[a-z0-9-]+$`. |
| `assessment_notes` | string | Summary of the transfer readiness assessment. | Non-empty, max 4096 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target_promotion_date` | string | `null` | Target date for promotion consideration (ISO 8601). |
| `promotion_priority` | string | `"NORMAL"` | Priority classification: `LOW`, `NORMAL`, `HIGH`, `URGENT`. |
| `known_limitations` | array of strings | `[]` | Known limitations or caveats that should be considered during promotion review. |
| `recommended_promotion_path` | string | `null` | Recommended promotion approach: `DIRECT_ABSORPTION`, `ADAPTER_PATTERN`, `STAGED_MIGRATION`. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in ACTIVE state.
2. **Slice existence, ownership, and state**: Confirm slice exists, belongs to mirror, and is ACTIVE.
3. **Gate completeness**: All 9 gate keys must be present in `gate_evidence`.
4. **Gate satisfaction**: All 9 gates must have `satisfied: true`. If any gate is `false`, the command fails with the list of unsatisfied gates.
5. **Evidence completeness**: Each gate must have non-empty `evidence_ref`, `verified_by`, and `verified_at`.
6. **Verification recency**: All `verified_at` timestamps must be within the allowed recency window (default: 30 days for most gates, 180 days for security review).
7. **Cross-reference validation**: Parity score from gate evidence must match the slice's current `parity_score` in registry. Drift-free claim must match `mirror-drift-registry.json` (no OPEN drifts for this slice).
8. **Not already transfer-ready**: The slice must not already be marked as transfer-ready with the same or newer evidence.

## Side Effects

### 1. mirror-transfer-registry.json

- **Action**: UPDATE or INSERT transfer record for this slice
- **Fields set/updated**:
  - `transfer_id`: Generated as `XFER-{MIRROR_CONTEXT}-{SLICE_CONTEXT}-{SEQUENCE}` (if new)
  - `mirror_id`: As provided
  - `slice_id`: As provided
  - `is_transfer_ready`: Set to `true`
  - `transfer_ready_at`: Current UTC timestamp
  - `readiness_reason`: Set to `"All 9 transfer gate conditions satisfied."`
  - `gate_evidence`: As provided
  - `assessor`: As provided
  - `assessment_notes`: As provided
  - `target_promotion_date`: As provided
  - `promotion_priority`: As provided
  - `known_limitations`: As provided
  - `recommended_promotion_path`: As provided
- **Metadata updates**: Increment `transfer_ready_count`

### 2. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `transfer_ready`: Set to `true`
  - `transfer_ready_at`: Current UTC timestamp

### 3. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `updated_at`: Current UTC timestamp

## Postconditions

1. The transfer record in `mirror-transfer-registry.json` has `is_transfer_ready: true` with complete gate evidence.
2. The slice record in `mirror-slices-registry.json` has `transfer_ready: true`.
3. The slice is now eligible for promotion consideration via `approve-promotion`.
4. All gate evidence is captured and immutable for governance audit.
5. The assessor's identity and assessment notes are recorded.
6. If `target_promotion_date` is set, the slice will be flagged for promotion review on that date.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in ACTIVE state. | Only ACTIVE mirrors can have slices marked transfer-ready. |
| `SLICE_NOT_FOUND` | No slice with the provided `slice_id`. | Verify the slice_id. |
| `SLICE_NOT_OWNED_BY_MIRROR` | Slice belongs to a different mirror. | Provide the correct mirror_id. |
| `SLICE_STATE_INELIGIBLE` | Slice is not in ACTIVE state. | Only ACTIVE slices can be marked transfer-ready. |
| `GATE_NOT_SATISFIED` | One or more transfer gates are not satisfied. | Satisfy all 9 gates before marking transfer-ready. Returns list of unsatisfied gates. |
| `INCOMPLETE_GATE_EVIDENCE` | Gate evidence is missing required fields. | Provide complete evidence for all gates. |
| `STALE_GATE_EVIDENCE` | Gate verification timestamps are outside the allowed recency window. | Re-verify gates with stale evidence. |
| `EVIDENCE_MISMATCH` | Gate evidence does not match current registry state (e.g., parity score mismatch, open drifts exist). | Reconcile evidence with current registry state. |
| `ALREADY_TRANSFER_READY` | Slice is already marked transfer-ready with current or newer evidence. | No action needed, or provide newer evidence to update. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "mark-transfer-ready",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-001",
    "gate_evidence": {
      "parity_verified": {
        "satisfied": true,
        "evidence_ref": "parity-reports/slice-001-review-cycle-12.json",
        "verified_by": "construction-os/parity-review-team",
        "verified_at": "2026-03-15T10:00:00Z"
      },
      "drift_free": {
        "satisfied": true,
        "evidence_ref": "drift-reports/slice-001-drift-clear-2026-03.json",
        "verified_by": "construction-os/drift-monitor",
        "verified_at": "2026-03-18T08:00:00Z"
      },
      "operational_stability": {
        "satisfied": true,
        "evidence_ref": "ops-reports/slice-001-stability-90day.json",
        "verified_by": "construction-os/sre-team",
        "verified_at": "2026-03-17T12:00:00Z"
      },
      "test_coverage": {
        "satisfied": true,
        "evidence_ref": "coverage-reports/slice-001-coverage-93pct.json",
        "verified_by": "construction-os/test-automation",
        "verified_at": "2026-03-16T14:00:00Z"
      },
      "documentation_complete": {
        "satisfied": true,
        "evidence_ref": "docs/slice-001-documentation-review.md",
        "verified_by": "construction-os/tech-writing",
        "verified_at": "2026-03-14T09:00:00Z"
      },
      "performance_validated": {
        "satisfied": true,
        "evidence_ref": "perf-reports/slice-001-sla-30day.json",
        "verified_by": "construction-os/performance-team",
        "verified_at": "2026-03-18T06:00:00Z"
      },
      "security_reviewed": {
        "satisfied": true,
        "evidence_ref": "security-reviews/slice-001-review-2026-q1.json",
        "verified_by": "construction-os/security-team",
        "verified_at": "2026-02-20T11:00:00Z"
      },
      "consumer_adoption": {
        "satisfied": true,
        "evidence_ref": "adoption-reports/slice-001-consumers.json",
        "verified_by": "construction-os/platform-team",
        "verified_at": "2026-03-15T15:00:00Z"
      },
      "rollback_tested": {
        "satisfied": true,
        "evidence_ref": "rollback-tests/slice-001-rollback-drill-2026-03.json",
        "verified_by": "construction-os/sre-team",
        "verified_at": "2026-03-10T10:00:00Z"
      }
    },
    "assessor": "construction-os/transfer-review-board",
    "assessment_notes": "Detail normalization slice has met all 9 transfer gate conditions. Parity at 0.97 with 5 consecutive PASS reviews. No drift in 120 days. Recommended for direct absorption.",
    "recommended_promotion_path": "DIRECT_ABSORPTION",
    "promotion_priority": "HIGH",
    "target_promotion_date": "2026-04-15T00:00:00Z"
  }
}
```
