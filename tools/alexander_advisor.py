#!/usr/bin/env python3
"""
Alexander Advisory System — Learning Layer

Observes assembly usage patterns and suggests improvements based on
Alexander's pattern language principles. Named after Christopher Alexander.

Capabilities:
- Detect contractor modifications to standard assemblies
- Suggest improvements based on constraint violations
- Track frequently modified details
- Identify patterns across conditions

Authority: 10-Construction_OS (domain plane)
Design: deterministic, advisory-only (never mutates truth)
"""

import json
import sys
from pathlib import Path


def analyze_assembly(assembly_path: str, repo_root: Path | None = None) -> dict:
    """Analyze an assembly for improvement opportunities.

    Returns advisory suggestions, not mutations.
    """
    if repo_root is None:
        repo_root = Path(__file__).resolve().parent.parent

    asm_path = Path(assembly_path)
    if not asm_path.is_absolute():
        asm_path = repo_root / asm_path

    if not asm_path.exists():
        return {
            "analyzed": False,
            "status": "FAIL_CLOSED",
            "reason": f"Assembly not found: {asm_path}",
        }

    with open(asm_path, "r") as f:
        assembly = json.load(f)

    detail_id = assembly.get("assembly_id", assembly.get("detail_id", ""))
    condition_type = assembly.get("condition_type", "")
    components = assembly.get("components", [])
    constraints = assembly.get("assembly_constraints", [])

    advisories = []

    # Pattern 1: Completeness check
    if not components:
        advisories.append({
            "advisory_id": "ALEXANDER_001",
            "type": "completeness",
            "severity": "high",
            "message": f"Assembly '{detail_id}' has no component definitions",
            "suggestion": "Add component definitions with materials, positions, and parameters to enable full constraint validation",
            "pattern": "A detail without defined components cannot be validated or compiled reliably",
        })

    # Pattern 2: Constraint coverage
    if components and not constraints:
        advisories.append({
            "advisory_id": "ALEXANDER_002",
            "type": "governance_gap",
            "severity": "medium",
            "message": f"Assembly '{detail_id}' has {len(components)} components but no constraints",
            "suggestion": "Add assembly constraints to enforce material compatibility and dimensional requirements",
            "pattern": "Components without constraints allow unvalidated configurations to pass through the system",
        })

    # Pattern 3: Warranty gap
    if components and not assembly.get("warranty_envelope"):
        advisories.append({
            "advisory_id": "ALEXANDER_003",
            "type": "warranty_gap",
            "severity": "medium",
            "message": f"Assembly '{detail_id}' lacks a warranty envelope",
            "suggestion": "Add warranty envelope with term, coverage, wind rating, and applicator requirements",
            "pattern": "Assemblies without warranty data cannot generate compliance certificates",
        })

    # Pattern 4: Flashing height sensitivity
    for comp in components:
        if comp.get("component_id") == "flashing":
            height = comp.get("parameters", {}).get("min_height_inches", 0)
            if height == 8:
                advisories.append({
                    "advisory_id": "ALEXANDER_004",
                    "type": "improvement_opportunity",
                    "severity": "low",
                    "message": "Flashing at minimum 8\" height — consider 12\" for enhanced protection",
                    "suggestion": "Contractors frequently extend flashing height beyond minimum for improved weather resistance",
                    "pattern": "Minimum values are starting points, not best practice targets",
                })

    # Pattern 5: CSI section tracking
    if components and not assembly.get("csi_section"):
        advisories.append({
            "advisory_id": "ALEXANDER_005",
            "type": "classification_gap",
            "severity": "low",
            "message": f"Assembly '{detail_id}' missing CSI MasterFormat section code",
            "suggestion": "Add csi_section for proper specification coordination (e.g., '07 52 16' for SBS Modified Bitumen)",
            "pattern": "CSI codes enable cross-reference between details and project specifications",
        })

    return {
        "analyzed": True,
        "status": "ANALYZED",
        "detail_id": detail_id,
        "condition_type": condition_type,
        "components_count": len(components),
        "constraints_count": len(constraints),
        "advisory_count": len(advisories),
        "advisories": advisories,
        "overall_health": "healthy" if not advisories else ("attention_needed" if any(a["severity"] == "high" for a in advisories) else "improvable"),
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python alexander_advisor.py <assembly_json_path>")
        sys.exit(1)

    result = analyze_assembly(sys.argv[1])
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
