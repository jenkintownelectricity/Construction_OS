"""Graph relation typing schema — kernel typing contract.

Defines the typing rules for distinguishing hard runtime edges
from enrichment-derived edges. This is critical for governance:
pattern-derived relations must remain distinguishable from
authoritative runtime facts.
"""
from dataclasses import dataclass, field

@dataclass
class GraphRelationTypingSchema:
    """Typing contract for graph relation classification.

    Kernel defines the boundary between hard facts and enrichment.
    Runtime enforces it during materialization.
    """
    relation_class: str = ""  # "hard_fact" | "enrichment"
    source_authority: str = ""  # "runtime" | "pattern_kernel" | "evidence"
    requires_confidence: bool = False
    confidence_threshold: float = 0.0
    mutable_by_enrichment: bool = False

RELATION_TYPING_RULES: dict[str, GraphRelationTypingSchema] = {
    "depends_on": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "blocked_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "interfaces_with": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "implemented_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "resolved_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "derived_from": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="evidence"),
    "classified_as": GraphRelationTypingSchema(
        relation_class="enrichment",
        source_authority="pattern_kernel",
        requires_confidence=True,
        confidence_threshold=0.5,
        mutable_by_enrichment=True,
    ),
    "included_in": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "revised_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "owned_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="runtime"),
    "supported_by": GraphRelationTypingSchema(relation_class="hard_fact", source_authority="evidence"),
}
