#!/usr/bin/env python3
"""
Detail Constraint Validator

Validates detail candidates against manufacturer constraint rules.
Produces validation results with PASS / WARN / HALT decisions.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_assembly(assembly_id: str, assemblies_dir: Path) -> dict | None:
    """Load an assembly primitive by ID (checks both assembly_id and detail_id)."""
    for f in assemblies_dir.glob("*.json"):
        with open(f, "r") as fh:
            data = json.load(fh)
            if data.get("assembly_id") == assembly_id or data.get("detail_id") == assembly_id:
                return data
    return None


def validate_candidate(
    candidate: dict,
    rules: list,
    assembly: dict | None,
) -> dict:
    """Validate a detail candidate against constraint rules."""
    candidate_id = candidate.get("detail_candidate_id", "UNKNOWN")
    condition_type = candidate.get("condition_type", "")
    rule_hits = []
    worst_severity = "PASS"

    # Map condition types for rule matching — check both candidate condition_type
    # and the assembly's condition_type (e.g. PARAPET → parapet_termination)
    condition_type_normalized = condition_type.lower().replace(" ", "_")
    assembly_condition_type = ""
    if assembly:
        assembly_condition_type = assembly.get("condition_type", "").lower().replace(" ", "_")

    for rule in rules:
        applies_to = [t.lower().replace(" ", "_") for t in rule.get("applies_to", [])]
        if condition_type_normalized not in applies_to and assembly_condition_type not in applies_to:
            continue

        rule_id = rule.get("rule_id")
        severity = rule.get("severity", "WARN")
        hit = False
        reason = ""

        # CONSTRAINT-COMPLETE-ASSEMBLY: check if assembly has components
        if rule_id == "CONSTRAINT-COMPLETE-ASSEMBLY":
            if assembly is None:
                hit = True
                reason = "No assembly primitive loaded"
            elif len(assembly.get("components", [])) == 0:
                hit = True
                reason = "Assembly is derived with 0 components"

        # CONSTRAINT-CHEMISTRY-SBS: check no cross-chemistry
        elif rule_id == "CONSTRAINT-CHEMISTRY-SBS":
            if assembly:
                for comp in assembly.get("components", []):
                    mat = comp.get("material", "").upper()
                    if mat in ("TPO", "PVC", "EPDM"):
                        hit = True
                        reason = f"Cross-chemistry violation: {mat} in SBS assembly"
                        break

        # CONSTRAINT-PARAPET-MIN-HEIGHT
        elif rule_id == "CONSTRAINT-PARAPET-MIN-HEIGHT":
            if assembly:
                flashing = next((c for c in assembly.get("components", []) if c.get("component_id") == "flashing"), None)
                if flashing:
                    min_h = flashing.get("parameters", {}).get("min_height_inches", 0)
                    if min_h < 8:
                        hit = True
                        reason = f"Flashing height {min_h}\" < 8\" minimum"

        # CONSTRAINT-WARRANTY-APPLICATOR
        elif rule_id == "CONSTRAINT-WARRANTY-APPLICATOR":
            if assembly:
                warranty = assembly.get("warranty_envelope", {})
                if warranty.get("requires_certified_applicator"):
                    hit = True
                    severity = "WARN"
                    reason = "Certified applicator required for warranty"

        # CONSTRAINT-INSULATION-R-VALUE
        elif rule_id == "CONSTRAINT-INSULATION-R-VALUE":
            if assembly:
                insulation = next((c for c in assembly.get("components", []) if c.get("component_id") == "insulation"), None)
                if insulation:
                    r_val = insulation.get("parameters", {}).get("min_r_value", 0)
                    if r_val < 20:
                        hit = True
                        reason = f"Insulation R-value {r_val} < R-20 minimum"

        # CONSTRAINT-EDGE-TERM-001
        elif rule_id == "CONSTRAINT-EDGE-TERM-001":
            if assembly:
                has_metal = any(
                    "metal" in c.get("component_id", "").lower() or "coping" in c.get("component_id", "").lower()
                    for c in assembly.get("components", [])
                )
                if not has_metal and len(assembly.get("components", [])) > 0:
                    hit = True
                    reason = "No metal edge or coping component found"

        if hit:
            rule_hits.append({
                "rule_id": rule_id,
                "severity": severity,
                "description": rule.get("description", ""),
                "reason": reason,
            })
            if severity == "HALT" and worst_severity != "HALT":
                worst_severity = "HALT"
            elif severity == "WARN" and worst_severity == "PASS":
                worst_severity = "WARN"

    return {
        "validation_id": f"VAL-{candidate_id}",
        "detail_candidate_id": candidate_id,
        "decision": worst_severity,
        "rule_hits": rule_hits,
        "rules_evaluated": len([r for r in rules if condition_type_normalized in [t.lower().replace(" ", "_") for t in r.get("applies_to", [])]]),
        "evidence": {
            "assembly_id": candidate.get("assembly_id"),
            "condition_type": condition_type,
            "components_count": len(assembly.get("components", [])) if assembly else 0,
        },
        "lineage": {
            "source_authority": "10-Construction_OS",
            "validation_method": "detail_constraint_validator",
            "validated_at": datetime.now(timezone.utc).isoformat(),
        },
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python detail_constraint_validator.py <detail_candidates_dir> [rules_config] [assemblies_dir]")
        sys.exit(1)

    candidates_dir = Path(sys.argv[1])
    rules_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "detail_constraint_rules.barrett.json"
    )
    assemblies_dir = (
        Path(sys.argv[3])
        if len(sys.argv) >= 4
        else Path(__file__).resolve().parent.parent / "assemblies" / "barrett"
    )

    with open(rules_path, "r") as f:
        rules_config = json.load(f)

    rules = rules_config.get("rules", [])
    results = []

    for f in sorted(candidates_dir.glob("dtl_*.json")):
        with open(f, "r") as fh:
            candidate = json.load(fh)
        assembly = load_assembly(candidate.get("assembly_id", ""), assemblies_dir)
        result = validate_candidate(candidate, rules, assembly)
        results.append(result)

    print(json.dumps({"validation_results": results, "count": len(results)}, indent=2))


if __name__ == "__main__":
    main()
