"""
CRI Signal Contract v0.1 — SignalEnvelopeBuilder.

Builds valid Cognitive Bus event envelopes from CRI signals.
Fills in all required fields per the event-envelope schema v0.1.
"""

import json
import uuid
from datetime import datetime, timezone

from cri.config import (
    MAX_PAYLOAD_BYTES,
    SCHEMA_VERSION,
    SOURCE_COMPONENT,
    SOURCE_REPO,
)
from cri.signal_mapper import SignalMapper


class SignalEnvelopeBuilder:
    """Builds a Cognitive Bus event envelope from a CRI signal."""

    @staticmethod
    def build(signal_type: str, event_type: str, payload: dict) -> dict:
        """Build a valid Cognitive Bus event envelope.

        Args:
            signal_type: CRI signal type ("observation" or "proposal").
            event_type: Specific event type descriptor within the class.
            payload: Event payload as a dict.

        Returns:
            A dict conforming to the Cognitive Bus event envelope schema.

        Raises:
            ValueError: If signal_type is invalid, payload is not a dict,
                or payload exceeds size limit.
        """
        # Validate payload type.
        if not isinstance(payload, dict):
            raise ValueError("payload must be a dict")

        # Validate payload size.
        payload_bytes = len(
            json.dumps(payload, sort_keys=True).encode("utf-8")
        )
        if payload_bytes > MAX_PAYLOAD_BYTES:
            raise ValueError(
                f"payload exceeds size limit: "
                f"{payload_bytes} bytes > {MAX_PAYLOAD_BYTES} bytes"
            )

        # Map signal type to event class (raises ValueError if invalid).
        event_class = SignalMapper.map(signal_type)

        # Build envelope.
        envelope = {
            "event_id": str(uuid.uuid4()),
            "event_class": event_class,
            "event_type": event_type,
            "schema_version": SCHEMA_VERSION,
            "source_component": SOURCE_COMPONENT,
            "source_repo": SOURCE_REPO,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "payload": payload,
        }

        return envelope
