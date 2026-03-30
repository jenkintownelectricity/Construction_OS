# Constraint Port Doctrine

## Document ID
L0-CMD-CONOS-VKGL04R-CPORT-001

## Authority
Armand Lefebvre — Lefebvre Design Solutions LLC

## Date
2026-03-30

## Purpose

The Constraint Port is a **bounded evaluation surface** within Construction OS.
It evaluates physical, regulatory, manufacturer, and warranty constraints
**deterministically** before construction decisions are finalized.

## Core Principles

### 1. Truth Is Kernel-Owned
The Constraint Port does **not** invent, generate, or infer truth.
All constraint truth originates from:
- Construction kernels (Material, Chemistry, Assembly, Specification, Scope)
- External authoritative sources (codes, standards, manufacturer specs)
- Registry-validated reference data

The port **consumes** truth. It does not **produce** it.

### 2. Evaluation Is Deterministic
Every constraint evaluation must:
- Accept a defined input (constraint object + context)
- Apply a defined rule (logic operator)
- Produce a defined output (decision + evidence)
- Be reproducible given the same inputs

No probabilistic reasoning. No LLM inference. No pattern guessing.

### 3. Runtime Is Consumer Only
Construction_Runtime consumes constraint decisions.
It does **not**:
- Reason about constraints
- Select which constraints apply
- Override constraint decisions
- Contain evaluation logic

Runtime executes. The Constraint Port evaluates. Kernels own truth.

### 4. Evidence Is Mandatory for Blocking Decisions
Any decision that results in BLOCK or REQUIRE_HUMAN_STAMP must include:
- The rule that triggered
- The source authority
- The specific evidence that caused the trigger
- The dependency chain that was evaluated

Decisions without evidence are invalid.

### 5. Fail-Closed by Default
If evidence is missing, dependencies are unresolvable, or a rule cannot
be fully evaluated:
- The default action is **BLOCK**
- The decision must state: `missing_evidence` or `unresolvable_dependency`
- No silent pass-through is permitted

## Decision Classes

| Class | Meaning |
|---|---|
| PASS | Constraint satisfied; no action required |
| WARN | Potential issue identified; proceed with caution |
| BLOCK | Constraint violated; action cannot proceed |
| REQUIRE_HUMAN_STAMP | Decision requires human authority to override |

## Governance Boundary

The Constraint Port operates within Ring 2 (Engines-Tools-Datasets).
It is governed by Ring 0/Ring 1 doctrine and must not exceed its
authority boundary.

## Scope Exclusions

- Does not replace building code officials
- Does not replace manufacturer technical support
- Does not replace professional engineering judgment
- Does not contain full standard corpora
- Does not perform non-deterministic analysis
