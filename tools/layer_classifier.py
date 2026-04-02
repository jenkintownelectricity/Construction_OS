#!/usr/bin/env python3
"""
Layer Classifier

Classifies DXF layers to roofing system families using config-driven mapping.
Produces layer classification records for downstream consumption.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def classify_layers(layers: list, config: dict, source_file: str) -> list:
    """Classify a list of DXF layer names to system families.

    Uses layer_to_system_map from the Barrett mapping config.
    """
    layer_map = config.get("layer_to_system_map", {})
    classifications = []

    for layer_name in layers:
        layer_upper = layer_name.upper()
        matched_system = None

        for pattern_group, system_family in layer_map.items():
            patterns = [p.strip().upper() for p in pattern_group.split("/")]
            for pattern in patterns:
                if pattern in layer_upper:
                    matched_system = system_family
                    break
            if matched_system:
                break

        classifications.append({
            "layer_name": layer_name,
            "classified_system": matched_system or "UNCLASSIFIED",
            "status": "CLASSIFIED" if matched_system else "UNCLASSIFIED",
            "source_file": source_file,
            "lineage": {
                "source_authority": "10-Construction_OS",
                "classification_method": "layer_to_system_map",
                "classified_at": datetime.now(timezone.utc).isoformat(),
                "config_version": config.get("version", "unknown"),
            },
        })

    return classifications


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python layer_classifier.py <layers_json_or_comma_list> [config_path]")
        sys.exit(1)

    input_arg = sys.argv[1]
    config_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "detail_atlas_mapping.barrett.json"
    )

    with open(config_path, "r") as f:
        config = json.load(f)

    # Accept either a JSON file of layers or comma-separated list
    input_path = Path(input_arg)
    if input_path.exists():
        with open(input_path, "r") as f:
            data = json.load(f)
            layers = data if isinstance(data, list) else data.get("layers", [])
    else:
        layers = [l.strip() for l in input_arg.split(",")]

    classifications = classify_layers(layers, config, source_file=input_path.stem if input_path.exists() else "cli")
    print(json.dumps({"layer_classifications": classifications, "count": len(classifications)}, indent=2))


if __name__ == "__main__":
    main()
