# Command: enable-slice

## Command Name

`enable-slice`

## Description

Activates a specific slice on a mirror, transitioning it from STAGED (or DISABLED) to ACTIVE state. Enabling a slice makes its reflected functionality operational within the mirror's trust boundary. The command validates that all dependencies are satisfied, runs health checks, and records the state change.

Slices should be enabled incrementally — core slices first, then dependent slices — to ensure a stable activation sequence. A slice cannot be enabled if any of its declared dependencies are not already ACTIVE.

## Preconditions

1. **Mirror exists and is eligible**: The mirror must exist and be in STAGED or ACTIVE lifecycle state. Mirrors in PROPOSED, CHARTERED, FROZEN, or RETIRED states cannot have slices enabled.
2. **Slice exists**: The specified `slice_id` must reference an existing slice in `mirror-slices-registry.json` belonging to the specified mirror.
3. **Slice is in eligible state**: The slice must be in STAGED or DISABLED state. Already ACTIVE or DEPRECATED slices cannot be enabled.
4. **Dependencies satisfied**: All slices listed in the slice's `dependencies` array must be in ACTIVE state.
5. **Health check passes**: A pre-activation health check must pass for the slice.
6. **Operator authorization**: The operator must have `slice:enable` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror containing the slice. | Must exist in mirrors-registry.json in STAGED or ACTIVE state. |
| `slice_id` | string | The slice to enable. | Must exist in mirror-slices-registry.json in STAGED or DISABLED state. |
| `reason` | string | Justification for enabling this slice. | Non-empty, max 2048 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip_health_check` | boolean | `false` | Skip the pre-activation health check. Use only in emergencies with appropriate authorization. |
| `force` | boolean | `false` | Force enable even if non-critical warnings exist. Does not bypass dependency checks. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in STAGED or ACTIVE state.
2. **Slice existence and ownership**: Confirm slice exists and belongs to the specified mirror.
3. **Slice state eligibility**: Confirm slice is in STAGED or DISABLED state.
4. **Dependency resolution**: For each entry in the slice's `dependencies` array, confirm the referenced slice is ACTIVE. If any dependency is not ACTIVE, the command fails with the list of unsatisfied dependencies.
5. **Health check execution**: Unless `skip_health_check` is true, execute a health check against the slice's functional endpoint. The health check must return HEALTHY status.
6. **Circular dependency check**: Verify enabling this slice does not create a circular dependency chain (should not be possible if data is consistent, but checked defensively).

## Side Effects

### 1. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `state`: Set to `"ACTIVE"`
  - `state_reason`: Set to provided `reason`
  - `enabled_at`: Current UTC timestamp
  - `disabled_at`: Set to `null` (clear any previous disable timestamp)
  - `last_health_check`: Current UTC timestamp
  - `health_status`: Set to `"HEALTHY"` (or result of health check)
- **Metadata updates**: Adjust `slices_by_state` counters (decrement previous state, increment ACTIVE)

### 2. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `active_slice_count`: Increment by 1
  - `updated_at`: Current UTC timestamp

### 3. mirror-transfer-registry.json

- **Action**: UPDATE transfer record for this slice (if exists)
- **Fields updated**:
  - `readiness_reason`: Updated to reflect ACTIVE state (e.g., "Slice is ACTIVE. Operational period tracking initiated.")

## Postconditions

1. The slice's `state` in `mirror-slices-registry.json` is `"ACTIVE"`.
2. The `enabled_at` timestamp is set to the current time.
3. The mirror's `active_slice_count` in `mirrors-registry.json` has been incremented.
4. All dependent slices (those listing this slice in their `dependencies`) may now have their dependency on this slice satisfied.
5. The slice's health_status is `"HEALTHY"`.
6. The transfer record for this slice (if it exists) reflects the updated state.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in STAGED or ACTIVE state. | Wait for mirror to reach eligible state. |
| `SLICE_NOT_FOUND` | No slice with the provided `slice_id`. | Verify the slice_id. |
| `SLICE_NOT_OWNED_BY_MIRROR` | Slice exists but belongs to a different mirror. | Provide the correct mirror_id for this slice. |
| `SLICE_STATE_INELIGIBLE` | Slice is not in STAGED or DISABLED state. | Cannot enable an already ACTIVE or DEPRECATED slice. |
| `UNSATISFIED_DEPENDENCIES` | One or more dependency slices are not ACTIVE. | Enable the dependency slices first. Returns list of unsatisfied dependencies. |
| `HEALTH_CHECK_FAILED` | Pre-activation health check returned non-HEALTHY status. | Investigate slice health and resolve issues before enabling. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "enable-slice",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-006",
    "reason": "Clash detection integration testing complete. All dependency slices are ACTIVE."
  }
}
```
