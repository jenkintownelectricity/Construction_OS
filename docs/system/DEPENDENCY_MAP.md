# DEPENDENCY_MAP — Construction_Kernel

## Stack Position

**Layer 5 — Domain Kernel**

## External Dependencies

### Upstream

| Repo | Relationship |
|------|-------------|
| Universal_Truth_Kernel | Inherits truth doctrine. "System is bounded by truth." |
| ValidKernel-Governance | Governance rules. Construction Kernel follows governance constraints. |
| ValidKernel_Registry | Topology entry. Construction Kernel is registered in system topology. |

### Downstream

| Repo | Relationship |
|------|-------------|
| Construction_Runtime | Executes kernel truth. Runtime operates within kernel-defined boundaries. |
| Construction_Application_OS | Apps aligned to kernels. Application layer maps to kernel domains. |

## Internal Zones

| Zone | Purpose |
|------|---------|
| `kernel/` | Master kernel definition (v0.1 architecture) |
| `kernels/` | Seven domain kernels with individual truth boundaries |
| `maps/` | Kernel relationships and app dependencies |
| `apps/` | Application specs aligned to kernel domains |

## Domain Kernel Dependencies

```
Governance ─┐
Geometry  ──┼──► Assembly ──┐
Chemistry ──┘               ├──► Deliverable
               Reality ─────┘

All Kernels ──────────────────► Intelligence
```

- **Governance + Geometry + Chemistry** feed into **Assembly**
- **Assembly + Reality** feed into **Deliverable**
- **All kernels** feed into **Intelligence**

## Relationship to Universal_Truth_Kernel

Inherits "system is bounded by truth." Applies and specializes truth for the construction domain without contradicting the nucleus. Each domain kernel must possess truth and define its truth within construction boundaries.
