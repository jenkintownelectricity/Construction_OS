# spec_parser — Guardrails

## Must Not

- Define canonical specification requirements. Specification authority is owned by project governance.
- Interpret drawings or visual documents (that is detail_extractor's domain).
- Make compliance determinations (that is compliance_signal's domain).
- Recommend products or materials (that is material_intelligence's domain).
- Modify or extend Governance Kernel or Deliverable Kernel schemas.
- Promote extracted requirements to canonical status.
- Deliver outputs directly to downstream consumers without handoff to validation.

## Must

- Tag all outputs with the correct category (extracted_structure or observation).
- Include confidence scores on all outputs.
- Include source specification section references on all outputs.
- Hand off all outputs to Construction_Runtime validation pipeline.
- Flag ambiguous or conflicting specification language as observations.
