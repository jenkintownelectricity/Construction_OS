#!/usr/bin/env python3
"""
Polyline Semantic Classifier

Classifies DXF polylines to semantic categories (PARAPET_LINE, ROOF_EDGE,
WALL_TRANSITION, JOINT_LINE) based on layer name and geometric properties.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls

Source evidence required: DXF-to-JSON with LWPOLYLINE/POLYLINE entities.
If no polyline entities exist, emits empty results honestly.
"""

import json
import math
import sys
from datetime import datetime, timezone
from pathlib import Path


LAYER_SEMANTIC_MAP = {
    "PARAPET": "PARAPET_LINE",
    "WALL": "WALL_TRANSITION",
    "COPING": "PARAPET_LINE",
    "EDGE": "ROOF_EDGE",
    "ROOF": "ROOF_EDGE",
    "EXPANSION": "JOINT_LINE",
    "JOINT": "JOINT_LINE",
    "CONTROL": "JOINT_LINE",
    "FLASHING": "PARAPET_LINE",
    "TRANSITION": "WALL_TRANSITION",
}


def classify_polyline_semantic(layer: str, points: list, config: dict) -> str:
    """Classify polyline semantic based on layer name and geometry."""
    layer_upper = layer.upper()

    # Check layer-based classification first
    custom_map = config.get("polyline_layer_semantic_map", {})
    for pattern, semantic in {**LAYER_SEMANTIC_MAP, **custom_map}.items():
        if pattern.upper() in layer_upper:
            return semantic

    return "UNKNOWN"


def compute_polyline_length(points: list) -> float:
    """Compute total polyline length."""
    total = 0
    for i in range(len(points) - 1):
        dx = points[i + 1][0] - points[i][0]
        dy = points[i + 1][1] - points[i][1]
        total += math.sqrt(dx * dx + dy * dy)
    return round(total, 4)


def extract_polyline_semantics(geometry_json: dict, config: dict, source_file: str) -> list:
    """Extract and classify polylines from DXF JSON geometry data."""
    results = []
    full_lens = geometry_json.get("full", {})
    entities = full_lens.get("entities", [])

    # Also check spatial lens
    spatial = geometry_json.get("spatial", {})
    spatial_entities = spatial.get("geometry", [])

    polyline_entities = [
        e for e in entities
        if e.get("type") in ("LWPOLYLINE", "POLYLINE")
    ]

    for idx, entity in enumerate(polyline_entities):
        layer = entity.get("layer", "0")
        points_raw = entity.get("points", entity.get("vertices", []))
        points = []
        for p in points_raw:
            if isinstance(p, dict):
                points.append([p.get("x", 0), p.get("y", 0)])
            elif isinstance(p, (list, tuple)) and len(p) >= 2:
                points.append([p[0], p[1]])

        classified = classify_polyline_semantic(layer, points, config)
        length = compute_polyline_length(points)

        results.append({
            "polyline_id": f"PLY-{source_file}-{idx+1:04d}",
            "source_file": source_file,
            "layer": layer,
            "points": points,
            "classified_semantic": classified,
            "length": length,
            "vertex_count": len(points),
            "closed": entity.get("closed", False),
            "evidence": {
                "classification_method": "layer_pattern_match",
                "matched_pattern": layer,
            },
            "lineage": {
                "source_authority": "10-Construction_OS",
                "extraction_method": "polyline_semantic_classifier",
                "extracted_at": datetime.now(timezone.utc).isoformat(),
                "config_version": config.get("version", "unknown"),
            },
        })

    return results


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python polyline_semantic_classifier.py <geometry_json_path> [config_path]")
        print("  If no polyline entities exist, outputs empty results.")
        sys.exit(1)

    geometry_path = Path(sys.argv[1])
    config_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "dxf_layer_semantics.barrett.json"
    )

    if not geometry_path.exists():
        print(json.dumps({"polyline_semantics": [], "status": "NO_SOURCE"}))
        sys.exit(0)

    with open(geometry_path, "r") as f:
        geometry_json = json.load(f)

    config = load_config(config_path) if config_path.exists() else {}
    source_file = geometry_path.stem

    results = extract_polyline_semantics(geometry_json, config, source_file)
    print(json.dumps({"polyline_semantics": results, "count": len(results)}, indent=2))


def load_config(path: Path) -> dict:
    with open(path, "r") as f:
        return json.load(f)


if __name__ == "__main__":
    main()
