# Geometry Context Model

## Purpose

Geometry context captures the physical configuration of building envelope assemblies where intelligence observations apply. A failure pattern at a low-slope roof has different geometry implications than one at a steep-slope wall transition. This model provides vocabulary for tagging intelligence records with geometric applicability.

## Geometry Categories

| Category | Description |
|---|---|
| `low_slope` | Roof slopes at or below 3:12. Ponding, drainage, and membrane performance are primary concerns. |
| `steep_slope` | Roof slopes above 3:12. Gravity drainage, shingle/panel overlap, and wind uplift govern. |
| `vertical` | Wall assemblies. Cladding, air/water barriers, insulation continuity. |
| `below_grade` | Foundation walls and slabs below finished grade. Hydrostatic pressure, waterproofing. |
| `inverted` | Overhangs, soffits, canopies. Exposed undersides with unique moisture and ventilation conditions. |
| `complex_geometry` | Non-planar surfaces: curves, domes, faceted enclosures requiring custom detailing. |

## Geometric Features

Specific features that modify risk and performance:

| Feature | Description |
|---|---|
| `parapet_run` | Length of parapet perimeter. Longer runs increase thermal movement and interface count. |
| `penetration_field` | Areas with high density of penetrations (mechanical equipment pads, pipe clusters). |
| `valley` | Intersecting roof planes creating concentrated water flow. |
| `ridge` | High point where roof planes meet. Wind exposure and ridge vent detailing. |
| `inside_corner` | Re-entrant corners where assemblies meet at concave angles. Stress concentration. |
| `outside_corner` | Projecting corners with elevated wind pressure and material stress. |
| `step_transition` | Changes in roof elevation between adjacent sections. |
| `cantilever` | Overhanging structure with thermal bridge and moisture management challenges. |
| `plaza_deck` | Horizontal assembly over occupied space, requiring waterproofing under traffic surface. |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `geometry_category` | enum | yes | Primary geometry from the categories above. |
| `geometric_features` | array of enums | no | Applicable features from the table above. |
| `slope` | object | no | `{ ratio: string, degrees: number }` — specific slope if relevant. |
| `geometry_notes` | string | no | Additional context about geometric applicability. |
| `area_scale` | enum | no | `small` (<500 sf), `medium` (500-10000 sf), `large` (>10000 sf). Affects risk profile. |

## Usage

Geometry context is attached as metadata to intelligence records. It constrains applicability:

- Failure patterns at `penetration_field` features indicate cluster-density risk.
- Success patterns validated on `low_slope` may not transfer to `steep_slope`.
- Interface risk observations are geometry-dependent (parapet risk varies with `parapet_run`).

## Constraints

1. At least one `geometry_category` is required when geometry context is attached.
2. `complex_geometry` should include a `geometry_notes` explanation.
3. Geometry context should be reassessed if new evidence arises from different configurations.

## Relationships

- Contextualizes all intelligence record types.
- Directly relevant to interface risk model (geometry determines which interfaces exist).
- Affects failure patterns (ponding failures are geometry-specific to low-slope).
- Affects success patterns (validated geometry scope limits transferability).
- Interacts with climate context (low-slope + freeze-thaw + ponding = compounded risk).
