# Command: record-parity-review

## Command Name

`record-parity-review`

## Description

Records the results of a parity review for a specific slice on a mirror. A parity review evaluates how faithfully the mirror's reflected functionality reproduces the behavior of the source system for a defined set of test fixtures. The review captures the fixtures tested, the parity result classification, and the reviewer's assessment.

Parity reviews are a critical governance mechanism — they provide evidence that mirrored functionality meets the fidelity requirements defined in the integration contract. Reviews should be conducted at regular intervals and whenever significant changes are made to either the source system or the mirror's reflected logic.

## Preconditions

1. **Mirror exists**: The specified `mirror_id` must reference an existing mirror in `mirrors-registry.json`.
2. **Mirror is in eligible state**: The mirror must be in STAGED, ACTIVE, or FROZEN state. PROPOSED, CHARTERED, or RETIRED mirrors cannot have parity reviews recorded.
3. **Slice exists**: The specified `slice_id` must reference an existing slice in `mirror-slices-registry.json` belonging to the specified mirror.
4. **Slice is in eligible state**: The slice must be in STAGED, ACTIVE, or DISABLED state. DEPRECATED slices cannot receive new parity reviews.
5. **Fixtures provided**: At least one test fixture must be included in the review.
6. **Operator authorization**: The operator must have `parity:record` permission.

## Required Parameters

| Parameter | Type | Description | Validation |
|-----------|------|-------------|------------|
| `mirror_id` | string | The mirror containing the slice. | Must exist in mirrors-registry.json. |
| `slice_id` | string | The slice being reviewed. | Must exist in mirror-slices-registry.json belonging to the mirror. |
| `fixtures_tested` | array of objects | List of test fixtures executed. Each must have `fixture_id`, `fixture_name`, `input_hash`, `expected_output_hash`, `actual_output_hash`, `result` (PASS/FAIL). | Minimum 1 fixture. Each fixture must have all required fields. |
| `parity_result` | string | Overall parity classification. | One of: `PASS`, `PARTIAL`, `FAIL`. |
| `reviewer` | string | Identity of the reviewer conducting the assessment. | Must match pattern `^[a-z0-9-]+/[a-z0-9-]+$`. |
| `review_notes` | string | Reviewer's assessment notes. | Non-empty, max 4096 characters. |

## Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `parity_score` | number | Computed from fixtures | Numeric parity score (0.0 to 1.0). If not provided, computed as count of PASS fixtures / total fixtures. |
| `source_version` | string | `null` | Version of the source system at review time. |
| `mirror_version` | string | `null` | Version of the mirror's reflected logic at review time. |
| `review_methodology` | string | `"AUTOMATED"` | Methodology used: `AUTOMATED`, `MANUAL`, `HYBRID`. |
| `tags` | array of strings | `[]` | Freeform tags for categorization. |

## Validation Rules

1. **Mirror existence and state**: Confirm mirror exists and is in STAGED, ACTIVE, or FROZEN state.
2. **Slice existence and ownership**: Confirm slice exists and belongs to the specified mirror.
3. **Slice state eligibility**: Confirm slice is not DEPRECATED.
4. **Fixture completeness**: Each fixture in `fixtures_tested` must have all required fields populated.
5. **Fixture result consistency**: Each fixture's `result` must be PASS or FAIL. The `actual_output_hash` must be non-empty.
6. **Parity result consistency**: If all fixtures PASS, `parity_result` must be `PASS`. If all fixtures FAIL, `parity_result` must be `FAIL`. Mixed results should be `PARTIAL`. The command will warn (but not fail) if the provided classification does not match the computed classification.
7. **Parity score range**: If provided, `parity_score` must be between 0.0 and 1.0 inclusive.
8. **Reviewer format**: The `reviewer` must match the identity format.

## Side Effects

### 1. mirror-slices-registry.json

- **Action**: UPDATE slice record
- **Fields updated**:
  - `parity_score`: Set to computed or provided parity score
  - `parity_fixtures_total`: Set to length of `fixtures_tested`
  - `parity_fixtures_pass`: Set to count of fixtures with `result: "PASS"`
  - `last_parity_review_at`: Current UTC timestamp
  - `last_parity_result`: Set to provided `parity_result`
  - `parity_review_count`: Increment by 1
- **Metadata updates**: Update `parity_distribution` counters

### 2. mirrors-registry.json

- **Action**: UPDATE mirror record
- **Fields updated**:
  - `parity_score`: Recomputed as weighted average of all slice parity scores
  - `updated_at`: Current UTC timestamp

### 3. mirror-drift-registry.json

- **Action**: CONDITIONAL — If `parity_result` is `PARTIAL` or `FAIL`, and the previous review result was `PASS`, a drift advisory record may be automatically created
- **Fields set** (if triggered):
  - `drift_id`: Generated
  - `mirror_id`, `slice_id`: As provided
  - `drift_description`: Auto-generated from failing fixtures
  - `severity`: `MEDIUM` for PARTIAL, `HIGH` for FAIL
  - `detected_by`: `"parity-review-system"`

## Postconditions

1. The slice's parity metrics in `mirror-slices-registry.json` are updated to reflect the latest review.
2. The mirror's aggregate `parity_score` in `mirrors-registry.json` is recomputed.
3. If parity degraded from a previous PASS to PARTIAL or FAIL, a drift advisory may exist in `mirror-drift-registry.json`.
4. The review is immutable — once recorded, it cannot be modified (only superseded by a newer review).
5. The parity review count for the slice has been incremented.

## Error Conditions

| Error Code | Condition | Resolution |
|------------|-----------|------------|
| `MIRROR_NOT_FOUND` | No mirror with the provided `mirror_id`. | Verify the mirror_id. |
| `MIRROR_STATE_INELIGIBLE` | Mirror is not in STAGED, ACTIVE, or FROZEN state. | Parity reviews cannot be recorded for PROPOSED, CHARTERED, or RETIRED mirrors. |
| `SLICE_NOT_FOUND` | No slice with the provided `slice_id`. | Verify the slice_id. |
| `SLICE_NOT_OWNED_BY_MIRROR` | Slice belongs to a different mirror. | Provide the correct mirror_id. |
| `SLICE_STATE_INELIGIBLE` | Slice is DEPRECATED. | Cannot record parity reviews for DEPRECATED slices. |
| `INVALID_PARITY_RESULT` | `parity_result` is not one of PASS, PARTIAL, FAIL. | Provide a valid parity result classification. |
| `EMPTY_FIXTURES` | `fixtures_tested` array is empty. | Provide at least one test fixture. |
| `INVALID_FIXTURE_FORMAT` | A fixture is missing required fields. | Ensure each fixture has fixture_id, fixture_name, input_hash, expected_output_hash, actual_output_hash, result. |
| `INVALID_PARITY_SCORE` | Provided `parity_score` is outside 0.0-1.0 range. | Provide a valid score or omit to auto-compute. |
| `MISSING_REQUIRED_PARAMETER` | A required parameter is missing. | Provide all required parameters. |
| `REGISTRY_WRITE_FAILED` | Registry update failed. | Retry the command. |

## Example

```json
{
  "command": "record-parity-review",
  "parameters": {
    "mirror_id": "MIRROR-GCP-SHOPDRAWING-001",
    "slice_id": "SLICE-GCP-SD-001",
    "fixtures_tested": [
      {
        "fixture_id": "FIX-001",
        "fixture_name": "steel_beam_normalization_standard",
        "input_hash": "sha256:abc123",
        "expected_output_hash": "sha256:def456",
        "actual_output_hash": "sha256:def456",
        "result": "PASS"
      },
      {
        "fixture_id": "FIX-002",
        "fixture_name": "concrete_slab_normalization_imperial",
        "input_hash": "sha256:ghi789",
        "expected_output_hash": "sha256:jkl012",
        "actual_output_hash": "sha256:jkl012",
        "result": "PASS"
      },
      {
        "fixture_id": "FIX-003",
        "fixture_name": "timber_joint_normalization_metric",
        "input_hash": "sha256:mno345",
        "expected_output_hash": "sha256:pqr678",
        "actual_output_hash": "sha256:stu901",
        "result": "FAIL"
      }
    ],
    "parity_result": "PARTIAL",
    "reviewer": "construction-os/parity-review-team",
    "review_notes": "Timber joint normalization produces incorrect output for metric units. Steel and concrete pass. Filed drift advisory for timber handling.",
    "review_methodology": "AUTOMATED",
    "source_version": "gcp-sd-v3.2.1",
    "mirror_version": "0.4.0"
  }
}
```
