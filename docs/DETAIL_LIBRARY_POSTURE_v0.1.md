# Detail Library Posture v0.1

## Authority
10-Construction_OS (domain execution plane)

## Admission Rules

1. Only compiled artifacts may become library records
2. BLOCKED artifacts are rejected — no library entry from HALT compile
3. PROVISIONAL artifacts are admitted with PROVISIONAL status, marked clearly
4. COMPILED artifacts are admitted with ADMITTED status
5. No library entry from unresolved candidates

## Current State (2026-04-02)

- **10 PROVISIONAL** library records (PARAPET conditions)
- **0 ADMITTED** library records (no PASS validation exists)
- **10 REJECTED** (BLOCKED artifacts from derived assemblies)

### Why No ADMITTED Records
All compilable candidates receive WARN (not PASS) because the warranty applicator constraint fires. This is honest — full admission requires PASS validation.

## Schema
- `schemas/detail_library_record.schema.json`

## Tool
- `tools/detail_library_admitter.py`

## Outputs
- `output/detail_library/library_index.json` — master index
- `output/detail_library/lib_*.json` — individual library records

## Lineage
Every library record traces back to: artifact → manifest → validation → candidate → condition → boundary.
