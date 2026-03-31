# Wave 2 — Domain OS Taxonomy Migration Note

**Date:** 2026-03-31
**Migration:** Flat Manufacturer Atlas -> Domain OS Layered Taxonomy

## What Changed

Wave 1 created a flat Manufacturer Atlas under:
```
2-Engines-Tools-Datasets/Manufacturer_Atlas/
  graph/ schemas/ lenses/ constraints/ relations/ surface/
```

Wave 2 reorganized into Domain OS taxonomy:
```
000-governance-truth/  (schemas, constraints, types)
100-knowledge-graph/   (nodes, edges, lenses, detail graph)
200-engines/           (resolvers, validators)
300-tools/             (atlas explorer, UI)
400-adapters/          (external bridges)
900-archive-immutable/ (receipts, audits)
```

## Architecture Law Applied

FUNCTIONS CANNOT LIVE WITH GOVERNANCE

- Schemas moved from graph/ to 000-governance-truth/090-schemas
- Constraint sets moved from constraints/ to 000-governance-truth/080-constraint-sets
- Graph data moved to 100-knowledge-graph/
- UI surface moved to 300-tools/
- Receipt archived to 900-archive-immutable/

## Lineage Preservation

All rehomed artifacts carry _lineage metadata:
- origin_repo
- origin_path
- origin_commit: 05a909260769de38eebe839494e2b00c277fbdff
- recreated_by
- recreated_date

## Original Files

Original Wave 1 files remain in their original locations.
The Domain OS taxonomy layers are the canonical locations going forward.
