# Worker Boundaries

## Purpose

Defines what workers may and may not do.

## Workers May

- Extract structured data from construction documents within their declared input domain.
- Normalize extracted data into governed output schemas.
- Compare extracted data against governed reference definitions.
- Emit proposals, observations, and signals with confidence scores.
- Reference upstream kernel definitions for context binding.
- Report extraction failures and ambiguities.
- Request clarification via signal (routed to validation surface).

## Workers Must Not

- **Define truth.** Workers do not create canonical definitions.
- **Self-canonicalize.** Workers do not promote their own outputs to authoritative status.
- **Store final state.** Workers do not maintain persistent canonical state. Intermediate processing state is permitted; final state is owned by governed surfaces.
- **Make downstream decisions.** Workers do not trigger actions. They propose; governed systems decide.
- **Expand scope unilaterally.** Workers do not process inputs outside their declared domain without governance approval.
- **Override governed references.** Workers do not modify, extend, or contradict upstream kernel or runtime definitions.
- **Consume other worker outputs as truth.** If a worker chain exists, intermediate outputs remain proposals until validated.
- **Bypass handoff.** Every output must reach a governed validation surface. Direct delivery to consumers without validation is prohibited.

## Boundary Enforcement

Boundary violations are detected by:
- Output schema validation (contracts layer).
- Handoff verification (runtime audit).
- Frozen seam checks (seam integrity layer).
