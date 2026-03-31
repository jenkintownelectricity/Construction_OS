# Versioning Rules v1.0

**Status:** FROZEN
**Version:** v1.0

---

## Governance Artifacts

| Version | Meaning |
|---------|----------|
| v1.0 | Initial freeze |
| v1.x | Additive changes (new schemas, new constraint sets) |
| v2.0 | Structural changes (schema field changes, constraint restructure) |

---

## Graph Artifacts

| Version | Meaning |
|---------|----------|
| v0.x | Incubating (scaffold-heavy, not yet stable) |
| v1.0 | Stable (grounded majority, production-ready) |

---

## Version Increment Rules

1. All governance version changes require thaw/refreeze protocol
2. Graph version changes require integrity audit
3. Breaking changes to schemas require v(N+1).0 major bump
4. Additive-only changes increment minor version
5. Every version change must be recorded in 900-archive-immutable
