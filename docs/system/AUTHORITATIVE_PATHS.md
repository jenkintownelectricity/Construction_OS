# AUTHORITATIVE_PATHS — Construction_Runtime

## First-Read

Start here. These files establish context and authority.

- `README.md` — Project overview and orientation
- `docs/system/REPO_MANIFEST.md` — Identity, ownership, stack position, frozen/mutable boundaries
- `docs/system/FROZEN_SEAMS.md` — What must not change and what may evolve

## Authoritative

These files define the runtime's v0.2 contract surface and canonical standards. Changes here require careful review.

- `contracts/*.schema.json` — 6 JSON schemas defining pipeline stage boundaries
- `standards/error_codes.py` — Canonical error taxonomy (62 codes, 11 categories)
- `standards/layer_standards.py` — 10 canonical A- layers with ACI color indices
- `runtime/models/drawing_instruction.py` — DrawingInstructionSet (canonical intermediate representation)
- `runtime/pipeline/construction_pipeline.py` — Pipeline orchestrator (stage order is frozen)

## Supporting

Implementation files that execute against frozen contracts. Internals may evolve; interfaces are constrained by authoritative files above.

- `validators/` — Structural, domain, generation validators
- `geometry/` — Deterministic geometry engine and rules
- `generator/` — DXF writer, SVG writer (dual output from DrawingInstructionSet)
- `runtime/parsers/` — Assembly and spec parsers
- `runtime/engines/` — Assembly, constraint, spec engines
- `adapters/` — Translation adapters

## Skip Unless Needed

- `.gitignore` — Standard exclusions
- `apps/` — Demo applications only (assembly_parser_app, spec_intelligence_app); application shell belongs to Construction_Application_OS

## Reserved for Audit and Debug

- `tests/mutation/` — Mutation testing
- `tests/golden/` — Golden fixture tests
- `tests/snapshots/` — Snapshot tests
- `runtime/logging/` — Append-only audit logging (cryptographic hashes, 9 event types)
