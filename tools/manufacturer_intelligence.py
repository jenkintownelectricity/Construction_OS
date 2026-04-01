#!/usr/bin/env python3
"""
Manufacturer Intelligence Layer

Exposes analytics to Barrett across the detail library:
- Most used details (by condition type)
- Component frequency analysis
- Constraint coverage analysis
- Assembly completeness scoring
- Modification patterns

Authority: 10-Construction_OS (domain plane)
Design: deterministic, read-only analytics
"""

import json
import sys
from pathlib import Path


def generate_intelligence_report(
    assemblies_dir: Path,
    sheets_dir: Path | None = None,
    repo_root: Path | None = None,
) -> dict:
    """Generate manufacturer intelligence report from assembly library.

    Returns analytics summary for Barrett manufacturer review.
    """
    if repo_root is None:
        repo_root = Path(__file__).resolve().parent.parent

    if not assemblies_dir.exists():
        return {
            "generated": False,
            "status": "FAIL_CLOSED",
            "reason": "Assemblies directory not found",
        }

    # Load all assemblies
    assemblies = []
    for f in sorted(assemblies_dir.glob("*.json")):
        with open(f, "r") as fh:
            assemblies.append(json.load(fh))

    if not assemblies:
        return {
            "generated": False,
            "status": "FAIL_CLOSED",
            "reason": "No assembly files found",
        }

    # Analytics
    total = len(assemblies)
    conditions = {}
    materials = {}
    total_components = 0
    total_constraints = 0
    complete_count = 0
    with_warranty = 0

    for asm in assemblies:
        ct = asm.get("condition_type", "unknown")
        conditions[ct] = conditions.get(ct, 0) + 1

        components = asm.get("components", [])
        total_components += len(components)
        total_constraints += len(asm.get("assembly_constraints", []))

        if components:
            complete_count += 1

        if asm.get("warranty_envelope"):
            with_warranty += 1

        for comp in components:
            mat = comp.get("material", "unknown")
            materials[mat] = materials.get(mat, 0) + 1

    # Sheet distribution analysis
    sheet_coverage = {}
    if sheets_dir and sheets_dir.exists():
        for sf in sheets_dir.glob("*.json"):
            with open(sf, "r") as fh:
                sheet = json.load(fh)
                sheet_coverage[sheet.get("sheet_id", "")] = {
                    "sheet_name": sheet.get("sheet_name", ""),
                    "detail_count": sheet.get("detail_count", 0),
                }

    return {
        "generated": True,
        "status": "GENERATED",
        "manufacturer": "Barrett",
        "system_family": "SBS Modified Bitumen",
        "summary": {
            "total_assemblies": total,
            "complete_assemblies": complete_count,
            "incomplete_assemblies": total - complete_count,
            "with_warranty": with_warranty,
            "without_warranty": total - with_warranty,
            "total_components_defined": total_components,
            "total_constraints_defined": total_constraints,
            "avg_components_per_assembly": round(total_components / total, 1) if total else 0,
            "avg_constraints_per_assembly": round(total_constraints / total, 1) if total else 0,
            "completeness_score": round(complete_count / total * 100, 1) if total else 0,
        },
        "condition_distribution": conditions,
        "material_frequency": dict(sorted(materials.items(), key=lambda x: -x[1])),
        "sheet_coverage": sheet_coverage if sheet_coverage else None,
        "top_issues": [
            f"{total - complete_count} assemblies lack component definitions" if total - complete_count else None,
            f"{total - with_warranty} assemblies lack warranty envelopes" if total - with_warranty else None,
        ],
    }


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python manufacturer_intelligence.py <assemblies_dir> [sheets_dir]")
        sys.exit(1)

    assemblies_dir = Path(sys.argv[1])
    sheets_dir = Path(sys.argv[2]) if len(sys.argv) >= 3 else None

    result = generate_intelligence_report(assemblies_dir, sheets_dir)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
