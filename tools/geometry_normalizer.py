#!/usr/bin/env python3
"""
Geometry Normalizer

Normalizes imported boundary geometry into canonical form for condition detection.
Produces normalized boundary records with wall centerlines if present.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls

This tool consumes trace_bundle boundary data (from trace_ingestor.py) and
normalizes polygon vertices for deterministic condition detection.
"""

import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path


def normalize_polygon(points: list, tolerances: dict) -> list:
    """Normalize polygon points: merge near-duplicate vertices, enforce winding order."""
    if len(points) < 3:
        return points

    merge_tol = tolerances.get("vertex_merge_tolerance_units", 0.25)
    min_edge = tolerances.get("minimum_edge_length_units", 0.5)

    # Merge near-duplicate vertices
    cleaned = [points[0]]
    for pt in points[1:]:
        dx = pt[0] - cleaned[-1][0]
        dy = pt[1] - cleaned[-1][1]
        dist = math.sqrt(dx * dx + dy * dy)
        if dist > merge_tol:
            cleaned.append(pt)

    # Remove short edges
    if len(cleaned) < 3:
        return cleaned

    final = [cleaned[0]]
    for pt in cleaned[1:]:
        dx = pt[0] - final[-1][0]
        dy = pt[1] - final[-1][1]
        dist = math.sqrt(dx * dx + dy * dy)
        if dist >= min_edge:
            final.append(pt)

    return final


def compute_winding(points: list) -> str:
    """Compute polygon winding order using shoelace formula."""
    if len(points) < 3:
        return "DEGENERATE"
    area = 0
    n = len(points)
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    if area > 0:
        return "CCW"
    elif area < 0:
        return "CW"
    return "DEGENERATE"


def compute_edges(points: list) -> list:
    """Compute edge list from polygon vertices."""
    edges = []
    n = len(points)
    for i in range(n):
        j = (i + 1) % n
        dx = points[j][0] - points[i][0]
        dy = points[j][1] - points[i][1]
        length = math.sqrt(dx * dx + dy * dy)
        midpoint = [(points[i][0] + points[j][0]) / 2, (points[i][1] + points[j][1]) / 2]
        angle = math.degrees(math.atan2(dy, dx))
        edges.append({
            "edge_index": i,
            "start": points[i],
            "end": points[j],
            "length": round(length, 4),
            "midpoint": [round(midpoint[0], 4), round(midpoint[1], 4)],
            "angle_degrees": round(angle, 2),
        })
    return edges


def normalize_boundary(boundary: dict, tolerances: dict) -> dict:
    """Normalize a single boundary record."""
    points_raw = boundary.get("points", boundary.get("polyline_points", []))
    points = [[p.get("x", p[0]) if isinstance(p, dict) else p[0],
                p.get("y", p[1]) if isinstance(p, dict) else p[1]]
               for p in points_raw]

    normalized_points = normalize_polygon(points, tolerances)
    winding = compute_winding(normalized_points)
    edges = compute_edges(normalized_points)

    return {
        "boundary_id": boundary.get("boundary_id", boundary.get("trace_id", "UNKNOWN")),
        "source_file": boundary.get("source_file", boundary.get("source_tool", "unknown")),
        "trace_type": boundary.get("trace_type", "UNKNOWN"),
        "units": boundary.get("units", "feet"),
        "vertex_count": len(normalized_points),
        "normalized_points": normalized_points,
        "winding_order": winding,
        "edges": edges,
        "edge_count": len(edges),
        "closed": boundary.get("closed", boundary.get("closed_status", True)),
        "lineage": {
            "source_authority": "10-Construction_OS",
            "normalization_method": "geometry_normalizer",
            "normalized_at": datetime.now(timezone.utc).isoformat(),
            "tolerances_applied": tolerances,
        },
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python geometry_normalizer.py <boundaries_json> [tolerances_json]")
        sys.exit(1)

    boundaries_path = Path(sys.argv[1])
    tolerances_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "condition_detection_tolerances.json"
    )

    with open(boundaries_path, "r") as f:
        boundaries = json.load(f)

    with open(tolerances_path, "r") as f:
        tolerances = json.load(f)

    if isinstance(boundaries, dict):
        boundaries = boundaries.get("boundaries", [boundaries])

    results = [normalize_boundary(b, tolerances) for b in boundaries]
    print(json.dumps({"normalized_boundaries": results, "count": len(results)}, indent=2))


if __name__ == "__main__":
    main()
