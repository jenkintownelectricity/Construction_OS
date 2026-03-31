# Building Envelope Manufacturer Systems

**SYSTEM PLANE:** domain_plane
**AUTHORITY:** produce_truth

---

## Repository Role

Canonical source of manufacturer truth for building envelope systems.

This domain produces and maintains:
- Manufacturer identity records
- Product definitions and specifications
- System assembly definitions
- Installation rules
- Certification rules
- Compatibility matrices

This domain does NOT own:
- Runtime execution
- UI/frontend surfaces
- API servers
- Execution engines
- Signal routing
- Governance authority

---

## Structure

```
docs/
  DOMAIN_INTENT_v0.1.md
  DOMAIN_BOUNDARY_v0.1.md
  CAPABILITY_TARGETS_v0.1.md
  PHASE_LOG_v0.1.md
schemas/
  manufacturer.schema.json
  product.schema.json
  system.schema.json
  installation_rule.schema.json
  certification_rule.schema.json
  compatibility_matrix.schema.json
registry/
  manufacturers/
  products/
  systems/
  rules/
    installation/
    certification/
  compatibility/
examples/
projection/
  detail-resolution-paths.json
  lens-definitions.json
README.md
```

---

## System Model

Foundry governs. Domains execute. Registry records. Signals route.

Code colocation does not transfer authority.

---

## Current State

| Category | Records | Grounded | Scaffold |
|----------|---------|----------|----------|
| Manufacturers | 1 | 0 | 1 |
| Products | 5 | 0 | 5 |
| Systems/Assemblies | 8 | 0 | 8 |
| Installation Rules | 3 | 3 | 0 |
| Certification Rules | 1 | 1 | 0 |
| Compatibility (conditions) | 5 | 5 | 0 |
| Compatibility (constraints) | 3 | 0 | 3 |
| **Total** | **26** | **9** | **17** |

---

## Authority Chain

```
Universal_Truth_Kernel
  ↓
ValidKernel-Governance
  ↓
Construction_OS (Domain d1)
  ↓
Manufacturer Systems Domain (this repo)
```
