#!/usr/bin/env python3
"""
Symbol-to-Condition Mapper

Maps classified symbol instances to condition nodes.
Requires symbol extraction output from dxf_block_extractor.py.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls

If no symbol instances exist, emits empty results honestly.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

SYMBOL_TO_CONDITION = {
    "DRAIN": "DRAIN",
    "CURB": "CURB",
    "EXPANSION_JOINT": "EXPANSION_JOINT",
    "PENETRATION": "PENETRATION",
    "SCUPPER": "SCUPPER",
}


def map_symbols_to_conditions(symbol_instances: list, boundary_id: str) -> list:
    """Map symbol instances to condition nodes."""
    conditions = []
    for sym in symbol_instances:
        classified_type = sym.get("classified_type", "UNKNOWN")
        condition_type = SYMBOL_TO_CONDITION.get(classified_type)

        if not condition_type:
            continue

        idx = len(conditions) + 1
        conditions.append({
            "condition_id": f"CND-{boundary_id}-SYM-{idx:03d}",
            "boundary_id": boundary_id,
            "type": condition_type,
            "position": sym.get("insertion_point", [0, 0]),
            "orientation": sym.get("rotation_degrees", 0),
            "status": "DETECTED",
            "evidence": {
                "rule": "symbol_classification_match",
                "geometry_inputs": f"symbol_{sym.get('symbol_instance_id', 'unknown')}",
                "tolerances_used": {},
                "source_symbols": [sym.get("symbol_instance_id")],
                "source_polylines": [],
            },
            "lineage": {
                "source_authority": "10-Construction_OS",
                "boundary_id": boundary_id,
                "detection_method": "symbol_to_condition_mapping",
                "detected_at": datetime.now(timezone.utc).isoformat(),
            },
        })

    return conditions


def main():
    if len(sys.argv) < 3:
        print("Usage: python symbol_to_condition_mapper.py <symbol_instances_json> <boundary_id>")
        sys.exit(1)

    symbols_path = Path(sys.argv[1])
    boundary_id = sys.argv[2]

    if not symbols_path.exists():
        print(json.dumps({"conditions": [], "status": "NO_SOURCE"}))
        sys.exit(0)

    with open(symbols_path, "r") as f:
        data = json.load(f)

    instances = data.get("symbol_instances", [])
    conditions = map_symbols_to_conditions(instances, boundary_id)
    print(json.dumps({"conditions": conditions, "count": len(conditions)}, indent=2))


if __name__ == "__main__":
    main()
