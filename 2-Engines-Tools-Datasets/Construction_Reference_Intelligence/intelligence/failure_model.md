# Failure Model — Failure Patterns

## Purpose

Failure patterns document recurring failure modes observed at interfaces, assemblies, and material boundaries within CSI Division 07 systems. They capture what fails, how it fails, why it fails, and under what conditions.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `failure_mode` | string | yes | Description of the failure mechanism (e.g., "adhesion loss at membrane-to-flashing interface"). |
| `root_cause_class` | enum | yes | `material_degradation`, `installation_defect`, `design_error`, `incompatibility`, `environmental_exposure`, `mechanical_damage`, `thermal_cycling`, `moisture_intrusion`, `unknown`. |
| `affected_assembly` | string | yes | Assembly or subsystem where the failure occurs. |
| `interface_zone` | string | no | One of the 10 interface zones if failure is interface-located (see interface_risk_model). |
| `severity` | enum | yes | `cosmetic`, `functional_degradation`, `water_intrusion`, `structural_risk`, `safety_hazard`. |
| `frequency` | enum | no | `isolated`, `occasional`, `recurring`, `systemic`. |
| `time_to_failure` | object | no | `{ typical_range_years: [min, max], conditions: string }`. |
| `contributing_factors` | array of strings | no | Environmental, design, or installation factors that contribute. |
| `detection_method` | string | no | How the failure is typically discovered (visual inspection, leak event, core sample). |
| `remediation` | string | no | Common repair or replacement approach. |

## Root Cause Classification

Root causes are classified to enable cross-pattern analysis:

- **material_degradation** — UV breakdown, chemical decomposition, embrittlement.
- **installation_defect** — Improper application, insufficient adhesion, wrong fastener pattern.
- **design_error** — Inadequate slope, missing drainage, thermal bridging at detail.
- **incompatibility** — Chemical or physical incompatibility between adjacent materials.
- **environmental_exposure** — Freeze-thaw, hail, extreme UV, ponding water.
- **mechanical_damage** — Foot traffic, wind uplift, impact.
- **thermal_cycling** — Repeated expansion/contraction stress.
- **moisture_intrusion** — Trapped moisture, vapor drive, condensation.

## Constraints

1. `root_cause_class` of `unknown` requires a note in `summary` explaining what investigation was attempted.
2. Failure patterns with `severity` of `structural_risk` or `safety_hazard` must have confidence `medium` or above.
3. Every failure pattern must reference at least one evidence item documenting an observed instance.

## Relationships

- References kernel assemblies and products via `kernel_refs`.
- Links to interface risk observations when failure is at an interface zone.
- May be correlated with trends showing increasing/decreasing failure frequency.
- Contrasts with success patterns that address the same assembly or interface.
