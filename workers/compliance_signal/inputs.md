# compliance_signal — Inputs

## Accepted Inputs

| Input Type | Format | Description |
|---|---|---|
| Extracted structures | Worker outputs (proposals) | Outputs from spec_parser, assembly_interpreter, detail_extractor, material_intelligence |
| Governed constraints | Governed schema (from CK/CR) | Code requirements, specification mandates, kernel-defined constraints |
| Code references | Structured data | Building code provisions, standards requirements |
| Governance kernel references | Governed schema (from CK) | Governance Kernel definitions for compliance binding |

## Input Constraints

- Inputs from other workers are treated as unvalidated proposals. Compliance signals reflect comparison results, not validated compliance.
- Governed constraints from CK/CR are consumed as governed definitions (read-only).
- Code references are treated as external governed references.
- Inputs lacking a clear governed constraint to compare against produce `unbound` signals routed for manual review.
