# Dependency Map

**Version:** 0.1
**Status:** Active
**Scope:** Construction_Reference_Intelligence repository dependencies

## Upstream Dependencies

This repository depends on five kernel repositories and the shared family artifact set. All dependencies are **read-only** — this repository consumes truth defined elsewhere but does not modify it.

### Kernel Repositories

| Repository | Dependency Type | What We Read | Update Frequency |
|---|---|---|---|
| **Construction_Specification_Kernel** | Read-only | CSI Division 07 specification structure, section scopes, coordination requirements | Per specification release cycle |
| **Construction_Assembly_Kernel** | Read-only | Assembly definitions, layer sequences, component relationships, interface definitions | Per assembly model update |
| **Construction_Material_Kernel** | Read-only | Material properties, classifications, performance data, material-to-assembly mappings | Per material data update |
| **Construction_Chemistry_Kernel** | Read-only | Chemical compatibility matrices, reactivity data, degradation pathways | Per chemistry data update |
| **Construction_Scope_Kernel** | Read-only | Scope boundaries, inclusions, exclusions, scope-to-specification mappings | Per scope definition update |

### Shared Family Artifacts

| Artifact | Path | Dependency Type |
|---|---|---|
| Family context | `shared/FAMILY_CONTEXT.md` | Read-only reference |
| Taxonomy | `shared/shared_taxonomy.json` | Vocabulary source; intelligence records use taxonomy terms |
| Enum registry | `shared/shared_enum_registry.json` | Enumerated values for categorical fields |
| Control layers | `shared/control_layers.json` | 11 control layer definitions referenced by intelligence records |
| Interface zones | `shared/interface_zones.json` | 10 interface zone definitions referenced by intelligence records |
| Standards registry | `shared/shared_standards_registry.json` | Standards catalog; evidence links reference entries here |
| Evidence registry | `shared/shared_evidence_registry.json` | Evidence source catalog; all evidence links resolve here |
| Risk registry | `shared/shared_risk_registry.json` | Risk classifications used by interface risk records |
| Division 07 posture | `shared/division_07_posture.json` | Division 07 alignment configuration |

## Registry

This repository is registered in the **ValidKernel_Registry** as a reference-intelligence layer within the construction-kernel family. The registry entry declares:

- Repository name: `Construction_Reference_Intelligence`
- Repository role: `reference-intelligence`
- Family: `construction-kernel`
- Layer: `intelligence`
- Domain focus: CSI Division 07

## Downstream Consumers

This repository does not track its downstream consumers (that is the consumer's responsibility), but anticipated consumers include:

- AI systems performing design review or specification analysis.
- Application layers presenting intelligence to practitioners.
- Reporting systems aggregating trends and failure patterns.
- Training and education systems using structured case examples.

## Runtime Dependencies

**None.** This repository has no runtime dependencies. It contains no executable code, no services, no databases, and no scheduled processes. It is a structured data repository consumed by external systems at their discretion.

## Dependency Health Checks

When validating repository integrity:

1. All `shared/` artifacts must be present and parseable.
2. All intelligence records referencing control layers must use identifiers present in `shared/control_layers.json`.
3. All intelligence records referencing interface zones must use identifiers present in `shared/interface_zones.json`.
4. All evidence links must resolve to entries in `shared/shared_evidence_registry.json`.
5. All standards references must resolve to entries in `shared/shared_standards_registry.json`.
6. Schema versions referenced by intelligence records must exist in `schemas/`.
