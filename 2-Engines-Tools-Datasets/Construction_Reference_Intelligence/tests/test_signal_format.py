"""
Tests for CRI signal envelope format and validation.
"""

import json
import unittest

from cri.config import MAX_PAYLOAD_BYTES, SOURCE_COMPONENT
from cri.signal_envelope_builder import SignalEnvelopeBuilder


REQUIRED_FIELDS = (
    "event_id",
    "event_class",
    "event_type",
    "schema_version",
    "source_component",
    "source_repo",
    "timestamp",
    "payload",
)

ALLOWED_EVENT_CLASSES = {"Observation", "Proposal", "ExternallyValidatedEvent"}


class TestSignalFormat(unittest.TestCase):
    """Verify CRI signal envelopes conform to Cognitive Bus schema."""

    def _build_observation(self, payload=None):
        if payload is None:
            payload = {"detail": "test observation"}
        return SignalEnvelopeBuilder.build(
            signal_type="observation",
            event_type="cri.observation.test",
            payload=payload,
        )

    def test_envelope_has_all_required_fields(self):
        """Every envelope must contain all required Cognitive Bus fields."""
        envelope = self._build_observation()
        for field in REQUIRED_FIELDS:
            self.assertIn(field, envelope, f"missing field: {field}")

    def test_envelope_matches_cognitive_bus_schema(self):
        """Envelope values must match Cognitive Bus schema constraints."""
        envelope = self._build_observation()

        # event_id is a non-empty string.
        self.assertIsInstance(envelope["event_id"], str)
        self.assertTrue(len(envelope["event_id"]) > 0)

        # event_class is one of the allowed values.
        self.assertIn(envelope["event_class"], ALLOWED_EVENT_CLASSES)

        # schema_version matches the required pattern.
        self.assertEqual(envelope["schema_version"], "0.1")

        # payload is a dict.
        self.assertIsInstance(envelope["payload"], dict)

        # timestamp is a non-empty string.
        self.assertIsInstance(envelope["timestamp"], str)
        self.assertTrue(len(envelope["timestamp"]) > 0)

    def test_payload_size_limit_enforced(self):
        """Payload exceeding the size limit must be rejected."""
        oversized = {"data": "x" * (MAX_PAYLOAD_BYTES + 1)}
        with self.assertRaises(ValueError) as ctx:
            SignalEnvelopeBuilder.build(
                signal_type="observation",
                event_type="cri.observation.oversized",
                payload=oversized,
            )
        self.assertIn("payload exceeds size limit", str(ctx.exception))

    def test_event_id_unique(self):
        """Each envelope must have a unique event_id."""
        envelope_a = self._build_observation()
        envelope_b = self._build_observation()
        self.assertNotEqual(envelope_a["event_id"], envelope_b["event_id"])

    def test_source_component_is_cri(self):
        """source_component must be Construction_Reference_Intelligence."""
        envelope = self._build_observation()
        self.assertEqual(
            envelope["source_component"],
            "Construction_Reference_Intelligence",
        )

    def test_payload_must_be_dict(self):
        """Non-dict payloads must be rejected."""
        with self.assertRaises(ValueError):
            SignalEnvelopeBuilder.build(
                signal_type="observation",
                event_type="cri.observation.bad",
                payload="not a dict",
            )

    def test_proposal_envelope_valid(self):
        """Proposal envelopes must also be valid."""
        envelope = SignalEnvelopeBuilder.build(
            signal_type="proposal",
            event_type="cri.proposal.test",
            payload={"suggestion": "test proposal"},
        )
        self.assertEqual(envelope["event_class"], "Proposal")
        for field in REQUIRED_FIELDS:
            self.assertIn(field, envelope)


if __name__ == "__main__":
    unittest.main()
