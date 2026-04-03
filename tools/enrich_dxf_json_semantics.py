#!/usr/bin/env python3
"""
enrich_dxf_json_semantics.py
============================

Reads a raw DXF JSON file and produces an additive *.semantic.json enrichment file.
NEVER modifies the raw JSON.

OUTPUT:
  source/barrett/json_semantic/<family>/<basename>.semantic.json

USAGE (LOCAL OPERATOR):
  cd <repo-root>

  # Enrich a single file:
  python tools/enrich_dxf_json_semantics.py \\
      --input source/barrett/json/RamProof_GC/some_detail.json \\
      --family RamProof_GC

  # Enrich all files in a family directory:
  python tools/enrich_dxf_json_semantics.py \\
      --input-dir source/barrett/json/RamProof_GC/ \\
      --family RamProof_GC

  # Override output directory:
  python tools/enrich_dxf_json_semantics.py \\
      --input source/barrett/json/RamProof_GC/some_detail.json \\
      --family RamProof_GC \\
      --output-dir source/barrett/json_semantic/RamProof_GC

PREREQUISITES:
  - Raw DXF JSON files must exist (gitignored, local-only).
  - Config files must be present:
      config/barrett_layer_semantic_map.json
      config/barrett_ownership_role_map.json
      config/barrett_entity_type_defaults.json
  - No external dependencies beyond Python 3.10+ standard library.

DESIGN:
  - All enrichment is ADDITIVE. Raw JSON is read but never written to.
  - Output conforms to schemas/dxf_entity_semantic_enrichment.schema.json
  - Classification priority:
      1. Entity type defaults (TEXT/MTEXT/MULTILEADER/DIMENSION -> ANNOTATION always)
      2. Exact layer name match from semantic map
      3. Regex layer pattern match from semantic map
      4. Fallback default (CONTEXT_ONLY / unclassified_context)
  - Each entity gets a classification_basis and confidence score.
"""

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

# --------------------------------------------------------------------------- #
# Constants
# --------------------------------------------------------------------------- #

ENRICHMENT_VERSION = "0.2.0"
TOOL_NAME = "enrich_dxf_json_semantics.py"
SOURCE_AUTHORITY = "10-Construction_OS"

# Config file paths (relative to repo root)
SEMANTIC_MAP_PATH = Path("config/barrett_layer_semantic_map.json")
OWNERSHIP_MAP_PATH = Path("config/barrett_ownership_role_map.json")
ENTITY_DEFAULTS_PATH = Path("config/barrett_entity_type_defaults.json")

# --------------------------------------------------------------------------- #
# Config loading
# --------------------------------------------------------------------------- #


def load_json(path: Path) -> dict:
    """Load a JSON file and return the parsed dict."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_configs() -> tuple[dict, dict, dict]:
    """Load the three config files needed for enrichment.

    Returns (semantic_map, ownership_map, entity_defaults).
    """
    missing = []
    for p in [SEMANTIC_MAP_PATH, OWNERSHIP_MAP_PATH, ENTITY_DEFAULTS_PATH]:
        if not p.exists():
            missing.append(str(p))
    if missing:
        print("ERROR: Missing config files:")
        for m in missing:
            print(f"  {m}")
        sys.exit(1)

    semantic_map = load_json(SEMANTIC_MAP_PATH)
    ownership_map = load_json(OWNERSHIP_MAP_PATH)
    entity_defaults = load_json(ENTITY_DEFAULTS_PATH)
    return semantic_map, ownership_map, entity_defaults


# --------------------------------------------------------------------------- #
# Classification logic
# --------------------------------------------------------------------------- #


def classify_by_entity_type(
    entity_type: str, entity_defaults: dict
) -> tuple[str, str, str, float] | None:
    """Check if entity type has a hard default (e.g., TEXT -> ANNOTATION).

    Returns (semantic_role, ownership_role, classification_basis, confidence)
    or None if entity type should be classified by layer.
    """
    defaults = entity_defaults.get("entity_type_defaults", {})
    entry = defaults.get(entity_type)
    if entry is None:
        return None

    ownership = entry.get("ownership_role", "CLASSIFY_BY_LAYER")
    if ownership == "CLASSIFY_BY_LAYER":
        return None

    semantic_role = entry.get("semantic_role", "annotation")
    return (semantic_role, ownership, "ENTITY_TYPE_DEFAULT", 1.0)


def classify_by_layer_exact(
    layer_name: str, semantic_map: dict
) -> tuple[str, str, str, float] | None:
    """Check for an exact layer name match in the semantic map.

    Returns (semantic_role, ownership_role, classification_basis, confidence)
    or None if no exact match.
    """
    layers = semantic_map.get("layers", {})
    entry = layers.get(layer_name)
    if entry is None:
        return None

    return (
        entry["semantic_role"],
        entry["ownership_role"],
        "LAYER_EXACT_MATCH",
        entry.get("confidence", 0.9),
    )


def classify_by_layer_pattern(
    layer_name: str, semantic_map: dict
) -> tuple[str, str, str, float] | None:
    """Check layer name against regex patterns in the semantic map.

    Returns (semantic_role, ownership_role, classification_basis, confidence)
    or None if no pattern matches.
    """
    patterns = semantic_map.get("layer_patterns", [])
    layer_lower = layer_name.lower()

    for pat_entry in patterns:
        pattern = pat_entry["pattern"]
        try:
            if re.search(pattern, layer_lower, re.IGNORECASE):
                return (
                    pat_entry["semantic_role"],
                    pat_entry["ownership_role"],
                    "LAYER_PATTERN_MATCH",
                    pat_entry.get("confidence", 0.7),
                )
        except re.error:
            continue

    return None


def classify_entity(
    entity: dict,
    semantic_map: dict,
    entity_defaults: dict,
) -> tuple[str, str, str, float]:
    """Classify a single entity.

    Priority:
      1. Entity type default (hard rules for ANNOTATION types)
      2. Exact layer name match
      3. Regex layer pattern match
      4. Fallback default

    Returns (semantic_role, ownership_role, classification_basis, confidence).
    """
    entity_type = str(entity.get("type", "UNKNOWN")).upper()
    layer_name = str(entity.get("layer", "")).strip()

    # 1. Entity type defaults (ANNOTATION types are hard-locked)
    result = classify_by_entity_type(entity_type, entity_defaults)
    if result is not None:
        return result

    # 2. Exact layer match
    result = classify_by_layer_exact(layer_name, semantic_map)
    if result is not None:
        return result

    # 3. Pattern match
    result = classify_by_layer_pattern(layer_name, semantic_map)
    if result is not None:
        return result

    # 4. Fallback
    fallback = semantic_map.get("fallback", {})
    return (
        fallback.get("semantic_role", "unclassified_context"),
        fallback.get("ownership_role", "CONTEXT_ONLY"),
        "FALLBACK_DEFAULT",
        fallback.get("confidence", 0.5),
    )


# --------------------------------------------------------------------------- #
# Enrichment
# --------------------------------------------------------------------------- #


def enrich_file(
    input_path: Path,
    family: str,
    semantic_map: dict,
    ownership_map: dict,
    entity_defaults: dict,
) -> dict:
    """Enrich a single raw DXF JSON file.

    Returns the enrichment dict conforming to the semantic enrichment schema.
    """
    raw = load_json(input_path)
    entities = raw.get("entities", [])

    enriched_entities = []
    role_counter: Counter = Counter()
    ownership_counter: Counter = Counter()
    type_counter: Counter = Counter()
    layers_seen: set[str] = set()
    unclassified_count = 0

    for idx, entity in enumerate(entities):
        entity_type = str(entity.get("type", "UNKNOWN")).upper()
        layer_name = str(entity.get("layer", "")).strip()

        semantic_role, ownership_role, basis, confidence = classify_entity(
            entity, semantic_map, entity_defaults
        )

        enriched_entities.append({
            "entity_index": idx,
            "entity_type": entity_type,
            "layer_name": layer_name,
            "semantic_role": semantic_role,
            "ownership_role": ownership_role,
            "classification_basis": basis,
            "confidence": confidence,
            "operator_confirmed": False,
        })

        role_counter[semantic_role] += 1
        ownership_counter[ownership_role] += 1
        type_counter[entity_type] += 1
        layers_seen.add(layer_name)

        if basis == "FALLBACK_DEFAULT":
            unclassified_count += 1

    # Build summary
    summary = {
        "total_entities": len(entities),
        "system_owned_count": ownership_counter.get("SYSTEM_OWNED", 0),
        "context_only_count": ownership_counter.get("CONTEXT_ONLY", 0),
        "annotation_count": ownership_counter.get("ANNOTATION", 0),
        "unclassified_count": unclassified_count,
        "unique_layers": sorted(layers_seen),
        "entity_type_counts": dict(type_counter),
        "role_counts": dict(role_counter),
    }

    # Build lineage
    original_dxf = raw.get("source_file", raw.get("relative_source_file", ""))
    lineage = {
        "source_authority": SOURCE_AUTHORITY,
        "enrichment_tool": TOOL_NAME,
        "enrichment_tool_version": ENRICHMENT_VERSION,
        "enriched_at": datetime.now(timezone.utc).isoformat(),
        "enriched_by": "local_operator",
        "config_files_used": [
            str(SEMANTIC_MAP_PATH),
            str(OWNERSHIP_MAP_PATH),
            str(ENTITY_DEFAULTS_PATH),
        ],
        "original_dxf_path": original_dxf,
    }

    return {
        "source_file": str(input_path).replace("\\", "/"),
        "enrichment_version": ENRICHMENT_VERSION,
        "family": family,
        "entities": enriched_entities,
        "summary": summary,
        "lineage": lineage,
    }


# --------------------------------------------------------------------------- #
# Output
# --------------------------------------------------------------------------- #


def write_enrichment(enrichment: dict, output_path: Path) -> None:
    """Write the enrichment dict to a *.semantic.json file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(enrichment, f, indent=2)


def print_summary(enrichment: dict, output_path: Path) -> None:
    """Print a human-readable summary of the enrichment."""
    s = enrichment["summary"]
    print(f"  Source:          {enrichment['source_file']}")
    print(f"  Family:          {enrichment['family']}")
    print(f"  Output:          {output_path}")
    print(f"  Total entities:  {s['total_entities']}")
    print(f"  SYSTEM_OWNED:    {s['system_owned_count']}")
    print(f"  CONTEXT_ONLY:    {s['context_only_count']}")
    print(f"  ANNOTATION:      {s['annotation_count']}")
    print(f"  Unclassified:    {s['unclassified_count']}")
    print(f"  Unique layers:   {s['unique_layers']}")
    print()


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Produce additive semantic enrichment for Barrett DXF JSON files."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--input",
        type=str,
        help="Path to a single raw DXF JSON file.",
    )
    group.add_argument(
        "--input-dir",
        type=str,
        help="Path to a directory of raw DXF JSON files (processes all *.json).",
    )
    parser.add_argument(
        "--family",
        type=str,
        required=True,
        help="Barrett product family name (e.g., RamProof_GC, Black_Pearl, PMMA, RT-250).",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=None,
        help="Output directory. Default: source/barrett/json_semantic/<family>/",
    )
    args = parser.parse_args()

    family = args.family

    # Determine output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        output_dir = Path("source/barrett/json_semantic") / family

    # Load configs
    semantic_map, ownership_map, entity_defaults = load_configs()

    # Collect input files
    input_files: list[Path] = []
    if args.input:
        p = Path(args.input)
        if not p.exists():
            print(f"ERROR: Input file does not exist: {p}")
            sys.exit(1)
        input_files.append(p)
    else:
        p = Path(args.input_dir)
        if not p.exists():
            print(f"ERROR: Input directory does not exist: {p}")
            sys.exit(1)
        input_files = sorted(p.glob("*.json"))
        if not input_files:
            print(f"No *.json files found in: {p}")
            sys.exit(1)

    print(f"Enriching {len(input_files)} file(s) for family '{family}'")
    print(f"Output directory: {output_dir}")
    print()

    # Process each file
    total_enriched = 0
    total_entities = 0
    errors: list[str] = []

    for input_path in input_files:
        try:
            enrichment = enrich_file(
                input_path, family, semantic_map, ownership_map, entity_defaults
            )
            output_path = output_dir / f"{input_path.stem}.semantic.json"
            write_enrichment(enrichment, output_path)
            print_summary(enrichment, output_path)
            total_enriched += 1
            total_entities += enrichment["summary"]["total_entities"]
        except Exception as exc:
            msg = f"ERROR processing {input_path}: {exc}"
            print(msg)
            errors.append(msg)

    # Final summary
    print("=" * 60)
    print(f"Enrichment complete.")
    print(f"  Files enriched:  {total_enriched}")
    print(f"  Total entities:  {total_entities}")
    print(f"  Errors:          {len(errors)}")
    if errors:
        for e in errors:
            print(f"    {e}")


if __name__ == "__main__":
    main()
