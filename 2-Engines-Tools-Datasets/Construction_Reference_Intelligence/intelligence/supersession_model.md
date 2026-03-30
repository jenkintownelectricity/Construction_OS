# Supersession Model

## Purpose

Supersession governs how intelligence records are replaced by newer versions while preserving full lineage. Records are never deleted in this system. When understanding evolves, a new record supersedes the old one, maintaining an auditable chain of how knowledge changed over time.

## Mechanism

When a record is superseded:

1. A new record is created with its own `entry_id`.
2. The new record's `lineage.supersedes` points to the old record's `entry_id`.
3. The old record's `lineage.superseded_by` is set to the new record's `entry_id`.
4. The old record's `status` transitions from `active` to `superseded`.
5. The new record enters the lifecycle at `draft` or `active` depending on evidence completeness.

## Key Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `supersedes` | string (entry_id) | no | ID of the record this one replaces. Null for original records. |
| `superseded_by` | string (entry_id) | no | ID of the record that replaced this one. Null for current records. |
| `supersession_reason` | enum | yes (on supersession) | `new_evidence`, `correction`, `scope_refinement`, `confidence_change`, `merger`. |
| `supersession_date` | ISO 8601 | yes (on supersession) | When the supersession occurred. |
| `change_summary` | string | yes (on supersession) | What changed and why. |

## Supersession Reasons

- **new_evidence** — New data changes the finding, direction, or scope.
- **correction** — The prior record contained an error.
- **scope_refinement** — The observation was split, narrowed, or broadened.
- **confidence_change** — Evidence upgrade or downgrade changed the confidence level materially.
- **merger** — Multiple prior records were combined into a single, more comprehensive record.

## Lineage Chain

Records form a singly-linked list through `supersedes` / `superseded_by`. A full lineage can be traversed forward (from original to current) or backward (from current to original).

```
record_v1 (superseded) → record_v2 (superseded) → record_v3 (active)
```

## Constraints

1. A `superseded` record must have a non-null `superseded_by`.
2. An `active` record must have a null `superseded_by`.
3. Supersession is irreversible — a superseded record cannot return to `active`.
4. `change_summary` must be substantive; "updated" is insufficient.
5. Circular supersession chains are invalid and must be prevented.
6. A single record can supersede multiple prior records (merger), but `supersedes` then becomes an array.

## Relationships

- Operates on all record types in the intelligence layer.
- Interacts with confidence_evolution_model — supersession often accompanies confidence changes.
- Supersession events are logged in the append-only audit trail.
