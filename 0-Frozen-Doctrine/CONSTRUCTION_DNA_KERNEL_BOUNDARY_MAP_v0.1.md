# Construction DNA Kernel Boundary Map — v0.1

**Date:** 2026-04-07
**Authority:** L0_ARMAND_LEFEBVRE
**Status:** INSTALLED

---

## Boundary Matrix

This map defines exact truth ownership boundaries to prevent overlap between the new DNA kernels and existing Construction OS kernels.

| Truth Domain | Owner | NOT Owned By |
|---|---|---|
| Material unique identity (name, SKU, manufacturer) | Material DNA Kernel | Material Kernel, Chemistry Kernel |
| Material physical/chemical/thermal properties | Material DNA Kernel | Chemistry Kernel (chemistry owns interaction truth, not property truth) |
| Material compatibility matrices | Material DNA Kernel | Chemistry Kernel (chemistry owns reaction profiles) |
| Material composition (layers, reinforcement, base chemistry) | Material DNA Kernel | Assembly Kernel (assembly owns sequence, not composition) |
| Material application constraints | Material DNA Kernel | Specification Kernel (spec owns requirements, not constraints) |
| Material failure modes and degradation | Material DNA Kernel | None (new truth domain) |
| Material lineage and provenance | Material DNA Kernel | None (new truth domain) |
| Chemical reactions and interaction profiles | Chemistry Kernel | Material DNA Kernel |
| Assembly sequences and layer ordering | Assembly Kernel | Material DNA Kernel |
| Specification requirements and compliance rules | Specification Kernel | Material DNA Kernel |
| Boundary/scope ownership | Scope Kernel | Material DNA Kernel, Taxonomy Kernel |
| Navigation hierarchy and browse structure | Taxonomy Kernel | All other kernels |
| Taxonomy node definitions | Taxonomy Kernel | Material DNA Kernel |
| Entity-to-node projections | Taxonomy Kernel | Material DNA Kernel |
| Faceted tags and filters | Taxonomy Kernel | Material DNA Kernel |
| Basic material catalog entries | Material Kernel | Material DNA Kernel (Material Kernel = catalog, DNA = deep truth) |

## Cross-Kernel Contracts

| From | To | Contract Type | Direction |
|---|---|---|---|
| Material DNA Kernel | Chemistry Kernel | Reference | Material DNA references Chemistry interaction profiles |
| Material DNA Kernel | Specification Kernel | Reference | Material DNA references Specification compliance rules |
| Taxonomy Kernel | Material DNA Kernel | Consumption | Taxonomy consumes Material DNA entities for navigation projection |
| Construction_Atlas | Taxonomy Kernel | Consumption | Atlas consumes taxonomy navigation for spatial context |
| Construction_ALEXANDER_Engine | Taxonomy Kernel | Consumption | ALEXANDER consumes taxonomy for pattern family classification |
| Construction_Runtime | Material DNA Kernel | Consumption | Runtime consumes material properties for execution validation |
