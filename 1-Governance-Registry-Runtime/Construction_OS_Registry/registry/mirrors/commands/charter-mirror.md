# Command: charter-mirror

## Command Name

`charter-mirror`

## Description

Transitions a mirror from the PROPOSED state to the CHARTERED state. Chartering a mirror represents formal approval by the architecture board to proceed with integration development. The charter establishes the integration contract, finalizes the trust boundary configuration, defines the complete slice inventory, and allocates resources.

Chartering is a governance gate — it ensures that every mirror integration has been reviewed for architectural alignment, security posture, and operational feasibility before any development or configuration work begins.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Current state is PROPOSED**: The mirror's `lifecycle_state` must be `PROPOSED`. No other state may transition to CHARTERED.
3. **Charter document provided**: A charter document reference must be supplied, containing scope, boundaries, success criteria, and rollback plan.
4. **Architecture board approval**: The charter must include evidence of architecture board approval (approver identities and vote count).
5. **Slice inventory defined**: A complete list of planned slices must be provided with names, descriptions, transfer classes, and dependency relationships.
6. **Trust boundary finalized**: Detailed trust boundary configuration must be provided including authentication method, authorization model, and encryption settings.
7. **Operator authorization**: The operator must have `mirror:charter` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror to charter. | Must exist in mirrors-registry.json with state PROPOSED. |
| `charter_document_ref` | string | Reference path to the charter document. | Non-empty string, must be a valid document path. |
| `integration_contract_ref` | string | Reference path to the integration contract. | Non-empty string, must be a valid document path. |
| `approvers` | array of objects | List of architecture board approvers. | Minimum 2 approvers, each with `approver_id` and `vote` (APPROVE/REJECT). |
| `slice_inventory` | array of objects | Planned slices for this mirror. | Minimum 1 slice. Each must have `slice_name`, `description`, `transfer_class`. |
| `trust_boundary_details` | object | Finalized trust boundary configuration. | Must include `authentication`, `authorization`, `encryption_in_transit`, `encryption_at_rest`. |
| `reason` | string | Justification for chartering. | Non-empty, max 2048 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `success_criteria` | array of strings | `[]` | Measurable success criteria for the mirror. |
| `rollback_plan` | string | `null` | Description of rollback approach if integration fails. |
| `resource_allocation` | object | `null` | Resource allocation details (compute, storage, team). |
| `target_activation_date` | string | `null` | Target date for ACTIVE state (ISO 8601). |

## Validation Rules

1. **Mirror existence**: Confirm `mirror_id` exists in `mirrors-registry.json`.
2. **State check**: Confirm `lifecycle_state` is `PROPOSED`.
3. **Approval quorum**: At least 2 approvers must have voted APPROVE. No REJECT votes allowed for charter to proceed.
4. **Slice inventory validity**: Each slice in the inventory must have a unique `slice_name`, a valid `transfer_class`, and no circular dependencies.
5. **Trust boundary completeness**: The `trust_boundary_details` object must contain all required security fields.
6. **Charter document accessibility**: The `charter_document_ref` must reference an accessible document.
7. **Integration contract completeness**: The `integration_contract_ref` must reference an accessible document.

## Side Effects

### 1. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `lifecycle_state`: Set to `"CHARTERED"`
  - `lifecycle_state_reason`: Set to provided `reason`
  - `chartered_at`: Current UTC timestamp
  - `updated_at`: Current UTC timestamp
  - `trust_boundary_details`: Set to provided `trust_boundary_details`
  - `slice_count`: Set to length of `slice_inventory`
- **Metadata updates**: Decrement `mirrors_by_state.PROPOSED`, increment `mirrors_by_state.CHARTERED`

### 2. mirror-lifecycle-registry.json

- **Action**: APPEND new transition record
- **Fields set**:
  - `transition_id`: Generated
  - `mirror_id`: As provided
  - `from_state`: `"PROPOSED"`
  - `to_state`: `"CHARTERED"`
  - `transitioned_at`: Current UTC timestamp
  - `transitioned_by`: Operator identity
  - `reason`: As provided
  - `validation_result`: Results of all validation checks including approver votes
  - `artifacts`: References to charter document, integration contract, and approval record
  - `tags`: `["charter", "approved"]`
- **Metadata updates**: Increment counters

## Postconditions

1. The mirror's `lifecycle_state` in `mirrors-registry.json` is `"CHARTERED"`.
2. The `chartered_at` timestamp is set.
3. A lifecycle transition record from PROPOSED to CHARTERED exists in `mirror-lifecycle-registry.json`.
4. The `slice_count` reflects the planned slice inventory size.
5. Trust boundary details are finalized on the mirror record.
6. The mirror is now eligible for the `stage-mirror` process (slice registration and configuration).

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror exists with the provided `mirror_id`. | Verify the mirror_id. |
| `INVALID_STATE_TRANSITION` | Mirror is not in PROPOSED state. | Only PROPOSED mirrors can be chartered. |
| `INSUFFICIENT_APPROVALS` | Fewer than 2 APPROVE votes provided. | Obtain additional architecture board approvals. |
| `APPROVAL_REJECTED` | One or more approvers voted REJECT. | Address rejection concerns and re-submit. |
| `INVALID_SLICE_INVENTORY` | Slice inventory contains duplicates, invalid transfer classes, or circular dependencies. | Correct the slice inventory. |
| `INCOMPLETE_TRUST_BOUNDARY` | Trust boundary details missing required fields. | Provide complete trust boundary configuration. |
| `CHARTER_DOCUMENT_NOT_FOUND` | Referenced charter document is not accessible. | Verify document path and accessibility. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "charter-mirror",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "charter_document_ref": "charters/gcp-shopdrawing-mirror-charter.md",
    "integration_contract_ref": "contracts/gcp-shopdrawing-integration-contract.json",
    "approvers": [
      { "approver_id": "arch-board/member-1", "vote": "APPROVE" },
      { "approver_id": "arch-board/member-2", "vote": "APPROVE" },
      { "approver_id": "arch-board/member-3", "vote": "APPROVE" }
    ],
    "slice_inventory": [
      { "slice_name": "detail_normalization", "description": "Normalizes shop drawing detail formats.", "transfer_class": "FOUNDATIONAL" },
      { "slice_name": "rules_engine", "description": "Applies construction-domain validation rules.", "transfer_class": "CORE_LOGIC" }
    ],
    "trust_boundary_details": {
      "authentication": "service_account_key",
      "authorization": "iam_role_binding",
      "encryption_in_transit": true,
      "encryption_at_rest": true,
      "audit_logging": true
    },
    "reason": "Charter approved by architecture board. Integration scope and contract finalized."
  }
}
```
