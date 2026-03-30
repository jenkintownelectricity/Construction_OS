# Authoritative Paths

**Version:** 0.1
**Status:** Active
**Scope:** Construction_Reference_Intelligence repository directory structure

## Purpose

This document defines the authoritative directory paths in this repository and what each path owns. Any content placed outside these paths is non-authoritative. Any content that contradicts the declared purpose of a path is a structural violation.

## Directory Map

### `shared/` — Canonical Shared Family Artifacts

**Owner:** Family-level governance (not this repository alone).
**Mutability:** Frozen per baseline. See [FROZEN_SEAMS.md](FROZEN_SEAMS.md).

Contains the shared artifacts consumed by all repositories in the construction-kernel family:

- `shared/FAMILY_CONTEXT.md` — Family-level context and identity.
- `shared/shared_taxonomy.json` — Classification hierarchy for Division 07.
- `shared/shared_enum_registry.json` — Enumerated value sets.
- `shared/control_layers.json` — 11 control layer definitions.
- `shared/interface_zones.json` — 10 interface zone definitions.
- `shared/shared_standards_registry.json` — Referenced standards catalog.
- `shared/shared_evidence_registry.json` — Evidence source catalog.
- `shared/shared_risk_registry.json` — Risk classifications.
- `shared/division_07_posture.json` — Division 07 alignment posture.

### `intelligence/` — Intelligence Models and Records

**Owner:** This repository.
**Mutability:** Append-only for active records (immutability policy applies).

Contains structured intelligence records:

- Failure patterns, success patterns, trends, precedents, interface risks.
- Organized by intelligence type and domain area.
- Every record in this directory must conform to a schema in `schemas/`.

### `schemas/` — JSON Schemas for Intelligence Records

**Owner:** This repository.
**Mutability:** Versioned. Committed schema versions are frozen.

Contains JSON Schema definitions that govern the structure of intelligence records:

- One schema per intelligence record type (failure pattern, trend, etc.).
- Schema versions are explicit and immutable once committed.
- Validation of intelligence records is performed against these schemas.

### `contracts/` — Governance Contracts

**Owner:** This repository, with family-level coordination for cross-repo contracts.
**Mutability:** Versioned per baseline.

Contains governance contracts that define:

- Validation rules for intelligence records.
- Cross-repository interface agreements.
- Quality gates for record lifecycle transitions.

### `maps/` — Relationship Maps

**Owner:** This repository.
**Mutability:** Append-only; updated as intelligence accumulates.

Contains structured relationship maps:

- Control-layer-to-failure-pattern mappings.
- Interface-zone-to-intelligence-record mappings.
- Cross-reference indices between intelligence records.

### `examples/` — Schema-Valid Examples

**Owner:** This repository.
**Mutability:** Updated with schema versions.

Contains example intelligence records that:

- Demonstrate correct schema usage.
- Serve as templates for new record creation.
- Are validated against current schemas as part of integrity checks.

### `state/` — Baseline State

**Owner:** This repository.
**Mutability:** Updated per baseline.

Contains repository state declarations:

- Current baseline version.
- Schema version declarations.
- Validation state summaries.
- Proposal zone staging area (when implemented).

### `docs/` — Documentation

**Owner:** This repository.
**Mutability:** Updated as architecture evolves.

Contains architectural documentation, doctrine, and system boundary definitions. Organized into:

- `docs/doctrine/` — Governing policies and principles.
- `docs/architecture/` — Structural design and models.
- `docs/system/` — System boundaries, dependencies, and manifests.

## Path Authority Rule

If a question arises about where a piece of content belongs:

1. Check this document for the appropriate path.
2. If no path matches, the content may not belong in this repository.
3. If the content spans paths, place it in the path closest to its primary purpose and cross-reference from others.
4. Content placed in an incorrect path should be relocated, not duplicated.
