# detail_extractor

## Purpose

Extracts detail information from construction drawings and documents. Produces extracted structures and observations describing dimensions, callouts, material indications, connection details, and spatial relationships.

## Domain

Construction drawings including plan details, section details, wall sections, connection details, and enlarged details.

## Output Categories

- **Extracted Structure**: Normalized detail data including dimensions, callouts, materials, connections, spatial relationships.
- **Observation**: Noted discrepancies, missing dimensions, unclear callouts, or conflicting information in drawings.

## Kernel Bindings

- Primary: Geometry Kernel, Reality Kernel
- Secondary: Assembly Kernel (assembly details depicted in drawings)

## Handoff Target

Construction_Runtime validation pipeline (extracted structures) and normalization validators.
