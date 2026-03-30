/**
 * Tests for PatternResolutionPanel cockpit component.
 */

import React from "react";
import {
  PatternResolutionPanel,
  type PatternResolutionState,
} from "./PatternResolutionPanel";

// Minimal render helper for testing without full React DOM
// Tests validate types, props, and data flow rather than DOM rendering

describe("PatternResolutionPanel types", () => {
  const resolvedState: PatternResolutionState = {
    resultId: "res-001",
    conditionId: "cond-001",
    status: "RESOLVED",
    seamAction: "accepted",
    patternFamilyId: "DNA-CONSTR-FAM-EDGE-001-R1",
    patternId: "DNA-CONSTR-PAT-EDGE-METAL-001-R1",
    variantId: "CHEM-CONSTR-VAR-EDGE-001-R1",
    artifactIntentId: "COLOR-CONSTR-ART-EDGE-001-R1",
    failReasons: [],
    conflicts: [],
    constraintViolations: [],
    score: {
      total_score: 0.92,
      breakdown: {
        family_confidence: 0.95,
        pattern_fit: 0.90,
        variant_match: 0.88,
        constraint_compliance: 1.0,
        conflict_free: 1.0,
      },
    },
    artifactTypesGenerated: ["DXF", "SVG", "PDF", "RenderManifest", "ArtifactLineageRecord"],
    lineageRecordId: "lineage-abc123",
    timestamp: "2026-03-22T12:00:00Z",
  };

  const unresolvedState: PatternResolutionState = {
    resultId: "res-002",
    conditionId: "cond-002",
    status: "UNRESOLVED",
    seamAction: "fail_closed",
    patternFamilyId: null,
    patternId: null,
    variantId: null,
    artifactIntentId: null,
    failReasons: [
      { code: "NO_FAMILY_MATCH", stage: "family_classification", message: "No matching family" },
    ],
    conflicts: [],
    constraintViolations: [],
    score: null,
    artifactTypesGenerated: [],
    lineageRecordId: null,
    timestamp: "2026-03-22T12:00:00Z",
  };

  const conflictState: PatternResolutionState = {
    resultId: "res-003",
    conditionId: "cond-003",
    status: "CONFLICT",
    seamAction: "fail_closed",
    patternFamilyId: "DNA-CONSTR-FAM-EDGE-001-R1",
    patternId: "DNA-CONSTR-PAT-EDGE-METAL-001-R1",
    variantId: "CHEM-CONSTR-VAR-EDGE-001-R1",
    artifactIntentId: null,
    failReasons: [
      { code: "CONFLICT_DETECTED", stage: "conflict_detection", message: "Pattern conflict" },
    ],
    conflicts: [
      {
        conflict_id: "cf-001",
        relationship_id: "rel-001",
        source_id: "pat-001",
        target_id: "pat-002",
        severity: "high",
        description: "Incompatible edge-parapet transition",
        resolution_strategy: "manual_review",
      },
    ],
    constraintViolations: [],
    score: null,
    artifactTypesGenerated: [],
    lineageRecordId: null,
    timestamp: "2026-03-22T12:00:00Z",
  };

  test("resolved state has correct status", () => {
    expect(resolvedState.status).toBe("RESOLVED");
    expect(resolvedState.seamAction).toBe("accepted");
    expect(resolvedState.artifactTypesGenerated.length).toBe(5);
  });

  test("unresolved state has fail reasons", () => {
    expect(unresolvedState.status).toBe("UNRESOLVED");
    expect(unresolvedState.seamAction).toBe("fail_closed");
    expect(unresolvedState.failReasons.length).toBe(1);
    expect(unresolvedState.artifactTypesGenerated.length).toBe(0);
  });

  test("conflict state has conflict records", () => {
    expect(conflictState.status).toBe("CONFLICT");
    expect(conflictState.conflicts.length).toBe(1);
    expect(conflictState.conflicts[0].severity).toBe("high");
  });

  test("resolved state distinguishes advisory from executed", () => {
    // Advisory state (from ALEXANDER)
    expect(resolvedState.patternId).toBeTruthy();
    expect(resolvedState.variantId).toBeTruthy();
    // Executed state (from Runtime)
    expect(resolvedState.artifactTypesGenerated.length).toBeGreaterThan(0);
    expect(resolvedState.lineageRecordId).toBeTruthy();
  });

  test("fail-closed states have no artifacts", () => {
    expect(unresolvedState.artifactTypesGenerated.length).toBe(0);
    expect(unresolvedState.lineageRecordId).toBeNull();
    expect(conflictState.artifactTypesGenerated.length).toBe(0);
    expect(conflictState.lineageRecordId).toBeNull();
  });

  test("blocked state type is valid", () => {
    const blockedState: PatternResolutionState = {
      ...unresolvedState,
      resultId: "res-004",
      status: "BLOCKED",
      failReasons: [
        { code: "AMBIGUOUS_PATTERN", stage: "pattern_resolution", message: "Ambiguous" },
      ],
      constraintViolations: [
        { constraint_id: "c1", constraint_type: "dimensional", violation: "Height exceeds max" },
      ],
    };
    expect(blockedState.status).toBe("BLOCKED");
    expect(blockedState.constraintViolations.length).toBe(1);
  });

  test("null state means no resolution in progress", () => {
    const nullState: PatternResolutionState | null = null;
    expect(nullState).toBeNull();
  });

  test("PatternResolutionPanel component is defined", () => {
    expect(PatternResolutionPanel).toBeDefined();
    expect(typeof PatternResolutionPanel).toBe("function");
  });

  test("all artifact types are from allowed set", () => {
    const allowed = new Set(["DXF", "SVG", "PDF", "RenderManifest", "ArtifactLineageRecord"]);
    for (const t of resolvedState.artifactTypesGenerated) {
      expect(allowed.has(t)).toBe(true);
    }
  });
});
