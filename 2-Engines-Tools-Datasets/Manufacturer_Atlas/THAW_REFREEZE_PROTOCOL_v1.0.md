# Thaw / Refreeze Protocol v1.0

**Status:** FROZEN
**Version:** v1.0

---

## Protocol

Governance changes to `000-governance-truth` follow a strict four-step protocol:

### Step 1: FROZEN (current state)
Governance is locked. No modifications permitted.

### Step 2: THAW
A governed commit explicitly thaws governance by updating:
```
000-governance-truth/.governance_state
```
Setting `status: thawed` with:
- `thawed_by`: identity of the thaw author
- `thawed_date`: ISO 8601 timestamp
- `thaw_reason`: why governance is being modified

### Step 3: MODIFY
Governance changes are made while thawed.
All changes must be committed with clear governance commit messages.

### Step 4: REFREEZE
Governance is refrozen by updating `.governance_state`:
- `status: frozen`
- `version`: incremented per versioning rules
- `refrozen_by`: identity of the refreeze author
- `refrozen_date`: ISO 8601 timestamp
- `refreeze_reason`: summary of changes made
- `lineage_reference`: commit SHA of the thaw commit

A receipt entry must be appended to `900-archive-immutable/910-receipts`.

---

## Constraints

1. Only one thaw may be active at a time
2. Thaw must be refrozen before any other governance thaw can begin
3. Emergency thaw requires documented justification
4. Refreeze without modification is permitted (no-op refreeze)
5. All thaw/refreeze events are permanently recorded in archive
