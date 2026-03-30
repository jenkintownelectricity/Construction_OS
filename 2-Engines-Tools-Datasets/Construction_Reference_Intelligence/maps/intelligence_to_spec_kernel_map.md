# Intelligence to Spec Kernel Map

## Relationship

Construction_Reference_Intelligence observes specification truth held in Construction_Specification_Kernel.
Intelligence records never duplicate or override spec entries — they reference them via `kernel_refs`.

## Link Mechanism

```
intelligence_record.kernel_refs[] -> {
  "kernel": "Construction_Specification_Kernel",
  "entry_id": "SPEC-07-XXXX"
}
```

## What Intelligence Observes from Spec Kernel

| Spec Kernel Domain         | Intelligence Observation Type         |
|---------------------------|---------------------------------------|
| Product data sheets       | Performance gap, field deviation       |
| Performance criteria      | Threshold breach pattern               |
| Code requirements         | Compliance failure precedent           |
| Test standards            | Test-to-field correlation trend        |
| Manufacturer limits       | Warranty boundary intelligence         |

## Direction of Truth

```
Spec Kernel (truth) --reads--> Intelligence (observation)
Intelligence (gap)  --proposes-> DB Expansion (if spec data missing)
```

- Spec Kernel owns product identity, test values, code minimums.
- Intelligence owns field observation, pattern detection, confidence scoring.
- Intelligence never writes to Spec Kernel.

## Example

A failure pattern `FP-07-001` references `SPEC-07-5410` (TPO membrane spec) to ground the
observation in the manufacturer's stated adhesion requirements. The intelligence record notes
that field pull-test results fell below spec thresholds — the spec entry provides the baseline,
the intelligence record provides the observation.

## Boundaries

- Intelligence does not store spec data — it points to it.
- If a spec entry is missing, intelligence flags a `data_gap_record`.
- Kernel refs must use stable entry IDs; no free-text spec references.
