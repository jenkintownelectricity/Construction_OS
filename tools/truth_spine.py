#!/usr/bin/env python3
"""
Truth Spine — Lineage Tracer

Traces the full lineage chain from a detail through assembly, sheet,
and project usage. Produces a deterministic truth spine for any
Barrett assembly primitive.

Chain: source → normalized detail → assembly primitive → compiled packet
       → sheet bundle → project usage

Authority: 10-Construction_OS (domain plane)
Design: fail-closed, deterministic, no network calls
"""

import json
import sys
from pathlib import Path


def trace_lineage(assembly_path: str, repo_root: Path | None = None) -> dict:
    """Trace the full truth spine for an assembly primitive.

    Args:
        assembly_path: Path to assembly primitive JSON
        repo_root: Root of 10-Construction_OS (default: auto-detect)

    Returns:
        Truth spine with full lineage chain.
    """
    if repo_root is None:
        repo_root = Path(__file__).resolve().parent.parent

    asm_path = Path(assembly_path)
    if not asm_path.is_absolute():
        asm_path = repo_root / asm_path

    if not asm_path.exists():
        return {
            "traced": False,
            "status": "FAIL_CLOSED",
            "reason": f"Assembly file not found: {asm_path}",
        }

    with open(asm_path, "r") as f:
        assembly = json.load(f)

    detail_id = assembly.get("assembly_id", assembly.get("detail_id", ""))
    condition_type = assembly.get("condition_type", "")
    manufacturer = assembly.get("manufacturer_name", assembly.get("manufacturer", ""))

    # Trace source
    lineage = assembly.get("lineage", {})
    source_path = lineage.get("source_json", str(asm_path.relative_to(repo_root)))

    # Check for receipt
    receipt_path_str = lineage.get("receipt_path", "")
    receipt_exists = False
    if receipt_path_str:
        # Handle paths like "10-Construction_OS/receipts/..."
        clean = receipt_path_str.replace("10-Construction_OS/", "")
        receipt_full = repo_root / clean
        receipt_exists = receipt_full.exists()

    # Check for compiled packet
    compiled_path = repo_root / "output" / "barrett" / "details" / f"{detail_id}_packet.pdf"
    compiled_exists = compiled_path.exists()

    # Check for sheet assignment
    sheets_dir = repo_root / "output" / "barrett" / "sheets"
    sheet_assignments = []
    if sheets_dir.exists():
        for sf in sheets_dir.glob("*.json"):
            with open(sf, "r") as fh:
                sheet = json.load(fh)
                for d in sheet.get("details", []):
                    if d.get("detail_id") == detail_id:
                        sheet_assignments.append({
                            "sheet_id": sheet.get("sheet_id"),
                            "sheet_name": sheet.get("sheet_name"),
                            "sheet_file": str(sf.relative_to(repo_root)),
                        })

    spine = {
        "traced": True,
        "status": "TRACED",
        "detail_id": detail_id,
        "condition_type": condition_type,
        "manufacturer": manufacturer,
        "spine": {
            "source": {
                "path": source_path,
                "authority": lineage.get("source_authority", "10-Construction_OS"),
                "exists": True,
            },
            "assembly_primitive": {
                "path": str(asm_path.relative_to(repo_root)),
                "exists": True,
                "components": len(assembly.get("components", [])),
                "constraints": len(assembly.get("assembly_constraints", [])),
            },
            "receipt": {
                "path": receipt_path_str,
                "exists": receipt_exists,
            },
            "compiled_packet": {
                "path": str(compiled_path.relative_to(repo_root)) if compiled_exists else None,
                "exists": compiled_exists,
            },
            "sheet_bundles": sheet_assignments if sheet_assignments else None,
        },
        "lineage_complete": receipt_exists,
        "compilation_complete": compiled_exists,
        "distribution_complete": len(sheet_assignments) > 0,
    }

    return spine


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage: python truth_spine.py <assembly_json_path>")
        sys.exit(1)

    result = trace_lineage(sys.argv[1])
    print(json.dumps(result, indent=2))

    if not result["traced"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
