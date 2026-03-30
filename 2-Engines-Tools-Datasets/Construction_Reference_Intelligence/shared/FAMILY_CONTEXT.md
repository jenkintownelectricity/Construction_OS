# Construction Kernel Family Context

## Architecture

The construction kernel family consists of **1 reference intelligence layer + 5 canonical truth kernels**, all registered in ValidKernel_Registry.

```
                  ValidKernel_Registry
                         |
        Construction_Reference_Intelligence
           (reference-intelligence layer)
                         |
     +---------+---------+---------+---------+
     |         |         |         |         |
  Spec      Assembly  Material  Chemistry  Scope
  Kernel    Kernel    Kernel    Kernel     Kernel
```

- **Construction_Reference_Intelligence** -- owns reference intelligence (failure patterns, success patterns, precedents, trends, evidence-linked observations, confidence evolution, interface-risk observations, climate/lifecycle/geometry-linked intelligence)
- **Construction_Specification_Kernel** -- owns specification truth
- **Construction_Assembly_Kernel** -- owns assembly truth
- **Construction_Material_Kernel** -- owns material truth
- **Construction_Chemistry_Kernel** -- owns chemistry truth
- **Construction_Scope_Kernel** -- owns scope truth

## Initial Domain Focus

**CSI Division 07 - Building Envelope Systems (Thermal and Moisture Protection)**

Division 07 is treated as an enclosure control-layer system, not merely a product bucket. All kernel truth, reference intelligence, and scope operations are organized around control-layer continuity and interface-zone integrity.

## Control Layer Posture

The building enclosure is analyzed through 11 control layers:

| # | Control Layer | Purpose |
|---|--------------|---------|
| 1 | bulk_water_control | Primary barrier against liquid water ingress |
| 2 | capillary_control | Resistance to moisture migration via capillary action |
| 3 | air_control | Continuous barrier limiting uncontrolled air movement |
| 4 | vapor_control | Layer managing vapor diffusion to prevent interstitial condensation |
| 5 | thermal_control | Insulation layer managing heat flow |
| 6 | fire_smoke_control | Barriers and rated assemblies limiting fire spread and smoke migration |
| 7 | movement_control | Joints and details accommodating thermal, structural, and seismic movement |
| 8 | weathering_surface | Outermost layer resisting UV, wind, precipitation, and degradation |
| 9 | drainage_plane | Layer directing incidental moisture downward and outward |
| 10 | protection_layer | Layer shielding underlying control layers from damage |
| 11 | vegetation_support_layer | Substrate and root-barrier for vegetated assemblies |

Canonical definitions: `shared/control_layers.json`

## Interface Zones

10 interface zones represent the highest-risk locations in the building enclosure:

| # | Interface Zone | Description |
|---|---------------|-------------|
| 1 | roof_to_wall | Roofing system meets vertical wall assembly |
| 2 | parapet_transition | Roof membrane terminates at parapet; wall cladding begins |
| 3 | penetration | Pipes, conduits, structural members pass through enclosure |
| 4 | fenestration_edge | Perimeter around windows, doors, curtain wall frames |
| 5 | below_grade_transition | Above-grade wall transitions to below-grade waterproofing |
| 6 | expansion_joint | Designed movement joint between building sections |
| 7 | deck_to_wall | Horizontal deck or plaza meets vertical wall |
| 8 | roof_edge | Perimeter edge including fascia, drip edge, coping |
| 9 | curb_transition | Roof membrane transitions over equipment curbs, skylights |
| 10 | drain_transition | Membrane connects to roof drains, scuppers, overflow points |

Canonical definitions: `shared/interface_zones.json`

## Cross-Kernel Coordination Rules

1. **Single source of truth**: each fact type is owned by exactly one kernel. No duplication of canonical truth across repos.
2. **Reference by pointer**: kernels reference sibling data by identifier, never by embedding copies.
3. **Intelligence layer reads, does not override**: this repo observes and annotates kernel truth but cannot alter it.
4. **Shared artifacts live here**: control-layer and interface-zone registries are maintained in this repo's `shared/` directory. Sibling kernels point to these shared definitions.
5. **Fail-closed governance**: any operation that cannot be validated against its owning kernel is rejected.
6. **Immutable history**: committed records are never rewritten.
