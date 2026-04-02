#!/usr/bin/env python3
"""
Assembly Recipe Selector

Selects the best assembly recipe for a condition based on manufacturer recipes.
Consumes assembly_condition_recipes config and assembly primitives.

Authority: 10-Construction_OS
Design: fail-closed, deterministic, config-driven, no network calls
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_recipes(config_path: Path) -> dict:
    with open(config_path, "r") as f:
        return json.load(f)


def load_assemblies(assemblies_dir: Path) -> dict:
    """Load all assembly primitives keyed by assembly_id."""
    index = {}
    if not assemblies_dir.exists():
        return index
    for f in sorted(assemblies_dir.glob("*.json")):
        with open(f, "r") as fh:
            data = json.load(fh)
            index[data.get("assembly_id", f.stem)] = data
    return index


def select_recipe(
    condition_type: str,
    recipes_config: dict,
    assemblies: dict,
) -> dict:
    """Select the best recipe for a condition type."""
    recipes = recipes_config.get("recipes", [])

    matching = [r for r in recipes if r.get("condition_type") == condition_type]

    if not matching:
        return {
            "status": "UNRESOLVED",
            "reason": f"No recipe defined for condition_type '{condition_type}'",
            "condition_type": condition_type,
        }

    # Prefer recipes with real assembly backing
    for recipe in matching:
        assembly_id = recipe.get("assembly_id")
        if assembly_id and assembly_id in assemblies:
            asm = assemblies[assembly_id]
            completeness = "complete" if len(asm.get("components", [])) > 0 else "derived"
            return {
                "status": "RESOLVED" if completeness == "complete" else "DERIVED",
                "recipe_id": recipe.get("recipe_id"),
                "recipe_family": recipe.get("recipe_family"),
                "assembly_id": assembly_id,
                "manufacturer": recipe.get("manufacturer", "Barrett"),
                "system_family": recipe.get("system_family", asm.get("system_type")),
                "condition_type": condition_type,
                "completeness": completeness,
                "components_count": len(asm.get("components", [])),
                "constraints_count": len(asm.get("assembly_constraints", [])),
            }

    # Fallback to first recipe without assembly backing
    recipe = matching[0]
    return {
        "status": "DERIVED",
        "recipe_id": recipe.get("recipe_id"),
        "recipe_family": recipe.get("recipe_family"),
        "assembly_id": recipe.get("assembly_id"),
        "manufacturer": recipe.get("manufacturer", "Barrett"),
        "system_family": recipe.get("system_family"),
        "condition_type": condition_type,
        "completeness": "derived",
        "components_count": 0,
        "constraints_count": 0,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python assembly_recipe_selector.py <condition_type> [recipes_config] [assemblies_dir]")
        sys.exit(1)

    condition_type = sys.argv[1]
    recipes_path = (
        Path(sys.argv[2])
        if len(sys.argv) >= 3
        else Path(__file__).resolve().parent.parent / "config" / "assembly_condition_recipes.barrett.json"
    )
    assemblies_dir = (
        Path(sys.argv[3])
        if len(sys.argv) >= 4
        else Path(__file__).resolve().parent.parent / "assemblies" / "barrett"
    )

    recipes = load_recipes(recipes_path)
    assemblies = load_assemblies(assemblies_dir)
    result = select_recipe(condition_type, recipes, assemblies)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
