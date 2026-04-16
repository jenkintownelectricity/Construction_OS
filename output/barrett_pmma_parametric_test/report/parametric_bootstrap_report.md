# Barrett PMMA Parametric Bootstrap Report

## Status: PASS

## Calibration Source
Barrett PMMA CAD detail LF-CU-01 (Curb Flashing) + Barrett TDS + canonical assembly records

## Files Created
| File | Path |
|------|------|
| Measured Geometry Schema | schemas/barrett_pmma_measured_geometry.schema.json |
| Calibration Specimen | source/barrett/calibration/barrett_pmma_calibration_specimen_001.json |
| Assembly DNA Template | kernels/assembly_dna/pmma/barrett_pmma_flash_template.json |
| Parametric Generator | generators/pmma/pmma_flash_generator.py |
| Condition Family Map | source/barrett/condition_maps/barrett_pmma_condition_family_map.json |
| Generator Registry | registries/generator_registry.json |
| Bootstrap Receipt | receipts/barrett_pmma_parametric_bootstrap_receipt.json |

## Generator Path
`generators/pmma/pmma_flash_generator.py`

## Registry Path
`registries/generator_registry.json`

## Dimensions Captured
| Dimension | Value | Source |
|-----------|-------|--------|
| slab_thickness | 6" | Standard |
| insulation_thickness | 3" | Standard |
| turnup_height | 8" min | Barrett spec |
| curb_height | 8" min | Barrett CAD LF-CU-01 |
| curb_width | 6" | Barrett CAD LF-CU-01 |
| horizontal_extension | 3" | Barrett CAD LF-CU-01 |
| cant_dimension | 4" | Barrett spec |
| corner_reinforcement_ext | 4" min | Barrett spec |
| fleece_collar_radius | 4" min | Barrett spec |
| pipe_flash_height | 4" min | Barrett spec |
| membrane_each_side | 6" min | Barrett spec |
| slope | 1/4"/ft min | Standard |

## Dimensions Still Missing (null)
- reinforcement_width (varies by condition)
- joint_gap (project-specific)
- overburden_depth (project-specific)
- bellows_width (project-specific)
- pipe_diameter (project-specific)
- wall_thickness for non-parapet conditions
- coping_width for non-standard parapets

## Conditions Supported
All 10 target conditions have generator functions.

## Proof-of-Life
| Condition | Generator | Status |
|-----------|-----------|--------|
| 01 parapet_wall_termination | generate_parapet | PASS |
| 02 edge_drip_termination | generate_edge | PASS |
| 03 primary_roof_drain | generate_primary_drain | PASS |
| 04 pipe_penetration | generate_pipe_penetration | PASS |
| 05 equipment_curb | generate_equipment_curb | PASS |
| 06 inside_corner_reinforcement | generate_inside_corner | PASS |
| 07 outside_corner_reinforcement | generate_outside_corner | PASS |
| 08 crack_control_joint | generate_crack_control_joint | PASS |
| 09 tile_overburden_assembly | generate_tile_overburden | PASS |
| 10 expansion_joint | generate_expansion_joint | PASS |

## Blockers to Full Production
1. SVG renderer needs adapter to consume geometry JSON payloads
2. DXF exporter needs adapter to consume geometry JSON payloads
3. Null calibration dimensions need operator fill from field data
4. Barrett Company sign-off still required
