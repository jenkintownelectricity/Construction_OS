# Contractor Automation Posture v0.1

## Authority
10-Construction_OS (domain execution plane)

## Automation Flow

```
Imported drawing
→ Boundary ingestion (trace_ingestor)
→ Geometry normalization (geometry_normalizer)
→ Condition detection (condition_resolver, condition_graph_resolver)
→ Assembly resolution (condition_to_assembly_resolver, assembly_recipe_selector)
→ Constraint validation (detail_constraint_validator)
→ Detail compilation (detail_manifest_builder → detail_compiler)
→ Library admission (detail_library_admitter)
→ Contractor-visible packet
```

## What Is Automatic
1. Boundary ingestion from traces — AUTOMATIC
2. Polygon corner detection (INSIDE/OUTSIDE) — AUTOMATIC
3. Parapet edge detection — AUTOMATIC
4. Condition-to-assembly resolution — AUTOMATIC
5. Constraint validation — AUTOMATIC
6. Manifest generation — AUTOMATIC
7. Library admission evaluation — AUTOMATIC

## What Is Blocked
1. Detail compilation for derived assemblies — BLOCKED (HALT)
   - Reason: edge_termination, roof_drain, pipe_penetration, roof_to_wall_transition assemblies have 0 components
   - Fix: Complete assembly primitive definitions

2. Symbol-based condition detection — BLOCKED (NO SOURCE)
   - Reason: No DXF/DWG files with INSERT entities
   - Fix: Ingest raw DXF source files

3. Polyline semantic classification — BLOCKED (NO SOURCE)
   - Reason: No DXF/DWG files with LWPOLYLINE entities
   - Fix: Ingest raw DXF source files

4. Wall intersection detection — BLOCKED (NO SOURCE)
   - Reason: No WALL_CENTERLINE trace data
   - Fix: Ingest wall centerline traces

## What Needs Manual Sign-off
1. Warranty applicator certification — MANUAL
   - All PARAPET details get WARN; contractor must confirm certified applicator status

## Current Contractor Path
Imported drawing → detect 20 conditions → resolve 20 assemblies → validate 20 candidates → 10 PROVISIONAL details (parapet) + 10 BLOCKED details (derived assemblies)

## Honest State
- **Not "one click"** — 50% of details are blocked due to derived assemblies
- **Parapet path works end-to-end** — provisional detail packets available
- **Remaining conditions require assembly completion** before compilation
