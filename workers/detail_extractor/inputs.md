# detail_extractor — Inputs

## Accepted Inputs

| Input Type | Format | Description |
|---|---|---|
| Construction drawings | PDF, image, structured vector | Drawing sheets containing construction details |
| Detail callout references | Structured text | References identifying which details to extract |
| Drawing indices | Tabular data | Sheet indices and detail listings |
| Geometry kernel references | Governed schema (from CK) | Geometry Kernel definitions for spatial binding |

## Input Constraints

- Inputs must be construction drawings or directly related references.
- The worker extracts from visual/graphic documents; it does not parse specification text (that is spec_parser's domain).
- Geometry kernel references are consumed as governed definitions (read-only).
- Drawings with unreadable or corrupt content are flagged with an observation.
