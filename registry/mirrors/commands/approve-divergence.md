# Command: approve-divergence

## Command Name

`approve-divergence`

## Description

Approves an existing drift record as an acceptable divergence, resolving it without requiring the mirror to re-align with the source system. This command is used when the drift represents a deliberate or acceptable deviation — for example, when the mirror intentionally applies construction-domain logic that differs from the source system's generic behavior, or when the source system change is considered non-applicable within the kernel's context.

Approved divergences are a formal governance decision. They require justification, an approver with sufficient authority, and an expiration policy. Divergences may be time-bounded (requiring periodic re-approval) or permanent (with appropriate architectural justification).

## Preconditions

1. **Drift record exists**: The specified `drift_id` must reference an existing drift record in `mirror-drift-registry.json`.
2. **Drift is OPEN**: The drift record's `status` must be `OPEN`. Resolved, approved, or rejected drift records cannot be re-approved.
3. **Justification provided**: A non-trivial justification must be supplied explaining why the divergence is acceptable.
4. **Approver authority**: The approver must have `drift:approve-divergence` permission. CRITICAL severity drifts require architecture board approval.
5. **Mirror is in eligible state**: The mirror referenced by the drift record must be in STAGED, ACTIVE, or FROZEN state.
6. **Operator authorization**: The operator must have `drift:approve-divergence` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `drift_id` | string | The drift record to approve as divergence. | Must exist in mirror-drift-registry.json with status OPEN. |
| `justification` | string | Detailed explanation of why this drift is an acceptable divergence. | Non-empty, min 50 characters, max 4096 characters. |
| `approver` | string | Identity of the approver authorizing the divergence. | Must match pattern `^[a-z0-9-]+/[a-z0-9-]+$`. Must have sufficient authority for the drift severity. |
| `divergence_type` | string | Classification of the divergence. | One of: `INTENTIONAL_OVERRIDE`, `SOURCE_NON_APPLICABLE`, `DOMAIN_SPECIALIZATION`, `DEFERRED_ALIGNMENT`, `PERMANENT_FORK`. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `expiration_date` | string | `null` | ISO 8601 date after which the divergence must be re-reviewed. Required for `DEFERRED_ALIGNMENT` type. |
| `re_review_interval_days` | integer | `null` | Number of days between mandatory re-reviews. If set, the divergence expires and re-opens if not re-approved. |
| `impact_mitigation` | string | `null` | Description of any mitigations applied to reduce downstream impact of the divergence. |
| `related_drift_ids` | array of strings | `[]` | Other drift records related to or resolved by this same divergence approval. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Drift record existence**: Confirm `drift_id` exists in `mirror-drift-registry.json`.
2. **Drift status check**: Confirm drift status is `OPEN`.
3. **Mirror state check**: Confirm the mirror referenced by the drift record is in an eligible state.
4. **Justification quality**: Justification must be at least 50 characters (prevents trivial approvals).
5. **Approver authority check**: For CRITICAL severity drifts, the approver must be an architecture board member. For HIGH severity, the approver must be a mirror owner or above.
6. **Divergence type consistency**: If `divergence_type` is `DEFERRED_ALIGNMENT`, an `expiration_date` must be provided. If `divergence_type` is `PERMANENT_FORK`, the justification minimum is 200 characters.
7. **Expiration validity**: If `expiration_date` is provided, it must be a future date.
8. **Related drift validity**: All `related_drift_ids` must reference existing drift records for the same mirror.

## Side Effects

### 1. mirror-drift-registry.json

- **Action**: UPDATE drift record
- **Fields updated**:
  - `status`: Set to `"APPROVED_DIVERGENCE"`
  - `resolution`: Set to `"DIVERGENCE_APPROVED"`
  - `resolution_details`: Object containing `justification`, `divergence_type`, `approver`, `expiration_date`, `re_review_interval_days`, `impact_mitigation`
  - `resolved_at`: Current UTC timestamp
  - `resolved_by`: Set to `approver`
- **Metadata updates**: Decrement `open_drift_count`, increment `resolved_drift_count`, increment `divergence_count`

### 2. mirror-drift-registry.json (related drifts)

- **Action**: CONDITIONAL — If `related_drift_ids` are provided, UPDATE each related drift record
- **Fields updated**:
  - `status`: Set to `"APPROVED_DIVERGENCE"`
  - `resolution`: Set to `"DIVERGENCE_APPROVED_VIA_RELATED"`
  - `resolution_details`: Reference to the primary drift approval
  - `resolved_at`: Current UTC timestamp

### 3. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `updated_at`: Current UTC timestamp
  - `drift_count`: Remains unchanged (drift count tracks total recorded, not open)

### 4. mirror-transfer-registry.json

- **Action**: CONDITIONAL — If the drift had previously suspended transfer readiness, re-evaluate readiness
- **Fields updated** (if applicable):
  - `readiness_reason`: Updated to reflect drift resolved as approved divergence

## Postconditions

1. The drift record's `status` in `mirror-drift-registry.json` is `"APPROVED_DIVERGENCE"`.
2. The `resolved_at` timestamp and `resolved_by` are set.
3. The resolution details capture the complete justification, divergence type, and governance metadata.
4. Any related drift records specified are also resolved.
5. If the divergence has an `expiration_date` or `re_review_interval_days`, it will be flagged for re-review when the period elapses.
6. Transfer readiness for the affected slice is re-evaluated.
7. The divergence approval is immutable — it can only be superseded by a new drift record if conditions change.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `DRIFT_NOT_FOUND` | No drift record with the provided `drift_id`. | Verify the drift_id. |
| `DRIFT_NOT_OPEN` | Drift record is not in OPEN status. | Only OPEN drift records can be approved as divergence. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in an eligible state. | Mirror must be in STAGED, ACTIVE, or FROZEN state. |
| `INSUFFICIENT_JUSTIFICATION` | Justification is too short. | Provide a justification of at least 50 characters (200 for PERMANENT_FORK). |
| `INSUFFICIENT_APPROVER_AUTHORITY` | Approver lacks authority for the drift severity level. | Obtain approval from an authorized individual. |
| `MISSING_EXPIRATION_DATE` | `divergence_type` is DEFERRED_ALIGNMENT but no `expiration_date` provided. | Provide an expiration date for deferred alignment divergences. |
| `EXPIRATION_IN_PAST` | Provided `expiration_date` is not a future date. | Provide a future expiration date. |
| `INVALID_DIVERGENCE_TYPE` | `divergence_type` is not a recognized classification. | Use one of the valid divergence types. |
| `RELATED_DRIFT_NOT_FOUND` | A referenced related drift record does not exist. | Verify related drift IDs. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "approve-divergence",
  "parameters": {
    "drift_id": "DRIFT-GCP-SD-001",
    "justification": "The source system's v3.3.0 timber joint normalization uses a generic format that does not comply with Construction OS kernel domain standards. The mirror intentionally applies ISO 6707-1 enrichment that the source system does not provide. This divergence is a domain specialization that adds value beyond the source system's capability.",
    "approver": "arch-board/member-1",
    "divergence_type": "DOMAIN_SPECIALIZATION",
    "impact_mitigation": "Downstream consumers receive enriched output that is a superset of source system output. No data loss or incompatibility.",
    "re_review_interval_days": 90,
    "tags": ["timber", "domain-specialization", "iso-6707-1"]
  }
}
```
