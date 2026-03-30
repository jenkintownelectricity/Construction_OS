"""
CRI Signal Contract v0.1 — SignalMapper.

Maps internal CRI signal types to Cognitive Bus event_class values.
Rejects any attempt to map to ExternallyValidatedEvent or unknown classes.
"""

from cri.config import ALLOWED_SIGNAL_TYPES, FORBIDDEN_EVENT_CLASSES
from cri.signal_contract import SIGNAL_DEFINITIONS


class SignalMapper:
    """Maps CRI signal types to Cognitive Bus event_class values."""

    # Explicit mapping: CRI signal type -> Cognitive Bus event_class.
    _MAPPING = {
        "observation": "Observation",
        "proposal": "Proposal",
    }

    @classmethod
    def map(cls, signal_type: str) -> str:
        """Map a CRI signal type to its Cognitive Bus event_class.

        Raises ValueError if the signal type is unknown or maps to a
        forbidden event class.
        """
        if signal_type not in ALLOWED_SIGNAL_TYPES:
            raise ValueError(
                f"unknown CRI signal type: {signal_type}"
            )

        event_class = cls._MAPPING.get(signal_type)
        if event_class is None:
            raise ValueError(
                f"no event_class mapping for signal type: {signal_type}"
            )

        if event_class in FORBIDDEN_EVENT_CLASSES:
            raise ValueError(
                f"CRI must not emit {event_class} — "
                f"forbidden event class for signal type: {signal_type}"
            )

        return event_class

    @classmethod
    def reverse_lookup(cls, event_class: str) -> str | None:
        """Return the CRI signal type for a given event_class, or None."""
        for sig_type, ec in cls._MAPPING.items():
            if ec == event_class:
                return sig_type
        return None
