# Entity Relationship Map

## Overview

All entity types in Construction_Reference_Intelligence and their relationships.

## Entity Types

| Entity Type          | ID Format  | Purpose                                      |
|---------------------|-----------|----------------------------------------------|
| Failure Pattern      | FP-XX-NNN | Recurring failure mode observation             |
| Success Pattern      | SP-XX-NNN | Documented successful system/detail            |
| Trend Record         | TR-XX-NNN | Industry or performance trend over time        |
| Precedent Record     | PR-XX-NNN | Specific historical event with lessons          |
| Evidence Record      | EV-NNN    | Empirical data supporting intelligence          |
| Data Gap Record      | DG-XX-NNN | Identified missing data                        |
| Confidence Evolution | CE-XX-NNN | Confidence progression log for a record         |
| Dataset Candidate    | DC-XX-NNN | Potential external data source                  |
| Pattern Detection    | PD-XX-NNN | Emerging pattern not yet confirmed              |
| Schema Change Proposal| SCP-NNN  | Proposed schema modification                    |
| DB Expansion Proposal | DBX-NNN  | Proposed new collection or field set            |
| Ingestion Proposal   | IP-NNN    | Proposed dataset ingestion plan                 |

## Relationships

```
Evidence ──validates──> Failure Pattern
Evidence ──validates──> Success Pattern
Evidence ──validates──> Precedent Record
Evidence ──supports──> Trend Record

Failure Pattern ──kernel_ref──> Assembly Kernel
Failure Pattern ──kernel_ref──> Material Kernel
Failure Pattern ──kernel_ref──> Spec Kernel
Failure Pattern ──kernel_ref──> Chemistry Kernel
Failure Pattern ──kernel_ref──> Scope Kernel

Success Pattern ──kernel_ref──> [same five kernels]

Confidence Evolution ──tracks──> any intelligence record
Pattern Detection ──may_become──> Failure Pattern | Trend Record

Data Gap ──kernel_ref──> [any kernel]
Data Gap ──triggers──> DB Expansion Proposal
Dataset Candidate ──feeds──> Ingestion Proposal
Pattern Detection ──triggers──> Schema Change Proposal
```

## Cardinality

- One intelligence record references zero or more evidence records.
- One evidence record may support multiple intelligence records.
- One intelligence record references one or more kernel entries.
- One confidence evolution tracks exactly one intelligence record.
- One data gap references exactly one kernel domain.

## Status Lifecycle

All intelligence records follow: `draft -> active -> superseded | retired`.
Proposals follow: `draft -> submitted -> accepted | rejected`.
