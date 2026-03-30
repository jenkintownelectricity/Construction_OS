# Standards to Object Map

## Purpose

Maps how standards reference entries connect to intelligence objects.

## Mapping Structure

```
standards_ref {
  "standard_id": "ASTM DXXXX",
  "edition": "2023",
  "section": "Section X.X",
  "relevance": "description of how standard applies"
}
```

## Standards-to-Object Relationships

| Standard Type          | Intelligence Object Type | Relationship                    |
|-----------------------|-------------------------|---------------------------------|
| Test method (ASTM)    | Evidence record          | Defines test protocol used       |
| Performance spec      | Failure pattern          | Provides threshold for deviation |
| Installation guide    | Failure pattern          | Defines correct practice baseline|
| Design standard       | Success pattern          | Confirms design compliance       |
| Classification std    | Trend record             | Provides category framework      |
| Code requirement      | Precedent record         | Establishes regulatory context   |

## Common Standards Referenced in Division 07

| Standard       | Object Types Commonly Linked         |
|---------------|--------------------------------------|
| ASTM D4811    | Evidence (peel adhesion tests)        |
| ASTM D751     | Evidence (membrane tensile tests)     |
| ASTM C1521    | Evidence (sealant adhesion tests)     |
| ASTM E2357    | Failure pattern (air barrier tests)   |
| ASHRAE 90.1   | Trend record (energy code compliance) |
| SPRI ES-1     | Failure pattern (wind uplift)         |
| NRCA Guidelines| Success pattern (best practice)      |

## Rules

- Standards refs are informational — they do not control record content.
- One intelligence object may reference multiple standards.
- Standards updates may trigger intelligence review but not automatic changes.
- Missing standard coverage is flagged in `data_gap_record` entries.
