# assembly_interpreter — Guardrails

## Must Not

- Define canonical assembly definitions. Assembly truth is owned by the Assembly Kernel.
- Modify or extend Assembly Kernel schemas.
- Promote extracted assemblies to canonical status.
- Make substitution recommendations (that is material_intelligence's domain).
- Process non-assembly documents.
- Deliver outputs directly to downstream consumers without handoff to validation.
- Suppress ambiguity observations. If the source is ambiguous, the worker must report it.

## Must

- Tag all outputs with the correct category (extracted_structure or observation).
- Include confidence scores on all outputs.
- Include source references on all outputs.
- Hand off all outputs to Construction_Runtime validation pipeline.
- Reject inputs outside its declared domain with an explanatory observation.
