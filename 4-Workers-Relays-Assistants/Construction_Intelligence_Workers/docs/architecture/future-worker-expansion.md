# Future Worker Expansion

## Purpose

Notes on expanding the worker fleet beyond the initial 5 workers.

## Expansion Principles

1. **New workers must conform to worker doctrine.** All constraints in `docs/doctrine/worker-doctrine.md` apply to future workers.
2. **New workers must declare boundaries.** Each new worker requires: README.md, inputs.md, outputs.md, guardrails.md.
3. **New workers must bind to at least one kernel.** Every worker must declare its primary kernel binding(s) from Construction_Kernel.
4. **New workers must not overlap existing worker domains without governance approval.**
5. **New workers must conform to existing output contracts.**

## Candidate Future Workers

| Candidate | Domain | Notes |
|---|---|---|
| `schedule_interpreter` | Construction schedule documents | Extract activity sequences, durations, dependencies |
| `cost_signal` | Cost and estimate data | Extract cost structures, compare against budget constraints |
| `submittal_parser` | Submittal documents | Extract product data, compliance claims, test reports |
| `rfi_classifier` | RFI documents | Classify RFI intent, extract referenced details and specs |
| `photo_context` | Site photography | Extract visible conditions, compare against expected state |

## Expansion Process

1. Define worker purpose and domain boundary.
2. Declare input domain, output schema, kernel bindings.
3. Write guardrails defining what the worker must not do.
4. Register in `docs/system/REPO_MANIFEST.md`.
5. Map to runtime, kernel, and application layers in `maps/`.
6. Submit for governance review.

## Frozen Constraints on Expansion

New workers must not:
- Define truth.
- Self-canonicalize.
- Bypass handoff to governed validation surfaces.
- Produce outputs outside the defined output categories (observation, extracted_structure, proposal, signal).
