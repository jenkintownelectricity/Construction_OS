"""
Governed Contract Loader

Loads machine-readable contract artifacts from Construction_Kernel.
Fails closed if contracts are missing, malformed, or incompatible.

Runtime consumes governed contracts. Runtime does not define them.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any


# Default path to Construction_Kernel contracts.
# Expects Construction_Kernel as a sibling directory to Construction_Runtime.
_DEFAULT_KERNEL_CONTRACTS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "Construction_Kernel", "contracts"
)

# Environment variable override for governed contract path.
_ENV_CONTRACTS_PATH = "CONSTRUCTION_KERNEL_CONTRACTS_PATH"


class ContractLoadError(Exception):
    """Raised when a governed contract cannot be loaded. Fail-closed."""


def _resolve_contracts_path() -> Path:
    """Resolve the path to Construction_Kernel contracts directory."""
    env_path = os.environ.get(_ENV_CONTRACTS_PATH)
    if env_path:
        return Path(env_path)
    return Path(_DEFAULT_KERNEL_CONTRACTS_PATH).resolve()


def _load_json(filepath: Path) -> dict[str, Any]:
    """Load and parse a JSON contract file. Fail-closed on any error."""
    if not filepath.exists():
        raise ContractLoadError(
            f"Governed contract missing: {filepath}. "
            f"Runtime cannot operate without kernel contracts."
        )
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError) as exc:
        raise ContractLoadError(
            f"Governed contract malformed: {filepath}. Error: {exc}"
        ) from exc

    if not isinstance(data, dict):
        raise ContractLoadError(
            f"Governed contract invalid structure: {filepath}. Expected object."
        )
    return data


def load_applicability_rules() -> list[dict[str, Any]]:
    """
    Load governed detail applicability rules from Construction_Kernel.

    Returns the list of applicability rules defined by the kernel.
    Fails closed if the contract is missing, malformed, or has no rules.
    """
    contracts_path = _resolve_contracts_path()
    filepath = contracts_path / "detail_applicability" / "applicability_rules.json"
    data = _load_json(filepath)

    rules = data.get("rules")
    if not isinstance(rules, list) or len(rules) == 0:
        raise ContractLoadError(
            f"Governed contract has no rules: {filepath}. "
            f"Runtime requires at least one applicability rule."
        )

    # Validate each rule has required fields
    required_fields = {"rule_id", "condition_pattern", "applies_detail", "detail_family", "components", "relationships"}
    for rule in rules:
        missing = required_fields - set(rule.keys())
        if missing:
            raise ContractLoadError(
                f"Governed rule '{rule.get('rule_id', 'unknown')}' missing fields: {missing}. "
                f"Contract: {filepath}"
            )

    return rules


def load_ir_instruction_types() -> list[str]:
    """
    Load governed IR instruction types from Construction_Kernel.

    Returns the list of valid IR instruction type strings.
    Fails closed if the contract is missing or malformed.
    """
    contracts_path = _resolve_contracts_path()
    filepath = contracts_path / "drawing_instruction_ir" / "ir_instruction_types.json"
    data = _load_json(filepath)

    types = data.get("ir_instruction_types")
    if not isinstance(types, list) or len(types) == 0:
        raise ContractLoadError(
            f"Governed contract has no IR instruction types: {filepath}."
        )

    return types


def load_detail_schema() -> dict[str, Any]:
    """
    Load governed detail schema from Construction_Kernel.

    Returns the schema contract defining valid roles, relationships, and parameters.
    Fails closed if the contract is missing or malformed.
    """
    contracts_path = _resolve_contracts_path()
    filepath = contracts_path / "detail_schema" / "detail_schema.json"
    data = _load_json(filepath)

    if "valid_component_roles" not in data:
        raise ContractLoadError(
            f"Governed detail schema missing valid_component_roles: {filepath}."
        )

    return data
