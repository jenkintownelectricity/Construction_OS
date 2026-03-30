# Intelligence to DB Expansion Map

## Purpose

Documents how intelligence gaps inform DB expansion proposals.
When intelligence analysis reveals that the current schema or data structure cannot
capture observed phenomena, a DB expansion proposal is created.

## Flow

```
Intelligence analysis
  --> Gap identified (missing collection, missing field set, missing zone)
    --> data_gap_record created (DG-XX-NNN)
      --> db_expansion_proposal created (DBX-NNN)
        --> Governance review
          --> approved | rejected
```

## Gap-to-Expansion Triggers

| Gap Type                        | Expansion Proposal Type                    |
|--------------------------------|-------------------------------------------|
| No collection for evidence type | New collection in reference_intelligence_zone|
| Missing context fields          | New field set on existing schema            |
| No zone for data category       | New zone proposal                           |
| Cross-kernel observation needs  | New linking collection                      |

## Examples

| Intelligence Gap                                 | Proposed Expansion                          |
|-------------------------------------------------|--------------------------------------------|
| No place to store commissioning test results     | Add commissioning_evidence collection        |
| No field for wind uplift zone classification     | Add wind_uplift_zone to failure_pattern      |
| No collection for long-term monitoring data      | Add monitoring_data collection               |
| No way to link warranty outcomes to patterns     | Add warranty_outcome linking collection      |

## Governance

- DB expansion proposals require rationale grounded in intelligence gaps.
- Proposals reference the `data_gap_record` that triggered them.
- Expansion proposals follow: `proposed -> approved -> implemented` or `proposed -> rejected`.
- No expansion is implemented without a corresponding schema update.

## Boundaries

- Intelligence identifies the need — it does not implement the expansion.
- Expansion proposals are scoped to the reference_intelligence_zone unless justified otherwise.
- Proposals must not duplicate data already held in kernel repositories.
