# Command: record-drift

## Command Name

`record-drift`

## Description

Records a detected drift between a mirror's reflected functionality and its source system. Drift occurs when the behavior, data format, API contract, or semantics of the source system diverge from what the mirror currently reflects. Recording drift creates an auditable tracking record that must be resolved through correction, approved divergence, or breakaway.

Drift detection may be triggered by automated monitoring, parity reviews, consumer reports, or manual inspection. Every drift record must be triaged and resolved — unresolved drift accumulates risk and may trigger governance escalation.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is in eligible state**: The mirror must be in STAGED, ACTIVE, or FROZEN state.
3. **Slice exists**: The specified `slice_id` must reference an existing slice in `mirror-slices-registry.json` belonging to the specified mirror.
4. **No duplicate drift**: A drift record with the same `mirror_id`, `slice_id`, and `drift_description` hash should not already exist in OPEN state (prevents duplicate filing).
5. **Operator authorization**: The operator must have `drift:record` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror experiencing drift. | Must exist in mirrors-registry.json in STAGED, ACTIVE, or FROZEN state. |
| `slice_id` | string | The slice experiencing drift. | Must exist in mirror-slices-registry.json belonging to the mirror. |
| `drift_description` | string | Detailed description of the observed drift. | Non-empty, max 4096 characters. |
| `severity` | string | Severity classification of the drift. | One of: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. |
| `detected_by` | string | Identity or system that detected the drift. | Non-empty, max 128 characters. |
| `detection_method` | string | How the drift was detected. | One of: `AUTOMATED_MONITORING`, `PARITY_REVIEW`, `CONSUMER_REPORT`, `MANUAL_INSPECTION`, `INCIDENT_INVESTIGATION`. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `affected_fixtures` | array of strings | `[]` | List of fixture IDs affected by this drift. |
| `source_version_before` | string | `null` | Source system version before the drift occurred. |
| `source_version_after` | string | `null` | Source system version after the drift occurred (if known). |
| `expected_behavior` | string | `null` | Description of expected behavior. |
| `actual_behavior` | string | `null` | Description of actual (drifted) behavior. |
| `impact_assessment` | string | `null` | Assessment of downstream impact. |
| `recommended_action` | string | `null` | Recommended resolution approach. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in STAGED, ACTIVE, or FROZEN state.
2. **Slice existence and ownership**: Confirm slice exists and belongs to the specified mirror.
3. **Severity validity**: Confirm `severity` is one of the valid classifications.
4. **Detection method validity**: Confirm `detection_method` is one of the valid methods.
5. **Duplicate check**: Compute a description hash and check that no OPEN drift record exists with the same `mirror_id`, `slice_id`, and description hash.
6. **Severity-detection consistency**: CRITICAL drift detected by `AUTOMATED_MONITORING` or `INCIDENT_INVESTIGATION` triggers an immediate escalation flag.

## Side Effects

### 1. mirror-drift-registry.json

- **Action**: INSERT new drift record
- **Fields set**:
  - `drift_id`: Generated as `DRIFT-{MIRROR_CONTEXT}-{SEQUENCE}`
  - `mirror_id`: As provided
  - `slice_id`: As provided
  - `drift_description`: As provided
  - `severity`: As provided
  - `status`: Set to `"OPEN"`
  - `detected_by`: As provided
  - `detection_method`: As provided
  - `detected_at`: Current UTC timestamp
  - `resolved_at`: Set to `null`
  - `resolution`: Set to `null`
  - `affected_fixtures`: As provided
  - `source_version_before`, `source_version_after`: As provided
  - `expected_behavior`, `actual_behavior`: As provided
  - `impact_assessment`, `recommended_action`: As provided
  - `tags`: As provided
- **Metadata updates**: Increment `total_drift_records`, increment `drift_by_severity.{severity}`, increment `open_drift_count`

### 2. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `drift_count`: Increment by 1
  - `updated_at`: Current UTC timestamp

### 3. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `drift_count`: Increment by 1 (if field exists on slice)
  - `last_drift_detected_at`: Current UTC timestamp

### 4. mirror-transfer-registry.json

- **Action**: CONDITIONAL — If the slice has a transfer record and `severity` is HIGH or CRITICAL, the transfer readiness may be suspended
- **Fields updated** (if triggered):
  - `is_transfer_ready`: Set to `false`
  - `readiness_reason`: Updated to reflect unresolved drift

## Postconditions

1. A new drift record exists in `mirror-drift-registry.json` with `status: "OPEN"`.
2. The mirror's `drift_count` in `mirrors-registry.json` has been incremented.
3. The slice's drift tracking fields are updated.
4. If severity is HIGH or CRITICAL, any transfer readiness for the slice may be suspended.
5. If severity is CRITICAL, an escalation flag is set for governance review.
6. The drift record is immutable once created — it can only be resolved, not deleted.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in STAGED, ACTIVE, or FROZEN state. | Drift can only be recorded for mirrors in operational states. |
| `SLICE_NOT_FOUND` | No slice with the provided `slice_id`. | Verify the slice_id. |
| `SLICE_NOT_OWNED_BY_MIRROR` | Slice belongs to a different mirror. | Provide the correct mirror_id. |
| `INVALID_SEVERITY` | `severity` is not one of LOW, MEDIUM, HIGH, CRITICAL. | Provide a valid severity classification. |
| `INVALID_DETECTION_METHOD` | `detection_method` is not a recognized method. | Provide a valid detection method. |
| `DUPLICATE_DRIFT_RECORD` | An OPEN drift record with the same description hash already exists for this mirror/slice. | Reference the existing drift record instead of creating a duplicate. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "record-drift",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-001",
    "drift_description": "Source system updated detail normalization to v3.3.0 which changes the output format for timber joint specifications. The mirror still reflects v3.2.1 behavior, producing incompatible output for metric timber joints.",
    "severity": "HIGH",
    "detected_by": "construction-os/drift-monitor",
    "detection_method": "AUTOMATED_MONITORING",
    "source_version_before": "gcp-sd-v3.2.1",
    "source_version_after": "gcp-sd-v3.3.0",
    "expected_behavior": "Timber joint output follows v3.3.0 metric format with ISO 6707-1 codes.",
    "actual_behavior": "Mirror produces v3.2.1 format without ISO 6707-1 codes for metric timber joints.",
    "impact_assessment": "Downstream consumers relying on metric timber joint data will receive stale format.",
    "recommended_action": "Update mirror reflection logic to align with v3.3.0 normalization changes.",
    "affected_fixtures": ["FIX-003"],
    "tags": ["timber", "normalization", "format-change"]
  }
}
```
