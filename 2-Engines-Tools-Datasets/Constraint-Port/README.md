# Constraint Port

## Location
`2-Engines-Tools-Datasets/Constraint-Port/`

## Purpose
Bounded evaluation surface for construction constraints.
Evaluates physical, regulatory, manufacturer, and warranty constraints deterministically.

## Authority
- Truth is kernel-owned — the Constraint Port does not invent truth
- Runtime consumes constraint decisions — it does not reason about them
- All evaluation is deterministic and evidence-based

## Subdirectories
- `doctrine/` — governance and boundary documents
- `schemas/` — JSON schemas for constraint objects, evidence, decisions
- `contracts/` — TypeScript type/interface definitions (no runtime code)
- `taxonomy/` — severity and action classification
- `examples/` — compact example rule packs
- `registry/` — manifest stub for Construction_OS_Registry induction
- `receipts/` — build receipts

## Ring Classification
Ring 2 — Engine / Tool surface

## Governance
Established under L0 command authority (L0-CMD-CONOS-VKGL04R-CPORT-001).
