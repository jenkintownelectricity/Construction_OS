# Authoritative Paths

**Repo**: Construction_Intelligence_Workers
**Version**: v0.1

## Purpose

Declares which file paths are authoritative for which concerns. When conflicts exist, the authoritative path governs.

## Path Authority

| Concern | Authoritative Path |
|---|---|
| Repository purpose and constraints | `README.md` |
| Worker doctrine | `docs/doctrine/worker-doctrine.md` |
| Proposal vs truth boundary | `docs/doctrine/proposal-vs-truth-policy.md` |
| Signal generation rules | `docs/doctrine/signal-generation-policy.md` |
| Worker boundaries | `docs/doctrine/worker-boundaries.md` |
| Handoff requirements | `docs/doctrine/handoff-doctrine.md` |
| System architecture | `docs/architecture/worker-system-map.md` |
| Worker inventory | `docs/architecture/worker-inventory-overview.md` |
| Stack position | `docs/architecture/stack-position.md` |
| Future expansion | `docs/architecture/future-worker-expansion.md` |
| Repository manifest and read order | `docs/system/REPO_MANIFEST.md` |
| Frozen seams | `docs/system/FROZEN_SEAMS.md` |
| Dependency map | `docs/system/DEPENDENCY_MAP.md` |
| Authoritative paths | `docs/system/AUTHORITATIVE_PATHS.md` (this file) |
| Baseline state | `state/BASELINE_STATE.json` |
| Observation output contract | `contracts/observation_output_contract.md` |
| Proposal output contract | `contracts/proposal_output_contract.md` |
| Normalized structure contract | `contracts/normalized_structure_contract.md` |
| No-self-canonicalization policy | `contracts/no-self-canonicalization-policy.md` |
| Worker-to-runtime mapping | `maps/worker_to_runtime_map.md` |
| Worker-to-kernel mapping | `maps/worker_to_kernel_map.md` |
| Worker-to-app mapping | `maps/worker_to_app_map.md` |
| Signal surface mapping | `maps/signal_surface_map.md` |

## Per-Worker Authority

| Worker | Authoritative Path |
|---|---|
| assembly_interpreter | `workers/assembly_interpreter/` |
| spec_parser | `workers/spec_parser/` |
| detail_extractor | `workers/detail_extractor/` |
| material_intelligence | `workers/material_intelligence/` |
| compliance_signal | `workers/compliance_signal/` |

Within each worker directory, `README.md` is authoritative for purpose, `inputs.md` for accepted inputs, `outputs.md` for bounded outputs, and `guardrails.md` for constraints.
