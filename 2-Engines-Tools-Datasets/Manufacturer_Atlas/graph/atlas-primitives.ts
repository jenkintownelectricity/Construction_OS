/**
 * Atlas Graph Primitives
 *
 * Minimal, deterministic graph primitives for the Manufacturer Atlas.
 * These types define the foundational node and edge structures
 * used across the entire manufacturer knowledge graph.
 *
 * This module defines TYPES ONLY — no execution, no rendering.
 */

/** Honesty status classification for every atlas node */
export type AtlasNodeStatus =
  | "grounded"
  | "derived"
  | "scaffold"
  | "deferred"
  | "unverified";

/** Governance tier for atlas edges */
export type GovernanceTier =
  | "manufacturer_published"
  | "code_required"
  | "industry_standard"
  | "derived_inference"
  | "scaffold";

/** Domain classification for atlas nodes */
export type AtlasDomain = "building_envelope";

/** Supported node classes in the manufacturer atlas */
export type AtlasNodeClass =
  | "manufacturer"
  | "system_family"
  | "system"
  | "condition"
  | "assembly"
  | "product"
  | "rule"
  | "detail";

/** Supported relationship types between atlas nodes */
export type AtlasRelationship =
  | "contains"
  | "supports"
  | "uses"
  | "governed_by"
  | "compatible_with"
  | "resolved_by"
  | "references"
  | "outputs";

/**
 * AtlasNode — A single node in the manufacturer knowledge graph.
 *
 * Every node carries an explicit honesty status so that scaffold
 * and grounded truth are never mixed silently.
 */
export interface AtlasNode {
  node_id: string;
  domain: AtlasDomain;
  class: AtlasNodeClass;
  label: string;
  status: AtlasNodeStatus;
  metadata: Record<string, unknown>;
}

/**
 * AtlasEdge — A directed relationship between two atlas nodes.
 *
 * Every edge carries a governance tier indicating the authority
 * level of the relationship.
 */
export interface AtlasEdge {
  edge_id: string;
  from_node: string;
  to_node: string;
  relationship: AtlasRelationship;
  governance_tier: GovernanceTier;
}

/**
 * AtlasGraph — The complete manufacturer atlas graph.
 */
export interface AtlasGraph {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
}
