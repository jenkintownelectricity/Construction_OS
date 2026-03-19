# Detail Applicability Consumption Note

## Purpose

Document how Construction_Runtime consumes detail applicability and detail schema rules defined by the Construction Detail Applicability Model and Construction Detail Schema.

---

## Consumption Rule

Runtime consumes detail rules defined in:
- `Construction_Kernel/docs/system/CONSTRUCTION_DETAIL_APPLICABILITY_MODEL.md`
- `Construction_Kernel/docs/system/CONSTRUCTION_DETAIL_SCHEMA.md`

Governed by:
- `Construction_Kernel/docs/governance/construction-detail-doctrine.md`

---

## Runtime Constraints

- Runtime consumes detail applicability rules and detail schema. Runtime does not define them.
- Runtime must not define detail logic or create detail variants.
- Runtime must not infer construction logic where no applicability rule matches.
- Runtime must not invent applicability matches for unresolved conditions.
- Runtime must not fall back to generic or default details.
- Runtime must fail closed when no applicability rule matches or when detail logic is incomplete.

---

## Scope

Runtime behavior is not modified in this wave. This document records the consumption relationship only.

---

## Safety Note

- This document defines architecture documentation only
- No runtime code, schemas, or implementations are modified
