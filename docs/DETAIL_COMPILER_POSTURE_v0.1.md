# Detail Compiler Posture v0.1

## Authority
10-Construction_OS (domain execution plane)

## Pipeline

```
detail_candidate → validation_result → compiler_manifest → detail_compiler → compiled_artifact
```

## Validation States

| Decision | Behavior |
|----------|----------|
| PASS | Compile normally, artifact status = COMPILED |
| WARN | Compile provisional only, artifact status = PROVISIONAL, visibly watermarked |
| HALT | Do not compile, artifact status = BLOCKED, emit blocked record honestly |

## Current State (2026-04-02)

- **20 detail candidates** evaluated
- **10 WARN** → 10 PROVISIONAL artifacts (PARAPET conditions with complete assembly)
- **10 HALT** → 10 BLOCKED artifacts (OUTSIDE_CORNER/INSIDE_CORNER with derived assemblies)
- **0 PASS** → 0 fully COMPILED artifacts

### HALT Reason
Derived assemblies (barrett_sbs_edge_term_001) have 0 components. Rule CONSTRAINT-COMPLETE-ASSEMBLY fires.

### WARN Reason
Complete parapet assembly triggers CONSTRAINT-WARRANTY-APPLICATOR (certified applicator required for warranty).

## Schemas
- `schemas/compiler_manifest.schema.json`
- `schemas/compiled_detail_artifact.schema.json`
- `schemas/compiler_validation_result.schema.json`

## Tools
- `tools/detail_constraint_validator.py` — validates candidates against rules
- `tools/detail_manifest_builder.py` — builds compiler manifests
- `tools/detailatlas_compiler.py` — generates PDF detail packets (existing)

## Lineage
All artifacts carry full lineage: source_authority, manifest_id, validation_id, compiled_at.
