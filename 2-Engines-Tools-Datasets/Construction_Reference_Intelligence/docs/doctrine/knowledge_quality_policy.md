# Knowledge Quality Policy

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](reference-intelligence-doctrine.md)

## Purpose

Intelligence without quality controls is noise. This policy defines confidence levels, ambiguity flagging requirements, and evidence linkage thresholds that govern what enters the active corpus.

## Confidence Levels

Every intelligence record carries exactly one confidence level:

### `low`

- Based on limited or indirect evidence.
- May rely on a single Tier 3 source or practitioner observation.
- Useful for hypothesis generation; not suitable for decision support.
- **Minimum evidence:** 1 source of any tier.

### `medium`

- Supported by multiple sources or at least one Tier 2 source.
- Pattern is plausible and consistent with related intelligence.
- Suitable for awareness and further investigation.
- **Minimum evidence:** 2 sources of any tier, or 1 Tier 2 source.

### `high`

- Supported by at least one Tier 1 source with corroboration.
- Pattern is well-documented and reproducible.
- Suitable for informing design and specification decisions (with professional judgment).
- **Minimum evidence:** 1 Tier 1 source + 1 corroborating source of any tier.
- **Evidence linkage:** Mandatory. Each supporting source must be explicitly linked.

### `established`

- Supported by multiple Tier 1 sources, industry consensus, or codified in standards.
- Pattern is widely recognized and non-controversial among practitioners.
- Suitable as baseline reference intelligence.
- **Minimum evidence:** 2+ Tier 1 sources or standards/code citation.
- **Evidence linkage:** Mandatory with full provenance chain.

## Confidence Evolution

Confidence levels may change over time as evidence accumulates or is contradicted. Changes follow the supersession model:

- A new record is created at the revised confidence level.
- The new record supersedes the prior record.
- The reason for confidence change is documented in the new record.

Confidence **never changes in place** on a committed record.

## Ambiguity Flags

When an intelligence record contains elements of uncertainty that are not fully captured by the confidence level alone, **ambiguity flags** are required:

| Flag | Meaning |
|---|---|
| `conflicting_evidence` | Evidence sources disagree on the pattern or conclusion |
| `limited_sample` | Pattern observed in fewer than 3 independent instances |
| `geographic_constraint` | Pattern may be climate- or region-specific |
| `temporal_constraint` | Pattern may be era-specific (materials/practices of a particular period) |
| `scope_boundary` | Pattern is near the edge of this repo's declared scope |
| `extrapolated` | Conclusion extends beyond direct evidence through inference |

Records at `high` or `established` confidence with any ambiguity flag should be reviewed for potential confidence downgrade.

## Rejection Criteria

An intelligence record is **rejected** (cannot enter `active` status) if:

1. It has no evidence linkage whatsoever.
2. Its confidence level exceeds the ceiling imposed by its evidence tier (see [Source Trust Policy](source-trust-policy.md)).
3. It asserts kernel truth (specification, assembly, material, chemistry, or scope definitions).
4. It reproduces copyrighted standards text.
5. It lacks a unique identifier or required schema fields.
