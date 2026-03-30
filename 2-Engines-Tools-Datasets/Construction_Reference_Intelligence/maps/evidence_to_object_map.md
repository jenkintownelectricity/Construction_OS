# Evidence to Object Map

## Purpose

Maps how evidence entries connect to specific intelligence objects.
Evidence is the empirical backbone — every intelligence object gains credibility from evidence linkage.

## Mapping Structure

```
intelligence_record.evidence_refs[] -> "EV-NNN"
```

## Evidence-to-Object Relationships

| Evidence Type            | Intelligence Object Type | Relationship                         |
|-------------------------|-------------------------|--------------------------------------|
| Forensic pull-test      | Failure pattern          | Quantifies adhesion failure threshold |
| Core sample analysis    | Failure pattern          | Confirms moisture intrusion path      |
| Field observation report| Success pattern          | Validates long-term system performance|
| Manufacturer bulletin   | Compatibility pattern    | Documents known incompatibility       |
| Insurance claim data    | Precedent record         | Provides outcome and cost context     |
| Published study         | Trend record             | Supports directional trend claim      |
| Inspection report       | Pattern detection        | Signals emerging failure mode         |
| Commissioning report    | Success pattern          | Confirms as-built system integrity    |

## Evidence Strength by Type

| Evidence Type            | Typical Strength | Notes                              |
|-------------------------|------------------|------------------------------------|
| Lab test (ASTM method)  | High             | Controlled, repeatable              |
| Forensic field test     | High             | Direct measurement, site-specific   |
| Expert judgment         | Medium           | Subjective but informed             |
| Manufacturer data       | Medium           | Potentially biased toward product   |
| Anecdotal field report  | Low              | Useful for pattern detection only   |
| Literature review       | Medium-High      | Depends on source rigor             |

## Cardinality Rules

- One evidence record may support multiple intelligence objects.
- One intelligence object should reference at least one evidence record for confidence above `low`.
- Evidence records are never modified by intelligence — they are immutable factual anchors.

## Boundaries

- Evidence records contain raw data and observations — no interpretation.
- Interpretation belongs to the intelligence object that references the evidence.
- Missing evidence for a known phenomenon triggers a `data_gap_record`.
