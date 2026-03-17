# Construction_Assistant

## Purpose

Construction_Assistant is a truth-emitting assistant layer that sits beside the construction stack (Layers 5-7). It reads governed truth from upstream systems and emits bounded truth to operators.

## What This Repo Is

- A query-response interface that emits bounded truth derived from governed upstream sources.
- A read-only consumer of truth surfaces exposed by Construction_Kernel, Construction_Runtime, and Construction_Application_OS.
- A bounded assistant that classifies every response as one of four emission types: truth, uncertainty, insufficiency, or next valid action.

## What This Repo Is Not

- This repo does not define truth. Truth originates in the kernel and runtime layers.
- This repo does not redefine runtime. Execution belongs to Construction_Runtime.
- This repo does not own workflow execution. Workflow coordination belongs to Construction_Application_OS.
- This repo does not mutate canonical state. All interactions are read-only.
- This repo does not approve, authorize, or certify. It reports what the governed system states.

## Stack Position

```
Layer 0: Universal_Truth_Kernel (root doctrine, reference only)
Layer 5: Construction_Kernel (domain truth)
Layer 6: Construction_Runtime (execution engine)
Layer 7: Construction_Application_OS (application coordination)
        |
        +-- Construction_Assistant (beside stack, reads and emits, does not originate)
```

## First-Read Order

1. Universal_Truth_Kernel nucleus (conceptual reference)
2. ValidKernel_Registry topology (conceptual reference)
3. `docs/system/REPO_MANIFEST.md`
4. `docs/system/AUTHORITATIVE_PATHS.md`
5. `docs/system/DEPENDENCY_MAP.md`
6. `docs/system/FROZEN_SEAMS.md`
7. `docs/doctrine/` (all doctrine files)
8. Implementation files (`assistant/`, `maps/`, `interfaces/`)
