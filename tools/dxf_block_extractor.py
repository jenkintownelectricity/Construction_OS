#!/usr/bin/env python3
"""
DXF Block Extractor

Extracts block insertions (symbol instances) from DXF JSON representation.
Classifies blocks to known roofing condition types using config-driven mapping.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls

Source evidence required: DXF-to-JSON extraction output with INSERT entities.
If no INSERT entities exist, emits empty results honestly.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_config(config_path: Path) -> dict:
    """Load DXF layer semantics config."""
    with open(config_path, "r") as f:
        return json.load(f)


def classify_block(block_name: str, layer: str, config: dict) -> str:
    """Classify a DXF block insertion to a known condition/component type.

    Uses block_to_component_map and layer_to_system_map from config.
    Returns classified type or UNKNOWN if no match.
    """
    block_upper = block_name.upper()
    block_map = config.get("block_to_component_map", {})

    for pattern, mapping in block_map.items():
        if pattern.upper() in block_upper:
            return mapping.get("classified_type", "UNKNOWN")

    return "UNKNOWN"


def extract_symbol_instances(geometry_json: dict, config: dict, source_file: str) -> list:
    """Extract symbol instances from DXF JSON geometry data.

    Looks for INSERT entities in the full lens of detail_geometry output.
    """
    instances = []
    full_lens = geometry_json.get("full", {})
    entities = full_lens.get("entities", [])

    insert_entities = [e for e in entities if e.get("type") == "INSERT"]

    for idx, entity in enumerate(insert_entities):
        block_name = entity.get("block_name", entity.get("name", "UNKNOWN"))
        layer = entity.get("layer", "0")
        insertion_point = entity.get("insertion_point", entity.get("location", [0, 0]))
        rotation = entity.get("rotation", 0)
        scale = entity.get("scale", [1, 1])

        classified_type = classify_block(block_name, layer, config)

        instance = {
            "symbol_instance_id": f"SYM-{source_file}-{idx+1:04d}",
            "source_file": source_file,
            "block_name": block_name,
            "layer": layer,
            "insertion_point": insertion_point[:2] if len(insertion_point) >= 2 else [0, 0],
            "rotation_degrees": rotation,
            "scale": scale[:2] if len(scale) >= 2 else [1, 1],
            "classified_type": classified_type,
            "lineage": {
                "source_authority": "10-Construction_OS",
                "extraction_method": "dxf_block_extractor",
                "extracted_at": datetime.now(timezone.utc).isoformat(),
                "config_version": config.get("version", "unknown"),
            },
        }
        instances.append(instance)

    return instances


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python dxf_block_extractor.py <geometry_json_path> [config_path]")
        print("  If no geometry JSON with INSERT entities exists, outputs empty results.")
        sys.exit(1)

    geometry_path = Path(sys.argv[1])
    config_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "dxf_layer_semantics.barrett.json"
    )

    if not geometry_path.exists():
        print(json.dumps({"symbol_instances": [], "status": "NO_SOURCE", "reason": "Geometry JSON not found"}))
        sys.exit(0)

    with open(geometry_path, "r") as f:
        geometry_json = json.load(f)

    config = load_config(config_path) if config_path.exists() else {"block_to_component_map": {}}
    source_file = geometry_path.stem

    instances = extract_symbol_instances(geometry_json, config, source_file)
    print(json.dumps({"symbol_instances": instances, "count": len(instances)}, indent=2))


if __name__ == "__main__":
    main()
