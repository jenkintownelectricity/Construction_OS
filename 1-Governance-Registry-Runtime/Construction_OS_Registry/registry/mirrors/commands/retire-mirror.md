# Command: retire-mirror

## Command Name

`retire-mirror`

## Description

Permanently retires a mirror, transitioning it from FROZEN to RETIRED state. Retirement is a terminal lifecycle action — once retired, a mirror cannot be reactivated. All associated registry entries are marked as archived, and the mirror's artifacts are preserved at the specified archive location for audit and reference purposes.

Retirement should only occur after a mirror has been frozen (typically due to breakaway), all slices have been disabled, all consumers have been migrated or decommissioned, and a complete archive of the mirror's state and history has been created. This ensures no operational dependencies are severed without notice.

This command is the final step in the mirror lifecycle. It records the retirement decision, finalizes all registry entries, and ensures the mirror leaves behind a complete audit trail.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must exist in `mirrors-registry.json`.
2. **Mirror is FROZEN**: The mirror must be in FROZEN lifecycle state. Only FROZEN mirrors can be retired.
3. **All slices disabled**: Every slice belonging to this mirror must be in DISABLED state.
4. **No active consumers**: No active consumers remain for any slice of this mirror. All consumer dependencies must have been migrated or decommissioned.
5. **Archive completed**: A complete archive of the mirror's state, configuration, history, and artifacts must exist at the specified archive location.
6. **Operator authorization**: The operator must have `mirror:retire-mirror` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror to retire. | Must exist and be in FROZEN state. |
| `reason` | string | Detailed reason for retirement. | Non-empty, max 4096 characters. |
| `archiver` | string | Identity of the person or system that performed the archival. | Non-empty string. |
| `archive_location` | string | URI or path to the completed archive. | Non-empty string. Must reference an accessible and verified archive. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `retired_by` | string | Value of `archiver` | Identity of the person initiating the retirement if different from the archiver. |
| `breakaway_id` | string | `null` | Reference to the breakaway record that led to the freeze and subsequent retirement. |
| `successor_mirror_id` | string | `null` | If this mirror is being replaced by another mirror, the ID of the successor. |
| `consumer_migration_records` | array of strings | `[]` | References to consumer migration records documenting how each consumer was migrated. |
| `retention_period` | string | `"INDEFINITE"` | How long the archive should be retained. One of: `1_YEAR`, `3_YEARS`, `5_YEARS`, `10_YEARS`, `INDEFINITE`. |
| `final_notes` | string | `null` | Any final notes or lessons learned from this mirror's lifecycle. |
| `tags` | array of strings | `[]` | Freeform tags. |

## Validation Rules

1. **Mirror existence**: Confirm mirror exists in `mirrors-registry.json`.
2. **Mirror state**: Confirm mirror lifecycle state is `FROZEN`. Mirrors in any other state cannot be retired directly.
3. **All slices disabled**: Query `mirror-slices-registry.json` and confirm every slice for this mirror has `state` of `DISABLED`.
4. **No active consumers**: Verify that no active consumer registrations exist for any slice of this mirror.
5. **Archive verification**: Confirm the archive at `archive_location` exists and is complete. The archive must include: mirror configuration, all slice definitions, parity review history, drift history, breakaway records, and lifecycle history.
6. **Successor validity**: If `successor_mirror_id` is provided, confirm it exists in `mirrors-registry.json`.
7. **Operator authorization**: Verify the operator has `mirror:retire-mirror` permission.

## Side Effects

### 1. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `lifecycle_state`: Set to `"RETIRED"`
  - `lifecycle_state_reason`: Set to provided `reason`
  - `retired_at`: Current UTC timestamp
  - `retired_by`: Value of `retired_by` or `archiver`
  - `archive_location`: As provided
  - `successor_mirror_id`: As provided or null
  - `updated_at`: Current UTC timestamp
- **Metadata updates**: Adjust `mirrors_by_state` counters (decrement FROZEN, increment RETIRED)

### 2. mirror-lifecycle-registry.json

- **Action**: APPEND new transition record
- **Fields set**:
  - `transition_id`: Generated as `LIFECYCLE-{CONTEXT}-{SEQUENCE}`
  - `mirror_id`: As provided
  - `from_state`: `"FROZEN"`
  - `to_state`: `"RETIRED"`
  - `transitioned_at`: Current UTC timestamp
  - `transitioned_by`: Value of `retired_by` or `archiver`
  - `reason`: As provided
  - `validation_result`: Results of all validation checks
  - `artifacts`: Object containing `archive_location`, `breakaway_id`, `successor_mirror_id`, `consumer_migration_records`
  - `tags`: `["retirement", "terminal"]` plus any provided tags

### 3. mirror-slices-registry.json

- **Action**: UPDATE all slices for this mirror
- **Fields updated** (for each slice):
  - `archived`: Set to `true`
  - `archived_at`: Current UTC timestamp
  - `archive_location`: As provided
  - `updated_at`: Current UTC timestamp

### 4. mirror-parity-registry.json

- **Action**: UPDATE all parity records for this mirror
- **Fields updated**:
  - `archived`: Set to `true`
  - `archived_at`: Current UTC timestamp

### 5. mirror-drift-registry.json

- **Action**: UPDATE all drift records for this mirror
- **Fields updated**:
  - `archived`: Set to `true`
  - `archived_at`: Current UTC timestamp

### 6. mirror-breakaway-registry.json

- **Action**: UPDATE breakaway record (if exists) for this mirror
- **Fields updated**:
  - `status`: Set to `"RETIRED"`
  - `retirement_record`: Object containing `retired_at` (current UTC), `retired_by`, `archive_location`, `reason`

### 7. mirror-transfer-registry.json

- **Action**: UPDATE all transfer records for this mirror
- **Fields updated**:
  - `archived`: Set to `true`
  - `archived_at`: Current UTC timestamp
  - `transfer_readiness`: Set to `"NOT_APPLICABLE"`
  - `readiness_reason`: Set to `"Mirror has been retired."`

## Postconditions

1. The mirror's `lifecycle_state` is `"RETIRED"` in `mirrors-registry.json`.
2. A lifecycle transition record exists in `mirror-lifecycle-registry.json` documenting the FROZEN to RETIRED transition.
3. All slice records are marked as archived.
4. All parity, drift, breakaway, and transfer records are marked as archived.
5. The archive location is recorded in the mirror record and is accessible.
6. No further mutations to the mirror or its slices are permitted.
7. If a successor mirror was specified, the relationship is recorded for consumer reference.
8. The mirror leaves behind a complete audit trail of its entire lifecycle.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_NOT_FROZEN` | Mirror is not in FROZEN state. | Only FROZEN mirrors can be retired. Freeze the mirror first. |
| `ACTIVE_SLICES_EXIST` | One or more slices are not in DISABLED state. | Disable all slices before retiring the mirror. |
| `ACTIVE_CONSUMERS_EXIST` | Active consumers remain for one or more slices. | Migrate or decommission all consumers before retiring. |
| `ARCHIVE_NOT_FOUND` | Archive at the specified location does not exist or is inaccessible. | Verify archive location and accessibility. |
| `ARCHIVE_INCOMPLETE` | Archive is missing required components. | Complete the archive to include all required artifacts. |
| `SUCCESSOR_NOT_FOUND` | Specified successor mirror does not exist. | Verify the successor_mirror_id. |
| `INSUFFICIENT_AUTHORIZATION` | Operator lacks `mirror:retire-mirror` permission. | Use an authorized operator. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "retire-mirror",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "reason": "The GCP shop drawing API v1 has been fully deprecated. The mirror was frozen 3 months ago due to breakaway caused by the v2 breaking changes. All consumers have been migrated to MIRROR-GCP-SHOPDRAWING-002 which supports the v2 API. The archive is complete and verified.",
    "archiver": "construction-os/mirror-team/ops",
    "archive_location": "s3://construction-os-archives/mirrors/MIRROR-GCP-SHOPDRAWING-001/2026-03-20/",
    "retired_by": "construction-os/mirror-team/lead",
    "breakaway_id": "BREAKAWAY-GCP-SD-001",
    "successor_mirror_id": "MIRROR-GCP-SHOPDRAWING-002",
    "consumer_migration_records": ["MIGRATION-2026-001", "MIGRATION-2026-002", "MIGRATION-2026-003"],
    "retention_period": "INDEFINITE",
    "final_notes": "Mirror operated for 18 months. Key lesson: API version pinning strategy should be established at charter time to reduce breakaway risk from upstream breaking changes.",
    "tags": ["api-v1-deprecation", "planned-retirement"]
  }
}
```
