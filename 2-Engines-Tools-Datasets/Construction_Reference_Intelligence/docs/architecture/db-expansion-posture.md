# DB Expansion Posture

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](../doctrine/reference-intelligence-doctrine.md)

## Three Database Zones

The repository's data is organized into three conceptual zones with distinct governance rules. These zones control where new intelligence enters, where it is validated, and where canonical truth resides.

### 1. Canonical Truth Zone

**Location:** `shared/` directory and kernel repository references.
**Governance:** Family-level. Changes require cross-repo coordination.
**Mutability:** Frozen per baseline (see [FROZEN_SEAMS.md](../system/FROZEN_SEAMS.md)).

Contents:
- `shared/shared_taxonomy.json` — classification hierarchy
- `shared/shared_enum_registry.json` — enumerated value sets
- `shared/control_layers.json` — 11 control layers
- `shared/interface_zones.json` — 10 interface zones
- `shared/shared_standards_registry.json` — referenced standards catalog
- `shared/shared_evidence_registry.json` — evidence source catalog
- `shared/shared_risk_registry.json` — risk classifications
- `shared/division_07_posture.json` — Division 07 alignment posture

This zone is **read-only** from the intelligence layer's perspective. The intelligence layer consumes these artifacts but does not author them. Additions or modifications to canonical truth require family-level governance approval.

### 2. Reference Intelligence Zone

**Location:** `intelligence/` directory and `schemas/` directory.
**Governance:** Repo-level. Standard validation and review process.
**Mutability:** Append-only for committed records (immutability policy applies).

Contents:
- Active intelligence records (failure patterns, success patterns, trends, precedents, interface risks).
- JSON schemas defining record structure.
- Schema-valid examples in `examples/`.

This zone is the core of this repository. Records enter through the pattern-seeking loop, pass validation, and become part of the active corpus. Once active, records are immutable and may only be superseded or deprecated.

### 3. Proposal Zone

**Location:** `state/` directory (proposals subdirectory when implemented).
**Governance:** Lightweight. Proposals are not authoritative.
**Mutability:** Mutable until promoted.

Contents:
- Draft intelligence records not yet validated.
- AI-generated candidate records awaiting human review.
- Candidate evidence sources not yet registered.
- Suggested additions to canonical truth artifacts (for family-level review).

This zone is a staging area. Nothing in the proposal zone is part of the active corpus. Consumers must not treat proposal-zone content as validated intelligence.

## Expansion Rules

| Action | Permitted By | Zone |
|---|---|---|
| Create draft intelligence record | Author (human or AI) | Proposal |
| Promote draft to active | Human reviewer after validation | Proposal -> Intelligence |
| Supersede active record | Human reviewer after validation | Intelligence |
| Propose canonical truth addition | Any contributor | Proposal |
| Modify canonical truth | Family governance only | Canonical Truth |
| Autonomously mutate any zone | Nobody | Blocked |

## AI Expansion Role

AI systems may:
- Generate draft records in the proposal zone.
- Suggest evidence linkages for existing drafts.
- Identify candidate patterns from dataset analysis.
- Propose additions to the evidence or standards registries.

AI systems may not:
- Promote their own proposals to active status.
- Modify canonical truth artifacts.
- Bypass the validation gate between proposal and intelligence zones.

## Growth Model

The repository grows through:
1. **Intelligence accumulation:** New active records added through the pattern-seeking loop.
2. **Evidence expansion:** New sources registered in the evidence registry as datasets are discovered.
3. **Schema evolution:** New record types or field additions via versioned schema updates.
4. **Canonical truth evolution:** Additions to control layers, interface zones, or taxonomies via family governance.

Each growth vector has its own governance threshold. Intelligence accumulation is the most frequent; canonical truth evolution is the most controlled.
