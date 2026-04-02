#!/usr/bin/env python3
"""
Detail Library Admitter

Admits compiled detail artifacts into the detail library.
Only COMPILED artifacts become library records. BLOCKED artifacts are rejected.
PROVISIONAL artifacts are marked clearly.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def admit_artifact(artifact: dict) -> dict | None:
    """Evaluate an artifact for library admission.

    Returns a library record or None if rejected.
    """
    status = artifact.get("status", "BLOCKED")
    artifact_id = artifact.get("artifact_id", "UNKNOWN")

    if status == "BLOCKED":
        return None  # Reject — no library entry from blocked compile

    admission_status = "ADMITTED" if status == "COMPILED" else "PROVISIONAL"

    return {
        "library_record_id": f"LIB-{artifact_id}",
        "artifact_id": artifact_id,
        "detail_candidate_id": artifact.get("detail_candidate_id", ""),
        "manufacturer": artifact.get("manufacturer", "Barrett"),
        "system_family": artifact.get("system_family", ""),
        "condition_type": artifact.get("condition_type", ""),
        "assembly_id": artifact.get("assembly_id", ""),
        "artifact_path": artifact.get("artifact_path", ""),
        "artifact_format": artifact.get("format", "PDF"),
        "admission_status": admission_status,
        "lineage": {
            "source_authority": "10-Construction_OS",
            "admitted_by": "detail_library_admitter",
            "admitted_at": datetime.now(timezone.utc).isoformat(),
            "manifest_id": artifact.get("manifest_id", ""),
            "receipt_id": artifact.get("receipt_id", ""),
        },
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python detail_library_admitter.py <compiled_artifacts_dir>")
        sys.exit(1)

    artifacts_dir = Path(sys.argv[1])
    records = []
    rejected = 0

    for f in sorted(artifacts_dir.glob("art_*.json")):
        with open(f, "r") as fh:
            artifact = json.load(fh)
        record = admit_artifact(artifact)
        if record:
            records.append(record)
        else:
            rejected += 1

    output = {
        "library_records": records,
        "admitted_count": len(records),
        "rejected_count": rejected,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
