# Stack Position

## Purpose

Defines where Construction_Intelligence_Workers sits relative to the governed construction stack.

## Position: Beside the Stack

Construction_Intelligence_Workers is not a layer in the stack. It operates beside the stack as a specialized worker fleet.

```
Stack Layers:
  Layer 0: Universal_Truth_Kernel (root doctrine)
  Layer 5: Construction_Kernel (domain kernels)
  Layer 6: Construction_Runtime (execution engine)
  Layer 7: Construction_Application_OS (application coordination)

Beside the Stack:
  → Construction_Intelligence_Workers (signal extraction fleet)
```

## Relationship to Stack Layers

| Stack Layer | Relationship |
|---|---|
| Layer 0 (UTK) | Workers inherit epistemological constraints. Workers do not reference UTK directly; constraints flow through Layer 5-6. |
| Layer 5 (CK) | Workers bind extracted data against kernel definitions. Workers consume kernel schemas; they do not modify them. |
| Layer 6 (CR) | Workers hand off outputs to runtime validation surfaces. Workers conform to runtime contracts. |
| Layer 7 (CAO) | Workers deliver proposals to application-layer review surfaces. CAO may orchestrate worker invocation. |

## What This Position Means

- Workers are consumers of governed definitions, not producers.
- Workers are suppliers of proposals, not suppliers of truth.
- Workers operate under stack governance but do not participate in governance decisions.
- Workers can be replaced, versioned, or scaled without affecting stack integrity.
