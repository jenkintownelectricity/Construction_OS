#!/usr/bin/env python3
"""
Condition Resolution Engine

Resolves a building condition query to the appropriate Barrett assembly primitive.

Input:  condition_type, system_type, optional wall_type
Output: Matching assembly primitive path and metadata

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from pathlib import Path


def load_assembly_index(assemblies_dir: Path) -> list:
    """Load all assembly primitives from a directory."""
    index = []
    if not assemblies_dir.exists():
        return index
    for f in sorted(assemblies_dir.glob("*.json")):
        with open(f, "r") as fh:
            data = json.load(fh)
            data["_file_path"] = str(f)
            index.append(data)
    return index


def resolve_condition(
    condition_type: str,
    system_type: str | None = None,
    wall_type: str | None = None,
    assemblies_dir: Path | None = None,
) -> dict:
    """Resolve a building condition to the best matching assembly.

    Args:
        condition_type: e.g. "parapet_termination", "roof_drain"
        system_type: e.g. "SBS Modified Bitumen" (optional filter)
        wall_type: e.g. "masonry" (optional, for future variant selection)
        assemblies_dir: Path to assemblies directory

    Returns:
        Resolution result with matched assembly or fail-closed reason.
    """
    if assemblies_dir is None:
        assemblies_dir = Path(__file__).resolve().parent.parent / "assemblies" / "barrett"

    index = load_assembly_index(assemblies_dir)

    if not index:
        return {
            "resolved": False,
            "status": "FAIL_CLOSED",
            "reason": "No assembly primitives found in index",
            "condition_type": condition_type,
            "system_type": system_type,
            "matched_assembly": None,
        }

    # Filter by condition_type
    candidates = [a for a in index if a.get("condition_type") == condition_type]

    if not candidates:
        return {
            "resolved": False,
            "status": "FAIL_CLOSED",
            "reason": f"No assembly matches condition_type '{condition_type}'",
            "condition_type": condition_type,
            "system_type": system_type,
            "matched_assembly": None,
            "available_conditions": sorted(set(a.get("condition_type", "") for a in index)),
        }

    # Filter by system_type if provided
    if system_type:
        system_matches = [a for a in candidates if a.get("system_type") == system_type]
        if system_matches:
            candidates = system_matches

    # Select best match (prefer complete assemblies with more components)
    best = max(candidates, key=lambda a: len(a.get("components", [])))

    return {
        "resolved": True,
        "status": "RESOLVED",
        "condition_type": condition_type,
        "system_type": system_type or best.get("system_type"),
        "matched_assembly": {
            "assembly_id": best.get("assembly_id", best.get("detail_id")),
            "manufacturer": best.get("manufacturer_name", best.get("manufacturer")),
            "system_family": best.get("system_type", best.get("system_family")),
            "condition_type": best.get("condition_type"),
            "variant_type": best.get("variant_type"),
            "components_count": len(best.get("components", [])),
            "constraints_count": len(best.get("assembly_constraints", [])),
            "file_path": best.get("_file_path"),
        },
    }


def main():
    """CLI entry point for condition resolver."""
    if len(sys.argv) < 2:
        print("Usage: python condition_resolver.py <condition_type> [system_type] [assemblies_dir]")
        print("  condition_type: parapet_termination, roof_drain, pipe_penetration, etc.")
        print("  system_type:    optional filter, e.g. 'SBS Modified Bitumen'")
        print("  assemblies_dir: optional path to assemblies directory")
        sys.exit(1)

    condition_type = sys.argv[1]
    system_type = sys.argv[2] if len(sys.argv) >= 3 else None
    assemblies_dir = Path(sys.argv[3]) if len(sys.argv) >= 4 else None

    result = resolve_condition(condition_type, system_type, assemblies_dir=assemblies_dir)

    print(json.dumps(result, indent=2))

    if not result["resolved"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
