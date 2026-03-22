"""
Identifier Validator for Construction_Pattern_Language_OS

Validates that all identifiers conform to the canonical format:
  <CLASS>-CONSTR-<TYPE>-<NAME>-<INDEX>-R<REV>

Fail-closed: any non-conforming identifier causes validation failure.
"""

import re
import sys
import json
import os
import yaml
from pathlib import Path
from typing import List, Tuple, Dict


VALID_CLASSES = {"DNA", "CHEM", "COLOR", "SOUND", "TEXTURE", "CLIMATE"}

VALID_TYPES = {"FAM", "PAT", "VAR", "REL", "ART", "CNS", "DTL"}

SCAN_DIRS = [
    "pattern_language",
    "pattern_relationships",
    "artifact_intents",
    "constraint_profiles",
]

ID_PATTERN = re.compile(
    r"^([A-Z]+)-CONSTR-([A-Z]+)-([A-Z][A-Z0-9_]*(?:-[A-Z][A-Z0-9_]*)*)-(\d{3})-R(\d+)$"
)


def validate_identifier(identifier: str) -> Tuple[bool, str]:
    """Validate a single identifier. Returns (is_valid, error_message_or_empty)."""
    match = ID_PATTERN.match(identifier)
    if not match:
        return False, (
            f"INVALID FORMAT: '{identifier}' does not match "
            "<CLASS>-CONSTR-<TYPE>-<NAME>-<INDEX>-R<REV>"
        )

    cls, typ, name, index, rev = match.groups()

    if cls not in VALID_CLASSES:
        return False, f"INVALID CLASS: '{cls}' not in {sorted(VALID_CLASSES)}"

    if typ not in VALID_TYPES:
        return False, f"INVALID TYPE: '{typ}' not in {sorted(VALID_TYPES)}"

    if int(rev) < 1:
        return False, f"INVALID REVISION: revision must be >= 1, got R{rev}"

    return True, ""


def validate_uniqueness(
    id_sources: Dict[str, List[str]],
) -> List[str]:
    """Check that no identifier appears in more than one location.
    id_sources maps identifier -> list of file paths where it was found.
    Returns list of error strings for duplicates.
    """
    errors = []
    for ident, sources in id_sources.items():
        if len(sources) > 1:
            locations = ", ".join(sources)
            errors.append(f"DUPLICATE ID: '{ident}' found in: {locations}")
    return errors


def load_yaml_file(filepath: str) -> object:
    """Safely load a YAML file, returning the parsed object or None."""
    try:
        with open(filepath, "r") as f:
            return yaml.safe_load(f)
    except (yaml.YAMLError, IOError) as exc:
        return None


def load_json_file(filepath: str) -> object:
    """Safely load a JSON file, returning the parsed object or None."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def extract_identifiers(data: object) -> List[str]:
    """Recursively extract all identifier-like strings from a data structure."""
    identifiers = []

    def _walk(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "id" and isinstance(value, str) and "CONSTR" in value:
                    identifiers.append(value)
                else:
                    _walk(value)
        elif isinstance(obj, list):
            for item in obj:
                _walk(item)

    _walk(data)
    return identifiers


def collect_identifiers_from_file(filepath: str) -> List[str]:
    """Extract all identifiers from a YAML or JSON file."""
    if filepath.endswith((".yaml", ".yml")):
        data = load_yaml_file(filepath)
    elif filepath.endswith(".json"):
        data = load_json_file(filepath)
    else:
        return []

    if data is None:
        return []

    return extract_identifiers(data)


def gather_files(root_dir: str) -> List[str]:
    """Gather all YAML and JSON files from the relevant subdirectories."""
    root = Path(root_dir)
    files = []
    for subdir in SCAN_DIRS:
        target = root / subdir
        if target.is_dir():
            for ext in ("*.yaml", "*.yml", "*.json"):
                files.extend(str(p) for p in target.rglob(ext))
    return sorted(files)


def validate_directory(root_dir: str) -> bool:
    """Validate all identifiers found in YAML/JSON files under root_dir.

    Fail-closed: returns False on any error.
    """
    errors: List[str] = []
    id_sources: Dict[str, List[str]] = {}
    files_checked = 0
    total_ids = 0

    files = gather_files(root_dir)

    for filepath in files:
        if ".git" in filepath or "schema" in Path(filepath).name:
            continue
        files_checked += 1
        ids = collect_identifiers_from_file(filepath)
        for ident in ids:
            total_ids += 1
            valid, msg = validate_identifier(ident)
            if not valid:
                errors.append(f"  {filepath}: {msg}")
            id_sources.setdefault(ident, []).append(filepath)

    dup_errors = validate_uniqueness(id_sources)
    for dup in dup_errors:
        errors.append(f"  {dup}")

    print("Identifier Validation Report")
    print("=" * 60)
    print(f"Files checked:      {files_checked}")
    print(f"Identifiers found:  {total_ids}")
    print(f"Unique identifiers: {len(id_sources)}")
    print(f"Errors:             {len(errors)}")

    if errors:
        print("\nFAILURES:")
        for err in errors:
            print(err)
        print("\nRESULT: FAIL (fail-closed)")
        return False

    print("\nRESULT: PASS")
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(
            f"Usage: python {sys.argv[0]} <path_to_repo_root>",
            file=sys.stderr,
        )
        sys.exit(1)
    repo_root = sys.argv[1]
    if not os.path.isdir(repo_root):
        print(f"ERROR: '{repo_root}' is not a directory", file=sys.stderr)
        sys.exit(1)
    success = validate_directory(repo_root)
    sys.exit(0 if success else 1)
