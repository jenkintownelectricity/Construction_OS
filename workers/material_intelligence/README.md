# material_intelligence

## Purpose

Analyzes material references from source documents and other worker outputs. Identifies specific products, classifies materials by assembly fit, and flags substitution candidates. Produces proposals and signals.

## Domain

Material references, product data, manufacturer information, and material properties as they relate to construction assemblies and specifications.

## Output Categories

- **Proposal**: Suggested product identifications, material classifications, substitution candidates.
- **Signal**: Material fit indicators, specification compliance indicators for materials, availability signals.

## Kernel Bindings

- Primary: Chemistry Kernel, Assembly Kernel
- Secondary: Governance Kernel (specification-driven material constraints)

## Handoff Target

Construction_Application_OS proposal review surface (proposals) and Construction_Runtime signal audit surface (signals).
