# Immutability Policy

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](reference-intelligence-doctrine.md)

## Policy Statement

All committed intelligence records are **append-only**. Once a record reaches `active` status and is committed to the repository, its content is immutable. No silent mutation of committed intelligence is permitted.

## Supersession Model

When intelligence must be corrected, refined, extended, or retracted, the mechanism is **supersession**:

1. A new record is created with its own unique identifier.
2. The new record includes a `supersedes` field referencing the predecessor record's identifier.
3. The predecessor record's status transitions to `superseded`.
4. The predecessor record is never deleted or modified (except for the status field transition to `superseded`).

### Supersession Chain

Every superseded record forms a link in an auditable chain:

```
record_v1 (active)
  --> record_v2 (supersedes: record_v1) --> record_v1 status: superseded
    --> record_v3 (supersedes: record_v2) --> record_v2 status: superseded
```

The full chain is always traversable. Consumers can follow the chain to understand how intelligence evolved and why.

## What Immutability Covers

- Intelligence content (observations, patterns, conclusions)
- Evidence linkages at time of commit
- Confidence level at time of commit
- Source attributions

## What Immutability Does Not Cover

- Record **status** transitions (`draft` -> `active` -> `superseded` -> `deprecated`) are permitted as lifecycle events, not content mutations.
- Metadata annotations (e.g., adding a cross-reference tag) are permitted only if the schema explicitly defines them as mutable metadata and the change is logged.

## Enforcement

- Schema validation rejects records that attempt to overwrite existing committed identifiers.
- Pull request review must verify that no committed record content has been altered.
- Automated checks (when implemented) will diff committed records against their prior state and reject content-level changes.

## Rationale

Silent mutation destroys auditability. In construction intelligence — where failure pattern records may inform real-world decisions about building envelope integrity — the ability to trace exactly what was known, when, and why it changed is non-negotiable.
