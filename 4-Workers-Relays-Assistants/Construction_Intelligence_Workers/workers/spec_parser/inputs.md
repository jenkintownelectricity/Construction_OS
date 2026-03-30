# spec_parser — Inputs

## Accepted Inputs

| Input Type | Format | Description |
|---|---|---|
| Specification documents | PDF, structured text | Construction specification sections |
| Specification indices | Tabular data | Table of contents and section listings |
| Referenced standards | Governed references | Standards cited within specifications |
| Governance kernel references | Governed schema (from CK) | Governance Kernel definitions for binding |

## Input Constraints

- Inputs must be construction specification documents or directly related references.
- The worker parses specification text; it does not interpret drawings (that is detail_extractor's domain).
- Referenced standards are treated as governed references (read-only).
- Specifications with unresolvable format issues are flagged with an observation.
