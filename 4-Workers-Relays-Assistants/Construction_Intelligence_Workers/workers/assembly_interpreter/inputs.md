# assembly_interpreter — Inputs

## Accepted Inputs

| Input Type | Format | Description |
|---|---|---|
| Assembly documents | PDF, structured text | Construction assembly specifications and descriptions |
| Assembly drawings | Referenced via detail_extractor outputs | Drawing details depicting assembly configurations |
| Material schedules | Tabular data | Schedules listing materials within assemblies |
| Assembly kernel references | Governed schema (from CK) | Assembly Kernel definitions for binding extracted data |

## Input Constraints

- Inputs must be within the construction assembly domain.
- Inputs from other workers (e.g., detail_extractor) remain proposals and are treated as unvalidated.
- Assembly kernel references are consumed as governed definitions (read-only).
- Inputs lacking clear assembly context are rejected with an observation noting insufficient context.
