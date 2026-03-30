# Standards to Intelligence Map

## Relationship

Standards references provide normative context for intelligence records.
Standards inform thresholds, test methods, and acceptance criteria — but standards
do not replace intelligence. Intelligence observes how standards perform in the field.

## Link Mechanism

```
intelligence_record.standards_refs[] -> {
  "standard_id": "ASTM D4811",
  "relevance": "Defines peel adhesion test method used in evidence"
}
```

## What Standards Provide to Intelligence

| Standards Domain           | Intelligence Use                        |
|---------------------------|----------------------------------------|
| Test methods              | Basis for evidence evaluation            |
| Performance thresholds    | Baseline for deviation detection         |
| Classification systems    | Categorization of materials/systems      |
| Installation requirements | Basis for installation error detection    |
| Design criteria           | Reference for design deficiency patterns |

## Standards Bodies Commonly Referenced

- ASTM International (test methods, material specifications)
- ASHRAE (climate zones, energy performance)
- NRCA (roofing installation guidelines)
- SMACNA (sheet metal and air conditioning)
- AAMA (fenestration standards)
- SPRI (single-ply roofing)

## Direction of Truth

```
Standards (normative) --informs--> Intelligence (observational)
Intelligence (gap)    --may flag-> Standards gap (no test method exists)
```

## Boundaries

- Intelligence does not replicate standards content — it references by ID.
- Standards inform what "should" happen; intelligence records what "does" happen.
- Changes in standards may trigger intelligence re-evaluation.
- Missing standards for observed phenomena are flagged as data gaps.
