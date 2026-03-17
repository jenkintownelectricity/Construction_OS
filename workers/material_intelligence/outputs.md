# material_intelligence — Outputs

## Output Schema

### Proposals

| Field | Type | Description |
|---|---|---|
| material_reference | string | The input material reference being analyzed |
| identified_products | array | Specific products identified as matching the reference |
| assembly_fit_class | string | Classification of material fit within assembly context |
| substitution_candidates | array | Alternative products that may satisfy the same requirement |
| basis_of_classification | string | Why this classification was proposed |
| source_reference | string | Origin of the material reference |
| confidence | float | Classification confidence (0.0-1.0) |

### Signals

| Field | Type | Description |
|---|---|---|
| signal_type | string | material_fit | spec_compliance | availability | substitution_flag |
| material_reference | string | The material being evaluated |
| governed_reference | string | The kernel or spec definition compared against |
| comparison_result | string | Description of the comparison outcome |
| source_reference | string | Origin of the analysis |
| confidence | float | Signal confidence (0.0-1.0) |

## Output Constraints

- All outputs are proposals or signals. None are canonical.
- Product identifications are proposals, not definitive matches.
- Substitution candidates are suggestions requiring validation by governed surfaces.
- Outputs must include confidence scores.
- Outputs must be handed off to governed validation surfaces.
