# Construction Material DNA Kernel — v0.1

**Date:** 2026-04-07
**Kernel ID:** KRN-MATDNA-001
**Authority:** L0_ARMAND_LEFEBVRE
**Ring:** 0 (sovereign truth authority)
**Status:** INSTALLED

---

## Truth Domain

The Construction Material DNA Kernel owns canonical truth for the deep material identity and behavior of every construction material entity in the system.

## Owned Truth Claims

| Claim | Description |
|---|---|
| Material Identity | Unique identification, naming, SKU, manufacturer provenance |
| Material Properties | Physical, chemical, thermal, mechanical, optical properties |
| Material Relationships | Compatibility, adjacency rules, interaction profiles |
| Material Composition | Layer stacks, compound formulations, reinforcement structures |
| Material Constraints | Application constraints, environmental limits, code compliance |
| Material Context | Condition-specific behavior, failure modes, degradation profiles |
| Material Lineage | Version history, spec sheet provenance, manufacturer revision chain |

## Microkernel Subdomains

Each subdomain is a bounded microkernel INSIDE this parent kernel:

| Microdomain | ID | Owns |
|---|---|---|
| material_identity | MK-MATDNA-IDENT | Material naming, SKU, manufacturer origin, product variant |
| material_properties | MK-MATDNA-PROPS | R-values, perm ratings, tensile strength, elongation, fire rating, thickness, reflectivity |
| material_relationships | MK-MATDNA-RELS | Compatibility matrices, adjacency rules, chemical interaction profiles |
| material_composition | MK-MATDNA-COMP | Layer stacks, reinforcement types, surface treatments, base chemistry |
| material_constraints | MK-MATDNA-CONST | Application constraints (when NOT to use), temperature limits, code references |
| material_context | MK-MATDNA-CTX | Failure modes, degradation profiles, condition-specific behavior |
| material_lineage | MK-MATDNA-LIN | Spec sheet provenance, version chains, manufacturer revision history |

## Boundary Rules

### May Own
- All canonical material truth listed above
- Material-local schemas for identity, properties, relationships, composition, constraints, context, lineage

### May NOT Own
- Chemical interaction truth (owned by Chemistry Kernel)
- Assembly sequence truth (owned by Assembly Kernel)
- Specification requirement truth (owned by Specification Kernel)
- Boundary/scope truth (owned by Scope Kernel)
- Navigation/browse hierarchy (owned by Taxonomy Kernel)
- UI rendering or projection surfaces

### May NOT Be Mutated By
- Any execution system
- Any observational intelligence system
- Any projection surface
- Any engine (engines may consume, never mutate)

## Relationship to Existing Kernels

| Kernel | Boundary |
|---|---|
| Material_Kernel | Material_Kernel owns basic material catalog entries. Material DNA Kernel owns deep identity, properties, relationships, composition, constraints, context, and lineage. No overlap: Material_Kernel = catalog surface, Material DNA Kernel = deep truth. |
| Chemistry_Kernel | Chemistry owns chemical interaction truth (reaction profiles, compatibility chemistry). Material DNA owns material-level compatibility matrices that reference Chemistry outputs. |
| Assembly_Kernel | Assembly owns assembly sequence truth. Material DNA owns material composition (what a material IS), not how materials are assembled together. |
| Specification_Kernel | Specification owns requirement truth. Material DNA owns the material properties that specifications reference. |
