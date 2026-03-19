"""Graph edge type schema — kernel typing contract.

Defines the canonical set of graph edge types and their required fields.
This is a typing contract ONLY.
"""
from dataclasses import dataclass, field

GRAPH_EDGE_TYPES = frozenset({
    "depends_on", "blocked_by", "interfaces_with", "implemented_by",
    "resolved_by", "derived_from", "classified_as", "included_in",
    "revised_by", "owned_by", "supported_by",
})

@dataclass
class GraphEdgeTypeSchema:
    """Schema definition for a graph edge type.

    Kernel-owned typing contract. Runtime materializes instances.
    """
    edge_type: str = ""
    required_fields: list[str] = field(default_factory=list)
    optional_fields: list[str] = field(default_factory=list)
    valid_from_node_types: list[str] = field(default_factory=list)
    valid_to_node_types: list[str] = field(default_factory=list)
    is_enrichment_edge: bool = False

EDGE_TYPE_REGISTRY: dict[str, GraphEdgeTypeSchema] = {
    "depends_on": GraphEdgeTypeSchema(
        edge_type="depends_on",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "interface", "detail"],
        valid_to_node_types=["condition", "assembly", "interface", "detail"],
    ),
    "blocked_by": GraphEdgeTypeSchema(
        edge_type="blocked_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "interface", "detail"],
        valid_to_node_types=["blocker", "issue"],
    ),
    "interfaces_with": GraphEdgeTypeSchema(
        edge_type="interfaces_with",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["assembly", "interface"],
        valid_to_node_types=["assembly", "interface"],
    ),
    "implemented_by": GraphEdgeTypeSchema(
        edge_type="implemented_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "interface"],
        valid_to_node_types=["detail", "assembly"],
    ),
    "resolved_by": GraphEdgeTypeSchema(
        edge_type="resolved_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["issue", "blocker"],
        valid_to_node_types=["remediation"],
    ),
    "derived_from": GraphEdgeTypeSchema(
        edge_type="derived_from",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "interface", "detail", "artifact"],
        valid_to_node_types=["evidence"],
    ),
    "classified_as": GraphEdgeTypeSchema(
        edge_type="classified_as",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        optional_fields=["enrichment_metadata"],
        valid_from_node_types=["condition"],
        valid_to_node_types=["pattern"],
        is_enrichment_edge=True,
    ),
    "included_in": GraphEdgeTypeSchema(
        edge_type="included_in",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["assembly", "interface", "detail", "artifact"],
        valid_to_node_types=["package"],
    ),
    "revised_by": GraphEdgeTypeSchema(
        edge_type="revised_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "interface", "detail", "package", "artifact"],
        valid_to_node_types=["revision"],
    ),
    "owned_by": GraphEdgeTypeSchema(
        edge_type="owned_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "interface", "detail"],
        valid_to_node_types=["owner"],
    ),
    "supported_by": GraphEdgeTypeSchema(
        edge_type="supported_by",
        required_fields=["graph_edge_id", "edge_type", "from_node_id", "to_node_id", "project_id", "source_basis", "lineage_ref"],
        valid_from_node_types=["condition", "assembly", "remediation"],
        valid_to_node_types=["evidence", "artifact"],
    ),
}
