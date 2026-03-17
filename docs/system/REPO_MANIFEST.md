# Repository Manifest

**Repo**: Construction_Intelligence_Workers
**Version**: v0.1
**Role**: Signal extraction and proposal worker fleet

## First-Read Order

Read these files in this order to understand the repository:

1. `README.md` — Repository purpose and core constraints.
2. `docs/doctrine/worker-doctrine.md` — Foundational worker doctrine.
3. `docs/doctrine/proposal-vs-truth-policy.md` — Proposal vs truth boundary.
4. `docs/doctrine/worker-boundaries.md` — What workers may and may not do.
5. `docs/doctrine/handoff-doctrine.md` — Handoff requirements.
6. `docs/doctrine/signal-generation-policy.md` — Signal generation process.
7. `docs/architecture/stack-position.md` — Position beside the stack.
8. `docs/architecture/worker-system-map.md` — System architecture.
9. `docs/architecture/worker-inventory-overview.md` — The 5 initial workers.
10. `docs/system/FROZEN_SEAMS.md` — Frozen constraints.
11. `docs/system/DEPENDENCY_MAP.md` — Upstream and downstream dependencies.
12. `docs/system/AUTHORITATIVE_PATHS.md` — Authoritative file paths.
13. `contracts/` — Output contracts.
14. `maps/` — Worker-to-stack mapping.
15. `workers/` — Individual worker definitions.
16. `state/BASELINE_STATE.json` — Baseline state.

## File Inventory

### Root
- `README.md`

### docs/doctrine/
- `worker-doctrine.md`
- `proposal-vs-truth-policy.md`
- `signal-generation-policy.md`
- `worker-boundaries.md`
- `handoff-doctrine.md`

### docs/architecture/
- `worker-system-map.md`
- `worker-inventory-overview.md`
- `stack-position.md`
- `future-worker-expansion.md`

### docs/system/
- `REPO_MANIFEST.md` (this file)
- `FROZEN_SEAMS.md`
- `DEPENDENCY_MAP.md`
- `AUTHORITATIVE_PATHS.md`

### state/
- `BASELINE_STATE.json`

### contracts/
- `observation_output_contract.md`
- `proposal_output_contract.md`
- `normalized_structure_contract.md`
- `no-self-canonicalization-policy.md`

### maps/
- `worker_to_runtime_map.md`
- `worker_to_kernel_map.md`
- `worker_to_app_map.md`
- `signal_surface_map.md`

### workers/
- `assembly_interpreter/` — README.md, inputs.md, outputs.md, guardrails.md
- `spec_parser/` — README.md, inputs.md, outputs.md, guardrails.md
- `detail_extractor/` — README.md, inputs.md, outputs.md, guardrails.md
- `material_intelligence/` — README.md, inputs.md, outputs.md, guardrails.md
- `compliance_signal/` — README.md, inputs.md, outputs.md, guardrails.md
