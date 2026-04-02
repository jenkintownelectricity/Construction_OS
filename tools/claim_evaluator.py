#!/usr/bin/env python3
"""
Claim Evaluator

Loads claim records and evidence records, evaluates each claim against
claim_evaluation_rules.json, checks if required evidence types are present,
and updates claim status accordingly.

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, config-driven, no network calls

CLI: python claim_evaluator.py <claims_dir> <evidence_dir> [rules_path]
"""

import json
import sys
from pathlib import Path

DEFAULT_RULES = Path(__file__).resolve().parent.parent / "config" / "claim_evaluation_rules.json"


def load_json_dir(directory: Path) -> list:
    """Load all JSON records from a directory."""
    records = []
    if not directory.exists():
        return records
    for f in sorted(directory.glob("*.json")):
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
                "reason": f"Failed to parse: {f.name}",
            })
    return records


def load_rules(rules_path: Path) -> dict:
    """Load claim evaluation rules."""
    if not rules_path.exists():
        return {"error": f"Rules not found: {rules_path}"}
    with open(rules_path, "r") as f:
        return json.load(f)


def find_rule_for_claim(claim_type: str, rules: list) -> dict | None:
    """Find the matching rule for a claim type."""
    for rule in rules:
        if rule.get("claim_type") == claim_type:
            return rule
    return None


def evaluate_claim(claim: dict, evidence_records: list, rules: list) -> dict:
    """Evaluate a single claim against rules and available evidence."""
    claim_type = claim.get("claim_type", "").upper()
    claim_topic = claim.get("topic", claim.get("subject", ""))
    claim_id = claim.get("claim_id", claim.get("id", "unknown"))

    rule = find_rule_for_claim(claim_type, rules)
    if rule is None:
        claim["evaluation_status"] = "NEEDS_REVIEW"
        claim["evaluation_reason"] = f"No rule found for claim type: {claim_type}"
        return claim

    required_types = set(rule.get("required_evidence_types", []))
    min_count = rule.get("min_evidence_count", 1)

    # Collect evidence matching this claim's topic
    matching_evidence = [
        e for e in evidence_records
        if e.get("topic", e.get("subject", "")) == claim_topic
        or e.get("claim_id") == claim_id
    ]

    # Check which required evidence types are present
    found_types = set()
    for e in matching_evidence:
        src = e.get("source_type", "").upper()
        if src in required_types:
            found_types.add(src)

    # Check for contested evidence (evidence that contradicts the claim)
    contested = any(
        e.get("contradicts_claim_id") == claim_id
        or e.get("disposition") == "CONTRADICTS"
        for e in matching_evidence
    )

    if contested:
        claim["evaluation_status"] = "CONTESTED"
        claim["evaluation_reason"] = "Contradicting evidence found"
        claim["evidence_found"] = list(found_types)
    elif len(found_types) >= min_count:
        claim["evaluation_status"] = "EVIDENCED"
        claim["evaluation_reason"] = "Required evidence types present"
        claim["evidence_found"] = list(found_types)
    else:
        claim["evaluation_status"] = "NEEDS_REVIEW"
        claim["evaluation_reason"] = (
            f"Insufficient evidence: found {list(found_types)}, "
            f"need {min_count} of {list(required_types)}"
        )
        claim["evidence_found"] = list(found_types)

    claim["rule_applied"] = rule.get("rule_id")
    return claim


def evaluate_all(claims_dir: Path, evidence_dir: Path, rules_path: Path | None = None) -> dict:
    """Main entry point: load claims + evidence, evaluate, return results."""
    if rules_path is None:
        rules_path = DEFAULT_RULES

    rules_data = load_rules(rules_path)
    if "error" in rules_data:
        return {"status": "FAIL_CLOSED", "reason": rules_data["error"], "claims": []}

    rules = rules_data.get("rules", [])
    claims = load_json_dir(claims_dir)
    evidence = load_json_dir(evidence_dir)

    if not claims:
        return {
            "status": "FAIL_CLOSED",
            "reason": f"No claim records found in {claims_dir}",
            "claims": [],
        }

    evaluated = [evaluate_claim(c, evidence, rules) for c in claims]

    summary = {
        "total": len(evaluated),
        "evidenced": sum(1 for c in evaluated if c.get("evaluation_status") == "EVIDENCED"),
        "contested": sum(1 for c in evaluated if c.get("evaluation_status") == "CONTESTED"),
        "needs_review": sum(1 for c in evaluated if c.get("evaluation_status") == "NEEDS_REVIEW"),
    }

    return {"status": "OK", "summary": summary, "claims": evaluated}


def main():
    if len(sys.argv) < 3:
        print(json.dumps({
            "status": "FAIL_CLOSED",
            "reason": "Usage: python claim_evaluator.py <claims_dir> <evidence_dir> [rules_path]",
        }, indent=2))
        sys.exit(1)

    claims_dir = Path(sys.argv[1])
    evidence_dir = Path(sys.argv[2])
    rules_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None
    result = evaluate_all(claims_dir, evidence_dir, rules_path)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["status"] == "OK" else 1)


if __name__ == "__main__":
    main()
