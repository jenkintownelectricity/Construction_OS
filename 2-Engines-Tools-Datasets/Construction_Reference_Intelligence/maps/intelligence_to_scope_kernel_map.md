# Intelligence to Scope Kernel Map

## Relationship

Construction_Reference_Intelligence observes scope truth held in Construction_Scope_Kernel.
Scope Kernel owns trade boundaries, responsibility matrices, and interface definitions.
Intelligence references scope entries when observations involve scope gaps or trade conflicts.

## Link Mechanism

```
intelligence_record.kernel_refs[] -> {
  "kernel": "Construction_Scope_Kernel",
  "entry_id": "SCOPE-XXX-NNN"
}
```

## What Intelligence Observes from Scope Kernel

| Scope Kernel Domain        | Intelligence Observation Type           |
|---------------------------|----------------------------------------|
| Trade boundaries          | Scope gap failure pattern                |
| Responsibility matrices   | Accountability ambiguity precedent       |
| Interface definitions     | Interface failure at trade boundary      |
| Exclusion clauses         | Exclusion-driven warranty dispute pattern|
| Coordination requirements | Coordination failure trend               |

## Direction of Truth

```
Scope Kernel (truth) --reads--> Intelligence (observation)
```

- Scope Kernel owns who-does-what definitions.
- Intelligence owns observations about what happens when scope is unclear or contested.

## Example

A warranty dispute pattern references `SCOPE-07-021` (roofing/waterproofing trade boundary
at plaza deck). The scope entry defines the intended division of work; the intelligence
record documents that warranty claims are denied when substrate preparation falls between
trades and neither party accepts responsibility.

## Boundaries

- Intelligence does not define scope — it observes scope-related failures.
- Scope ambiguity patterns are high-value intelligence for risk assessment.
- Missing scope definitions trigger `data_gap_record`.
