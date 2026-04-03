# Barrett Layer Frequency Table

**Status:** PARTIAL — frequency counts pending local operator enumeration  
**Generated:** 2026-04-03  
**Total known layers:** 31  
**Total DXF files in corpus:** 74  
**Families:** RamProof_GC, RT-250, Black_Pearl, PMMA  

> **Note:** Full per-layer frequency counts require access to the 74 raw DXF JSON files
> at `source/barrett/json/`, which are gitignored and local-only (Windows paths).
> All frequency values below are marked LOCAL_OPERATOR_REQUIRED until a local operator
> runs layer enumeration against those files.

## Evidence Sources

| # | Source File | Type |
|--:|---|---|
| 1 | `config/manufacturer/barrett_layer_semantic_seed_ramproof_gc.json` | Seed map (11 layers) |
| 2 | `source/barrett/definitions/black_pearl.definition.json` | Family definition |
| 3 | `source/barrett/definitions/pmma.definition.json` | Family definition |
| 4 | `source/barrett/definitions/ramproof_gc.definition.json` | Family definition |
| 5 | `source/barrett/definitions/rt250.definition.json` | Family definition |

## SYSTEM_OWNED Layers

| Layer Name | Semantic Role | Families | Frequency | Source |
|---|---|---|---|---|
| RamProof SYSTEM LIQUID | liquid_applied_membrane | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| RamProof SYSTEM MESH | reinforcement_mesh | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| Ram Mastic | sealant | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| RAM POLY FELT 3.5 FILTER FABRIC | filter_fabric | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| Drainage Mat | drainage_layer | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| Protection Course | protection_course | RamProof_GC, Black_Pearl, RT-250 | LOCAL_OPERATOR_REQUIRED | seed map + definitions |
| Primer | primer | RamProof_GC, PMMA | LOCAL_OPERATOR_REQUIRED | seed map + definitions |
| RAM Black Pearl Sheet | membrane | Black_Pearl | LOCAL_OPERATOR_REQUIRED | definition |
| Black Pearl | membrane | Black_Pearl | LOCAL_OPERATOR_REQUIRED | definition |
| PMMA | membrane | PMMA | LOCAL_OPERATOR_REQUIRED | definition |
| RamFlash | membrane | PMMA | LOCAL_OPERATOR_REQUIRED | definition |
| Fleece | reinforcement_mesh | PMMA | LOCAL_OPERATOR_REQUIRED | definition |
| RamProof GC | membrane | RamProof_GC | LOCAL_OPERATOR_REQUIRED | definition |
| RamProof | membrane | RamProof_GC | LOCAL_OPERATOR_REQUIRED | definition |
| Membrane | membrane | RamProof_GC, RT-250 | LOCAL_OPERATOR_REQUIRED | definition |
| RamTough 250 | membrane | RT-250 | LOCAL_OPERATOR_REQUIRED | definition |
| RT-250 | membrane | RT-250 | LOCAL_OPERATOR_REQUIRED | definition |
| RT250 | membrane | RT-250 | LOCAL_OPERATOR_REQUIRED | definition |

## ANNOTATION Layers

| Layer Name | Semantic Role | Families | Frequency | Source |
|---|---|---|---|---|
| Text | annotation | all families | LOCAL_OPERATOR_REQUIRED | seed map + definitions |
| Dimensions | annotation | RamProof_GC | LOCAL_OPERATOR_REQUIRED | seed map |
| MULTILEADER | annotation | all families | LOCAL_OPERATOR_REQUIRED | definitions |

## CONTEXT_ONLY Layers

| Layer Name | Semantic Role | Families | Frequency | Source |
|---|---|---|---|---|
| Others | context_geometry | all families | LOCAL_OPERATOR_REQUIRED | seed map + definitions |
| Defpoints | reference_geometry | all families | LOCAL_OPERATOR_REQUIRED | seed map + definitions |
| Substrate | context_geometry | all families | LOCAL_OPERATOR_REQUIRED | definitions |
| Concrete | context_geometry | all families | LOCAL_OPERATOR_REQUIRED | definitions |
| Structural Slab | context_geometry | Black_Pearl, RT-250 | LOCAL_OPERATOR_REQUIRED | definitions |
| Overburden | context_geometry | Black_Pearl | LOCAL_OPERATOR_REQUIRED | definition |
| Wall | context_geometry | PMMA | LOCAL_OPERATOR_REQUIRED | definition |
| Foundation Wall | context_geometry | RamProof_GC | LOCAL_OPERATOR_REQUIRED | definition |
| Structural | context_geometry | RamProof_GC | LOCAL_OPERATOR_REQUIRED | definition |
| Foundation | context_geometry | RT-250 | LOCAL_OPERATOR_REQUIRED | definition |

## Summary by Ownership Role

| Ownership Role | Count |
|---|---:|
| SYSTEM_OWNED | 18 |
| ANNOTATION | 3 |
| CONTEXT_ONLY | 10 |
| **Total** | **31** |

## Next Steps (LOCAL_OPERATOR_REQUIRED)

1. Run layer enumeration script against all 74 JSON files at `source/barrett/json/`
2. For each layer, count: number of files containing it, total entity count, entity type breakdown
3. Identify any layers present in DXF files but not yet in this inventory
4. Update frequency values from LOCAL_OPERATOR_REQUIRED to actual counts
