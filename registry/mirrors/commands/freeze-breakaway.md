# Command: freeze-breakaway

## Command Name

`freeze-breakaway`

## Description

Transitions a mirror from ACTIVE to FROZEN state due to breakaway conditions being met. Freezing a mirror halts all active slice operations and prevents new changes while preserving the mirror's current state in a non-destructive manner. This is a protective measure invoked when the mirror has diverged sufficiently from its source system that continued operation poses risk to downstream consumers or kernel integrity.

A breakaway freeze is distinct from an administrative freeze — it is triggered specifically by breakaway threshold violations (accumulated drift, parity degradation, trust boundary compromise, or governance escalation). The freeze is non-destructive: all data, configuration, and history are preserved, and the mirror can be unfrozen if breakaway conditions are resolved.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is ACTIVE**: The mirror's `lifecycle_state` must be `ACTIVE`. Only ACTIVE mirrors can be frozen via breakaway.
3. **Breakaway conditions met**: At least one breakaway condition must be satisfied:
   - Aggregate parity score below threshold (default: < 0.70)
   - Open CRITICAL drift count exceeds threshold (default: >= 1)
   - Open HIGH drift count exceeds threshold (default: >= 3)
   - Trust boundary violation detected
   - Governance escalation mandated
4. **Non-destructive verification**: The freeze operation must not destroy or corrupt any existing data or configuration.
5. **Operator authorization**: The operator must have `mirror:freeze-breakaway` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror to freeze. | Must exist in mirrors-registry.json with state ACTIVE. |
| `breakaway_conditions` | array of objects | List of breakaway conditions that triggered the freeze. Each must have `condition_type`, `threshold`, `actual_value`, `description`. | Minimum 1 condition. Each must have all required fields. |
| `reason` | string | Detailed justification for the breakaway freeze. | Non-empty, max 4096 characters. |
| `initiated_by` | string | Identity of the person or system initiating the freeze. | Non-empty, max 128 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `freeze_scope` | string | `"FULL"` | Scope of the freeze: `FULL` (all slices), `PARTIAL` (specified slices only). |
| `affected_slice_ids` | array of strings | all slices | If `freeze_scope` is PARTIAL, the specific slices to freeze. Otherwise ignored. |
| `resolution_plan` | string | `null` | Proposed plan for resolving the breakaway conditions. |
| `escalation_contacts` | array of strings | `[]` | Additional contacts to notify about the breakaway freeze. |
| `auto_unfreeze_conditions` | object | `null` | Conditions under which the mirror may be automatically unfrozen. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and `lifecycle_state` is `ACTIVE`.
2. **Breakaway condition validity**: Each condition in `breakaway_conditions` must have a valid `condition_type` (one of: `PARITY_BELOW_THRESHOLD`, `CRITICAL_DRIFT_EXCEEDED`, `HIGH_DRIFT_EXCEEDED`, `TRUST_BOUNDARY_VIOLATION`, `GOVERNANCE_ESCALATION`).
3. **Condition evidence**: Each condition must include `threshold` and `actual_value` demonstrating the threshold was exceeded.
4. **Partial freeze consistency**: If `freeze_scope` is `PARTIAL`, `affected_slice_ids` must be provided and all referenced slices must belong to the mirror.
5. **Non-destructive check**: Verify that the freeze operation will not trigger data deletion, configuration loss, or irreversible state changes.
6. **Active slice inventory**: Enumerate all ACTIVE slices on the mirror to ensure all are accounted for in the freeze scope.

## Side Effects

### 1. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `lifecycle_state`: Set to `"FROZEN"`
  - `lifecycle_state_reason`: Set to provided `reason`
  - `frozen_at`: Current UTC timestamp
  - `updated_at`: Current UTC timestamp
- **Metadata updates**: Decrement `mirrors_by_state.ACTIVE`, increment `mirrors_by_state.FROZEN`

### 2. mirror-lifecycle-registry.json

- **Action**: APPEND new transition record
- **Fields set**:
  - `transition_id`: Generated
  - `mirror_id`: As provided
  - `from_state`: `"ACTIVE"`
  - `to_state`: `"FROZEN"`
  - `transitioned_at`: Current UTC timestamp
  - `transitioned_by`: Set to `initiated_by`
  - `reason`: As provided
  - `validation_result`: Results including breakaway conditions evidence
  - `artifacts`: Breakaway condition details, resolution plan if provided
  - `tags`: `["breakaway", "freeze"]`
- **Metadata updates**: Increment `total_transitions`, increment `transitions_by_target_state.FROZEN`

### 3. mirror-breakaway-registry.json

- **Action**: INSERT new breakaway record
- **Fields set**:
  - `breakaway_id`: Generated as `BREAK-{MIRROR_CONTEXT}-{SEQUENCE}`
  - `mirror_id`: As provided
  - `breakaway_type`: Derived from highest-severity condition
  - `conditions`: As provided in `breakaway_conditions`
  - `initiated_by`: As provided
  - `initiated_at`: Current UTC timestamp
  - `status`: Set to `"ACTIVE"`
  - `resolution_plan`: As provided
  - `resolved_at`: Set to `null`
- **Metadata updates**: Increment `total_breakaway_records`, increment `active_breakaway_count`

### 4. mirror-slices-registry.json

- **Action**: UPDATE all ACTIVE slices belonging to this mirror (or only `affected_slice_ids` if partial)
- **Fields updated**:
  - `state`: Set to `"FROZEN"` (if full freeze) or `"FROZEN"` (for affected slices in partial freeze)
  - `state_reason`: Set to `"Breakaway freeze: {reason}"`
  - `frozen_at`: Current UTC timestamp
- **Metadata updates**: Adjust `slices_by_state` counters

### 5. mirror-transfer-registry.json

- **Action**: UPDATE all transfer records for affected slices
- **Fields updated**:
  - `is_transfer_ready`: Set to `false`
  - `readiness_reason`: Set to `"Mirror frozen due to breakaway conditions."`

## Postconditions

1. The mirror's `lifecycle_state` in `mirrors-registry.json` is `"FROZEN"`.
2. A lifecycle transition record (ACTIVE to FROZEN) exists in `mirror-lifecycle-registry.json`.
3. A breakaway record exists in `mirror-breakaway-registry.json` with `status: "ACTIVE"`.
4. All affected slices are in FROZEN state in `mirror-slices-registry.json`.
5. All transfer readiness for affected slices is suspended.
6. No data, configuration, or history has been destroyed (non-destructive).
7. The mirror cannot accept new slice enables, parity reviews, or configuration changes until unfrozen.
8. The breakaway record captures all conditions and evidence for governance audit.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `INVALID_STATE_TRANSITION` | Mirror is not in ACTIVE state. | Only ACTIVE mirrors can be frozen via breakaway. |
| `NO_BREAKAWAY_CONDITIONS` | `breakaway_conditions` array is empty. | At least one breakaway condition must be provided. |
| `INVALID_CONDITION_TYPE` | A condition has an unrecognized `condition_type`. | Use a valid breakaway condition type. |
| `CONDITION_NOT_MET` | A condition's `actual_value` does not exceed its `threshold`. | Only include conditions that are genuinely exceeded. |
| `INVALID_PARTIAL_FREEZE` | `freeze_scope` is PARTIAL but `affected_slice_ids` is empty or contains invalid IDs. | Provide valid slice IDs for partial freeze. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "freeze-breakaway",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "breakaway_conditions": [
      {
        "condition_type": "PARITY_BELOW_THRESHOLD",
        "threshold": 0.70,
        "actual_value": 0.58,
        "description": "Aggregate parity score has fallen below the 0.70 threshold due to source system v3.3.0 changes."
      },
      {
        "condition_type": "HIGH_DRIFT_EXCEEDED",
        "threshold": 3,
        "actual_value": 4,
        "description": "Four HIGH severity drift records are open and unresolved."
      }
    ],
    "reason": "Mirror parity has degraded below acceptable threshold and multiple high-severity drifts remain unresolved. Freezing to prevent further divergence and protect downstream consumers.",
    "initiated_by": "construction-os/mirror-operations",
    "resolution_plan": "1. Align mirror with source v3.3.0 changes. 2. Resolve all HIGH drift records. 3. Run full parity review suite. 4. Request unfreeze when parity >= 0.85.",
    "tags": ["breakaway", "parity-degradation"]
  }
}
```
