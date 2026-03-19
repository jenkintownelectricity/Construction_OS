"""Graph node type schema — kernel typing contract.

Defines the canonical set of graph node types and their required fields.
This is a typing contract ONLY. Kernel does not own graph instances,
does not execute projection, and does not materialize graphs.
"""
from dataclasses import dataclass, field

GRAPH_NODE_TYPES = frozenset({
    "condition", "assembly", "interface", "detail", "issue",
    "blocker", "remediation", "artifact", "evidence", "pattern",
    "package", "revision", "owner",
})

@dataclass
class GraphNodeTypeSchema:
    """Schema definition for a graph node type.

    Kernel-owned typing contract. Runtime materializes instances.
    """
    node_type: str = ""
    required_fields: list[str] = field(default_factory=list)
    optional_fields: list[str] = field(default_factory=list)
    source_object_types: list[str] = field(default_factory=list)
    supports_versioning: bool = True

NODE_TYPE_REGISTRY: dict[str, GraphNodeTypeSchema] = {
    "condition": GraphNodeTypeSchema(
        node_type="condition",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        optional_fields=["pattern_candidate_refs", "pattern_confidence"],
        source_object_types=["ConditionPacket"],
        supports_versioning=True,
    ),
    "assembly": GraphNodeTypeSchema(
        node_type="assembly",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["AssemblyObject"],
    ),
    "interface": GraphNodeTypeSchema(
        node_type="interface",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["InterfaceObject"],
    ),
    "detail": GraphNodeTypeSchema(
        node_type="detail",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["DetailObject"],
    ),
    "issue": GraphNodeTypeSchema(
        node_type="issue",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["IssueRecord"],
    ),
    "blocker": GraphNodeTypeSchema(
        node_type="blocker",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["BlockerRecord"],
    ),
    "remediation": GraphNodeTypeSchema(
        node_type="remediation",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["RemediationAction"],
    ),
    "artifact": GraphNodeTypeSchema(
        node_type="artifact",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["ExportArtifact"],
    ),
    "evidence": GraphNodeTypeSchema(
        node_type="evidence",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["EvidenceRecord"],
    ),
    "pattern": GraphNodeTypeSchema(
        node_type="pattern",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["PatternDefinition"],
    ),
    "package": GraphNodeTypeSchema(
        node_type="package",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["DrawingPackage"],
    ),
    "revision": GraphNodeTypeSchema(
        node_type="revision",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["RevisionEntry"],
    ),
    "owner": GraphNodeTypeSchema(
        node_type="owner",
        required_fields=["graph_node_id", "node_type", "source_object_type", "source_object_id", "project_id", "label", "state_summary", "refs", "metadata", "lineage_ref", "node_version"],
        source_object_types=["OwnerRecord"],
    ),
}
