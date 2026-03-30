# Record Lifecycle

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](../doctrine/reference-intelligence-doctrine.md)

## Lifecycle States

Every intelligence record progresses through a defined lifecycle. State transitions are explicit, logged, and irreversible (a record never moves backward).

```
draft --> active --> superseded --> deprecated
```

### `draft`

- Record is under construction or review.
- Not part of the active corpus. Consumers must not treat draft records as authoritative.
- Schema validation is applied but evidence thresholds are advisory, not enforced.
- A draft may be abandoned without entering `active` status.

### `active`

- Record has passed validation: schema compliance, minimum evidence linkage, confidence level justified by evidence tier.
- Immutability applies from this point forward (see [Immutability Policy](../doctrine/immutability-policy.md)).
- Consumers may rely on active records at the stated confidence level.
- Transition trigger: successful validation and merge to the canonical branch.

### `superseded`

- A newer record has been created that replaces this one.
- The superseding record's `supersedes` field references this record's identifier.
- The superseded record remains in the repository for auditability; it is never deleted.
- Consumers should follow the supersession chain to the current active record.
- Transition trigger: a successor record enters `active` status.

### `deprecated`

- Record has been withdrawn without a direct successor.
- Reasons for deprecation: evidence was retracted, scope was determined to be out-of-bounds, or the pattern was found to be an artifact of bad data.
- A `deprecation_reason` field is required.
- Transition trigger: governance review determines the record should be withdrawn.

## Supersession Chain Requirements

1. Every superseding record must include a `supersedes` field containing the predecessor's record identifier.
2. The predecessor's status must transition to `superseded` in the same commit as the successor's introduction.
3. The supersession reason must be documented in the successor record (e.g., new evidence, confidence revision, scope correction, error correction).
4. Chains are unbounded in length. A record may be superseded by a record that is itself later superseded.
5. Branching supersession (one record superseded by multiple successors) is permitted when a single record is split into more granular patterns.

## State Transition Table

| From | To | Trigger | Reversible |
|---|---|---|---|
| `draft` | `active` | Validation pass + merge | No |
| `draft` | (abandoned) | Author withdrawal | N/A |
| `active` | `superseded` | Successor enters active | No |
| `active` | `deprecated` | Governance review | No |
| `superseded` | `deprecated` | Governance review (rare) | No |

## Validation Gates

Transition from `draft` to `active` requires:

- All required schema fields populated.
- At least one evidence source linked (registered in `shared/shared_evidence_registry.json`).
- Confidence level does not exceed the ceiling of the best evidence tier.
- No reproduction of copyrighted standards text.
- Unique record identifier assigned.
