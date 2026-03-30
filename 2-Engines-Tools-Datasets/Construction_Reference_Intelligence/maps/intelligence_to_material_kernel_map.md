# Intelligence to Material Kernel Map

## Relationship

Construction_Reference_Intelligence observes material truth held in Construction_Material_Kernel.
Material Kernel owns physical properties, compatibility matrices, and degradation profiles.
Intelligence records reference materials to connect observations to material behavior.

## Link Mechanism

```
intelligence_record.kernel_refs[] -> {
  "kernel": "Construction_Material_Kernel",
  "entry_id": "MAT-XXX-NNN"
}
```

## What Intelligence Observes from Material Kernel

| Material Kernel Domain     | Intelligence Observation Type           |
|---------------------------|----------------------------------------|
| Physical properties       | Property deviation under field conditions|
| Compatibility matrices    | Incompatibility precedent               |
| Degradation profiles      | Accelerated degradation pattern          |
| Temperature limits        | Thermal exceedance failure pattern       |
| UV resistance ratings     | UV degradation trend                     |

## Direction of Truth

```
Material Kernel (truth) --reads--> Intelligence (observation)
```

- Material Kernel owns material identity and laboratory properties.
- Intelligence owns field-observed material behavior and deviation records.

## Example

An SBS modified bitumen granule loss pattern references `MAT-BIT-012` for the membrane
material entry. The material kernel states UV resistance class; intelligence documents
that granule loss accelerates beyond manufacturer expectations in high-UV desert climates
(>120 kLy/year).

## Boundaries

- Intelligence does not store material properties — it references them.
- Field-observed deviations from stated properties are intelligence records, not material edits.
- Missing material entries trigger `data_gap_record` creation.
