"""
CRI Signal Contract v0.1 — SignalContract.

Defines the allowed CRI signal types and their constraints.
CRI may emit: Observation, Proposal.
CRI must NOT emit ExternallyValidatedEvent.
All signals are non-authoritative hints — never truth claims.
"""

from cri.config import ALLOWED_SIGNAL_TYPES, FORBIDDEN_EVENT_CLASSES


# Signal type definitions with descriptions and validation rules.
SIGNAL_DEFINITIONS = {
    "observation": {
        "description": (
            "Intelligence observation — a non-authoritative hint "
            "derived from analysis of construction-domain data. "
            "Carries lineage metadata. Not a truth claim."
        ),
        "event_class": "Observation",
        "requires_payload_keys": [],
    },
    "proposal": {
        "description": (
            "Suggested action based on analysis — a non-authoritative "
            "recommendation for downstream consideration. "
            "Carries lineage metadata. Not a directive."
        ),
        "event_class": "Proposal",
        "requires_payload_keys": [],
    },
}


class SignalContract:
    """Validates that a CRI signal type is allowed and well-formed."""

    @staticmethod
    def allowed_types():
        """Return the set of allowed CRI signal types."""
        return frozenset(ALLOWED_SIGNAL_TYPES)

    @staticmethod
    def is_allowed(signal_type: str) -> bool:
        """Return True if signal_type is permitted for CRI."""
        return signal_type in ALLOWED_SIGNAL_TYPES

    @staticmethod
    def validate(signal_type: str, payload: dict) -> tuple[bool, str]:
        """Validate a signal type and its payload.

        Returns (True, "") on success or (False, reason) on failure.
        """
        if signal_type not in ALLOWED_SIGNAL_TYPES:
            return False, f"signal type not allowed: {signal_type}"

        definition = SIGNAL_DEFINITIONS.get(signal_type)
        if definition is None:
            return False, f"no definition for signal type: {signal_type}"

        # Check the mapped event class is not forbidden.
        if definition["event_class"] in FORBIDDEN_EVENT_CLASSES:
            return False, (
                f"signal type {signal_type} maps to forbidden "
                f"event class: {definition['event_class']}"
            )

        if not isinstance(payload, dict):
            return False, "payload must be a dict"

        for key in definition["requires_payload_keys"]:
            if key not in payload:
                return False, f"payload missing required key: {key}"

        return True, ""
