# detail_extractor — Outputs

## Output Schema

### Extracted Structures

| Field | Type | Description |
|---|---|---|
| detail_id | string | Identifier for the extracted detail |
| detail_type | string | plan | section | connection | enlarged | elevation |
| dimensions | array | Extracted dimensional data |
| callouts | array | Text callouts found in the detail |
| material_indications | array | Materials indicated graphically or by note |
| connections | array | Connection methods depicted |
| spatial_relationships | array | Relative positions and adjacencies |
| source_reference | string | Drawing sheet, detail number |
| confidence | float | Extraction confidence (0.0-1.0) |

### Observations

| Field | Type | Description |
|---|---|---|
| observation_type | string | missing_dimension | unclear_callout | conflict | discrepancy |
| description | string | What was observed |
| source_reference | string | Drawing sheet and detail of origin |
| confidence | float | 1.0 for deterministic observations |

## Output Constraints

- All outputs are proposals. None are canonical.
- Outputs must include confidence scores. Drawing extraction often involves interpretation; confidence must reflect this.
- Outputs must reference their source drawing and detail.
- Outputs must be handed off to governed validation surfaces.
