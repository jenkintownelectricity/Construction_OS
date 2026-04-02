#!/usr/bin/env python3
"""
Spatial Index Builder

Builds a spatial index for Atlas-scale retrieval of boundaries, conditions,
assembly resolutions, and compiled artifacts.

The spatial index does NOT own truth — it is derived from admitted outputs only.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def build_spatial_index(
    conditions_dir: Path,
    candidates_dir: Path,
    resolutions_dir: Path,
    artifacts_dir: Path,
) -> dict:
    """Build spatial index from condition, candidate, resolution, and artifact data."""
    entries = []

    # Index condition nodes
    for f in sorted(conditions_dir.glob("cnd_*.json")):
        with open(f, "r") as fh:
            cnd = json.load(fh)
        entries.append({
            "entry_type": "condition",
            "id": cnd.get("condition_id"),
            "boundary_id": cnd.get("boundary_id"),
            "position": cnd.get("position", [0, 0]),
            "condition_type": cnd.get("type"),
            "status": cnd.get("status"),
        })

    # Index detail candidates
    for f in sorted(candidates_dir.glob("dtl_*.json")):
        with open(f, "r") as fh:
            dtl = json.load(fh)
        entries.append({
            "entry_type": "detail_candidate",
            "id": dtl.get("detail_candidate_id"),
            "condition_id": dtl.get("condition_id"),
            "boundary_id": dtl.get("lineage", {}).get("boundary_id"),
            "assembly_id": dtl.get("assembly_id"),
            "condition_type": dtl.get("condition_type"),
            "status": dtl.get("status"),
        })

    # Index assembly resolutions
    for f in sorted(resolutions_dir.glob("asr_*.json")):
        with open(f, "r") as fh:
            asr = json.load(fh)
        entries.append({
            "entry_type": "assembly_resolution",
            "id": asr.get("assembly_resolution_id"),
            "condition_id": asr.get("condition_id"),
            "assembly_id": asr.get("selected_assembly_id"),
            "status": asr.get("status"),
        })

    # Index compiled artifacts
    for f in sorted(artifacts_dir.glob("art_*.json")):
        with open(f, "r") as fh:
            art = json.load(fh)
        entries.append({
            "entry_type": "compiled_artifact",
            "id": art.get("artifact_id"),
            "detail_candidate_id": art.get("detail_candidate_id"),
            "format": art.get("format"),
            "status": art.get("status"),
            "artifact_path": art.get("artifact_path"),
        })

    return {
        "spatial_index_id": "spatial_index_v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_authority": "10-Construction_OS",
        "entry_count": len(entries),
        "entries": entries,
        "lineage": {
            "source_authority": "10-Construction_OS",
            "built_by": "spatial_index_builder",
            "note": "Derived index only — no truth ownership",
        },
    }


def main():
    base = Path(__file__).resolve().parent.parent
    conditions_dir = base / "output" / "conditions"
    candidates_dir = base / "output" / "detail_candidates"
    resolutions_dir = base / "output" / "assembly_resolutions"
    artifacts_dir = base / "output" / "compiled_details"

    index = build_spatial_index(conditions_dir, candidates_dir, resolutions_dir, artifacts_dir)
    print(json.dumps(index, indent=2))


if __name__ == "__main__":
    main()
