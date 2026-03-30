# Pattern to Proposal Map

## Purpose

Documents how detected patterns may trigger schema change or DB expansion proposals.
Pattern detection is the primary feedback loop that drives system evolution.

## Flow

```
Pattern detection record (PD-XX-NNN)
  --> Analysis reveals schema limitation or data structure gap
    --> Schema change proposal (SCP-NNN)
       OR
    --> DB expansion proposal (DBX-NNN)
```

## Pattern-to-Proposal Triggers

| Pattern Signal                                    | Proposal Type         | Example                           |
|--------------------------------------------------|-----------------------|-----------------------------------|
| New field needed to classify observed failures     | Schema change         | Add wind_uplift_zone to failure_pattern |
| Recurring data that has no collection             | DB expansion          | Add commissioning_evidence collection   |
| Existing enum missing observed values              | Schema change         | Add new root_cause_category value       |
| Cross-record correlation not capturable            | DB expansion          | Add correlation_record collection       |
| Climate context needs finer granularity            | Schema change         | Add microclimate subfields              |
| New evidence type not in current enum              | Schema change         | Add drone_inspection to evidence types  |

## Confirmation Threshold

- A pattern detection must reach `confidence: medium` or higher before triggering a proposal.
- Proposals from `low` confidence detections are deferred until more evidence accumulates.
- The pattern detection record must reference at least 3 supporting records.

## Proposal Lifecycle

```
Pattern detection (confirmed)
  --> Proposal drafted (proposed)
    --> Review by governance
      --> approved --> implementation planned
      --> rejected --> rationale recorded, pattern flagged
```

## Linkage

- Schema change proposals reference the detection that triggered them in `rationale`.
- DB expansion proposals reference both the detection and any related `data_gap_record`.

## Boundaries

- Not every pattern triggers a proposal — only those exposing structural limitations.
- Proposals are suggestions, not mandates — governance decides.
- Pattern detection records persist regardless of proposal outcome.
