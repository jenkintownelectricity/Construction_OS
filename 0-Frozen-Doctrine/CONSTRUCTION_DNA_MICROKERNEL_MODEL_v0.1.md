# Construction DNA Microkernel Model — v0.1

**Date:** 2026-04-07
**Authority:** L0_ARMAND_LEFEBVRE
**Status:** INSTALLED

---

## Microkernel Pattern

Both parent kernels use a bounded microkernel model for internal organization. Microdomains are NOT independent sovereign Ring 0 kernels. They are bounded owned subdomains inside their parent kernel.

### Why Microkernels?

1. **Composability** — each microdomain has a clear truth boundary
2. **Scalability** — new microdomains can be added without restructuring the parent
3. **Governance** — ownership is explicit at the microdomain level
4. **No monolith** — prevents the parent kernel from becoming a monolithic truth blob

### Rules

1. A microdomain may only be owned by exactly one parent kernel
2. No two microdomains may claim the same truth
3. Microdomains may reference other microdomains within the same parent kernel
4. Cross-kernel microdomain references require explicit contracts
5. A microdomain may be promoted to a sovereign kernel in a future wave — but this requires a separate GMO

---

## Material DNA Kernel Microdomains

```
Construction_Material_DNA_Kernel
├── material_identity       (MK-MATDNA-IDENT)
├── material_properties     (MK-MATDNA-PROPS)
├── material_relationships  (MK-MATDNA-RELS)
├── material_composition    (MK-MATDNA-COMP)
├── material_constraints    (MK-MATDNA-CONST)
├── material_context        (MK-MATDNA-CTX)
└── material_lineage        (MK-MATDNA-LIN)
```

## Taxonomy Kernel Microdomains

```
Construction_Taxonomy_Kernel
├── taxonomy_nodes            (MK-TXNMY-NODES)
├── taxonomy_edges            (MK-TXNMY-EDGES)
├── taxonomy_tags             (MK-TXNMY-TAGS)
├── taxonomy_projections      (MK-TXNMY-PROJ)
├── taxonomy_aliases          (MK-TXNMY-ALIAS)
└── taxonomy_navigation_views (MK-TXNMY-VIEWS)
```

## Growth Rule

New microdomains may be added to either parent kernel via a bounded build GMO. The threshold for promoting a microdomain to a sovereign kernel is:

1. The microdomain has grown to serve 3+ distinct consumers
2. The microdomain has its own lifecycle distinct from the parent
3. The microdomain would benefit from independent versioning
4. L0 authority explicitly authorizes the promotion

Until all four conditions are met, microdomains remain inside their parent kernel.
