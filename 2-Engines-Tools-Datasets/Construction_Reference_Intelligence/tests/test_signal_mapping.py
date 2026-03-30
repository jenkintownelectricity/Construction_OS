"""
Tests for CRI signal type mapping to Cognitive Bus event classes.
"""

import unittest

from cri.signal_mapper import SignalMapper


class TestSignalMapping(unittest.TestCase):
    """Verify CRI signal types map correctly to Cognitive Bus event classes."""

    def test_observation_maps_to_observation_class(self):
        """Observation signals must map to the Observation event class."""
        result = SignalMapper.map("observation")
        self.assertEqual(result, "Observation")

    def test_proposal_maps_to_proposal_class(self):
        """Proposal signals must map to the Proposal event class."""
        result = SignalMapper.map("proposal")
        self.assertEqual(result, "Proposal")

    def test_externally_validated_event_mapping_rejected(self):
        """CRI must not be able to map to ExternallyValidatedEvent."""
        with self.assertRaises(ValueError) as ctx:
            SignalMapper.map("externally_validated")
        self.assertIn("unknown CRI signal type", str(ctx.exception))

    def test_unknown_signal_type_rejected(self):
        """Unknown signal types must be rejected."""
        with self.assertRaises(ValueError) as ctx:
            SignalMapper.map("nonexistent_type")
        self.assertIn("unknown CRI signal type", str(ctx.exception))

    def test_reverse_lookup_observation(self):
        """Reverse lookup for Observation returns observation."""
        result = SignalMapper.reverse_lookup("Observation")
        self.assertEqual(result, "observation")

    def test_reverse_lookup_unknown_returns_none(self):
        """Reverse lookup for unknown class returns None."""
        result = SignalMapper.reverse_lookup("ExternallyValidatedEvent")
        self.assertIsNone(result)


if __name__ == "__main__":
    unittest.main()
