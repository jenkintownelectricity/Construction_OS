# Evidence to Intelligence Map

## Relationship

Evidence records provide the empirical foundation for intelligence records.
Evidence validates, qualifies, challenges, or refutes intelligence observations.
Intelligence without evidence remains at low confidence.

## Link Mechanism

```
intelligence_record.evidence_refs[] -> "EV-NNN"
```

## Evidence Roles

| Role          | Description                                              |
|---------------|----------------------------------------------------------|
| validates     | Evidence confirms the intelligence observation            |
| qualifies     | Evidence adds conditions or limits to the observation     |
| challenges    | Evidence contradicts or weakens the observation            |
| extends       | Evidence broadens the scope of the observation             |

## Confidence Impact

| Evidence Count | Evidence Quality | Resulting Confidence |
|---------------|-----------------|---------------------|
| 0             | n/a             | speculative          |
| 1-2           | low             | low                  |
| 3-5           | mixed           | medium               |
| 5+            | high            | high                 |

## Evidence Types

- Forensic test results (pull tests, peel tests, core samples)
- Field observation reports
- Manufacturer technical bulletins
- Insurance claim data (anonymized)
- Published research findings
- Expert testimony records

## Direction of Flow

```
Evidence (raw data) --> Intelligence (pattern/trend/precedent)
New evidence --> Confidence re-evaluation
Contradicting evidence --> Status change (active -> challenged)
```

## Boundaries

- Evidence records are factual — no interpretation.
- Intelligence records interpret evidence into patterns, trends, precedents.
- One evidence record may support multiple intelligence records.
- One intelligence record typically requires multiple evidence records.
