# Construction_Intelligence_Workers

Specialized worker fleet for construction intelligence signal extraction and proposal generation.

## Role

Construction_Intelligence_Workers sits beside the governed construction stack as a signal extraction layer. Workers process construction documents, drawings, specifications, and material references to produce structured proposals, observations, and signals.

## Core Constraints

1. **Workers extract and propose.** Every worker output is a proposal, observation, or signal. No worker output is canonical truth.
2. **Workers do not define truth.** Truth is defined upstream by governed kernel and runtime layers. Workers reference truth; they do not create it.
3. **Workers do not self-canonicalize.** No worker may promote its own output to canonical status. All outputs require external validation.
4. **Workers must hand off into governed validation surfaces.** Every worker output must be delivered to a governed validation surface before it may influence downstream decisions.

## Workers

| Worker | Purpose |
|---|---|
| `assembly_interpreter` | Interprets construction assembly documents, extracts structured assembly data |
| `spec_parser` | Parses specification documents, extracts requirements, constraints, material references |
| `detail_extractor` | Extracts detail information from construction drawings and documents |
| `material_intelligence` | Analyzes material references, identifies products, classifies by assembly fit |
| `compliance_signal` | Generates compliance signals by comparing extracted data against governed constraints |

## Stack Position

This repository operates beside the construction stack (Layers 0-7). It consumes governed definitions from upstream layers and delivers proposals into governed validation surfaces. It does not participate in truth definition or runtime governance.

## Read Order

See `docs/system/REPO_MANIFEST.md` for the canonical first-read order.
