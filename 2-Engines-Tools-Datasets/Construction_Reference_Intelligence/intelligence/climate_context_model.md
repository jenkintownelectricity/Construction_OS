# Climate Context Model

## Purpose

Climate and exposure context determines which intelligence observations apply to a given project location. A failure pattern documented in marine coastal exposure may be irrelevant in arid inland conditions. This model provides the vocabulary for tagging intelligence records with their applicable climate and exposure conditions.

## ASHRAE Climate Zones

Intelligence records reference ASHRAE climate zones (1 through 8, with moisture designators A/B/C) as the primary geographic classification:

| Zone | Description |
|---|---|
| 1A, 1B | Very Hot — Humid / Dry |
| 2A, 2B | Hot — Humid / Dry |
| 3A, 3B, 3C | Warm — Humid / Dry / Marine |
| 4A, 4B, 4C | Mixed — Humid / Dry / Marine |
| 5A, 5B, 5C | Cool — Humid / Dry / Marine |
| 6A, 6B | Cold — Humid / Dry |
| 7 | Very Cold |
| 8 | Subarctic / Arctic |

## Exposure Flags

Beyond climate zone, specific exposure conditions materially affect building envelope performance:

| Flag | Description |
|---|---|
| `marine` | Salt-laden air exposure within coastal proximity. Accelerates corrosion and material degradation. |
| `uv_extreme` | High-altitude or low-latitude locations with elevated UV radiation dosage. |
| `freeze_thaw` | Climates with frequent freeze-thaw cycling (>60 cycles/year typical). |
| `high_wind` | Locations subject to sustained high winds or hurricane/typhoon exposure. |
| `hail_prone` | Regions with elevated hail frequency and severity. |
| `wildfire_risk` | Wildland-urban interface exposure requiring ember and radiant heat resistance. |
| `ponding_risk` | Conditions promoting standing water on horizontal surfaces (low slope, poor drainage, heavy rainfall). |
| `condensation_risk` | High interior humidity or extreme temperature differentials driving vapor issues. |
| `seismic` | Seismic zones requiring movement accommodation in envelope details. |
| `industrial_exposure` | Chemical or particulate exposure from nearby industrial operations. |

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `climate_zones` | array of strings | no | Applicable ASHRAE zones (e.g., `["4A", "5A", "6A"]`). Empty means zone-independent. |
| `exposure_flags` | array of enums | no | Applicable exposure conditions from the table above. |
| `climate_notes` | string | no | Additional context about climate applicability or limitations. |
| `exclusion_zones` | array of strings | no | ASHRAE zones where the observation explicitly does NOT apply. |

## Usage

Climate context is attached as metadata to intelligence records. It constrains the applicability of findings:

- A failure pattern with `exposure_flags: ["freeze_thaw"]` is most relevant to zones 5-8.
- A success pattern validated only in `climate_zones: ["2A", "2B"]` should not be assumed applicable in cold climates.
- Trends may be climate-specific (e.g., increasing SPF failures in high-UV zones).

## Constraints

1. If `climate_zones` is empty, the record is assumed to be climate-independent — this should be stated explicitly in `climate_notes`.
2. `exclusion_zones` and `climate_zones` must not overlap.
3. Climate context should be reviewed when evidence from new geographic regions is added.
4. Exposure flags are additive — a coastal site in a seismic zone carries both `marine` and `seismic`.

## Relationships

- Contextualizes all intelligence record types.
- Directly affects interface risk observations (freeze-thaw elevates risk at expansion joints).
- Affects compatibility patterns (marine exposure accelerates galvanic corrosion).
- Links to kernel assembly records that have climate-zone-dependent performance data.
