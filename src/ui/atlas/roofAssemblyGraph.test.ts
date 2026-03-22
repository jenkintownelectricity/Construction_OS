/**
 * Assembly Relationship Graph — Tests
 *
 * Proves:
 *   - At least 4 graph nodes exist
 *   - At least 4 graph edges exist
 *   - All nodes reference existing assembly objects
 *   - All edges reference existing nodes
 *   - All edge kinds are valid
 *   - Graph validates successfully
 *   - getRelatedAssemblies returns correct neighbors
 *   - getRelatedAssemblies returns empty for unknown ID
 *   - Validation rejects unknown assembly references
 *   - Validation rejects unknown node references
 *   - Validation rejects invalid relationship kinds
 *   - No data duplication from roofAssemblyObjects
 *
 * Governance: VKGL04R — Ring 2 gate proof
 */

import { describe, it, expect } from 'vitest';
import {
  GRAPH_NODES,
  GRAPH_EDGES,
  validateGraph,
  getRelatedAssemblies,
  type AssemblyGraphNode,
  type AssemblyGraphEdge,
} from './roofAssemblyGraph';
import { ROOF_ASSEMBLY_OBJECTS } from './roofAssemblyObjects';

describe('GRAPH_NODES — static data', () => {
  it('has at least 4 graph nodes', () => {
    expect(GRAPH_NODES.length).toBeGreaterThanOrEqual(4);
  });

  it('all nodes have non-empty nodeId and assemblyObjectId', () => {
    for (const node of GRAPH_NODES) {
      expect(node.nodeId.trim().length).toBeGreaterThan(0);
      expect(node.assemblyObjectId.trim().length).toBeGreaterThan(0);
    }
  });

  it('all nodes have unique nodeIds', () => {
    const ids = GRAPH_NODES.map((n) => n.nodeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all nodes reference existing assembly objects', () => {
    const assemblyIds = new Set(ROOF_ASSEMBLY_OBJECTS.map((o) => o.objectId));
    for (const node of GRAPH_NODES) {
      expect(assemblyIds.has(node.assemblyObjectId)).toBe(true);
    }
  });

  it('nodes do NOT duplicate label, manufacturer, or spec from assembly objects', () => {
    for (const node of GRAPH_NODES) {
      const n = node as Record<string, unknown>;
      expect(n).not.toHaveProperty('label');
      expect(n).not.toHaveProperty('manufacturer');
      expect(n).not.toHaveProperty('spec');
      expect(n).not.toHaveProperty('areaName');
    }
  });
});

describe('GRAPH_EDGES — static data', () => {
  it('has at least 4 graph edges', () => {
    expect(GRAPH_EDGES.length).toBeGreaterThanOrEqual(4);
  });

  it('all edges have non-empty edgeId, fromNodeId, toNodeId', () => {
    for (const edge of GRAPH_EDGES) {
      expect(edge.edgeId.trim().length).toBeGreaterThan(0);
      expect(edge.fromNodeId.trim().length).toBeGreaterThan(0);
      expect(edge.toNodeId.trim().length).toBeGreaterThan(0);
    }
  });

  it('all edges have unique edgeIds', () => {
    const ids = GRAPH_EDGES.map((e) => e.edgeId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all edges reference existing graph nodes', () => {
    const nodeIds = new Set(GRAPH_NODES.map((n) => n.nodeId));
    for (const edge of GRAPH_EDGES) {
      expect(nodeIds.has(edge.fromNodeId)).toBe(true);
      expect(nodeIds.has(edge.toNodeId)).toBe(true);
    }
  });

  it('all edge kinds are in the locked set', () => {
    const validKinds = new Set(['adjacent', 'up-slope', 'down-slope', 'service-linked']);
    for (const edge of GRAPH_EDGES) {
      expect(validKinds.has(edge.kind)).toBe(true);
    }
  });
});

describe('validateGraph', () => {
  it('validates the static graph successfully', () => {
    const result = validateGraph(GRAPH_NODES, GRAPH_EDGES);
    expect(result.valid).toBe(true);
  });

  it('FAIL_CLOSED on node referencing unknown assembly object', () => {
    const badNodes: AssemblyGraphNode[] = [
      ...GRAPH_NODES,
      { nodeId: 'GN-BAD', assemblyObjectId: 'RA-NONEXISTENT' },
    ];
    const result = validateGraph(badNodes, GRAPH_EDGES);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('UNKNOWN_ASSEMBLY_OBJECT');
    expect(result.errorMessage).toContain('FAIL_CLOSED');
  });

  it('FAIL_CLOSED on edge referencing unknown fromNodeId', () => {
    const badEdges: AssemblyGraphEdge[] = [
      ...GRAPH_EDGES,
      { edgeId: 'GE-BAD', fromNodeId: 'GN-NONEXISTENT', toNodeId: 'GN-001', kind: 'adjacent' },
    ];
    const result = validateGraph(GRAPH_NODES, badEdges);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('UNKNOWN_NODE_REF');
    expect(result.errorMessage).toContain('FAIL_CLOSED');
  });

  it('FAIL_CLOSED on edge referencing unknown toNodeId', () => {
    const badEdges: AssemblyGraphEdge[] = [
      ...GRAPH_EDGES,
      { edgeId: 'GE-BAD', fromNodeId: 'GN-001', toNodeId: 'GN-NONEXISTENT', kind: 'adjacent' },
    ];
    const result = validateGraph(GRAPH_NODES, badEdges);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('UNKNOWN_NODE_REF');
  });

  it('FAIL_CLOSED on edge with invalid relationship kind', () => {
    const badEdges: AssemblyGraphEdge[] = [
      ...GRAPH_EDGES,
      { edgeId: 'GE-BAD', fromNodeId: 'GN-001', toNodeId: 'GN-002', kind: 'unknown-kind' as never },
    ];
    const result = validateGraph(GRAPH_NODES, badEdges);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe('INVALID_RELATIONSHIP_KIND');
    expect(result.errorMessage).toContain('FAIL_CLOSED');
  });
});

describe('getRelatedAssemblies', () => {
  it('returns related assemblies for RA-001 (Main Roof)', () => {
    const related = getRelatedAssemblies('RA-001');
    expect(related.length).toBeGreaterThanOrEqual(2);
    const relatedIds = related.map((r) => r.assemblyObject.objectId);
    expect(relatedIds).toContain('RA-002'); // adjacent
    expect(relatedIds).toContain('RA-003'); // down-slope
  });

  it('returns related assemblies for RA-002 (Mech Penthouse)', () => {
    const related = getRelatedAssemblies('RA-002');
    expect(related.length).toBeGreaterThanOrEqual(2);
    const relatedIds = related.map((r) => r.assemblyObject.objectId);
    expect(relatedIds).toContain('RA-001'); // adjacent (reverse)
    expect(relatedIds).toContain('RA-004'); // service-linked
  });

  it('returns related assemblies for RA-004 (Service Wing)', () => {
    const related = getRelatedAssemblies('RA-004');
    expect(related.length).toBeGreaterThanOrEqual(2);
    const relatedIds = related.map((r) => r.assemblyObject.objectId);
    expect(relatedIds).toContain('RA-002'); // service-linked (reverse)
    expect(relatedIds).toContain('RA-001'); // adjacent
  });

  it('returns empty array for unknown assembly ID', () => {
    const related = getRelatedAssemblies('RA-NONEXISTENT');
    expect(related).toEqual([]);
  });

  it('each related assembly has assemblyObject, relationshipKind, and edgeId', () => {
    const related = getRelatedAssemblies('RA-001');
    for (const rel of related) {
      expect(rel.assemblyObject).toBeDefined();
      expect(rel.assemblyObject.objectId).toBeTruthy();
      expect(rel.relationshipKind).toBeTruthy();
      expect(rel.edgeId).toBeTruthy();
    }
  });

  it('related assemblies derive data from roofAssemblyObjects, not graph nodes', () => {
    const related = getRelatedAssemblies('RA-001');
    for (const rel of related) {
      // Each related assemblyObject should have full data from roofAssemblyObjects
      expect(rel.assemblyObject.label).toBeTruthy();
      expect(rel.assemblyObject.manufacturer).toBeTruthy();
      expect(rel.assemblyObject.spec).toBeTruthy();
      expect(rel.assemblyObject.assemblyType).toBe('roofing');
    }
  });
});
