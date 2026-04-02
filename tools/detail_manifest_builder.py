#!/usr/bin/env python3
"""
Detail Manifest Builder

Builds compiler manifests from detail candidates and their validation results.
A manifest is the contract between the resolver and compiler.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def build_manifest(
    candidate: dict,
    validation: dict,
    assembly: dict | None,
) -> dict:
    """Build a compiler manifest for a detail candidate."""
    candidate_id = candidate.get("detail_candidate_id", "UNKNOWN")
    decision = validation.get("decision", "HALT")

    manifest = {
        "manifest_id": f"MAN-{candidate_id}",
        "detail_candidate_id": candidate_id,
        "assembly_resolution_id": candidate.get("assembly_resolution_id", f"ASR-{candidate_id}"),
        "assembly_id": candidate.get("assembly_id", ""),
        "recipe_id": candidate.get("recipe_id", ""),
        "condition_type": candidate.get("condition_type", ""),
        "manufacturer": candidate.get("manufacturer", "Barrett"),
        "system_family": candidate.get("system_family", ""),
        "validation_decision": decision,
        "target_formats": ["DXF", "PDF"] if decision != "HALT" else [],
        "geometry_context": {
            "boundary_id": candidate.get("lineage", {}).get("boundary_id", ""),
            "condition_position": candidate.get("evidence", {}).get("condition_position", [0, 0]),
        },
        "annotation_context": {
            "manufacturer_name": candidate.get("manufacturer", "Barrett"),
            "system_type": candidate.get("system_family", ""),
            "condition_type": candidate.get("condition_type", ""),
        },
        "lineage": {
            "source_authority": "10-Construction_OS",
            "built_by": "detail_manifest_builder",
            "built_at": datetime.now(timezone.utc).isoformat(),
            "validation_id": validation.get("validation_id", ""),
        },
    }
    return manifest


def main():
    if len(sys.argv) < 3:
        print("Usage: python detail_manifest_builder.py <candidates_dir> <validation_results_json> [assemblies_dir]")
        sys.exit(1)

    candidates_dir = Path(sys.argv[1])
    validation_path = Path(sys.argv[2])
    assemblies_dir = (
        Path(sys.argv[3])
        if len(sys.argv) >= 4
        else Path(__file__).resolve().parent.parent / "assemblies" / "barrett"
    )

    with open(validation_path, "r") as f:
        validations_data = json.load(f)

    validations = {v["detail_candidate_id"]: v for v in validations_data.get("validation_results", [])}

    manifests = []
    for f_path in sorted(candidates_dir.glob("dtl_*.json")):
        with open(f_path, "r") as fh:
            candidate = json.load(fh)

        cid = candidate.get("detail_candidate_id", "UNKNOWN")
        validation = validations.get(cid, {"decision": "HALT", "validation_id": "NONE"})

        # Load assembly if available
        assembly = None
        assembly_id = candidate.get("assembly_id", "")
        for asm_path in assemblies_dir.glob("*.json"):
            with open(asm_path, "r") as afh:
                asm = json.load(afh)
                if asm.get("assembly_id") == assembly_id:
                    assembly = asm
                    break

        manifest = build_manifest(candidate, validation, assembly)
        manifests.append(manifest)

    print(json.dumps({"manifests": manifests, "count": len(manifests)}, indent=2))


if __name__ == "__main__":
    main()
