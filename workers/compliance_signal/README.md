# compliance_signal

## Purpose

Generates compliance signals by comparing extracted data against governed constraints. Compares worker outputs from upstream workers against code requirements, specification mandates, and kernel-defined constraints. Emits signals indicating conformance, deviation, or ambiguity.

## Domain

Compliance comparison: extracted construction data vs. governed constraints, code requirements, and specification mandates.

## Output Categories

- **Signal**: Compliance signals indicating conformance, deviation, ambiguity, or insufficient data for comparison.

## Kernel Bindings

- Primary: Governance Kernel, Intelligence Kernel
- Secondary: All other kernels as needed for domain-specific compliance checks

## Handoff Target

Construction_Runtime signal audit surface.
