# Non-Goals

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](reference-intelligence-doctrine.md)

## Purpose

Clarity about what this repository is **not** is as important as clarity about what it is. The following are explicit non-goals. Scope creep into any of these areas is a design violation.

## This Repository Is NOT:

### 1. A Kernel Truth Owner

This repo does not own, define, or author:

- **Specification truth** — CSI Division 07 specification content lives in the specification kernel.
- **Assembly truth** — Assembly definitions, layer sequences, and component relationships live in the assembly kernel.
- **Material truth** — Material properties, classifications, and performance data live in the material kernel.
- **Chemistry truth** — Chemical compatibility, reactivity, and degradation data live in the chemistry kernel.
- **Scope truth** — Project scope definitions, inclusions, exclusions, and boundary conditions live in the scope kernel.

If intelligence appears to conflict with kernel truth, the intelligence is wrong (or the kernel needs updating through its own governance). This repo never overrides kernel truth.

### 2. A Runtime System

This repository contains no executable services, no APIs, no databases, no scheduled jobs. It is a structured knowledge repository. Runtime systems that consume this intelligence are separate concerns in separate repositories.

### 3. An Application Layer

No user interfaces, dashboards, query engines, or interactive tools live here. Applications that present intelligence to users are downstream consumers, not part of this repository.

### 4. A Standards Text Repository

This repository **references** standards by citation. It does not reproduce, excerpt, or paraphrase standards text. Standards text is copyrighted by its issuing body. See [Standards Reference Posture](../architecture/standards-reference-posture.md).

### 5. A Specification Authoring Tool

This repository does not generate, template, or assemble specification sections. It provides intelligence that may inform specification decisions, but the act of specification authoring is outside its scope.

### 6. A Product Database

Individual product data (specific manufacturer SKUs, model numbers, pricing) is not intelligence. Product categories, material classes, and performance trends are within scope; product catalogs are not.

### 7. An Autonomous Decision-Maker

Intelligence records inform human and AI-assisted decision-making. They do not make decisions. No record in this repository should be interpreted as a directive, instruction, or recommendation without human review in context.
