# Drawing IR Consumption Note

## Purpose

Document how Construction_Runtime consumes Drawing Instruction IR rules defined by the Drawing Instruction IR specification.

---

## Consumption Rule

Runtime consumes drawing instruction rules defined in:
- `Construction_Kernel/docs/system/DRAWING_INSTRUCTION_IR.md`

Governed by:
- `Construction_Kernel/docs/governance/construction-detail-doctrine.md`

---

## Runtime Constraints

- Runtime consumes IR instructions. Runtime does not define IR instruction types.
- Runtime must not invent IR instructions beyond governed translation of resolved detail logic.
- Runtime must not embed vendor-specific CAD commands in IR output.
- Runtime must not emit renderer-specific instructions at the IR layer.
- Runtime must maintain the separation between IR (what to draw) and renderer (how to emit).
- Runtime must fail closed when required IR inputs (component references, relationships, output intent) are incomplete.

---

## Scope

Runtime behavior is not modified in this wave. This document records the consumption relationship only.

---

## Safety Note

- This document defines architecture documentation only
- No runtime code, schemas, or implementations are modified
