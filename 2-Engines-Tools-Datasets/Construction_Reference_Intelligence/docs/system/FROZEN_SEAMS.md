# Frozen Seams

**Version:** 0.1
**Status:** Active
**Scope:** Construction_Reference_Intelligence repository boundaries

## Purpose

This document defines the frozen boundaries — the seams where this repository interfaces with sibling kernel repositories and shared family artifacts. Frozen seams ensure stability: changes at boundaries require explicit, coordinated governance rather than unilateral action.

## Frozen Boundary: Shared Artifacts

All artifacts in the `shared/` directory are **immutable without family-level governance approval**. This repository reads from `shared/` but does not unilaterally modify its contents.

### Shared Artifacts Subject to Freeze

| Artifact | Description | Freeze Scope |
|---|---|---|
| `shared/shared_taxonomy.json` | Classification hierarchy | Structure and values frozen per baseline |
| `shared/shared_enum_registry.json` | Enumerated value sets | Values frozen per baseline; additions require governance |
| `shared/control_layers.json` | 11 control layers | Layer definitions frozen per baseline |
| `shared/interface_zones.json` | 10 interface zones | Zone definitions frozen per baseline |
| `shared/shared_standards_registry.json` | Standards catalog | Schema frozen; entries may be added via governed process |
| `shared/shared_evidence_registry.json` | Evidence source catalog | Schema frozen; entries may be added via governed process |
| `shared/shared_risk_registry.json` | Risk classifications | Classifications frozen per baseline |
| `shared/division_07_posture.json` | Division 07 alignment | Frozen per baseline |
| `shared/FAMILY_CONTEXT.md` | Family-level context | Frozen per baseline |

### What "Frozen Per Baseline" Means

- A **baseline** is a tagged, versioned snapshot of the shared artifacts.
- This repository declares which baseline it conforms to in `state/`.
- Intelligence records are validated against the declared baseline's schemas and enumerations.
- Moving to a new baseline requires explicit migration: validating all active records against the new baseline and resolving any incompatibilities.

## Frozen Boundary: Kernel Truth

The intelligence layer **reads** kernel truth from the five sibling repositories. It does not write to them.

| Kernel Repository | What This Repo Reads | What This Repo May NOT Do |
|---|---|---|
| Construction_Specification_Kernel | Specification section structure, scope boundaries | Define or modify specification content |
| Construction_Assembly_Kernel | Assembly definitions, layer sequences | Define or modify assembly structures |
| Construction_Material_Kernel | Material properties, classifications | Define or modify material data |
| Construction_Chemistry_Kernel | Compatibility data, reactivity information | Define or modify chemistry data |
| Construction_Scope_Kernel | Scope boundaries, inclusions/exclusions | Define or modify scope definitions |

## Frozen Boundary: Schema Versions

JSON schemas in the `schemas/` directory are versioned. A committed schema version is frozen:

- Active intelligence records reference a specific schema version.
- Schema changes produce a new version, not a modification of the existing version.
- Records validated against schema v1 remain valid against schema v1 indefinitely.
- Migration to a new schema version is an explicit, auditable process.

## Governance for Boundary Changes

Changes to any frozen seam require:

1. **Proposal:** Documented rationale for the change, submitted through the proposal zone.
2. **Impact analysis:** Assessment of which active intelligence records are affected.
3. **Family coordination:** For shared artifacts, agreement across all family repositories that consume the artifact.
4. **Migration plan:** For schema changes, a plan to validate or migrate existing records.
5. **Baseline tag:** A new baseline is tagged after the change is incorporated.
