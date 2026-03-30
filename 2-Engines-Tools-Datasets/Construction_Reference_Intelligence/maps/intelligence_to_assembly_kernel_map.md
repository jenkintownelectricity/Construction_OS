# Intelligence to Assembly Kernel Map

## Relationship

Construction_Reference_Intelligence observes assembly truth held in Construction_Assembly_Kernel.
Assemblies define systems, layers, continuity requirements, and transitions.
Intelligence records reference assemblies to ground observations in system context.

## Link Mechanism

```
intelligence_record.kernel_refs[] -> {
  "kernel": "Construction_Assembly_Kernel",
  "entry_id": "ASSY-XXX-NNN"
}
```

## What Intelligence Observes from Assembly Kernel

| Assembly Kernel Domain     | Intelligence Observation Type          |
|---------------------------|----------------------------------------|
| Layer sequences           | Layer substitution failure pattern      |
| Continuity requirements   | Discontinuity breach observation        |
| Transition details        | Transition failure pattern              |
| System compatibility      | Incompatibility precedent               |
| Control layer mapping     | Control layer failure correlation       |

## Direction of Truth

```
Assembly Kernel (truth) --reads--> Intelligence (observation)
```

- Assembly Kernel owns system definitions, layer order, continuity rules.
- Intelligence owns field performance observations tied to those assemblies.
- Intelligence never modifies assembly definitions.

## Example

A parapet transition failure pattern references `ASSY-PAR-001` from the Assembly Kernel.
The assembly entry defines the intended layer sequence at the parapet; the intelligence
record documents that field failures occur when the air barrier termination at that
assembly is improperly detailed.

## Boundaries

- Intelligence references assemblies — it does not define them.
- If an assembly entry is missing for an observed system, intelligence creates a `data_gap_record`.
- Multiple intelligence records may reference the same assembly entry.
