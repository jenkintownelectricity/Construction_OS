# Drift Removal Manifest

The following files and directories are structural drift from prior waves
and should be removed. They are superseded by the canonical truth-only
structure (docs/, schemas/, registry/, examples/, projection/).

## Forbidden Content (execution/UI/runtime drift)

| Path | Reason |
|------|--------|
| 200-engines/ | Execution engines are not owned by this truth domain |
| 300-tools/ | UI surfaces are not owned by this truth domain |
| 400-adapters/ | External bridges are not owned by this truth domain |
| 900-archive-immutable/ | Archive layer superseded by docs/PHASE_LOG |
| surface/ | Old Wave 1 UI surface (moved to projection/) |

## Superseded Content (replaced by canonical structure)

| Path | Replaced By |
|------|------------|
| 000-governance-truth/ | schemas/ + registry/ |
| 100-knowledge-graph/ | registry/ + projection/ |
| graph/ | registry/ (decomposed into proper truth categories) |
| lenses/ | projection/lens-definitions.json |
| constraints/ | registry/compatibility/ |
| relations/ | projection/detail-resolution-paths.json |
| schemas/ (old Wave 1) | schemas/ (new normalized) |

## Superseded Root Files

| File | Replaced By |
|------|------------|
| DOMAIN_OS_CONSTITUTION_v1.0.md | docs/DOMAIN_INTENT_v0.1.md |
| LAYER_BOUNDARY_RULES_v1.0.md | docs/DOMAIN_BOUNDARY_v0.1.md |
| THAW_REFREEZE_PROTOCOL_v1.0.md | Not applicable to truth-only domain |
| VERSIONING_RULES_v1.0.md | Not applicable to truth-only domain |
| TRANSFER_MAP.md | docs/PHASE_LOG_v0.1.md |
| BOUNDARY.md | docs/DOMAIN_BOUNDARY_v0.1.md |
| MANUFACTURER_ATLAS_FOUNDATION_RECEIPT.md | docs/PHASE_LOG_v0.1.md |

## Action Required

Delete all listed paths above. The canonical structure is:
```
docs/
schemas/
registry/
examples/
projection/
README.md
```

No runtime, UI, API, engine, signal bus, or execution content
should exist in this repository.
