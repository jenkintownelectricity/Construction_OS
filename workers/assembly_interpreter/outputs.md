# assembly_interpreter — Outputs

## Output Schema

All outputs conform to the relevant output contract (see `contracts/`).

### Extracted Structures

| Field | Type | Description |
|---|---|---|
| assembly_id | string | Identifier for the extracted assembly |
| layer_sequence | array | Ordered list of layers from exterior to interior |
| layer_material | string | Material reference per layer |
| layer_thickness | number/null | Thickness if specified, null if not |
| attachment_method | string/null | How layers connect |
| performance_notes | array | Extracted performance characteristics |
| source_reference | string | Document and section of origin |
| confidence | float | Extraction confidence (0.0-1.0) |

### Observations

| Field | Type | Description |
|---|---|---|
| observation_type | string | ambiguity | missing_data | conflict | noted_condition |
| description | string | What was observed |
| source_reference | string | Document and section of origin |
| confidence | float | 1.0 for deterministic observations |

## Output Constraints

- All outputs are proposals. None are canonical.
- Outputs must include confidence scores.
- Outputs must reference their source document.
- Outputs must be handed off to governed validation surfaces.
