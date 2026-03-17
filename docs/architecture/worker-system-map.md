# Worker System Map

## Purpose

System architecture of the Construction_Intelligence_Workers fleet.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              Governed Construction Stack             │
│  Layer 0: Universal_Truth_Kernel                     │
│  Layer 5: Construction_Kernel                        │
│  Layer 6: Construction_Runtime                       │
│  Layer 7: Construction_Application_OS                │
└──────────────────────┬──────────────────────────────┘
                       │ governed references
                       ▼
┌─────────────────────────────────────────────────────┐
│        Construction_Intelligence_Workers             │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ assembly_         │  │ spec_parser      │         │
│  │ interpreter       │  │                  │         │
│  └────────┬─────────┘  └────────┬─────────┘         │
│  ┌────────┴─────────┐  ┌────────┴─────────┐         │
│  │ detail_extractor  │  │ material_        │         │
│  │                   │  │ intelligence     │         │
│  └────────┬─────────┘  └────────┬─────────┘         │
│  ┌────────┴──────────────────────┴─────────┐        │
│  │ compliance_signal                        │        │
│  └────────┬────────────────────────────────┘        │
└───────────┼─────────────────────────────────────────┘
            │ proposals / observations / signals
            ▼
┌─────────────────────────────────────────────────────┐
│          Governed Validation Surfaces                │
│  Construction_Runtime validation pipeline            │
│  Construction_Application_OS proposal review         │
└──────────────────────┬──────────────────────────────┘
                       │ validated outputs
                       ▼
┌─────────────────────────────────────────────────────┐
│               Downstream Consumers                   │
│  Construction_Assistant                              │
│  Opportunity_Intelligence                            │
└─────────────────────────────────────────────────────┘
```

## Data Flow

1. Workers receive governed references from upstream stack layers.
2. Workers receive source documents (drawings, specs, assemblies) as inputs.
3. Workers extract, normalize, compare, and emit structured proposals.
4. All outputs are handed off to governed validation surfaces.
5. Validated outputs are consumed by downstream systems.

## Isolation Boundaries

- Workers do not communicate directly with each other except through governed handoff chains.
- Workers do not access downstream consumers directly.
- Workers do not modify upstream governed state.
