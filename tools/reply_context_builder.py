#!/usr/bin/env python3
"""
Reply Context Builder

Builds reply draft context from project snapshot, claims, posture, and
reconciliation data. Assembles target_party, topic, claims_to_address,
evidence_to_cite, posture_context, tone_guidance, and risk_level.

Every output is labeled DRAFT / REQUIRES_HUMAN_REVIEW. No autonomous sending.

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls

CLI: python reply_context_builder.py <snapshot_path> <target_party_id> <topic>
"""

import json
import sys
from pathlib import Path

# Posture-to-tone mapping (deterministic)
TONE_MAP = {
    "ALIGNED": "collaborative",
    "COOPERATIVE": "collaborative",
    "NEUTRAL": "professional",
    "COMPLIANT": "professional",
    "PROTECTED": "professional",
    "DIVERGENT": "measured",
    "PARTIAL_ALIGNMENT": "measured",
    "CONTESTED": "firm_but_professional",
    "DEFENSIVE": "firm_but_professional",
    "REJECTING": "firm_but_professional",
    "ADVERSARIAL": "formal_and_guarded",
    "ESCALATING": "formal_and_guarded",
    "NON_COMPLIANT": "corrective",
    "EXPOSED": "urgent",
    "BLOCKED": "action_oriented",
    "STALLED": "action_oriented",
    "TRANSITIONING": "procedural",
    "ACCEPTING": "acknowledgment",
    "DE_ESCALATING": "conciliatory",
    "NEEDS_REVIEW": "neutral_pending_review",
}

# Posture-to-risk mapping
RISK_MAP = {
    "ALIGNED": "LOW",
    "COOPERATIVE": "LOW",
    "NEUTRAL": "LOW",
    "COMPLIANT": "LOW",
    "PROTECTED": "LOW",
    "DIVERGENT": "MEDIUM",
    "PARTIAL_ALIGNMENT": "MEDIUM",
    "CONTESTED": "HIGH",
    "DEFENSIVE": "MEDIUM",
    "REJECTING": "HIGH",
    "ADVERSARIAL": "CRITICAL",
    "ESCALATING": "HIGH",
    "NON_COMPLIANT": "HIGH",
    "EXPOSED": "CRITICAL",
    "BLOCKED": "MEDIUM",
    "STALLED": "MEDIUM",
    "TRANSITIONING": "LOW",
    "ACCEPTING": "LOW",
    "DE_ESCALATING": "MEDIUM",
    "NEEDS_REVIEW": "MEDIUM",
}


def load_json_file(path: Path) -> dict | None:
    """Load a JSON file, return None on failure."""
    if not path.exists():
        return None
    try:
        with open(path, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


def find_claims_for_topic(snapshot_path: Path, topic: str, target_party: str) -> list:
    """Find claims relevant to topic and party."""
    claims_dir = snapshot_path.parent / "claims"
    if not claims_dir.exists():
        return []
    claims = []
    for f in sorted(claims_dir.glob("*.json")):
        try:
            with open(f, "r") as fh:
                data = json.load(fh)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    item_topic = item.get("topic", item.get("subject", ""))
                    item_party = item.get("party_id", item.get("target_party", ""))
                    if item_topic == topic or item_party == target_party:
                        claims.append(item)
        except (json.JSONDecodeError, OSError):
            pass
    return claims


def find_evidence_for_claims(snapshot_path: Path, claim_ids: list) -> list:
    """Find evidence records linked to specific claims."""
    evidence_dir = snapshot_path.parent / "evidence"
    if not evidence_dir.exists():
        return []
    evidence = []
    for f in sorted(evidence_dir.glob("*.json")):
        try:
            with open(f, "r") as fh:
                data = json.load(fh)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if item.get("claim_id") in claim_ids or item.get("topic") in claim_ids:
                        evidence.append({
                            "evidence_id": item.get("evidence_id", item.get("id", "")),
                            "source_type": item.get("source_type", ""),
                            "quality_tier": item.get("quality_tier", "UNCLASSIFIED"),
                            "summary": item.get("summary", item.get("description", "")),
                        })
        except (json.JSONDecodeError, OSError):
            pass
    return evidence


def find_posture_for_topic(snapshot_path: Path, topic: str) -> str:
    """Find posture state for a topic from postures directory."""
    postures_dir = snapshot_path.parent / "postures"
    if not postures_dir.exists():
        return "NEEDS_REVIEW"
    for f in sorted(postures_dir.glob("*.json")):
        try:
            with open(f, "r") as fh:
                data = json.load(fh)
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if item.get("topic") == topic:
                        return item.get("posture_state", "NEEDS_REVIEW")
        except (json.JSONDecodeError, OSError):
            pass
    return "NEEDS_REVIEW"


def build_reply_context(snapshot_path: Path, target_party: str, topic: str) -> dict:
    """Main entry point: build reply draft context."""
    snapshot = load_json_file(snapshot_path)
    if snapshot is None:
        return {
            "status": "FAIL_CLOSED",
            "label": "DRAFT",
            "reason": f"Snapshot not found or unreadable: {snapshot_path}",
        }

    # Locate claims and evidence
    claims = find_claims_for_topic(snapshot_path, topic, target_party)
    claim_ids = [c.get("claim_id", c.get("id", c.get("topic", ""))) for c in claims]
    evidence = find_evidence_for_claims(snapshot_path, claim_ids)

    # Determine posture
    posture_state = find_posture_for_topic(snapshot_path, topic)
    tone = TONE_MAP.get(posture_state, "neutral_pending_review")
    risk = RISK_MAP.get(posture_state, "MEDIUM")

    # Build claims summary for reply context
    claims_to_address = []
    for c in claims:
        claims_to_address.append({
            "claim_id": c.get("claim_id", c.get("id", "")),
            "claim_type": c.get("claim_type", ""),
            "evaluation_status": c.get("evaluation_status", "UNKNOWN"),
            "summary": c.get("summary", c.get("description", "")),
        })

    return {
        "status": "OK",
        "label": "DRAFT",
        "requires_human_review": True,
        "target_party": target_party,
        "topic": topic,
        "claims_to_address": claims_to_address,
        "evidence_to_cite": evidence,
        "posture_context": {
            "posture_state": posture_state,
            "detection_source": "posture_detector",
        },
        "tone_guidance": tone,
        "risk_level": risk,
        "project_id": snapshot.get("project_id", "UNKNOWN"),
        "project_name": snapshot.get("project_name", "UNKNOWN"),
        "disclaimer": "REQUIRES_HUMAN_REVIEW — This is a machine-assembled draft context. "
                      "Do not send without human review and approval.",
    }


def main():
    if len(sys.argv) < 4:
        print(json.dumps({
            "status": "FAIL_CLOSED",
            "label": "DRAFT",
            "reason": "Usage: python reply_context_builder.py <snapshot_path> <target_party_id> <topic>",
        }, indent=2))
        sys.exit(1)

    snapshot_path = Path(sys.argv[1])
    target_party = sys.argv[2]
    topic = sys.argv[3]
    result = build_reply_context(snapshot_path, target_party, topic)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["status"] == "OK" else 1)


if __name__ == "__main__":
    main()
