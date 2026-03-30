# Data Gap to Kernel Map

## Purpose

Documents how identified data gaps relate to specific kernel domains.
Each data gap references the kernel where the missing data would naturally reside.

## Gap-to-Kernel Relationships

| Kernel Domain           | Typical Data Gaps                                     |
|------------------------|------------------------------------------------------|
| Specification Kernel    | Missing product data sheets, untested performance criteria |
| Assembly Kernel         | Undocumented transition details, missing layer sequences   |
| Material Kernel         | No long-term aging data, missing compatibility entries     |
| Chemistry Kernel        | Unknown cure interactions, untested chemical pairings      |
| Scope Kernel            | Undefined trade boundaries, ambiguous responsibility zones |

## Link Mechanism

```
data_gap_record.related_kernel_refs[] -> {
  "kernel": "Construction_Material_Kernel",
  "entry_id": "MAT-XXX-NNN"  // or "MISSING" if no entry exists
}
```

## Gap Severity by Kernel

| Kernel           | Critical Gaps                              | Impact                          |
|-----------------|-------------------------------------------|---------------------------------|
| Spec Kernel     | No performance baseline for new product    | Cannot evaluate field deviations |
| Assembly Kernel | No defined assembly for observed system    | Cannot ground failure pattern    |
| Material Kernel | No degradation profile for material class  | Cannot predict service life      |
| Chemistry Kernel| No compatibility data for product pairing  | Cannot assess incompatibility risk|
| Scope Kernel    | No trade boundary for interface zone       | Cannot attribute responsibility  |

## Gap Resolution Path

```
data_gap_record (open)
  --> Dataset candidate identified (DC-XX-NNN)
    --> Ingestion proposal (IP-NNN)
      --> Data acquired and integrated
        --> data_gap_record (addressed)
```

## Boundaries

- Data gaps point to kernel domains but do not request kernel changes.
- Intelligence flags the absence — kernel maintainers decide whether to fill it.
- A data gap with severity `critical` should trigger priority review.
