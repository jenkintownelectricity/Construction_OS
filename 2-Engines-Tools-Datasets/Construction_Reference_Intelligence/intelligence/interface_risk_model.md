# Interface Risk Model

## Purpose

Interface risk observations document risk postures at the 10 defined interface zones where building envelope control layers must maintain continuity. Interfaces are where most building envelope failures originate — transitions between assemblies, penetrations, and movement joints. This model captures observed risk at these critical locations.

## The 10 Interface Zones

| ID | Name |
|---|---|
| `roof_to_wall` | Roof-to-Wall Transition |
| `parapet_transition` | Parapet Transition |
| `penetration` | Penetration |
| `fenestration_edge` | Fenestration Edge |
| `below_grade_transition` | Below-Grade Transition |
| `expansion_joint` | Expansion Joint |
| `deck_to_wall` | Deck-to-Wall Transition |
| `roof_edge` | Roof Edge |
| `curb_transition` | Curb Transition |
| `drain_transition` | Drain Transition |

These are defined in `shared/interface_zones.json`.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `interface_zone_id` | string | yes | One of the 10 interface zone IDs. |
| `control_layers_at_risk` | array of enums | yes | Which control layers have continuity risk: `water`, `air`, `vapor`, `thermal`, `fire`. |
| `risk_level` | enum | yes | `low`, `moderate`, `high`, `critical`. |
| `risk_description` | string | yes | Narrative description of the observed risk condition. |
| `typical_failure_modes` | array of strings | no | Common failure modes at this interface. |
| `contributing_conditions` | array of strings | no | Conditions that elevate risk (e.g., "high thermal cycling", "complex geometry"). |
| `assemblies_involved` | array of strings | no | Assembly types that meet at this interface. |
| `recommended_controls` | array of strings | no | Observed mitigation strategies that reduce risk. |
| `related_failure_patterns` | array of IDs | no | Links to failure pattern records at this interface. |

## Control-Layer Continuity Risk

The building envelope depends on continuous control layers. Interface zones are where continuity is most likely to break. This model tracks which layers are at risk and why:

- **water** — Bulk water penetration path through the interface.
- **air** — Air barrier discontinuity allowing uncontrolled air leakage.
- **vapor** — Vapor retarder gap or conflict causing condensation risk.
- **thermal** — Thermal bridge or insulation gap at the transition.
- **fire** — Fire barrier discontinuity at the interface.

## Risk Levels

- **low** — Well-understood interface with established detailing practices and low failure history.
- **moderate** — Some documented failures; requires attention to detailing but manageable.
- **high** — Frequent failure location; requires specialized detailing and quality assurance.
- **critical** — Systemic failure risk; warrants enhanced inspection, mockup testing, or design revision.

## Constraints

1. `interface_zone_id` must match a valid ID from `shared/interface_zones.json`.
2. At least one control layer must be identified in `control_layers_at_risk`.
3. `critical` risk level requires confidence of `medium` or above and at least one linked failure pattern.
4. Interface risk records should be reviewed when new failure patterns are logged at the same zone.

## Relationships

- References `shared/interface_zones.json` for zone definitions.
- Links to failure patterns and success patterns at the same interface.
- Informed by climate context (exposure conditions affect interface risk).
- Informed by geometry context (complex geometry elevates interface risk).
- References kernel assemblies that meet at the interface via `kernel_refs`.
