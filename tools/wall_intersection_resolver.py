#!/usr/bin/env python3
"""
Wall Intersection Resolver

Detects WALL_INTERSECTION conditions by cross-referencing wall centerline
traces with boundary outline geometry.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls

Source evidence required: WALL_CENTERLINE trace type data.
If no wall centerline data exists, emits empty results honestly.
"""

import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path


def find_wall_intersections(
    boundary_points: list,
    wall_centerlines: list,
    tolerances: dict,
    boundary_id: str,
) -> list:
    """Find where wall centerlines intersect boundary edges."""
    conditions = []
    merge_tol = tolerances.get("vertex_merge_tolerance_units", 0.25)

    for wall_idx, wall in enumerate(wall_centerlines):
        wall_points = wall.get("points", wall.get("polyline_points", []))
        if len(wall_points) < 2:
            continue

        for wp in wall_points:
            wx = wp[0] if isinstance(wp, (list, tuple)) else wp.get("x", 0)
            wy = wp[1] if isinstance(wp, (list, tuple)) else wp.get("y", 0)

            # Check proximity to boundary edges
            n = len(boundary_points)
            for i in range(n):
                j = (i + 1) % n
                bx1, by1 = boundary_points[i]
                bx2, by2 = boundary_points[j]

                # Point-to-segment distance
                dx, dy = bx2 - bx1, by2 - by1
                seg_len_sq = dx * dx + dy * dy
                if seg_len_sq < 1e-10:
                    continue

                t = max(0, min(1, ((wx - bx1) * dx + (wy - by1) * dy) / seg_len_sq))
                proj_x = bx1 + t * dx
                proj_y = by1 + t * dy
                dist = math.sqrt((wx - proj_x) ** 2 + (wy - proj_y) ** 2)

                if dist <= merge_tol * 4:
                    idx = len(conditions) + 1
                    conditions.append({
                        "condition_id": f"CND-{boundary_id}-WALL-{idx:03d}",
                        "boundary_id": boundary_id,
                        "type": "WALL_INTERSECTION",
                        "position": [round(proj_x, 4), round(proj_y, 4)],
                        "orientation": round(math.degrees(math.atan2(dy, dx)), 2),
                        "status": "DETECTED",
                        "evidence": {
                            "rule": "wall_centerline_boundary_proximity",
                            "geometry_inputs": f"wall_{wall_idx}_edge_{i}",
                            "tolerances_used": {"proximity_threshold": merge_tol * 4},
                            "source_symbols": [],
                            "source_polylines": [wall.get("trace_id", f"wall_{wall_idx}")],
                        },
                        "lineage": {
                            "source_authority": "10-Construction_OS",
                            "boundary_id": boundary_id,
                            "detection_method": "wall_intersection_resolver",
                            "detected_at": datetime.now(timezone.utc).isoformat(),
                        },
                    })
                    break  # One condition per wall point per boundary

    return conditions


def main():
    if len(sys.argv) < 3:
        print("Usage: python wall_intersection_resolver.py <boundaries_json> <wall_centerlines_json>")
        sys.exit(1)

    boundaries_path = Path(sys.argv[1])
    walls_path = Path(sys.argv[2])

    if not walls_path.exists():
        print(json.dumps({
            "conditions": [],
            "count": 0,
            "status": "NO_SOURCE_EVIDENCE",
            "reason": "No wall centerline data found",
        }))
        sys.exit(0)

    with open(boundaries_path, "r") as f:
        boundaries_data = json.load(f)

    with open(walls_path, "r") as f:
        walls_data = json.load(f)

    tolerances_path = Path(__file__).resolve().parent.parent / "config" / "condition_detection_tolerances.json"
    with open(tolerances_path, "r") as f:
        tolerances = json.load(f)

    boundaries = boundaries_data if isinstance(boundaries_data, list) else boundaries_data.get("boundaries", [])
    walls = walls_data if isinstance(walls_data, list) else walls_data.get("wall_centerlines", [])

    all_conditions = []
    for boundary in boundaries:
        bid = boundary.get("boundary_id", boundary.get("trace_id", "UNKNOWN"))
        points_raw = boundary.get("points", boundary.get("polyline_points", []))
        points = []
        for p in points_raw:
            if isinstance(p, dict):
                points.append([p.get("x", 0), p.get("y", 0)])
            elif isinstance(p, (list, tuple)):
                points.append([p[0], p[1]])
        all_conditions.extend(find_wall_intersections(points, walls, tolerances, bid))

    print(json.dumps({"conditions": all_conditions, "count": len(all_conditions)}, indent=2))


if __name__ == "__main__":
    main()
