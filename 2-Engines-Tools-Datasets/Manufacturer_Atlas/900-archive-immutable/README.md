# 900-archive-immutable

**Purpose:** Append-only lineage archive.

## Subdirectories

| Directory | Purpose |
|-----------|----------|
| 910-receipts | Wave completion receipts |
| 920-audits | Audit reports |
| 930-phase-logs | Phase transition logs |
| 940-migration-notes | Migration and rehoming notes |
| 950-frozen-snapshots | Point-in-time frozen snapshots |

## Archive Rules

- **APPEND-ONLY:** Never overwrite existing files
- **NEVER DELETE:** No file in this directory may be removed
- **IMMUTABLE:** Once written, content is permanent record
