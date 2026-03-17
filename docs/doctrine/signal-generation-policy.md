# Signal Generation Policy

## Purpose

Defines how workers generate signals from extracted data.

## Signal Definition

A signal is a derived indicator produced by comparing extracted data against governed constraints or reference structures. Signals are not truth. Signals are proposals that indicate a potential condition requiring validation.

## Signal Generation Process

1. **Input Acquisition**: Worker receives source documents within its declared input domain.
2. **Extraction**: Worker extracts structured data per its extraction schema.
3. **Reference Binding**: Worker binds extracted data against governed reference definitions (from Construction_Kernel or Construction_Runtime).
4. **Comparison**: Worker compares extracted values against governed constraints.
5. **Signal Emission**: Worker emits a signal with:
   - Signal type (observation, extracted_structure, proposal, compliance_signal)
   - Source reference (document, section, detail)
   - Extracted value(s)
   - Governed reference value(s), if applicable
   - Confidence score
   - Handoff target

## Signal Constraints

- Signals must be deterministic for identical inputs and reference states.
- Signals must not embed judgments. They report comparisons, not conclusions.
- Signals must include confidence scores where extraction involves interpretation.
- Signals must identify their governed reference source explicitly.
- Signals with no governed reference must be tagged as `unbound` and routed for manual review.

## Signal Routing

All signals are routed to governed validation surfaces. Routing is determined by signal type and the governing domain kernel. See `maps/signal_surface_map.md`.
