# Command: disable-slice

## Command Name

`disable-slice`

## Description

Deactivates a specific slice on a mirror, transitioning it from ACTIVE to DISABLED state. Disabling a slice removes its reflected functionality from the mirror's operational surface while preserving all configuration, history, and audit data. This is a non-destructive operation — the slice can be re-enabled later via the `enable-slice` command.

Slices should be disabled in reverse dependency order — dependent slices first, then their dependencies — to prevent cascading failures. A slice cannot be disabled if any other ACTIVE slice declares a dependency on it.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is in eligible state**: The mirror must be in STAGED, ACTIVE, or FROZEN lifecycle state.
3. **Slice exists**: The specified `slice_id` must reference an existing slice in `mirror-slices-registry.json` belonging to the specified mirror.
4. **Slice is ACTIVE**: The slice must currently be in ACTIVE state. Only ACTIVE slices can be disabled.
5. **No active dependent slices**: No other slice in ACTIVE state may list this slice in its `dependencies` array. All dependents must be disabled first.
6. **Operator authorization**: The operator must have `slice:disable` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror containing the slice. | Must exist in mirrors-registry.json in STAGED, ACTIVE, or FROZEN state. |
| `slice_id` | string | The slice to disable. | Must exist in mirror-slices-registry.json in ACTIVE state. |
| `reason` | string | Justification for disabling this slice. | Non-empty, max 2048 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force` | boolean | `false` | Force disable even if active dependents exist. Use only in emergencies. Triggers cascade warnings but does NOT automatically disable dependents. |
| `drain_timeout_seconds` | integer | `300` | Time in seconds to allow in-flight operations to complete before disabling. |
| `notify_consumers` | boolean | `true` | Whether to emit a notification event to downstream consumers before disabling. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in STAGED, ACTIVE, or FROZEN state.
2. **Slice existence and ownership**: Confirm slice exists and belongs to the specified mirror.
3. **Slice state eligibility**: Confirm slice is in ACTIVE state.
4. **Reverse dependency check**: Query all slices belonging to this mirror. For each ACTIVE slice, check if its `dependencies` array includes the target `slice_id`. If any active dependent slices are found and `force` is false, the command fails with the list of active dependents.
5. **Drain period**: If `drain_timeout_seconds` is greater than 0, initiate a drain period and wait for in-flight operations to complete or timeout.
6. **Consumer notification**: If `notify_consumers` is true, emit a disable notification event before proceeding.

## Side Effects

### 1. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `state`: Set to `"DISABLED"`
  - `state_reason`: Set to provided `reason`
  - `disabled_at`: Current UTC timestamp
  - `last_health_check`: Current UTC timestamp
  - `health_status`: Set to `"DISABLED"`
- **Metadata updates**: Decrement `slices_by_state.ACTIVE`, increment `slices_by_state.DISABLED`

### 2. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `active_slice_count`: Decrement by 1
  - `updated_at`: Current UTC timestamp

### 3. mirror-transfer-registry.json

- **Action**: UPDATE transfer record for this slice (if exists)
- **Fields updated**:
  - `readiness_reason`: Updated to reflect DISABLED state (e.g., "Slice is DISABLED. Transfer readiness suspended.")
  - `is_transfer_ready`: Set to `false`

## Postconditions

1. The slice's `state` in `mirror-slices-registry.json` is `"DISABLED"`.
2. The `disabled_at` timestamp is set to the current time.
3. The mirror's `active_slice_count` in `mirrors-registry.json` has been decremented.
4. No other ACTIVE slice depends on this slice (verified by precondition or force override).
5. The slice's health_status is `"DISABLED"`.
6. The transfer record for this slice (if it exists) reflects readiness as suspended.
7. The slice can be re-enabled via `enable-slice` at a later time.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in STAGED, ACTIVE, or FROZEN state. | Wait for mirror to reach eligible state. |
| `SLICE_NOT_FOUND` | No slice with the provided `slice_id`. | Verify the slice_id. |
| `SLICE_NOT_OWNED_BY_MIRROR` | Slice exists but belongs to a different mirror. | Provide the correct mirror_id for this slice. |
| `SLICE_STATE_INELIGIBLE` | Slice is not in ACTIVE state. | Only ACTIVE slices can be disabled. |
| `ACTIVE_DEPENDENTS_EXIST` | One or more ACTIVE slices depend on this slice. | Disable dependent slices first, or use `force: true`. Returns list of active dependents. |
| `DRAIN_TIMEOUT_EXCEEDED` | In-flight operations did not complete within the drain timeout. | Increase `drain_timeout_seconds` or investigate stuck operations. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "disable-slice",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-006",
    "reason": "Clash detection integration deprecated in favor of native kernel implementation.",
    "drain_timeout_seconds": 600,
    "notify_consumers": true
  }
}
```
