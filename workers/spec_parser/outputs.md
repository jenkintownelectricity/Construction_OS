# spec_parser — Outputs

## Output Schema

### Extracted Structures

| Field | Type | Description |
|---|---|---|
| spec_section | string | Specification section identifier |
| requirement_type | string | prescriptive | performance | reference |
| requirement_text | string | Extracted requirement statement |
| material_references | array | Materials referenced in the section |
| acceptable_products | array | Listed acceptable products, if any |
| performance_criteria | array | Quantified performance requirements |
| referenced_standards | array | Standards cited |
| source_reference | string | Document, section, paragraph |
| confidence | float | Extraction confidence (0.0-1.0) |

### Observations

| Field | Type | Description |
|---|---|---|
| observation_type | string | ambiguity | conflict | missing_reference | unusual_condition |
| description | string | What was observed |
| source_reference | string | Document and section of origin |
| confidence | float | 1.0 for deterministic observations |

## Output Constraints

- All outputs are proposals. None are canonical.
- Outputs must include confidence scores.
- Outputs must reference their source specification section.
- Outputs must be handed off to governed validation surfaces.
