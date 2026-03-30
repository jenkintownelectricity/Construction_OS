# Intelligence to Chemistry Kernel Map

## Relationship

Construction_Reference_Intelligence observes chemistry truth held in Construction_Chemistry_Kernel.
Chemistry Kernel owns compatibility rules, cure chemistry, adhesion mechanisms, and reaction profiles.
Intelligence references chemistry entries when observations involve chemical interactions.

## Link Mechanism

```
intelligence_record.kernel_refs[] -> {
  "kernel": "Construction_Chemistry_Kernel",
  "entry_id": "CHEM-XXX-NNN"
}
```

## What Intelligence Observes from Chemistry Kernel

| Chemistry Kernel Domain    | Intelligence Observation Type           |
|---------------------------|----------------------------------------|
| Cure chemistry            | Cure failure pattern (temperature, humidity)|
| Adhesion mechanisms       | Adhesion failure precedent               |
| Chemical compatibility    | Incompatibility precedent                |
| Solvent interactions      | Solvent attack observation               |
| Plasticizer migration     | Plasticizer-induced degradation pattern  |

## Direction of Truth

```
Chemistry Kernel (truth) --reads--> Intelligence (observation)
```

- Chemistry Kernel owns reaction rules and compatibility data.
- Intelligence owns field observations of chemistry-related failures.

## Example

An incompatibility precedent records silicone sealant adhesion failure over uncured
urethane foam. It references `CHEM-ADH-007` which documents the silicone-urethane
cure interference mechanism. The chemistry entry explains why; the intelligence
record documents that it happened and how frequently.

## Boundaries

- Intelligence never defines chemical compatibility — it observes consequences.
- Chemistry-related intelligence always requires a `kernel_ref` to Chemistry Kernel.
- Missing chemistry data triggers `data_gap_record`.
