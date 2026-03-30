# Worker to Application Map

## Purpose

Maps each worker to its Construction_Application_OS (Layer 7) integration points.

## Mappings

| Worker | App Surface | Integration Type |
|---|---|---|
| assembly_interpreter | — | No direct app integration (routes through runtime) |
| spec_parser | — | No direct app integration (routes through runtime) |
| detail_extractor | — | No direct app integration (routes through runtime) |
| material_intelligence | Proposal review surface | Material proposals submitted for review |
| compliance_signal | — | Signals route through runtime audit, not app layer directly |

## Application-Layer Orchestration

Construction_Application_OS may orchestrate worker invocation:
- CAO determines which workers to invoke based on incoming document types.
- CAO provides worker inputs and receives handoff acknowledgments.
- CAO does not modify worker outputs. It routes and orchestrates.

## Downstream Consumer Routing (Post-Validation)

After validation, CAO routes validated outputs to:
- Construction_Assistant (for user-facing presentation)
- Opportunity_Intelligence (for opportunity analysis)

Workers do not interact with these consumers directly.
