# Worker Inventory Overview

## Purpose

Overview of the 5 initial workers in the Construction_Intelligence_Workers fleet.

## Workers

### 1. assembly_interpreter

- **Domain**: Construction assembly documents
- **Function**: Interprets assembly documents and extracts structured assembly data including layer sequences, material references, attachment methods, and performance characteristics.
- **Output Types**: Extracted structure, observation
- **Primary Kernel Binding**: Assembly Kernel, Geometry Kernel

### 2. spec_parser

- **Domain**: Construction specification documents
- **Function**: Parses specification sections, extracts requirements, constraints, acceptable products, material references, and performance criteria.
- **Output Types**: Extracted structure, observation
- **Primary Kernel Binding**: Governance Kernel, Deliverable Kernel

### 3. detail_extractor

- **Domain**: Construction drawings and detail documents
- **Function**: Extracts detail information including dimensions, callouts, material indications, connection details, and spatial relationships from construction drawings.
- **Output Types**: Extracted structure, observation
- **Primary Kernel Binding**: Geometry Kernel, Reality Kernel

### 4. material_intelligence

- **Domain**: Material references and product data
- **Function**: Analyzes material references from other worker outputs, identifies specific products, classifies materials by assembly fit, and flags substitution candidates.
- **Output Types**: Proposal, signal
- **Primary Kernel Binding**: Chemistry Kernel, Assembly Kernel

### 5. compliance_signal

- **Domain**: Extracted data vs. governed constraints
- **Function**: Compares extracted data from upstream workers against governed constraints, code requirements, and specification mandates. Emits compliance signals indicating conformance, deviation, or ambiguity.
- **Output Types**: Signal
- **Primary Kernel Binding**: Governance Kernel, Intelligence Kernel

## Worker Interaction Pattern

Workers may operate independently or in chains. Common chains:
- `spec_parser` -> `compliance_signal`
- `assembly_interpreter` -> `material_intelligence` -> `compliance_signal`
- `detail_extractor` -> `material_intelligence`

All intermediate outputs in chains remain proposals. Each worker hands off independently.
