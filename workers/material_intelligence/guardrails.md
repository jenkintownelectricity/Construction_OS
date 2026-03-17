# material_intelligence — Guardrails

## Must Not

- Define canonical material properties. Material truth is owned by the Chemistry Kernel.
- Approve substitutions. Substitution approval is a governance decision.
- Make procurement recommendations. This worker classifies; it does not direct purchasing.
- Interpret construction drawings (that is detail_extractor's domain).
- Parse specification text directly (consumes spec_parser outputs instead).
- Modify or extend Chemistry Kernel or Assembly Kernel schemas.
- Promote material classifications to canonical status.
- Deliver outputs directly to downstream consumers without handoff to validation.
- Treat other worker outputs as validated data.

## Must

- Tag all outputs with the correct category (proposal or signal).
- Include confidence scores on all outputs.
- Include the basis of classification for all proposals.
- Include governed references for all signals.
- Hand off proposals to Construction_Application_OS proposal review surface.
- Hand off signals to Construction_Runtime signal audit surface.
- Flag materials with insufficient context as low-confidence signals.
