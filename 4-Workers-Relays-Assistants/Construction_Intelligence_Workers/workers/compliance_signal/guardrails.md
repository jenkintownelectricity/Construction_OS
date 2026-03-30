# compliance_signal — Guardrails

## Must Not

- Make compliance determinations. This worker signals potential conformance or deviation; it does not certify compliance.
- Define or modify code requirements. Code authority is external to this worker.
- Override governed constraints. Workers compare against constraints; they do not change them.
- Extract data from source documents directly (consumes other worker outputs instead).
- Modify or extend Governance Kernel or Intelligence Kernel schemas.
- Promote compliance signals to canonical compliance status.
- Deliver outputs directly to downstream consumers without handoff to validation.
- Treat upstream worker outputs as validated data. Confidence scores must account for upstream uncertainty.

## Must

- Tag all outputs as signals.
- Include confidence scores on all outputs, accounting for upstream extraction uncertainty.
- Include both the extracted value and the governed constraint in every signal.
- Include the source worker and governed reference in every signal.
- Hand off all signals to Construction_Runtime signal audit surface.
- Emit `insufficient_data` signals when comparison cannot be performed.
- Emit `ambiguity` signals when the comparison outcome is indeterminate.
