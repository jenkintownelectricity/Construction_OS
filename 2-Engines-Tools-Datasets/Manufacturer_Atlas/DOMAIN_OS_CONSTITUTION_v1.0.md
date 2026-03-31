# Manufacturer Domain OS — Constitution v1.0

**Domain:** Building Envelope Manufacturer
**Classification:** MANUFACTURER_DOMAIN_OPERATING_SYSTEM
**Status:** FROZEN
**Version:** v1.0
**Frozen Date:** 2026-03-31

---

## Taxonomy

```
2-Engines-Tools-Datasets/Manufacturer_Atlas/
├── 000-governance-truth/     Canonical manufacturer authority
├── 100-knowledge-graph/     Atlas graph and detail graph structures
├── 200-engines/             Deterministic logic consuming truth and graph
├── 300-tools/               Operator-facing tools and UI surfaces
├── 400-adapters/            Bridges to external systems (OMNI, CAD, BIM)
└── 900-archive-immutable/   Append-only lineage archive
```

---

## Architecture Law

**FUNCTIONS CANNOT LIVE WITH GOVERNANCE**

All execution must respect this rule. Schemas, types, and constraint
definitions live in 000-governance-truth. Engines, tools, and adapters
live in their own layers and consume governance through read-only
reference.

---

## Dependency Law

```
000 → 100 → 200 → 300 → 400
              ↓
             900
```

Lower layers may consume higher layers.
Higher layers may NEVER be overwritten by lower layers.

---

## Governance Rules

1. Only governed commits may modify `000-governance-truth`
2. Engines (200) cannot write to governance (000)
3. Tools (300) cannot write to governance (000)
4. Adapters (400) cannot write to governance (000)
5. Archive (900) is append-only: never overwrite, never delete
6. All governance changes follow thaw/refreeze protocol

---

## Portability

This Manufacturer Domain OS is designed as a portable module.
It can operate within 10-Construction_OS or be extracted as
a standalone domain operating system.

---

## Authority Chain

```
Universal_Truth_Kernel
  ↓
ValidKernel-Governance
  ↓
Construction_OS (Domain d1)
  ↓
Manufacturer Domain OS (this module)
```
