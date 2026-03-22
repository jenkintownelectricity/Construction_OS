"""
Graph Validator for Construction_Pattern_Language_OS

Validates the pattern relationship graph:
  - All source_id and target_id references point to existing entities
  - No dangling references
  - No self-referencing relationships
  - relationship_type must be one of: adjacency, conflict, dependency
  - Artifact intent pattern_refs must reference existing entities
  - Constraint profile applies_to references must reference existing entities

Fail-closed: any violation causes validation failure.
"""

import json
import sys
import os
import yaml
from pathlib import Path
from typing import Dict, List, Set


VALID_RELATIONSHIP_TYPES = {"adjacency", "conflict", "dependency"}


def load_yaml_file(filepath: str) -> object:
    """Safely load a YAML file."""
    try:
        with open(filepath, "r") as f:
            return yaml.safe_load(f)
    except (yaml.YAMLError, IOError):
        return None


def load_json_file(filepath: str) -> object:
    """Safely load a JSON file."""
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return None


def load_data_file(filepath: str) -> object:
    """Load a YAML or JSON file and return its contents."""
    if filepath.endswith((".yaml", ".yml")):
        return load_yaml_file(filepath)
    elif filepath.endswith(".json"):
        return load_json_file(filepath)
    return None


def gather_files_from(directory: str) -> List[str]:
    """Collect all YAML/JSON file paths under a directory."""
    root = Path(directory)
    files = []
    if not root.is_dir():
        return files
    for ext in ("*.yaml", "*.yml", "*.json"):
        for fpath in root.rglob(ext):
            if ".git" in str(fpath) or "schema" in fpath.name:
                continue
            files.append(str(fpath))
    return sorted(files)


def extract_records(filepath: str) -> List[dict]:
    """Load a file and return a list of dict records (handles single or list)."""
    data = load_data_file(filepath)
    records = []
    if isinstance(data, dict):
        data["_source_file"] = filepath
        records.append(data)
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                item["_source_file"] = filepath
                records.append(item)
    return records


def collect_all_entity_ids(root_dir: str) -> Set[str]:
    """Collect every entity ID from pattern_language/ directory."""
    ids: Set[str] = set()
    pattern_lang_dir = os.path.join(root_dir, "pattern_language")
    for filepath in gather_files_from(pattern_lang_dir):
        for record in extract_records(filepath):
            rid = record.get("id", "")
            if rid and "CONSTR" in rid:
                ids.add(rid)
    return ids


def collect_relationships(root_dir: str) -> List[dict]:
    """Collect all relationship records from pattern_relationships/."""
    relationships = []
    rel_dir = os.path.join(root_dir, "pattern_relationships")
    for filepath in gather_files_from(rel_dir):
        for record in extract_records(filepath):
            rid = record.get("id", "")
            if "CONSTR" in rid and "REL" in rid:
                relationships.append(record)
    return relationships


def collect_artifact_intents(root_dir: str) -> List[dict]:
    """Collect all artifact intent records from artifact_intents/."""
    intents = []
    art_dir = os.path.join(root_dir, "artifact_intents")
    for filepath in gather_files_from(art_dir):
        for record in extract_records(filepath):
            rid = record.get("id", "")
            if rid and "CONSTR" in rid:
                intents.append(record)
    return intents


def collect_constraint_profiles(root_dir: str) -> List[dict]:
    """Collect all constraint profile records from constraint_profiles/."""
    profiles = []
    cns_dir = os.path.join(root_dir, "constraint_profiles")
    for filepath in gather_files_from(cns_dir):
        for record in extract_records(filepath):
            rid = record.get("id", "")
            if rid and "CONSTR" in rid:
                profiles.append(record)
    return profiles


def validate_graph(root_dir: str) -> bool:
    """Validate the relationship graph and cross-references. Fail-closed."""
    errors: List[str] = []

    # Collect all known entity IDs from pattern_language/
    all_ids = collect_all_entity_ids(root_dir)

    # Also include IDs from artifact_intents and constraint_profiles themselves
    # so relationships can reference them
    artifact_intents = collect_artifact_intents(root_dir)
    constraint_profiles = collect_constraint_profiles(root_dir)
    relationships = collect_relationships(root_dir)

    for art in artifact_intents:
        rid = art.get("id", "")
        if rid:
            all_ids.add(rid)
    for cns in constraint_profiles:
        rid = cns.get("id", "")
        if rid:
            all_ids.add(rid)
    for rel in relationships:
        rid = rel.get("id", "")
        if rid:
            all_ids.add(rid)

    # ---- Validate relationships ----
    for rel in relationships:
        rel_id = rel.get("id", "UNKNOWN")
        source = rel.get("source_id", "")
        target = rel.get("target_id", "")
        rel_type = rel.get("relationship_type", "")
        src_file = rel.get("_source_file", "<unknown>")

        # Validate relationship type
        if rel_type not in VALID_RELATIONSHIP_TYPES:
            errors.append(
                f"Relationship '{rel_id}': invalid relationship_type '{rel_type}' "
                f"(must be one of {sorted(VALID_RELATIONSHIP_TYPES)})  [{src_file}]"
            )

        # Validate source_id exists
        if not source:
            errors.append(
                f"Relationship '{rel_id}': missing source_id  [{src_file}]"
            )
        elif source not in all_ids:
            errors.append(
                f"Relationship '{rel_id}': dangling source_id '{source}'  [{src_file}]"
            )

        # Validate target_id exists
        if not target:
            errors.append(
                f"Relationship '{rel_id}': missing target_id  [{src_file}]"
            )
        elif target not in all_ids:
            errors.append(
                f"Relationship '{rel_id}': dangling target_id '{target}'  [{src_file}]"
            )

        # No self-referencing
        if source and target and source == target:
            errors.append(
                f"Relationship '{rel_id}': self-referencing "
                f"(source_id == target_id == '{source}')  [{src_file}]"
            )

    # ---- Validate artifact intent pattern_refs ----
    for art in artifact_intents:
        art_id = art.get("id", "UNKNOWN")
        src_file = art.get("_source_file", "<unknown>")
        pattern_refs = art.get("pattern_refs", []) or art.get("applicable_patterns", [])
        if pattern_refs is None:
            pattern_refs = []
        for ref in pattern_refs:
            if ref not in all_ids:
                errors.append(
                    f"ArtifactIntent '{art_id}': dangling pattern_refs reference '{ref}'  [{src_file}]"
                )

    # ---- Validate constraint profile applies_to references ----
    for cns in constraint_profiles:
        cns_id = cns.get("id", "UNKNOWN")
        src_file = cns.get("_source_file", "<unknown>")
        applies_to = cns.get("applies_to", []) or cns.get("applicable_patterns", [])
        if applies_to is None:
            applies_to = []
        for ref in applies_to:
            if ref not in all_ids:
                errors.append(
                    f"ConstraintProfile '{cns_id}': dangling applies_to reference '{ref}'  [{src_file}]"
                )

    # ---- Check for duplicate relationship IDs ----
    seen_rel_ids: Dict[str, str] = {}
    for rel in relationships:
        rid = rel.get("id", "")
        src_file = rel.get("_source_file", "<unknown>")
        if rid in seen_rel_ids:
            errors.append(
                f"Duplicate relationship ID '{rid}' in [{src_file}] "
                f"(first seen in [{seen_rel_ids[rid]}])"
            )
        else:
            seen_rel_ids[rid] = src_file

    # ---- Report ----
    print("Graph Validation Report")
    print("=" * 60)
    print(f"Total entity IDs:       {len(all_ids)}")
    print(f"Relationships found:    {len(relationships)}")
    print(f"Artifact intents found: {len(artifact_intents)}")
    print(f"Constraint profiles:    {len(constraint_profiles)}")
    print(f"Errors:                 {len(errors)}")

    if errors:
        print("\nFAILURES:")
        for err in errors:
            print(f"  {err}")
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
    success = validate_graph(repo_root)
    sys.exit(0 if success else 1)
