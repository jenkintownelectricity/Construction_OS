# Worker to Kernel Map

## Purpose

Maps each worker to its Construction_Kernel (Layer 5) domain kernel bindings.

## Mappings

| Worker | Primary Kernel(s) | Secondary Kernel(s) | Binding Type |
|---|---|---|---|
| assembly_interpreter | Assembly, Geometry | Chemistry | Read-only reference for extraction binding |
| spec_parser | Governance, Deliverable | Chemistry, Assembly | Read-only reference for requirement binding |
| detail_extractor | Geometry, Reality | Assembly | Read-only reference for spatial binding |
| material_intelligence | Chemistry, Assembly | Governance | Read-only reference for material classification |
| compliance_signal | Governance, Intelligence | All (as needed) | Read-only reference for constraint comparison |

## Binding Rules

- All kernel bindings are read-only. Workers consume kernel definitions; they do not modify them.
- Workers must declare their kernel bindings explicitly.
- A kernel version change may invalidate worker bindings and require revalidation.
- Unbound outputs (those not tied to a kernel reference) must be tagged as `unbound`.
