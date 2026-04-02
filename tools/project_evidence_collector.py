#!/usr/bin/env python3
"""
Project Evidence Collector

Loads evidence records from a directory of JSON files, evaluates quality tier
based on source_type using evidence_quality_thresholds.json, assigns quality_tier
and confidence score, and outputs evaluated evidence records.

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls

CLI: python project_evidence_collector.py <evidence_dir> [config_path]
"""

import json
import sys
from pathlib import Path

DEFAULT_CONFIG = Path(__file__).resolve().parent.parent / "config" / "evidence_quality_thresholds.json"


def load_config(config_path: Path) -> dict:
    """Load evidence quality thresholds configuration."""
    if not config_path.exists():
        return {"error": f"Config not found: {config_path}"}
    with open(config_path, "r") as f:
        return json.load(f)


def load_evidence_records(evidence_dir: Path) -> list:
    """Load all evidence JSON files from a directory."""
    records = []
    if not evidence_dir.exists():
        return records
    for f in sorted(evidence_dir.glob("*.json")):
        try:
            with open(f, "r") as fh:
                data = json.load(fh)
                if isinstance(data, list):
                    for item in data:
                        item["_source_file"] = str(f)
                        records.append(item)
                else:
                    data["_source_file"] = str(f)
                    records.append(data)
        except (json.JSONDecodeError, OSError):
            records.append({
                "_source_file": str(f),
                "status": "FAIL_CLOSED",
                "reason": f"Failed to parse evidence file: {f.name}",
            })
    return records


def classify_evidence(record: dict, config: dict) -> dict:
    """Classify a single evidence record by quality tier."""
    source_type = record.get("source_type", "").upper()
    quality_tiers = config.get("quality_tiers", {})
    insufficient_threshold = config.get("insufficient_evidence_threshold", 0.3)
    needs_review_threshold = config.get("needs_review_threshold", 0.5)

    # Match source_type to a tier
    for tier_name, tier_def in quality_tiers.items():
        if source_type in tier_def.get("source_types", []):
            record["quality_tier"] = tier_name
            record["confidence"] = tier_def["min_confidence"]
            record["status"] = "EVALUATED"
            return record

    # No tier matched — fail closed to NEEDS_REVIEW
    record["quality_tier"] = "UNCLASSIFIED"
    record["confidence"] = insufficient_threshold
    record["status"] = "NEEDS_REVIEW"
    record["reason"] = f"Source type '{source_type}' not found in any quality tier"
    return record


def collect_and_evaluate(evidence_dir: Path, config_path: Path | None = None) -> dict:
    """Main entry point: load evidence, evaluate, return results."""
    if config_path is None:
        config_path = DEFAULT_CONFIG

    config = load_config(config_path)
    if "error" in config:
        return {"status": "FAIL_CLOSED", "reason": config["error"], "records": []}

    records = load_evidence_records(evidence_dir)
    if not records:
        return {
            "status": "FAIL_CLOSED",
            "reason": f"No evidence records found in {evidence_dir}",
            "records": [],
        }

    evaluated = [classify_evidence(r, config) for r in records]

    summary = {
        "total": len(evaluated),
        "evaluated": sum(1 for r in evaluated if r.get("status") == "EVALUATED"),
        "needs_review": sum(1 for r in evaluated if r.get("status") == "NEEDS_REVIEW"),
        "fail_closed": sum(1 for r in evaluated if r.get("status") == "FAIL_CLOSED"),
    }

    return {"status": "OK", "summary": summary, "records": evaluated}


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "FAIL_CLOSED",
            "reason": "Usage: python project_evidence_collector.py <evidence_dir> [config_path]",
        }, indent=2))
        sys.exit(1)

    evidence_dir = Path(sys.argv[1])
    config_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    result = collect_and_evaluate(evidence_dir, config_path)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["status"] == "OK" else 1)


if __name__ == "__main__":
    main()
