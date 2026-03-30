# material_intelligence — Inputs

## Accepted Inputs

| Input Type | Format | Description |
|---|---|---|
| Material references | Structured text | Material callouts from documents or other worker outputs |
| Product data | Structured data | Manufacturer product information, technical data sheets |
| Assembly context | Extracted structures (from assembly_interpreter) | Assembly context for material fit classification |
| Specification requirements | Extracted structures (from spec_parser) | Spec requirements constraining material selection |
| Chemistry kernel references | Governed schema (from CK) | Chemistry Kernel definitions for material binding |

## Input Constraints

- Inputs from other workers are treated as unvalidated proposals.
- Product data from external sources is treated as reference material, not governed truth.
- Chemistry and Assembly kernel references are consumed as governed definitions (read-only).
- Material references lacking sufficient context are flagged with a signal noting insufficient data.
