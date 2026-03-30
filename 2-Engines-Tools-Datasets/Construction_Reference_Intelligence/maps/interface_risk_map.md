# Interface Risk Map

## Purpose

Maps the 10 interface zones to common risk patterns and intelligence observations.
Interface zones are where control layer continuity is most vulnerable.

## Interface Zones and Risk Patterns

| Interface Zone          | Primary Risks                                    | Common Intelligence Types        |
|------------------------|--------------------------------------------------|----------------------------------|
| roof_to_wall           | Air barrier discontinuity, flashing failure       | Failure pattern, success pattern  |
| parapet_transition     | Membrane delamination, base flashing termination  | Failure pattern, precedent        |
| penetration            | Seal failure around pipes/conduits, fire stop gaps | Failure pattern, trend            |
| fenestration_edge      | Sealant adhesion loss, water intrusion at sill     | Failure pattern, compatibility    |
| below_grade_transition | Waterproofing lap failure, hydrostatic pressure    | Failure pattern, precedent        |
| expansion_joint        | Movement exceeds joint capacity, sealant fatigue   | Failure pattern, trend            |
| deck_to_wall           | Drainage plane interruption, flashing conflict     | Failure pattern, scope dispute    |
| roof_edge              | Wind uplift at perimeter, edge metal displacement  | Failure pattern, trend            |
| curb_transition        | Membrane bridging failure, inadequate cant strip   | Failure pattern, success pattern  |
| drain_transition       | Clamping ring seal loss, ponding water accumulation| Failure pattern, precedent        |

## Risk Density by Zone

```
High risk density:   parapet_transition, roof_to_wall, penetration
Medium risk density: fenestration_edge, below_grade_transition, expansion_joint
Lower risk density:  deck_to_wall, roof_edge, curb_transition, drain_transition
```

## Control Layers Most Affected by Zone

| Interface Zone          | Most Vulnerable Control Layers                    |
|------------------------|--------------------------------------------------|
| roof_to_wall           | air_control, bulk_water_control, thermal_control  |
| parapet_transition     | bulk_water_control, air_control                   |
| penetration            | air_control, fire_smoke_control                   |
| fenestration_edge      | bulk_water_control, air_control, vapor_control    |
| below_grade_transition | bulk_water_control, vapor_control                 |
| expansion_joint        | movement_control, bulk_water_control              |
| deck_to_wall           | drainage_plane, bulk_water_control                |
| roof_edge              | bulk_water_control, weathering_surface            |
| curb_transition        | bulk_water_control, air_control                   |
| drain_transition       | bulk_water_control, drainage_plane                |

## Intelligence Observation Pattern

Each interface zone typically generates failure patterns first, then success patterns
emerge as remediation approaches are documented and validated with evidence.
Trend records track whether failure frequency at a given zone is increasing or decreasing.

## Boundaries

- This map identifies risk associations — it does not prescribe solutions.
- Actual risk assessment requires project-specific context and evidence.
