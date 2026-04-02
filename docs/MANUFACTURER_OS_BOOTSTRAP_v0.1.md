# Manufacturer OS Bootstrap v0.1

## Authority
10-Construction_OS (domain execution plane)

## Purpose
Expose manufacturer-governed system logic using Barrett as first manufacturer.

## Barrett SBS Modified Bitumen — Current Posture

### System Family
Barrett Company — SBS Modified Bitumen (CSI 07 52 16)

### Assembly Primitives
| Assembly ID | Condition Type | Components | Constraints | Completeness |
|-------------|---------------|------------|-------------|-------------- |
| barrett_sbs_parapet_ext_001 | parapet_termination | 9 | 8 | complete |
| barrett_sbs_roof_drain_001 | roof_drain | 0 | 0 | derived |
| barrett_sbs_pipe_pen_001 | pipe_penetration | 0 | 0 | derived |
| barrett_sbs_wall_trans_001 | roof_to_wall_transition | 0 | 0 | derived |
| barrett_sbs_edge_term_001 | edge_termination | 0 | 0 | derived |

### Warranty Envelope (Parapet Assembly)
- Type: NDL (No Dollar Limit)
- Term: 20 years
- Coverage: Material and labor
- Wind speed: 110 mph
- Certified applicator required: YES

### Constraint Rules
6 manufacturer constraint rules in `config/detail_constraint_rules.barrett.json`

### Compiled Detail Set
| Condition | Validation | Artifact Status | Library Status |
|-----------|-----------|-----------------|---------------|
| PARAPET | WARN | PROVISIONAL | PROVISIONAL |
| OUTSIDE_CORNER | HALT | BLOCKED | REJECTED |
| INSIDE_CORNER | HALT | BLOCKED | REJECTED |

### Limitations
- 4 of 5 assemblies are derived (0 components) — need full component definition
- No raw DXF source data for symbol/polyline-based condition detection
- Warranty applicator constraint prevents full PASS/ADMITTED status

## Next Steps
1. Complete derived assembly definitions (components, constraints, warranty)
2. Ingest raw DXF source files for richer geometry
3. Add manufacturer-specific UI panel in Construction_Application_OS
