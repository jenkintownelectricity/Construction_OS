#!/usr/bin/env python3
"""
Posture Detector

Loads project records (claims, evidence, submittals, documents, action items)
and applies posture_classification_rules.json to produce posture records
for each detected topic.

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls

CLI: python posture_detector.py <project_data_dir> [rules_path]
"""

import json
import sys
from pathlib import Path

DEFAULT_RULES = Path(__file__).resolve().parent.parent / "config" / "posture_classification_rules.json"

SUBDIRS = ["claims", "evidence", "submittals", "documents", "action_items"]


def load_json_dir(directory: Path) -> list:
    """Load all JSON records from a directory."""
    records = []
    if not directory.exists():
        return records
    for f in sorted(directory.glob("*.json")):
        try:
            with open(f, "r") as fh:
                data = json.load(fh)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    item["_source_file"] = str(f)
                    item["_record_type"] = directory.name
                    records.append(item)
        except (json.JSONDecodeError, OSError):
            pass
    return records


def load_rules(rules_path: Path) -> dict:
    """Load posture classification rules."""
    if not rules_path.exists():
        return {"error": f"Rules not found: {rules_path}"}
    with open(rules_path, "r") as f:
        return json.load(f)


def gather_project_data(project_dir: Path) -> dict:
    """Load all project data subdirectories into a unified structure."""
    data = {}
    for subdir in SUBDIRS:
        data[subdir] = load_json_dir(project_dir / subdir)
    return data


def extract_topics(project_data: dict) -> set:
    """Extract unique topics from all project records."""
    topics = set()
    for records in project_data.values():
        for r in records:
            topic = r.get("topic", r.get("subject", ""))
            if topic:
                topics.add(topic)
    return topics


def records_for_topic(project_data: dict, topic: str) -> dict:
    """Filter project data to records matching a topic."""
    filtered = {}
    for category, records in project_data.items():
        filtered[category] = [
            r for r in records
            if r.get("topic", r.get("subject", "")) == topic
        ]
    return filtered


def evaluate_conditions(topic_data: dict) -> dict:
    """Evaluate boolean signal conditions from topic data."""
    claims = topic_data.get("claims", [])
    evidence = topic_data.get("evidence", [])
    submittals = topic_data.get("submittals", [])
    action_items = topic_data.get("action_items", [])

    has_claims = len(claims) > 0
    has_evidence = len(evidence) > 0
    has_contested = any(c.get("evaluation_status") == "CONTESTED" for c in claims)
    has_evidenced = all(c.get("evaluation_status") == "EVIDENCED" for c in claims) if claims else False
    has_contradicting = any(e.get("disposition") == "CONTRADICTS" for e in evidence)
    has_legal = any(r.get("type", "").upper() in ("LEGAL_NOTICE", "FORMAL_DISPUTE") for r in claims + action_items)
    has_rejections = any(r.get("disposition", "").upper() == "REJECTED" for r in submittals + claims)
    has_open_blocking = any(
        r.get("status", "").upper() in ("OPEN", "PENDING") and r.get("blocking", False)
        for r in action_items + submittals
    )
    inspections_passed = any(
        e.get("source_type", "").upper() == "INSPECTION_REPORT" and e.get("result", "").upper() == "PASS"
        for e in evidence
    )
    failed_inspections = any(
        e.get("source_type", "").upper() == "INSPECTION_REPORT" and e.get("result", "").upper() == "FAIL"
        for e in evidence
    )

    return {
        "has_claims": has_claims,
        "has_evidence": has_evidence,
        "has_contested": has_contested,
        "all_claims_evidenced": has_evidenced,
        "has_contradicting_evidence": has_contradicting,
        "has_legal_notices": has_legal,
        "has_rejections": has_rejections,
        "has_open_blocking_items": has_open_blocking,
        "inspections_passed": inspections_passed,
        "failed_inspections": failed_inspections,
    }


def classify_posture(signals: dict, rules: list) -> dict:
    """Classify posture from signals using rule matching."""
    # Deterministic rule cascade
    if signals.get("has_legal_notices"):
        return {"posture_state": "ADVERSARIAL", "detection_method": "RULE_BASED"}
    if signals.get("has_contested") or signals.get("has_contradicting_evidence"):
        return {"posture_state": "CONTESTED", "detection_method": "RULE_BASED"}
    if signals.get("has_rejections"):
        return {"posture_state": "REJECTING", "detection_method": "RULE_BASED"}
    if signals.get("has_open_blocking_items"):
        return {"posture_state": "BLOCKED", "detection_method": "RULE_BASED"}
    if signals.get("failed_inspections"):
        return {"posture_state": "NON_COMPLIANT", "detection_method": "RULE_BASED"}
    if signals.get("all_claims_evidenced") and signals.get("inspections_passed"):
        return {"posture_state": "ALIGNED", "detection_method": "RULE_BASED"}
    if signals.get("all_claims_evidenced"):
        return {"posture_state": "COMPLIANT", "detection_method": "RULE_BASED"}
    if not signals.get("has_claims") and not signals.get("has_evidence"):
        return {"posture_state": "NEUTRAL", "detection_method": "RULE_BASED"}
    if signals.get("has_claims") and not signals.get("has_evidence"):
        return {"posture_state": "EXPOSED", "detection_method": "HEURISTIC"}

    return {"posture_state": "NEEDS_REVIEW", "detection_method": "RULE_BASED"}


def detect_postures(project_dir: Path, rules_path: Path | None = None) -> dict:
    """Main entry point: load data, detect postures per topic."""
    if rules_path is None:
        rules_path = DEFAULT_RULES

    rules_data = load_rules(rules_path)
    if "error" in rules_data:
        return {"status": "FAIL_CLOSED", "reason": rules_data["error"], "postures": []}

    rules = rules_data.get("rules", [])
    project_data = gather_project_data(project_dir)
    topics = extract_topics(project_data)

    if not topics:
        return {
            "status": "FAIL_CLOSED",
            "reason": f"No topics found in project data at {project_dir}",
            "postures": [],
        }

    postures = []
    for topic in sorted(topics):
        topic_data = records_for_topic(project_data, topic)
        signals = evaluate_conditions(topic_data)
        classification = classify_posture(signals, rules)
        postures.append({
            "topic": topic,
            "posture_state": classification["posture_state"],
            "detection_method": classification["detection_method"],
            "signals": signals,
        })

    summary = {}
    for p in postures:
        state = p["posture_state"]
        summary[state] = summary.get(state, 0) + 1

    return {"status": "OK", "summary": summary, "postures": postures}


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "FAIL_CLOSED",
            "reason": "Usage: python posture_detector.py <project_data_dir> [rules_path]",
        }, indent=2))
        sys.exit(1)

    project_dir = Path(sys.argv[1])
    rules_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    result = detect_postures(project_dir, rules_path)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["status"] == "OK" else 1)


if __name__ == "__main__":
    main()
