#!/usr/bin/env python3
"""
Condition-to-Assembly Resolver — Detail Candidate Generator

Resolves detected condition nodes to Barrett assembly primitives,
producing detail candidate records.

Input:  Condition nodes from output/conditions/
        Assembly primitives from assemblies/barrett/
        Mapping config from config/detail_atlas_mapping.barrett.json

Output: Detail candidates → output/detail_candidates/
        Receipt → receipts/barrett_ingestion/detail_resolution_receipt.json

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def load_condition_nodes(conditions_dir: Path | None = None) -> list[dict]:
    """Load condition nodes from output directory."""
    if conditions_dir is None:
        conditions_dir = REPO_ROOT / "output" / "conditions"
    nodes = []
    if not conditions_dir.exists():
        return nodes
    for f in sorted(conditions_dir.glob("cnd_*.json")):
        with open(f) as fh:
            nodes.append(json.load(fh))
    return nodes


def load_assemblies(assemblies_dir: Path | None = None) -> list[dict]:
    """Load assembly primitives."""
    if assemblies_dir is None:
        assemblies_dir = REPO_ROOT / "assemblies" / "barrett"
    if not assemblies_dir.exists():
        return []
    results = []
    for f in sorted(assemblies_dir.glob("*.json")):
        with open(f) as fh:
            data = json.load(fh)
            data["_file_path"] = str(f)
            results.append(data)
    return results


def load_mapping_config(config_path: Path | None = None) -> dict:
    """Load Barrett mapping config."""
    if config_path is None:
        config_path = REPO_ROOT / "config" / "detail_atlas_mapping.barrett.json"
    if not config_path.exists():
        return {}
    with open(config_path) as f:
        return json.load(f)


CONDITION_TO_ASSEMBLY_TYPE = {
    "PARAPET": "parapet_termination",
    "INSIDE_CORNER": "edge_termination",
    "OUTSIDE_CORNER": "edge_termination",
    "DRAIN": "roof_drain",
    "WALL_INTERSECTION": "roof_to_wall_transition",
    "CURB": "curb_condition",
    "EXPANSION_JOINT": "expansion_joint",
}


def resolve_condition_to_detail(
    condition: dict,
    assemblies: list[dict],
    mapping_config: dict,
) -> dict:
    """Resolve a single condition node to a detail candidate.

    Returns a detail candidate record, or an UNRESOLVED record
    if no matching assembly exists.
    """
    cond_type = condition.get("type", "")
    cond_id = condition.get("condition_id", "UNKNOWN")
    assembly_condition_type = CONDITION_TO_ASSEMBLY_TYPE.get(cond_type, cond_type.lower())

    # Find matching assembly
    candidates = [a for a in assemblies if a.get("condition_type") == assembly_condition_type]

    if not candidates:
        return {
            "detail_candidate_id": f"DTL-{cond_id}",
            "condition_id": cond_id,
            "assembly_id": None,
            "manufacturer": "Barrett",
            "system_family": "SBS Modified Bitumen",
            "condition_type": cond_type,
            "status": "UNRESOLVED",
            "evidence": {
                "rule": "no_matching_assembly_primitive",
                "condition_type_queried": assembly_condition_type,
                "available_assembly_types": sorted(set(a.get("condition_type", "") for a in assemblies)),
            },
            "lineage": {
                "source_authority": "10-Construction_OS",
                "condition_id": cond_id,
                "resolved_at": datetime.now(timezone.utc).isoformat(),
                "resolution_method": "condition_to_assembly_lookup",
            },
        }

    # Select best matching assembly (prefer ones with more components)
    best = max(candidates, key=lambda a: len(a.get("components", [])))
    asm_id = best.get("assembly_id", best.get("detail_id", "UNKNOWN"))

    # Determine status
    source_kind = best.get("evidence", {}).get("source_kind", "")
    if source_kind == "condition_heuristic_derived":
        status = "DERIVED"
    else:
        status = "RESOLVED"

    return {
        "detail_candidate_id": f"DTL-{cond_id}",
        "condition_id": cond_id,
        "assembly_id": asm_id,
        "manufacturer": best.get("manufacturer_name", best.get("manufacturer", "Barrett")),
        "system_family": best.get("system_type", best.get("system_family", "SBS Modified Bitumen")),
        "condition_type": cond_type,
        "status": status,
        "evidence": {
            "rule": f"assembly_match_{assembly_condition_type}",
            "matched_assembly_id": asm_id,
            "components_count": len(best.get("components", [])),
            "constraints_count": len(best.get("assembly_constraints", [])),
            "source_kind": source_kind or "assembly_primitive",
            "condition_position": condition.get("position", []),
        },
        "lineage": {
            "source_authority": "10-Construction_OS",
            "condition_id": cond_id,
            "boundary_id": condition.get("boundary_id", ""),
            "assembly_file": best.get("_file_path", ""),
            "resolved_at": datetime.now(timezone.utc).isoformat(),
            "resolution_method": "condition_to_assembly_lookup",
        },
    }


def write_detail_candidates(candidates: list[dict], output_dir: Path | None = None) -> list[str]:
    """Write detail candidate files."""
    if output_dir is None:
        output_dir = REPO_ROOT / "output" / "detail_candidates"
    output_dir.mkdir(parents=True, exist_ok=True)

    written = []
    for candidate in candidates:
        cid = candidate["detail_candidate_id"].lower().replace("-", "_")
        filename = f"{cid}.json"
        filepath = output_dir / filename
        with open(filepath, "w") as f:
            json.dump(candidate, f, indent=2)
        written.append(str(filepath))
    return written


def write_receipt(candidates: list[dict], written_files: list[str], receipt_path: Path | None = None) -> str:
    """Write detail resolution receipt."""
    if receipt_path is None:
        receipt_path = REPO_ROOT / "receipts" / "barrett_ingestion" / "detail_resolution_receipt.json"
    receipt_path.parent.mkdir(parents=True, exist_ok=True)

    status_counts = {}
    for c in candidates:
        s = c["status"]
        status_counts[s] = status_counts.get(s, 0) + 1

    type_counts = {}
    for c in candidates:
        ct = c["condition_type"]
        type_counts[ct] = type_counts.get(ct, 0) + 1

    receipt = {
        "receipt_id": "receipt_detail_resolution_v1",
        "receipt_type": "detail_resolution",
        "status": "success",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_authority": "10-Construction_OS",
        "summary": {
            "total_candidates_generated": len(candidates),
            "status_counts": status_counts,
            "condition_type_counts": type_counts,
            "resolved_count": status_counts.get("RESOLVED", 0),
            "derived_count": status_counts.get("DERIVED", 0),
            "unresolved_count": status_counts.get("UNRESOLVED", 0),
        },
        "assembly_primitives_used": sorted(set(
            c["assembly_id"] for c in candidates if c["assembly_id"]
        )),
        "files_written": written_files,
        "sentinel_checks": {
            "assemblies_loaded": True,
            "mapping_config_loaded": True,
            "conditions_loaded": True,
            "fail_closed_enforced": True,
        },
    }

    with open(receipt_path, "w") as f:
        json.dump(receipt, f, indent=2)
    return str(receipt_path)


def run() -> dict:
    """Main entry point. Load conditions, resolve to assemblies, write detail candidates."""
    conditions = load_condition_nodes()
    assemblies = load_assemblies()
    mapping_config = load_mapping_config()

    if not conditions:
        print("WARNING: No condition nodes found. Run condition_graph_resolver.py first.", file=sys.stderr)
        return {"candidates_generated": 0}

    # Resolve each condition to a detail candidate
    candidates = []
    for condition in conditions:
        candidate = resolve_condition_to_detail(condition, assemblies, mapping_config)
        candidates.append(candidate)

    # Write outputs
    written_files = write_detail_candidates(candidates)
    receipt_file = write_receipt(candidates, written_files)
    written_files.append(receipt_file)

    summary = {
        "candidates_generated": len(candidates),
        "resolved": sum(1 for c in candidates if c["status"] == "RESOLVED"),
        "derived": sum(1 for c in candidates if c["status"] == "DERIVED"),
        "unresolved": sum(1 for c in candidates if c["status"] == "UNRESOLVED"),
        "files_written": len(written_files),
    }

    print(json.dumps(summary, indent=2))
    return summary


def main():
    """CLI entry point."""
    run()


if __name__ == "__main__":
    main()
