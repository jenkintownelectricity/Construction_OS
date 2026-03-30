"""
CRI Signal Contract v0.1 — Configuration constants.

Identity, schema version, and allowed signal types for CRI.
"""

# --- CRI Identity ---
SOURCE_COMPONENT = "Construction_Reference_Intelligence"
SOURCE_REPO = "Construction_Reference_Intelligence"

# --- Schema ---
SCHEMA_VERSION = "0.1"

# --- Payload size limit (bytes) — mirrors Cognitive Bus limit ---
MAX_PAYLOAD_BYTES = 65536  # 64 KiB

# --- Allowed CRI signal types ---
ALLOWED_SIGNAL_TYPES = frozenset({
    "observation",
    "proposal",
})

# --- Forbidden event classes — CRI must never emit these ---
FORBIDDEN_EVENT_CLASSES = frozenset({
    "ExternallyValidatedEvent",
})
