# Construction DNA Kernel Stack — v0.1

**Date:** 2026-04-07
**Authority:** L0_ARMAND_LEFEBVRE
**Command Class:** DOMAIN_KERNEL_INSTALL
**Status:** INSTALLED

---

## Overview

The Construction DNA Kernel Stack introduces two sovereign parent kernels into the Construction OS truth layer:

1. **Construction_Material_DNA_Kernel** — canonical material truth
2. **Construction_Taxonomy_Kernel** — navigation and browse structure

These kernels decompose the material intelligence domain into bounded, composable truth authorities. They replace the monolithic `construction_dna` approach with a governed two-kernel architecture that scales by composition.

## Architecture

```
Universal_Truth_Kernel
└── Construction_Kernel (umbrella domain truth)
    ├── Material_Kernel (existing)
    ├── Chemistry_Kernel (existing)
    ├── Assembly_Kernel (existing)
    ├── Specification_Kernel (existing)
    ├── Scope_Kernel (existing)
    ├── Construction_Material_DNA_Kernel  ← NEW
    └── Construction_Taxonomy_Kernel      ← NEW
```

## Kernel Relationship

- **Material DNA Kernel** is the deep material truth authority. It owns identity, properties, relationships, composition, constraints, context, and lineage for every material entity.
- **Taxonomy Kernel** is the navigation layer. It projects material truth into browsable, filterable, human-navigable hierarchies. It does NOT own material truth.

```
Material DNA Kernel (canonical truth)
        │
        │ consumed by
        ▼
Taxonomy Kernel (navigation projection)
        │
        │ projected to
        ▼
Construction Atlas / Application OS (UI surfaces)
```

## Key Doctrine

1. **Taxonomy is navigation, not truth.** The Taxonomy Kernel organizes and projects material entities for human navigation. It never overrides or extends canonical material properties.
2. **Material DNA Kernel is deep truth, not UI.** It never renders, routes, or present navigation surfaces.
3. **No overlap with existing kernels.** Chemistry Kernel keeps chemical interaction truth. Assembly Kernel keeps assembly sequence truth. Material DNA Kernel keeps deep material identity/properties/relationships.
4. **Microkernel composition.** Both parent kernels contain bounded microdomains that scale by composition, not monolithic growth.

## Lineage

| Field | Value |
|---|---|
| Prior artifact | `construction_dna` (TEMP-UNRESOLVED in classification freeze) |
| Classification resolution | Resolved: `construction_dna` is now the reference implementation seed for this kernel stack |
| Migration path | `construction_dna` packages/kernel/ content informs Material DNA Kernel truth objects |
| Supersession | `construction_dna` as monolithic kernel concept is superseded by this two-kernel stack |
