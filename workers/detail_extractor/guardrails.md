# detail_extractor — Guardrails

## Must Not

- Define canonical geometry or spatial definitions. Geometry truth is owned by the Geometry Kernel.
- Parse specification text (that is spec_parser's domain).
- Make compliance determinations (that is compliance_signal's domain).
- Classify materials by assembly fit (that is material_intelligence's domain).
- Modify or extend Geometry Kernel or Reality Kernel schemas.
- Promote extracted details to canonical status.
- Deliver outputs directly to downstream consumers without handoff to validation.
- Infer dimensions not present in the source drawing.

## Must

- Tag all outputs with the correct category (extracted_structure or observation).
- Include confidence scores on all outputs, reflecting the interpretive nature of drawing extraction.
- Include source drawing and detail references on all outputs.
- Hand off all outputs to Construction_Runtime validation pipeline.
- Flag missing dimensions, unclear callouts, and drawing conflicts as observations.
