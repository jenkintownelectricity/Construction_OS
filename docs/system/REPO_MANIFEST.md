# Repo Manifest

## Identity

- **Repo name:** Construction_Assistant
- **Stack role:** Truth-emitting assistant layer, beside the construction stack (Layers 5-7)
- **Branch:** claude/multi-repo-construction-build-WLo5u
- **Manifest version:** v0.1

## Purpose

Reads governed truth from upstream systems and emits bounded, classified responses to operators. Does not originate truth, mutate canonical state, or execute workflows.

## Owned Components

- Assistant doctrine (`docs/doctrine/`)
- Emission classification model (`docs/doctrine/truth-emission-model.md`)
- Authority boundaries (`docs/doctrine/authority-boundaries.md`)
- Query routing model (`docs/doctrine/routing-model.md`)
- Intent inventory and question taxonomy (`assistant/`)
- Stack mapping and truth surface maps (`maps/`)
- Operator interface contracts (`interfaces/`)

## Non-Owned Components

- Truth origination (owned by Construction_Kernel, Layer 5)
- Runtime execution (owned by Construction_Runtime, Layer 6)
- Application coordination (owned by Construction_Application_OS, Layer 7)
- Root doctrine (owned by Universal_Truth_Kernel, Layer 0)
- Canonical state in any upstream system

## Upstream Dependencies

| Dependency | Layer | Relationship |
|---|---|---|
| Universal_Truth_Kernel | Layer 0 | Conceptual doctrinal reference. No code inheritance. |
| Construction_Kernel | Layer 5 | Domain truth surfaces (read-only). |
| Construction_Runtime | Layer 6 | Execution state and validation surfaces (read-only). |
| Construction_Application_OS | Layer 7 | Application state surfaces (read-only). |

## Downstream Surfaces

- Operator-facing query responses (bounded emissions only)

## Frozen Seams

See `docs/system/FROZEN_SEAMS.md`. Summary:
- Truth-emission-only posture
- No canonical state mutation
- No truth origination
- Four emission classes (truth, uncertainty, insufficiency, next valid action)
- Bounded authority as defined in `docs/doctrine/authority-boundaries.md`

## Mutable Surfaces

- Intent inventory (`assistant/intent_inventory.md`) — new intent classes may be added
- Question taxonomy (`assistant/question_classes.md`) — new question types may be added
- Stack maps (`maps/`) — updated as upstream surfaces evolve
- Future expansion notes (`docs/architecture/future-expansion-notes.md`) — updated as plans evolve

## First-Read Order

1. Universal_Truth_Kernel nucleus (upstream, conceptual reference)
2. ValidKernel_Registry topology (upstream, conceptual reference)
3. This manifest (`docs/system/REPO_MANIFEST.md`)
4. `docs/system/AUTHORITATIVE_PATHS.md`
5. `docs/system/DEPENDENCY_MAP.md`
6. `docs/system/FROZEN_SEAMS.md`
7. `docs/doctrine/` (all doctrine files)
8. Implementation files (`assistant/`, `maps/`, `interfaces/`)

## Cache Invalidation Rules

- Cache is valid until branch commit or manifest change.
- Reaudit required on: branch change, commit change, manifest change, frozen seam change, explicit user request, topology change.
- Cache mode: manifest-first.
