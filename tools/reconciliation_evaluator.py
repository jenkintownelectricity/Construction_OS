#!/usr/bin/env python3
"""
Reconciliation Evaluator

Compares intended, approved, asserted, observed, and documented states
to produce reconciliation records with divergence descriptions.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def evaluate_reconciliation(record: dict, rules: list) -> dict:
    intended = record.get("intended_state")
    approved = record.get("approved_state")
    asserted = record.get("asserted_state")
    observed = record.get("observed_state")
    documented = record.get("documented_state")

    state = "NEEDS_REVIEW"
    divergence = ""

    has_intent = bool(intended or approved)
    has_reality = bool(asserted or observed or documented)

    if has_intent and not has_reality:
        state = "INTENT_ONLY"
        divergence = "Intent exists but no reality evidence found"
    elif has_reality and not has_intent:
        state = "REALITY_ONLY"
        divergence = "Reality evidence exists but no approved intent found"
    elif asserted and not observed:
        state = "ASSERTED_NOT_EVIDENCED"
        divergence = "Assertion made but no independent observation confirms it"
    elif observed and not approved:
        state = "OBSERVED_NOT_APPROVED"
        divergence = "Observed condition exists without approved intent"
    elif documented and not observed:
        state = "DOCUMENTED_BUT_NOT_OBSERVED"
        divergence = "Documentation exists but no field observation confirms it"
    elif has_intent and has_reality:
        state = "ALIGNED"
        divergence = "Intent and reality are consistent"

    return {
        "reconciliation_state": state,
        "divergence_description": divergence,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python reconciliation_evaluator.py <states_dir> [rules_path]")
        sys.exit(1)

    states_dir = Path(sys.argv[1])
    rules_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "reconciliation_rules.json"
    )

    with open(rules_path, "r") as f:
        rules_config = json.load(f)
    rules = rules_config.get("rules", [])

    results = []
    for f_path in sorted(states_dir.glob("rcn_*.json")):
        with open(f_path, "r") as fh:
            record = json.load(fh)
        evaluation = evaluate_reconciliation(record, rules)
        record["reconciliation_state"] = evaluation["reconciliation_state"]
        record["divergence_description"] = evaluation["divergence_description"]
        results.append(record)

    print(json.dumps({"reconciliation_results": results, "count": len(results)}, indent=2))


if __name__ == "__main__":
    main()
