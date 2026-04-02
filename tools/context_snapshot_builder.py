#!/usr/bin/env python3
"""
Context Snapshot Builder

Aggregates all project data into a context snapshot for downstream consumption.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_json_records(directory: Path, prefix: str = "") -> list:
    records = []
    if not directory.exists():
        return records
    for f in sorted(directory.glob(f"{prefix}*.json")):
        with open(f, "r") as fh:
            records.append(json.load(fh))
    return records


def summarize_by_field(records: list, field: str) -> dict:
    counts = {}
    for r in records:
        val = r.get(field, "UNKNOWN")
        counts[val] = counts.get(val, 0) + 1
    return counts


def build_snapshot(project_dir: Path, project_id: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()

    evidence = load_json_records(project_dir / "project_evidence")
    claims = load_json_records(project_dir / "project_claims")
    postures = load_json_records(project_dir / "project_posture")
    reconciliations = load_json_records(project_dir / "project_reconciliation")

    return {
        "snapshot_id": f"CTX-{project_id}-SNAP",
        "project_id": project_id,
        "generated_at": now,
        "summary": {
            "total_documents": len(evidence),
            "total_communications": len([e for e in evidence if e.get("source_type") == "EMAIL"]),
            "total_submittals": len([e for e in evidence if e.get("source_type") == "SUBMITTAL"]),
            "total_claims": len(claims),
            "total_open_actions": len([c for c in claims if c.get("status") in ("ASSERTED", "CONTESTED")]),
            "posture_summary": summarize_by_field(postures, "posture_state"),
            "reconciliation_summary": summarize_by_field(reconciliations, "reconciliation_state"),
        },
        "lineage": {
            "source_authority": "10-Construction_OS",
            "generated_at": now,
            "generated_by": "context_snapshot_builder",
        },
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python context_snapshot_builder.py <project_output_dir> [project_id]")
        sys.exit(1)

    project_dir = Path(sys.argv[1])
    project_id = sys.argv[2] if len(sys.argv) >= 3 else "PRJ-UNKNOWN"

    snapshot = build_snapshot(project_dir, project_id)
    print(json.dumps(snapshot, indent=2))


if __name__ == "__main__":
    main()
