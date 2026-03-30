# Frozen Seams

**Repo**: Construction_Intelligence_Workers
**Version**: v0.1

## Purpose

Frozen seams are architectural constraints that must not be violated. They define the immutable boundaries of the worker fleet. Changing a frozen seam requires explicit governance approval and triggers a full reaudit.

## Frozen Seams

### 1. No Truth Definition

Workers do not define canonical truth. Workers extract, observe, and propose. Truth originates from governed upstream layers (UTK, CK, CR). This seam is non-negotiable.

**Violation indicator**: Any worker output tagged as `canonical`, `authoritative`, or `definitive`.

### 2. No Self-Canonicalization

Workers do not promote their own outputs to canonical status. No worker may reference its own prior output as authoritative input. Canonicalization occurs only at governed validation surfaces.

**Violation indicator**: Any worker consuming its own output without intermediate validation.

### 3. Proposal-Only Outputs

Every worker output must be categorized as: observation, extracted_structure, proposal, or signal. No other output category is permitted. All categories are non-canonical by definition.

**Violation indicator**: Any worker output lacking a valid category tag, or any output tagged outside the permitted categories.

### 4. Handoff-Required Posture

Every worker output must be delivered to a governed validation surface. No worker output may be consumed directly by a downstream system without passing through validation. No worker may discard outputs instead of handing off.

**Violation indicator**: Any worker output delivered directly to a consumer, or any output that never reaches a validation surface.

## Seam Integrity

Frozen seams are checked on:
- Every commit to the repository.
- Every manifest version change.
- Every topology change.
- Explicit audit request.

A frozen seam violation invalidates the baseline state and requires remediation before any further worker operations.
