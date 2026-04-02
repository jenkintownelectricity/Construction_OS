# Condition Graph Posture v0.1

## Overview

The condition graph system detects building conditions from imported boundary geometry and resolves them to Barrett assembly primitives, producing governed detail candidates.

## Pipeline

```
Imported Boundary → Condition Detection → Condition Graph → Assembly Resolution → Detail Candidate
```

## Supported Condition Types

| Condition Type | Detection Method | Evidence Source | Status |
|---|---|---|---|
| INSIDE_CORNER | Vertex cross-product analysis | Polygon geometry | DETECTED |
| OUTSIDE_CORNER | Vertex cross-product analysis | Polygon geometry | DETECTED |
| PARAPET | Edge analysis on closed foundation outlines | Polygon edges | DETECTED |

## Unsupported Condition Types (No Current Evidence)

| Condition Type | Reason |
|---|---|
| DRAIN | No drain point/symbol data in boundary geometry |
| CURB | No curb geometry in boundaries |
| EXPANSION_JOINT | No joint data in boundaries |
| WALL_INTERSECTION | Requires cross-referencing wall centerlines with foundation outlines; thin evidence |

## Tools

- `tools/condition_graph_resolver.py` — Condition detection engine
- `tools/condition_to_assembly_resolver.py` — Assembly resolution engine

## Configuration

- `config/condition_detection_tolerances.json` — Geometry tolerances and thresholds

## Outputs

- `output/conditions/cnd_*.json` — Individual condition nodes
- `output/conditions/condition_graph.json` — Full condition graph (nodes + edges)
- `output/detail_candidates/dtl_*.json` — Detail candidate records

## Schemas

- `schemas/condition_node.schema.json`
- `schemas/detail_candidate.schema.json`

## Receipts

- `receipts/barrett_ingestion/condition_detection_receipt.json`
- `receipts/barrett_ingestion/detail_resolution_receipt.json`

## Design Principles

1. **Fail-closed**: Missing config or invalid geometry → rejection, not guessing
2. **Deterministic**: Same input → same output, no randomness
3. **Config-driven**: Tolerances in config, not hardcoded thresholds
4. **Evidence-based**: Every condition includes evidence and lineage
5. **Honest labeling**: DETECTED / DERIVED / UNRESOLVED — never faked

## Assembly Resolution Mapping

| Detected Condition | Assembly Condition Type | Barrett Assembly |
|---|---|---|
| PARAPET | parapet_termination | barrett_sbs_parapet_ext_001 |
| INSIDE_CORNER | edge_termination | barrett_sbs_edge_term_001 |
| OUTSIDE_CORNER | edge_termination | barrett_sbs_edge_term_001 |
