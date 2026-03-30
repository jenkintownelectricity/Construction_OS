# Evidence Lineage

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Source Trust Policy](../doctrine/source-trust-policy.md)

## Principle

Every intelligence record must trace to at least one evidence source. Every evidence source must have a declared quality tier. The chain from intelligence assertion back to source material must be explicit, traversable, and auditable.

## Lineage Structure

```
Intelligence Record
  |
  +-- evidence_links[]
        |
        +-- source_ref  -->  shared/shared_evidence_registry.json entry
        |     |
        |     +-- quality_tier (primary | secondary | tertiary)
        |     +-- source_type (standard, test_report, field_investigation, ...)
        |     +-- provenance metadata (author, date, access_path)
        |
        +-- relevance_note  (how this source supports the assertion)
        +-- extraction_date (when the evidence was incorporated)
```

## Evidence-to-Intelligence Linkage Rules

1. **Mandatory linkage.** No intelligence record may reach `active` status without at least one evidence link. Records with zero evidence links are rejected at validation.

2. **Source registry reference.** Evidence links reference sources by their identifier in `shared/shared_evidence_registry.json`. Inline-only citations (without registry entries) are not permitted for active records.

3. **Quality tier inheritance.** The confidence ceiling of an intelligence record is bounded by the highest-quality evidence tier among its linked sources (see [Source Trust Policy](../doctrine/source-trust-policy.md)).

4. **Relevance documentation.** Each evidence link should include a brief note explaining how the source supports the specific assertion. A source linked without relevance context is a weak link.

5. **Temporal context.** Evidence links should record when the evidence was extracted or reviewed. Source material may be updated or retracted; the extraction date establishes what was known at commit time.

## Source Quality Tiers

| Tier | Label | Confidence Ceiling | Examples |
|---|---|---|---|
| 1 | Primary | `established` | Standards text, accredited test reports, peer-reviewed publications, field investigation reports with photographic evidence |
| 2 | Secondary | `high` | Technical bulletins, installation instructions, published case studies, conference proceedings |
| 3 | Tertiary | `medium` | Textbooks, trade articles, forum discussions, uncited expert opinion |

## Lineage Integrity Checks

- **Forward traceability:** Given a source, identify all intelligence records that depend on it. Enables impact analysis when a source is retracted or updated.
- **Backward traceability:** Given an intelligence record, identify all sources that support it. Enables confidence auditing.
- **Orphan detection:** Sources in the registry not linked by any active record are flagged for review (they may be candidates for new intelligence or for registry cleanup).
- **Broken link detection:** Intelligence records referencing source identifiers not present in the registry are invalid.

## Evidence Accumulation

As additional evidence is discovered for an existing pattern, the mechanism is supersession:

1. Create a new record with the expanded evidence set.
2. The new record supersedes the prior record.
3. If the expanded evidence justifies a higher confidence level, the new record reflects that.
4. The prior record's evidence links are preserved in the superseded record for historical auditability.
