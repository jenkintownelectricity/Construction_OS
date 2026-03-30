# Command: approve-promotion

## Command Name

`approve-promotion`

## Description

Approves the promotion of a mirror's reflected functionality (at the slice level) into the kernel core. Promotion is the terminal positive outcome of the mirror lifecycle — it represents the formal decision that mirrored functionality has proven sufficiently valuable, stable, and mature to be absorbed into the Construction OS kernel as native capability.

Promotion is a high-governance gate requiring architecture board approval and satisfaction of all seven promotion gate conditions. Once promoted, the reflected functionality transitions from operating within a mirror's trust boundary to operating as first-class kernel functionality.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is ACTIVE**: The mirror must be in ACTIVE lifecycle state.
3. **Slice is transfer-ready**: The specified `slice_id` must be marked as transfer-ready in `mirror-transfer-registry.json` with `is_transfer_ready: true`.
4. **All 7 promotion gate conditions met**:
   - **Gate 1 — Transfer Readiness Confirmed**: All 9 transfer gates remain satisfied (no regression since marking transfer-ready).
   - **Gate 2 — Architecture Board Approval**: Minimum 3 architecture board members have voted APPROVE with no REJECT votes.
   - **Gate 3 — Kernel Integration Plan**: A detailed kernel integration plan exists specifying the target kernel module, API surface, data migration strategy, and backward compatibility approach.
   - **Gate 4 — Consumer Migration Plan**: A migration plan exists for all current consumers of the mirrored functionality.
   - **Gate 5 — Rollback Strategy**: A kernel-level rollback strategy is defined in case the promoted functionality exhibits issues post-integration.
   - **Gate 6 — Performance Baseline**: Performance benchmarks demonstrate the promoted functionality meets or exceeds kernel performance standards.
   - **Gate 7 — Security Clearance**: A kernel-level security review has been completed with no unresolved findings.
5. **Operator authorization**: The operator must have `promotion:approve` permission (restricted to architecture board members).

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror containing the slice to promote. | Must exist in mirrors-registry.json with state ACTIVE. |
| `slice_id` | string | The slice to promote. | Must be transfer-ready in mirror-transfer-registry.json. |
| `approvers` | array of objects | Architecture board approvers. Each must have `approver_id`, `vote` (APPROVE/REJECT), `comments`. | Minimum 3 approvers, all must vote APPROVE. |
| `kernel_integration_plan_ref` | string | Reference to the kernel integration plan document. | Non-empty, must be a valid document path. |
| `consumer_migration_plan_ref` | string | Reference to the consumer migration plan. | Non-empty, must be a valid document path. |
| `rollback_strategy_ref` | string | Reference to the rollback strategy document. | Non-empty, must be a valid document path. |
| `target_kernel_module` | string | The kernel module that will absorb the promoted functionality. | Non-empty, must reference a valid kernel module. |
| `promotion_reason` | string | Justification for promotion. | Non-empty, max 4096 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target_promotion_date` | string | `null` | Scheduled date for the actual promotion execution (ISO 8601). |
| `performance_baseline_ref` | string | `null` | Reference to performance benchmark results. |
| `security_clearance_ref` | string | `null` | Reference to the kernel-level security review. |
| `backward_compatibility_notes` | string | `null` | Notes on backward compatibility considerations. |
| `deprecation_timeline` | object | `null` | Timeline for deprecating the mirrored version after promotion. Contains `announcement_date`, `soft_deprecation_date`, `hard_deprecation_date`. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in ACTIVE state.
2. **Slice transfer readiness**: Confirm slice is marked transfer-ready in `mirror-transfer-registry.json`.
3. **Transfer gate regression check**: Re-validate that all 9 transfer gate conditions still hold (no regression since transfer-ready was marked).
4. **Approval quorum**: At least 3 approvers must have voted APPROVE. No REJECT votes allowed.
5. **Document accessibility**: All referenced documents (`kernel_integration_plan_ref`, `consumer_migration_plan_ref`, `rollback_strategy_ref`) must be accessible.
6. **Kernel module validity**: The `target_kernel_module` must reference a known kernel module.
7. **No conflicting promotions**: No other slice from any mirror should be in active promotion to the same kernel module target with conflicting functionality.
8. **Deprecation timeline consistency**: If `deprecation_timeline` is provided, dates must be in chronological order and `announcement_date` must be on or after the promotion date.

## Side Effects

### 1. mirror-promotion-registry.json

- **Action**: INSERT new promotion record
- **Fields set**:
  - `promotion_id`: Generated as `PROMO-{MIRROR_CONTEXT}-{SLICE_CONTEXT}-{SEQUENCE}`
  - `mirror_id`: As provided
  - `slice_id`: As provided
  - `status`: Set to `"APPROVED"`
  - `approved_at`: Current UTC timestamp
  - `approvers`: As provided
  - `kernel_integration_plan_ref`: As provided
  - `consumer_migration_plan_ref`: As provided
  - `rollback_strategy_ref`: As provided
  - `target_kernel_module`: As provided
  - `promotion_reason`: As provided
  - `target_promotion_date`: As provided
  - `deprecation_timeline`: As provided
  - `executed_at`: Set to `null` (populated when promotion is executed)
- **Metadata updates**: Increment `total_promotions`, increment `promotions_by_status.APPROVED`

### 2. mirror-transfer-registry.json

- **Action**: UPDATE transfer record for this slice
- **Fields updated**:
  - `promotion_status`: Set to `"APPROVED"`
  - `promotion_id`: Set to the generated promotion_id
  - `promotion_approved_at`: Current UTC timestamp

### 3. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `promotion_status`: Set to `"APPROVED"`
  - `promotion_approved_at`: Current UTC timestamp

### 4. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `updated_at`: Current UTC timestamp

### 5. mirror-lifecycle-registry.json

- **Action**: APPEND new transition record
- **Fields set**:
  - `transition_id`: Generated
  - `mirror_id`: As provided
  - `from_state`: `"ACTIVE"` (mirror remains ACTIVE; this records the promotion event)
  - `to_state`: `"ACTIVE"` (no state change on mirror itself at approval time)
  - `transitioned_at`: Current UTC timestamp
  - `transitioned_by`: Lead approver identity
  - `reason`: Promotion approval reason
  - `artifacts`: References to all promotion documents
  - `tags`: `["promotion", "approved"]`

## Postconditions

1. A promotion record exists in `mirror-promotion-registry.json` with `status: "APPROVED"`.
2. The transfer record for the slice reflects the approved promotion.
3. The slice record reflects the approved promotion status.
4. The architecture board approval is captured with all votes and comments.
5. All governance documents (integration plan, migration plan, rollback strategy) are referenced and immutable.
6. The promotion is approved but NOT yet executed — execution is a separate operational step.
7. If a `deprecation_timeline` is set, the mirror operations team is notified of upcoming deprecation milestones.
8. The mirror remains in ACTIVE state; it does not transition until the promoted functionality is fully absorbed and the mirror is retired.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in ACTIVE state. | Only ACTIVE mirrors can have slices promoted. |
| `SLICE_NOT_TRANSFER_READY` | Slice is not marked as transfer-ready. | Complete transfer readiness assessment first via `mark-transfer-ready`. |
| `TRANSFER_GATE_REGRESSION` | One or more transfer gate conditions have regressed since transfer-ready was marked. | Re-satisfy the regressed gates and update transfer readiness. |
| `INSUFFICIENT_APPROVALS` | Fewer than 3 APPROVE votes provided. | Obtain additional architecture board approvals. |
| `APPROVAL_REJECTED` | One or more approvers voted REJECT. | Address rejection concerns and re-submit. |
| `INTEGRATION_PLAN_NOT_FOUND` | Referenced kernel integration plan is not accessible. | Verify document path. |
| `MIGRATION_PLAN_NOT_FOUND` | Referenced consumer migration plan is not accessible. | Verify document path. |
| `ROLLBACK_STRATEGY_NOT_FOUND` | Referenced rollback strategy is not accessible. | Verify document path. |
| `INVALID_KERNEL_MODULE` | Target kernel module is not recognized. | Verify the kernel module reference. |
| `CONFLICTING_PROMOTION` | Another slice is being promoted to the same kernel module with conflicting functionality. | Resolve the conflict before proceeding. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "approve-promotion",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-001",
    "approvers": [
      { "approver_id": "arch-board/member-1", "vote": "APPROVE", "comments": "Excellent parity record. Ready for core absorption." },
      { "approver_id": "arch-board/member-2", "vote": "APPROVE", "comments": "Integration plan is thorough. Migration path is clear." },
      { "approver_id": "arch-board/member-3", "vote": "APPROVE", "comments": "Security review is clean. Performance exceeds kernel baseline." }
    ],
    "kernel_integration_plan_ref": "plans/gcp-sd-slice-001-kernel-integration.md",
    "consumer_migration_plan_ref": "plans/gcp-sd-slice-001-consumer-migration.md",
    "rollback_strategy_ref": "plans/gcp-sd-slice-001-rollback-strategy.md",
    "target_kernel_module": "KERN-DETAIL-NORMALIZATION",
    "promotion_reason": "Detail normalization has achieved 0.97 parity over 6 months with zero drift. Three downstream consumers are actively using the functionality. Architecture board unanimously approves absorption into kernel core.",
    "target_promotion_date": "2026-04-15T00:00:00Z",
    "deprecation_timeline": {
      "announcement_date": "2026-04-01T00:00:00Z",
      "soft_deprecation_date": "2026-05-15T00:00:00Z",
      "hard_deprecation_date": "2026-07-15T00:00:00Z"
    },
    "tags": ["promotion", "detail-normalization", "kernel-absorption"]
  }
}
```
