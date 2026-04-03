#!/usr/bin/env python3
"""
build_barrett_dxf_inventory.py
==============================

Scans source/barrett/json/ directories and produces per-family inventory JSON files.

OUTPUT:
  source/barrett/inventory/  (one JSON per family + combined index)

USAGE (LOCAL OPERATOR):
  cd <repo-root>
  python tools/build_barrett_dxf_inventory.py

  To scan a custom directory:
  python tools/build_barrett_dxf_inventory.py --input-dir source/barrett/json

PREREQUISITES:
  - Raw DXF JSON files must exist under source/barrett/json/<family>/
  - These files are gitignored and local-only; the operator must have them on disk.
  - No external dependencies beyond Python 3.10+ standard library.

WHAT IT DOES:
  1. Walks source/barrett/json/ looking for *.json files grouped by family subfolder.
  2. For each file: extracts basename, family, entity count, unique layer list,
     entity type counts, and source file metadata.
  3. Writes per-family inventory files:
       source/barrett/inventory/<family>_inventory.json
  4. Writes a combined index:
       source/barrett/inventory/barrett_inventory_index.json
  5. Prints a summary to stdout.

NOTE: This tool READS raw JSON files but never modifies them.
"""

import argparse
import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def extract_file_metadata(file_path: Path, family: str) -> dict:
    """Extract inventory metadata from a single raw DXF JSON file."""
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    entities = data.get("entities", [])
    total_entities = len(entities)

    # Collect layers and entity types
    layers = []
    type_counter: Counter = Counter()
    for entity in entities:
        layer = str(entity.get("layer", "UNKNOWN")).strip() or "UNKNOWN"
        etype = str(entity.get("type", "UNKNOWN")).upper()
        layers.append(layer)
        type_counter[etype] += 1

    unique_layers = sorted(set(layers))

    # Extract metadata from the raw JSON if present
    basename = data.get("basename", file_path.stem)
    source_file = data.get("source_file", "")
    relative_source_file = data.get("relative_source_file", "")
    parse_status = data.get("parse_status", "unknown")

    return {
        "file": str(file_path).replace("\\", "/"),
        "basename": basename,
        "family": family,
        "parse_status": parse_status,
        "source_file": source_file,
        "relative_source_file": relative_source_file,
        "total_entities": total_entities,
        "layer_count": len(unique_layers),
        "unique_layers": unique_layers,
        "entity_type_counts": dict(type_counter),
    }


def detect_family(file_path: Path, input_dir: Path) -> str:
    """Detect the family name from the directory structure.

    Expects: input_dir/<family>/<file>.json
    """
    try:
        relative = file_path.relative_to(input_dir)
        parts = relative.parts
        if len(parts) >= 2:
            return parts[0]
    except ValueError:
        pass
    return "UNKNOWN"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build per-family DXF JSON inventory for Barrett."
    )
    parser.add_argument(
        "--input-dir",
        type=str,
        default="source/barrett/json",
        help="Root directory containing family subfolders of raw DXF JSON files.",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="source/barrett/inventory",
        help="Output directory for inventory JSON files.",
    )
    args = parser.parse_args()

    input_dir = Path(args.input_dir)
    output_dir = Path(args.output_dir)

    if not input_dir.exists():
        print(f"ERROR: Input directory does not exist: {input_dir}")
        print("       Ensure raw DXF JSON files are present under source/barrett/json/")
        print("       These files are gitignored and must be on your local disk.")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all JSON files
    json_files = sorted(input_dir.rglob("*.json"))
    if not json_files:
        print(f"No JSON files found under: {input_dir}")
        sys.exit(1)

    # Group by family
    families: dict[str, list[dict]] = {}
    errors: list[dict] = []

    for file_path in json_files:
        family = detect_family(file_path, input_dir)
        try:
            metadata = extract_file_metadata(file_path, family)
            families.setdefault(family, []).append(metadata)
        except Exception as exc:
            errors.append({
                "file": str(file_path).replace("\\", "/"),
                "family": family,
                "error": str(exc),
            })

    # Write per-family inventory files
    now = datetime.now(timezone.utc).isoformat()
    family_summaries = []

    for family_name in sorted(families.keys()):
        records = families[family_name]
        # Sort by basename within each family
        records.sort(key=lambda r: r["basename"])

        # Compute family-level aggregates
        all_layers: set[str] = set()
        all_entity_types: Counter = Counter()
        total_files = len(records)
        total_entities = 0
        for rec in records:
            all_layers.update(rec["unique_layers"])
            for etype, count in rec["entity_type_counts"].items():
                all_entity_types[etype] += count
            total_entities += rec["total_entities"]

        family_inventory = {
            "family": family_name,
            "generated_at": now,
            "generated_by": "build_barrett_dxf_inventory.py",
            "total_files": total_files,
            "total_entities": total_entities,
            "unique_layers_across_family": sorted(all_layers),
            "entity_type_totals": dict(all_entity_types),
            "files": records,
        }

        family_output_path = output_dir / f"{family_name}_inventory.json"
        with open(family_output_path, "w", encoding="utf-8") as f:
            json.dump(family_inventory, f, indent=2)

        print(f"  Wrote: {family_output_path}  ({total_files} files, {total_entities} entities)")

        family_summaries.append({
            "family": family_name,
            "total_files": total_files,
            "total_entities": total_entities,
            "unique_layer_count": len(all_layers),
            "inventory_file": str(family_output_path).replace("\\", "/"),
        })

    # Write combined index
    combined_index = {
        "generated_at": now,
        "generated_by": "build_barrett_dxf_inventory.py",
        "input_dir": str(input_dir).replace("\\", "/"),
        "total_families": len(families),
        "total_files": sum(s["total_files"] for s in family_summaries),
        "total_entities": sum(s["total_entities"] for s in family_summaries),
        "families": family_summaries,
        "errors": errors,
    }

    index_path = output_dir / "barrett_inventory_index.json"
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(combined_index, f, indent=2)

    # Print summary
    print(f"\n  Combined index: {index_path}")
    print(f"  Families: {len(families)}")
    print(f"  Total files: {combined_index['total_files']}")
    print(f"  Total entities: {combined_index['total_entities']}")
    if errors:
        print(f"  Errors: {len(errors)}")
        for err in errors:
            print(f"    {err['file']} -> {err['error']}")


if __name__ == "__main__":
    main()
