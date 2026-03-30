# Dependency Map

**Repo**: Construction_Intelligence_Workers
**Version**: v0.1

## Upstream Dependencies

These repositories provide governed definitions that workers consume.

| Repository | Layer | Dependency Type | What Workers Consume |
|---|---|---|---|
| Universal_Truth_Kernel (UTK) | Layer 0 | Indirect | Epistemological constraints (flow through CK/CR) |
| Construction_Kernel (CK) | Layer 5 | Direct | Domain kernel definitions: Governance, Geometry, Chemistry, Assembly, Reality, Deliverable, Intelligence |
| Construction_Runtime (CR) | Layer 6 | Direct | Execution contracts, validation pipeline interfaces, audit surface schemas |
| Construction_Application_OS (CAO) | Layer 7 | Direct | Proposal review surface interfaces, orchestration contracts |

## Downstream Dependents

These systems consume validated worker outputs (after governed validation).

| Repository / System | Relationship | What It Consumes |
|---|---|---|
| Governed Validation Surfaces (CR/CAO) | Direct handoff target | Raw worker proposals, observations, signals |
| Construction_Assistant | Consumer (post-validation) | Validated extraction results, compliance signals |
| Opportunity_Intelligence | Consumer (post-validation) | Validated material intelligence, spec data, compliance signals |

## Dependency Rules

1. Workers must not bypass upstream dependencies. All governed references must come from declared upstream sources.
2. Workers must not deliver directly to downstream consumers. All outputs route through governed validation surfaces first.
3. Upstream changes may invalidate worker bindings. Workers must revalidate kernel bindings when upstream versions change.
4. Downstream consumers must not assume worker outputs are canonical. Only validated outputs carry authority.
