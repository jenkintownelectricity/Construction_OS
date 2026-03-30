# Command: create-mirror

## Command Name

`create-mirror`

## Description

Registers a new mirror in the Construction OS registry in the initial PROPOSED state. This is the entry point for all mirror lifecycle management. The command creates the canonical mirror record, initializes the lifecycle audit trail, and reserves the mirror identifier namespace.

A mirror should be created when a new external system integration has been identified and scoped. The proposal captures the source system, intended scope, trust boundary classification, and ownership. No slices are registered at this stage — that occurs during staging after charter approval.

## Preconditions

1. **No duplicate mirror name**: No existing mirror in `mirrors-registry.json` may have the same `mirror_name`. Mirror names are globally unique within the registry.
2. **Valid source system**: The `source_system` identifier must be a non-empty string that uniquely identifies the external system being mirrored.
3. **Valid kernel reference**: The `kernel_ref` must reference an existing kernel integration nucleus. Currently, the only valid reference is `KERN-INTEGRATION-MIRROR-NUCLEUS`.
4. **Valid trust boundary**: The `trust_boundary` must be one of the valid trust boundary classifications defined in the registry metadata: `INTERNAL`, `EXTERNAL_MANAGED`, `EXTERNAL_UNMANAGED`, `FEDERATED`.
5. **Owner specified**: A valid `owner` must be provided in the format `org/team` or `org/individual`.
6. **Operator authorization**: The operator executing the command must have `mirror:create` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_name` | string | Unique machine-readable name for the mirror. Lowercase alphanumeric with underscores. | Must match pattern `^[a-z][a-z0-9_]{2,63}$`. Must not already exist in registry. |
| `display_name` | string | Human-readable display name. | Non-empty, max 128 characters. |
| `description` | string | Detailed description of the mirror's purpose and scope. | Non-empty, max 2048 characters. |
| `source_system` | string | Identifier of the external system being mirrored. | Non-empty, max 128 characters. |
| `source_system_type` | string | Classification of the source system. | One of: `CLOUD_PLATFORM`, `ON_PREMISE`, `SAAS`, `HYBRID`, `EDGE`. |
| `source_system_provider` | string | Name of the provider or vendor. | Non-empty, max 128 characters. |
| `trust_boundary` | string | Trust boundary classification. | One of: `INTERNAL`, `EXTERNAL_MANAGED`, `EXTERNAL_UNMANAGED`, `FEDERATED`. |
| `owner` | string | Owner team or individual. | Must match pattern `^[a-z0-9-]+/[a-z0-9-]+$`. |
| `owner_contact` | string | Contact email for the owner. | Must be a valid email address. |
| `kernel_ref` | string | Reference to the kernel integration nucleus. | Must be a valid kernel reference. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tags` | array of strings | `[]` | Freeform tags for categorization. |
| `metadata` | object | `{}` | Arbitrary key-value metadata specific to the source system. |
| `trust_boundary_details` | object | `null` | Detailed trust boundary configuration (authentication, authorization, encryption). |

## Validation Rules

The following validations are executed in order. If any validation fails, the command is rejected and no state changes occur.

1. **Parameter completeness**: All required parameters must be present and non-null.
2. **Parameter format**: All parameters must match their declared format and validation patterns.
3. **Uniqueness check**: Query `mirrors-registry.json` to confirm no mirror exists with the same `mirror_name`.
4. **Kernel reference check**: Validate that `kernel_ref` references a known kernel nucleus.
5. **Owner existence check**: Validate that the `owner` identifier maps to a known team or individual.
6. **Trust boundary consistency**: If `trust_boundary_details` is provided, validate that it is consistent with the declared `trust_boundary` classification.

## Side Effects

Upon successful validation, the following registry mutations are performed atomically:

### 1. mirrors-registry.json

- **Action**: INSERT new mirror record
- **Fields set**:
  - `mirror_id`: Generated as `MIRROR-{CONTEXT}-{SEQUENCE}` where CONTEXT is derived from source_system
  - `mirror_name`: As provided
  - `display_name`: As provided
  - `description`: As provided
  - `source_system`, `source_system_type`, `source_system_provider`: As provided
  - `lifecycle_state`: Set to `PROPOSED`
  - `lifecycle_state_reason`: Set to `"Initial mirror proposal created."`
  - `trust_boundary`, `trust_boundary_details`: As provided
  - `created_at`: Current UTC timestamp
  - `updated_at`: Current UTC timestamp
  - All other timestamp fields (`chartered_at`, `staged_at`, etc.): Set to `null`
  - `owner`, `owner_contact`: As provided
  - `version`: Set to `"0.1.0"`
  - `kernel_ref`: As provided
  - `kernel_ref_version`: Set to current kernel version
  - `slice_count`: Set to `0`
  - `active_slice_count`: Set to `0`
  - `parity_score`: Set to `null`
  - `drift_count`: Set to `0`
  - `breakaway_count`: Set to `0`
  - `tags`, `metadata`: As provided
- **Metadata updates**: Increment `total_mirrors` and `mirrors_by_state.PROPOSED`

### 2. mirror-lifecycle-registry.json

- **Action**: APPEND new transition record
- **Fields set**:
  - `transition_id`: Generated as `TRANS-{CONTEXT}-{SEQUENCE}`
  - `mirror_id`: The newly generated mirror_id
  - `mirror_name`: As provided
  - `from_state`: `null` (initial creation)
  - `to_state`: `"PROPOSED"`
  - `transitioned_at`: Current UTC timestamp
  - `transitioned_by`: Operator identity
  - `reason`: As derived from description or provided explicitly
  - `validation_result`: Results of all validation checks
  - `artifacts`: Empty or as provided
  - `tags`: `["initial", "proposal"]`
- **Metadata updates**: Increment `total_transitions` and `transitions_by_target_state.PROPOSED`

## Postconditions

After successful execution:

1. A new mirror record exists in `mirrors-registry.json` with `lifecycle_state = "PROPOSED"`.
2. A lifecycle transition record exists in `mirror-lifecycle-registry.json` recording the `null -> PROPOSED` transition.
3. The mirror_id is globally unique and can be used to reference this mirror in all subsequent commands.
4. No slices, drift records, breakaway records, promotion records, or transfer records exist for this mirror (those are created by subsequent commands).
5. Registry metadata counters are consistent with the new state.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NAME_EXISTS` | A mirror with the provided `mirror_name` already exists. | Choose a different mirror name. |
| `INVALID_MIRROR_NAME_FORMAT` | The `mirror_name` does not match the required pattern. | Correct the name to match `^[a-z][a-z0-9_]{2,63}$`. |
| `INVALID_KERNEL_REF` | The provided `kernel_ref` does not reference a known kernel nucleus. | Use a valid kernel reference. |
| `INVALID_TRUST_BOUNDARY` | The provided `trust_boundary` is not a recognized classification. | Use one of the valid trust boundary values. |
| `INVALID_OWNER_FORMAT` | The `owner` does not match the required format. | Use format `org/team` or `org/individual`. |
| `OWNER_NOT_FOUND` | The `owner` identifier does not map to a known team or individual. | Register the team/individual first or correct the identifier. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing or null. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | The registry file could not be updated (I/O error, lock contention). | Retry the command. If persistent, investigate registry storage health. |

## Example

```json
{
  "command": "create-mirror",
  "parameters": {
    "mirror_name": "gcp_shopdrawing",
    "display_name": "GCP Shop Drawing Mirror",
    "description": "Integration mirror for Google Cloud Platform shop drawing services.",
    "source_system": "gcp_shopdrawing",
    "source_system_type": "CLOUD_PLATFORM",
    "source_system_provider": "Google Cloud Platform",
    "trust_boundary": "EXTERNAL_MANAGED",
    "owner": "construction-os/mirror-team",
    "owner_contact": "mirror-team@construction-os.internal",
    "kernel_ref": "KERN-INTEGRATION-MIRROR-NUCLEUS",
    "tags": ["gcp", "shop-drawing"]
  }
}
```
