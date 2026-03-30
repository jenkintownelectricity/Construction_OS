# Worker to Runtime Map

## Purpose

Maps each worker to its Construction_Runtime (Layer 6) integration points.

## Mappings

| Worker | Runtime Surface | Integration Type |
|---|---|---|
| assembly_interpreter | Validation pipeline | Extracted structures submitted for validation |
| assembly_interpreter | Normalization validators | Assembly structures normalized against runtime schemas |
| spec_parser | Validation pipeline | Extracted structures submitted for validation |
| spec_parser | Normalization validators | Specification structures normalized against runtime schemas |
| detail_extractor | Validation pipeline | Extracted structures submitted for validation |
| detail_extractor | Normalization validators | Detail structures normalized against runtime schemas |
| material_intelligence | Signal audit surface | Material signals submitted for audit |
| compliance_signal | Signal audit surface | Compliance signals submitted for audit |

## Runtime Contracts

All workers conform to Construction_Runtime execution contracts:
- Output schema validation before handoff.
- Handoff acknowledgment required.
- Audit trail maintained by runtime for all received worker outputs.
- Failed handoffs queued and retried per runtime retry policy.
