# Source Trust Policy

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](reference-intelligence-doctrine.md)

## Purpose

Every intelligence record must trace to one or more evidence sources. This policy defines how sources are classified, what provenance metadata is required, and how source quality affects the confidence ceiling of derived intelligence.

## Evidence Quality Tiers

### Tier 1 — Primary Sources

Direct, first-hand evidence from the phenomenon being observed.

- Field investigation reports with photographic documentation
- Laboratory test results from accredited facilities
- Manufacturer-published technical data (test reports, evaluation reports)
- Standards body publications (ASTM, ASCE, ASHRAE, NRCA, SMACNA, etc.)
- Building code text (IBC, IRC, state amendments)
- Patent filings with disclosed test data
- Peer-reviewed journal publications

**Confidence ceiling:** `established`

### Tier 2 — Secondary Sources

Interpreted, compiled, or summarized evidence derived from primary sources.

- Industry technical bulletins and application guides
- Manufacturer installation instructions and compatibility charts
- Published case studies (non-peer-reviewed)
- Conference proceedings and technical presentations
- Insurance/warranty claim trend summaries (aggregated, not individual)
- Expert commentary with cited primary sources

**Confidence ceiling:** `high`

### Tier 3 — Tertiary Sources

General knowledge, anecdotal evidence, or sources without direct traceability to primary data.

- Textbooks and training materials
- Trade publication articles
- Forum discussions and practitioner anecdotes
- Uncited expert opinion
- Manufacturer marketing materials without technical substantiation

**Confidence ceiling:** `medium`

## Source Provenance Tracking Requirements

Every evidence source referenced in an intelligence record must include:

| Field | Required | Description |
|---|---|---|
| `source_id` | Yes | Unique identifier within the evidence registry |
| `source_type` | Yes | Classification (standard, test_report, field_investigation, etc.) |
| `quality_tier` | Yes | `primary`, `secondary`, or `tertiary` |
| `title` | Yes | Human-readable title or description |
| `publication_date` | When available | Date of publication or observation |
| `author_organization` | When available | Issuing body or author |
| `access_path` | When available | How to locate the source (DOI, URL, document ID) |
| `retrieval_date` | When digital | Date the source was accessed |

## Confidence Ceiling Rule

An intelligence record's confidence level **cannot exceed** the ceiling imposed by its highest-quality evidence source. A record supported only by Tier 3 sources cannot be rated above `medium` confidence, regardless of the number of Tier 3 sources.

## Source Registry

All sources are registered in [shared/shared_evidence_registry.json](../../shared/shared_evidence_registry.json). Intelligence records reference sources by their registry identifiers, not by inline citations.
