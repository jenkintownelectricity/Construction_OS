# assembly_interpreter

## Purpose

Interprets construction assembly documents and extracts structured assembly data. Produces observations and extracted structures describing layer sequences, material references, attachment methods, and performance characteristics found in assembly documentation.

## Domain

Construction assembly documents including wall assemblies, roof assemblies, floor assemblies, and envelope assemblies.

## Output Categories

- **Extracted Structure**: Normalized assembly layer sequences, material callouts, attachment specifications.
- **Observation**: Noted conditions, ambiguities, or missing information in source documents.

## Kernel Bindings

- Primary: Assembly Kernel, Geometry Kernel
- Secondary: Chemistry Kernel (material properties referenced in assemblies)

## Handoff Target

Construction_Runtime validation pipeline (extracted structures) and normalization validators.
