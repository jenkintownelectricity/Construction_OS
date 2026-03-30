# Constraint Port Boundary Definition

## Classification
Ring 2 — Engine / Evaluation Surface

## Bounded Location
`10-Construction_OS/2-Engines-Tools-Datasets/Constraint-Port/`

## What the Constraint Port IS

1. A deterministic evaluation engine for construction constraints
2. A schema-governed surface for constraint objects, evidence, and decisions
3. A consumer of kernel-owned truth and external authority references
4. A producer of structured, evidence-backed decisions
5. A governed component registered through Construction_OS_Registry

## What the Constraint Port IS NOT

1. **Not a truth source** — truth is owned by kernels and external authorities
2. **Not a runtime component** — Runtime consumes decisions, Port evaluates
3. **Not an intelligence layer** — no LLM, no inference, no pattern matching
4. **Not a standards database** — contains only compact rule references
5. **Not a decision overrider** — BLOCK means BLOCK; only HUMAN_STAMP can override

## Dependency Map

### Consumes From (read-only)
- Construction_Material_Kernel — material properties and compatibility data
- Construction_Chemistry_Kernel — chemical interaction rules
- Construction_Assembly_Kernel — assembly sequence and method constraints
- Construction_Specification_Kernel — specification compliance requirements
- Construction_Scope_Kernel — scope boundary and responsibility constraints
- Construction_Reference_Intelligence — external code/standard references

### Produces For (output-only)
- Construction_Runtime — structured constraint decisions for execution gating
- Construction_Application_OS — constraint status for UI/reporting surfaces
- 5-State-Receipts-Signals — evaluation receipts and audit trail

### Registered Through
- Construction_OS_Registry — component manifest and version tracking

## Modification Rules

- Schema changes require L0 authority
- New constraint types require doctrine amendment
- Rule packs can be added by authorized contributors
- Taxonomy changes require governance review
- No file in this boundary may exceed 300 lines

## Fail-Closed Enforcement

If any evaluation cannot complete deterministically:
- Default decision: BLOCK
- Default evidence: `{ "reason": "evaluation_incomplete" }`
- No silent pass-through permitted
