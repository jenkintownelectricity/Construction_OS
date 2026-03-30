# Reference Intelligence Doctrine

**Version:** 0.1
**Status:** Active
**Scope:** Construction_Reference_Intelligence repository

## Core Principle

This repository is a **reference intelligence layer**. It observes, annotates, and links kernel truth maintained by the five construction-kernel repositories. It **never overrides, replaces, or contradicts** kernel truth.

## Doctrinal Commitments

### 1. Observation Without Ownership

The intelligence layer reads from kernel truth sources (specifications, assemblies, materials, chemistry, scope definitions). It does not define or modify those truths. If kernel truth changes, intelligence records referencing it must reconcile or be superseded — never the reverse.

### 2. Evidence-Linked Intelligence

Every intelligence record (failure pattern, trend, precedent, risk annotation) must link to at least one evidence source. Unsupported assertions are not intelligence; they are speculation and are rejected at validation.

### 3. Confidence Tracking

All intelligence carries an explicit confidence level: `low`, `medium`, `high`, or `established`. Confidence may evolve upward as evidence accumulates or downward as contradicting evidence emerges. Confidence transitions are recorded, never silently changed.

### 4. Fail-Closed Validation

Unvalidated intelligence is **rejected**, not accepted with caveats. A record that cannot meet minimum evidence and schema requirements does not enter the active corpus. Draft records exist in a staging state and are clearly marked as non-authoritative.

### 5. Immutable History

Once a record is committed to the active corpus, it is never rewritten. Corrections, refinements, and retractions are accomplished through **supersession**: a new record is created that explicitly references and replaces its predecessor. The full chain of reasoning remains auditable.

## Relationship to Kernel Truth

| Kernel Domain | This Repo's Posture |
|---|---|
| Specifications (CSI Division 07) | Reads and references; never authors spec text |
| Assemblies | Observes assembly definitions; annotates failure/success patterns at assembly interfaces |
| Materials | References material properties; never defines them |
| Chemistry | References compatibility/reactivity data; never defines chemistry |
| Scope definitions | Reads scope boundaries; intelligence stays within declared scope |

## Governing Policies

- [Immutability Policy](immutability-policy.md)
- [Source Trust Policy](source-trust-policy.md)
- [Knowledge Quality Policy](knowledge_quality_policy.md)
- [Non-Goals](non-goals.md)
