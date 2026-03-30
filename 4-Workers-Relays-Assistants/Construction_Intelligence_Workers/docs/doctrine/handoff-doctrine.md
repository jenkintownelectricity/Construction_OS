# Handoff Doctrine

## Purpose

Defines how workers hand off outputs to governed validation surfaces.

## Handoff Principle

Workers produce. Governed surfaces validate. The handoff is the boundary between production and validation. No worker output may bypass this boundary.

## Handoff Requirements

Every handoff must include:

1. **Worker ID**: Which worker produced the output.
2. **Output Category**: observation | extracted_structure | proposal | signal.
3. **Output Payload**: The structured output conforming to the relevant output contract.
4. **Source Reference**: Document, section, detail, or input that produced the output.
5. **Confidence Score**: Numeric confidence where extraction involves interpretation. Deterministic extractions carry confidence `1.0`.
6. **Governed Reference**: The upstream kernel or runtime definition the output relates to, if any. `null` if unbound.
7. **Handoff Target**: The governed validation surface this output is directed to.

## Handoff Targets

| Output Category | Primary Handoff Target |
|---|---|
| Observation | Construction_Runtime validation pipeline |
| Extracted Structure | Construction_Runtime normalization validators |
| Proposal | Construction_Application_OS proposal review surface |
| Signal | Construction_Runtime signal audit surface |

## Handoff Posture

- Workers push outputs to handoff targets. Workers do not wait for validation results.
- Workers may be notified of validation outcomes for logging. Workers do not act on validation outcomes.
- If a handoff target is unavailable, the worker must queue the output and retry. Workers must not discard undelivered outputs.
- Handoff failures are logged as system signals and routed to runtime audit.

## Chain Handoffs

When workers operate in sequence (e.g., spec_parser -> compliance_signal), intermediate outputs remain proposals. Each stage hands off independently. No stage may treat a prior stage's output as validated.
