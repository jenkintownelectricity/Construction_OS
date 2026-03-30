# Normalized Structure Contract

## Purpose

Defines the required schema and constraints for extracted_structure-category worker outputs.

## Schema

Every extracted structure output must include:

| Field | Type | Required | Description |
|---|---|---|---|
| output_category | string | Yes | Must be `extracted_structure` |
| worker_id | string | Yes | Identifier of the producing worker |
| structure_type | string | Yes | assembly | specification_requirement | detail | material_reference |
| structure_content | object | Yes | The normalized data structure (worker-specific schema) |
| source_reference | string | Yes | Document, section, detail of origin |
| confidence | float | Yes | Extraction confidence (0.0-1.0) |
| governed_reference | string/null | No | Upstream kernel definition used for normalization |
| normalization_basis | string | Yes | Which kernel schema was used to normalize the structure |
| handoff_target | string | Yes | Governed validation surface for delivery |
| timestamp | string | Yes | ISO 8601 timestamp of extraction |

## Constraints

- The `output_category` field must be exactly `extracted_structure`.
- Extracted structures are non-canonical. They represent what was found, normalized against a governed schema.
- The `normalization_basis` must reference a valid kernel schema.
- Structures that cannot be fully normalized must include partial data with reduced confidence.
- Missing required fields render the output non-compliant and block handoff.
