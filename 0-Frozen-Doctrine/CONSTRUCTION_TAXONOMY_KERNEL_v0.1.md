# Construction Taxonomy Kernel — v0.1

**Date:** 2026-04-07
**Kernel ID:** KRN-TXNMY-001
**Authority:** L0_ARMAND_LEFEBVRE
**Ring:** 0 (sovereign truth authority — navigation domain only)
**Status:** INSTALLED

---

## Truth Domain

The Construction Taxonomy Kernel owns canonical truth for the navigation hierarchy, classification structure, and browse paths used to organize and discover construction entities.

**Critical doctrine:** Taxonomy is navigation only. Taxonomy is NOT the source of canonical material truth. Canonical material truth remains in the Material DNA Kernel.

## Owned Truth Claims

| Claim | Description |
|---|---|
| Navigation Hierarchy | Tree structures, category groupings, division-level organization |
| Taxonomy Nodes | Individual classification nodes with unique IDs and labels |
| Taxonomy Edges | Parent-child, sibling, and cross-reference relationships between nodes |
| Taxonomy Tags | Faceted tags for filtering and discovery |
| Taxonomy Projections | Mappings from mesh entities (material DNA objects) into human-navigable paths |
| Taxonomy Aliases | Alternative names, search synonyms, industry-standard alternate labels |
| Navigation Views | Predefined browse paths optimized for specific user roles or workflows |

## Microkernel Subdomains

| Microdomain | ID | Owns |
|---|---|---|
| taxonomy_nodes | MK-TXNMY-NODES | Node definitions, labels, descriptions, node types |
| taxonomy_edges | MK-TXNMY-EDGES | Parent-child relationships, sibling ordering, cross-references |
| taxonomy_tags | MK-TXNMY-TAGS | Faceted tags, filter dimensions, tag groups |
| taxonomy_projections | MK-TXNMY-PROJ | Entity-to-node mappings, multi-path projections, primary path designation |
| taxonomy_aliases | MK-TXNMY-ALIAS | Alternate labels, search synonyms, industry nomenclature mappings |
| taxonomy_navigation_views | MK-TXNMY-VIEWS | Role-based browse paths, workflow-optimized navigation trees |

## Boundary Rules

### May Own
- All navigation and classification structure listed above
- Taxonomy-local schemas for nodes, edges, tags, projections, aliases, views

### May NOT Own
- Material identity, properties, relationships, composition, constraints, context, or lineage (owned by Material DNA Kernel)
- Chemical interaction truth (owned by Chemistry Kernel)
- Assembly sequence truth (owned by Assembly Kernel)
- Any canonical domain truth beyond navigation structure

### May NOT
- Override material properties via taxonomy placement
- Create material truth by creating taxonomy nodes
- Delete or modify upstream material DNA objects
- Act as a source of record for anything except navigation/browse structure

### Shallow and Stable

Taxonomy must remain shallow and stable. Deep system precision belongs in properties, relationships, constraints, and atomic reference layers inside the Material DNA Kernel. The taxonomy tree should have a maximum practical depth of 6-8 levels. If navigational depth exceeds this, the solution is better tagging and filtering, not deeper tree nesting.

## Consumed By

| Consumer | Usage |
|---|---|
| Construction_Atlas | Spatial context projection using taxonomy navigation paths |
| Construction_Application_OS | UI browse/filter/search surfaces |
| 70-manufacturer-mirror | Manufacturer-scoped navigation views |
| Construction_ALEXANDER_Engine | Pattern family classification input |
