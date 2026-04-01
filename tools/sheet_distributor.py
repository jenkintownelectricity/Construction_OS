#!/usr/bin/env python3
"""
Sheet Distribution Engine

Generates sheet bundles from compiled detail packets, organized by
condition family for A-series detail sheet distribution.

Example sheets:
  A-601 Roof Details (parapet, edge)
  A-602 Wall Transitions (wall transition)
  A-603 Drain Conditions (drain, penetration)

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Sheet assignment rules: condition_type → sheet family
SHEET_ASSIGNMENTS = {
    "parapet_termination": {"sheet_id": "A-601", "sheet_name": "Roof Details"},
    "edge_termination": {"sheet_id": "A-601", "sheet_name": "Roof Details"},
    "roof_to_wall_transition": {"sheet_id": "A-602", "sheet_name": "Wall Transitions"},
    "roof_drain": {"sheet_id": "A-603", "sheet_name": "Drain Conditions"},
    "pipe_penetration": {"sheet_id": "A-603", "sheet_name": "Drain Conditions"},
    "expansion_joint": {"sheet_id": "A-604", "sheet_name": "Joint Conditions"},
    "curb_condition": {"sheet_id": "A-605", "sheet_name": "Curb Conditions"},
}


def load_assemblies(assemblies_dir: Path) -> list:
    """Load all assembly primitives."""
    assemblies = []
    if not assemblies_dir.exists():
        return assemblies
    for f in sorted(assemblies_dir.glob("*.json")):
        with open(f, "r") as fh:
            data = json.load(fh)
            data["_file_path"] = str(f.relative_to(assemblies_dir.parent.parent))
            assemblies.append(data)
    return assemblies


def generate_sheet_bundles(
    assemblies_dir: Path,
    output_dir: Path,
    manufacturer_id: str = "barrett",
) -> dict:
    """Generate sheet bundle JSON manifests from assembly primitives.

    Returns distribution result with sheet bundles and manifest.
    """
    assemblies = load_assemblies(assemblies_dir)

    if not assemblies:
        return {
            "distributed": False,
            "status": "FAIL_CLOSED",
            "reason": "No assembly primitives found",
            "sheets": [],
        }

    # Group assemblies into sheets
    sheets: dict = {}
    unassigned = []

    for asm in assemblies:
        condition = asm.get("condition_type", "")
        assignment = SHEET_ASSIGNMENTS.get(condition)
        if assignment:
            sheet_id = assignment["sheet_id"]
            if sheet_id not in sheets:
                sheets[sheet_id] = {
                    "sheet_id": sheet_id,
                    "sheet_name": assignment["sheet_name"],
                    "manufacturer": manufacturer_id,
                    "details": [],
                }
            sheets[sheet_id]["details"].append({
                "detail_id": asm.get("assembly_id", asm.get("detail_id", "")),
                "condition_type": condition,
                "variant_type": asm.get("variant_type", ""),
                "source_path": asm.get("_file_path", ""),
                "components_count": len(asm.get("components", [])),
            })
        else:
            unassigned.append({
                "detail_id": asm.get("assembly_id", asm.get("detail_id", "")),
                "condition_type": condition,
                "reason": "No sheet assignment rule for condition type",
            })

    # Write sheet bundle JSON files
    output_dir.mkdir(parents=True, exist_ok=True)
    written_files = []

    for sheet_id, sheet_data in sorted(sheets.items()):
        filename = f"{sheet_id.lower().replace('-', '_')}_{manufacturer_id}_sheet_bundle.json"
        output_path = output_dir / filename
        sheet_data["detail_count"] = len(sheet_data["details"])
        sheet_data["generated_at"] = datetime.now(timezone.utc).isoformat()
        sheet_data["generated_by"] = "sheet_distributor"

        with open(output_path, "w") as f:
            json.dump(sheet_data, f, indent=2)
            f.write("\n")
        written_files.append(str(output_path))

    return {
        "distributed": True,
        "status": "DISTRIBUTED",
        "sheets_generated": len(sheets),
        "total_details_assigned": sum(len(s["details"]) for s in sheets.values()),
        "unassigned_details": len(unassigned),
        "sheet_bundles": list(sheets.values()),
        "written_files": written_files,
        "unassigned": unassigned if unassigned else None,
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python sheet_distributor.py <assemblies_dir> [output_dir]")
        sys.exit(1)

    assemblies_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2]) if len(sys.argv) >= 3 else Path("output/barrett/sheets")

    result = generate_sheet_bundles(assemblies_dir, output_dir)
    print(json.dumps(result, indent=2))

    if not result["distributed"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
