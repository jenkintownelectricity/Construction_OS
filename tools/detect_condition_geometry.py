"""
Condition Geometry Detection Kernel
Construction OS — Bounded heuristic condition detection from semantic geometry.

Input: semantic geometry JSON (entities with types, positions, relationships)
Output: list of detected conditions with confidence scores

Operational conditions in this wave:
  parapet, drain, penetration, corner, expansion_joint

No AI required. Heuristic rules only.
"""

import json
import sys
from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class DetectedCondition:
    condition: str
    confidence: float
    features: list[str]
    source_geometry: dict
    detail_id_hint: Optional[str] = None


# --- Heuristic detection rules ---

def detect_parapet(entities: list[dict]) -> Optional[DetectedCondition]:
    """Detect parapet condition from vertical wall elements at roof edge."""
    features = []
    score = 0.0

    for e in entities:
        etype = (e.get("type") or e.get("entity_type") or "").lower()
        layer = (e.get("layer") or "").lower()
        text = (e.get("text") or "").lower()

        if any(k in etype for k in ["wall", "vertical"]):
            features.append("vertical_wall_element")
            score += 0.2
        if "parapet" in layer or "parapet" in text:
            features.append("parapet_layer_reference")
            score += 0.3
        if any(k in layer for k in ["coping", "cap", "flashing"]):
            features.append("coping_or_cap_reference")
            score += 0.2
        if any(k in text for k in ["termination", "term bar", "termination bar"]):
            features.append("termination_reference")
            score += 0.15

    if not features:
        return None

    return DetectedCondition(
        condition="parapet",
        confidence=min(score, 1.0),
        features=features,
        source_geometry={"entity_count": len(entities), "rule": "parapet_heuristic"},
    )


def detect_drain(entities: list[dict]) -> Optional[DetectedCondition]:
    """Detect roof drain from circular geometry and drain references."""
    features = []
    score = 0.0

    for e in entities:
        etype = (e.get("type") or e.get("entity_type") or "").lower()
        layer = (e.get("layer") or "").lower()
        text = (e.get("text") or "").lower()

        if etype in ["circle", "arc"]:
            features.append("circular_geometry")
            score += 0.2
        if "drain" in layer or "drain" in text:
            features.append("drain_reference")
            score += 0.35
        if any(k in text for k in ["clamping", "clamp ring", "collar"]):
            features.append("clamp_or_collar_reference")
            score += 0.2
        if "sump" in text or "sump" in layer:
            features.append("sump_reference")
            score += 0.15

    if not features:
        return None

    return DetectedCondition(
        condition="drain",
        confidence=min(score, 1.0),
        features=features,
        source_geometry={"entity_count": len(entities), "rule": "drain_heuristic"},
    )


def detect_penetration(entities: list[dict]) -> Optional[DetectedCondition]:
    """Detect pipe penetration from small circular cutouts and penetration refs."""
    features = []
    score = 0.0

    for e in entities:
        etype = (e.get("type") or e.get("entity_type") or "").lower()
        layer = (e.get("layer") or "").lower()
        text = (e.get("text") or "").lower()

        if etype in ["circle", "arc"]:
            radius = e.get("radius", 0)
            if 0 < radius < 12:  # small diameter typical of pipe
                features.append("small_circular_cutout")
                score += 0.25
        if any(k in layer for k in ["pipe", "penetration", "pene"]):
            features.append("penetration_layer_reference")
            score += 0.3
        if any(k in text for k in ["pipe", "penetration", "boot", "sleeve"]):
            features.append("penetration_text_reference")
            score += 0.25

    if not features:
        return None

    return DetectedCondition(
        condition="penetration",
        confidence=min(score, 1.0),
        features=features,
        source_geometry={"entity_count": len(entities), "rule": "penetration_heuristic"},
    )


def detect_corner(entities: list[dict]) -> Optional[DetectedCondition]:
    """Detect inside/outside corner from perpendicular wall intersections."""
    features = []
    score = 0.0

    for e in entities:
        etype = (e.get("type") or e.get("entity_type") or "").lower()
        layer = (e.get("layer") or "").lower()
        text = (e.get("text") or "").lower()

        if any(k in text for k in ["corner", "inside corner", "outside corner"]):
            features.append("corner_text_reference")
            score += 0.35
        if any(k in layer for k in ["corner", "intersection"]):
            features.append("corner_layer_reference")
            score += 0.25
        if etype == "line":
            # Perpendicular line pairs suggest corners
            angle = e.get("angle")
            if angle is not None and (abs(angle - 90) < 5 or abs(angle - 270) < 5):
                features.append("perpendicular_line")
                score += 0.15

    if not features:
        return None

    return DetectedCondition(
        condition="corner",
        confidence=min(score, 1.0),
        features=features,
        source_geometry={"entity_count": len(entities), "rule": "corner_heuristic"},
    )


def detect_expansion_joint(entities: list[dict]) -> Optional[DetectedCondition]:
    """Detect expansion joint from parallel lines with gap and joint references."""
    features = []
    score = 0.0

    for e in entities:
        layer = (e.get("layer") or "").lower()
        text = (e.get("text") or "").lower()

        if any(k in text for k in ["expansion", "joint", "exp jt", "exp. jt"]):
            features.append("expansion_joint_text")
            score += 0.35
        if any(k in layer for k in ["expansion", "joint"]):
            features.append("expansion_joint_layer")
            score += 0.25
        if "bellows" in text or "flexible" in text:
            features.append("bellows_reference")
            score += 0.2

    if not features:
        return None

    return DetectedCondition(
        condition="expansion_joint",
        confidence=min(score, 1.0),
        features=features,
        source_geometry={"entity_count": len(entities), "rule": "expansion_joint_heuristic"},
    )


# --- Main detection pipeline ---

DETECTORS = [
    detect_parapet,
    detect_drain,
    detect_penetration,
    detect_corner,
    detect_expansion_joint,
]


def detect_conditions(geometry_json: dict) -> list[dict]:
    """
    Run all condition detectors against semantic geometry input.
    Returns list of detected conditions sorted by confidence descending.
    """
    entities = geometry_json.get("entities", [])
    if not entities:
        return []

    results = []
    for detector in DETECTORS:
        result = detector(entities)
        if result is not None:
            results.append(asdict(result))

    results.sort(key=lambda r: r["confidence"], reverse=True)
    return results


def main():
    """CLI entry point: reads JSON from stdin or file arg."""
    if len(sys.argv) > 1:
        with open(sys.argv[1], "r") as f:
            data = json.load(f)
    else:
        data = json.load(sys.stdin)

    results = detect_conditions(data)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
