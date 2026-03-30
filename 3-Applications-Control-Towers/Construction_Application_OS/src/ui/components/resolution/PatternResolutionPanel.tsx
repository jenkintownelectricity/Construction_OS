/**
 * PatternResolutionPanel — Cockpit subpanel for pattern resolution visibility.
 *
 * Displays the current state of PatternResolutionResult processing through
 * the ALEXANDER → Runtime seam. Shows:
 *   - Resolution status (RESOLVED / UNRESOLVED / BLOCKED / CONFLICT)
 *   - Fail reasons for non-RESOLVED states
 *   - Conflict details when present
 *   - Constraint violations when present
 *   - Score breakdown for RESOLVED states
 *   - Clear distinction between advisory resolution state and executed artifact state
 *
 * Ring 3 TOUCH-ALLOWED: cockpit panel additions for resolution visibility.
 */

import React from "react";

// ─── Types ──────────────────────────────────────────────────────

export type ResolutionStatus = "RESOLVED" | "UNRESOLVED" | "BLOCKED" | "CONFLICT";
export type SeamAction = "accepted" | "fail_closed" | "preflight_failed" | "pending";

export interface FailReason {
  code: string;
  stage: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ConflictRecord {
  conflict_id: string;
  relationship_id: string;
  source_id: string;
  target_id: string;
  severity: string;
  description?: string;
  resolution_strategy?: string;
}

export interface ConstraintViolation {
  constraint_id: string;
  constraint_type: string;
  violation: string;
  parameter?: string;
  expected?: unknown;
  actual?: unknown;
}

export interface ScoreBreakdown {
  total_score: number;
  breakdown?: {
    family_confidence: number;
    pattern_fit: number;
    variant_match: number;
    constraint_compliance: number;
    conflict_free: number;
  };
}

export interface PatternResolutionState {
  resultId: string;
  conditionId: string;
  status: ResolutionStatus;
  seamAction: SeamAction;
  /** Advisory state from ALEXANDER (Ring 2) */
  patternFamilyId: string | null;
  patternId: string | null;
  variantId: string | null;
  artifactIntentId: string | null;
  /** Fail context */
  failReasons: FailReason[];
  conflicts: ConflictRecord[];
  constraintViolations: ConstraintViolation[];
  score: ScoreBreakdown | null;
  /** Executed artifact state from Runtime */
  artifactTypesGenerated: string[];
  lineageRecordId: string | null;
  timestamp: string;
}

// ─── Status Badge ───────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ResolutionStatus,
  { label: string; color: string; bgColor: string }
> = {
  RESOLVED: { label: "Resolved", color: "#065f46", bgColor: "#d1fae5" },
  UNRESOLVED: { label: "Unresolved", color: "#92400e", bgColor: "#fef3c7" },
  BLOCKED: { label: "Blocked", color: "#991b1b", bgColor: "#fee2e2" },
  CONFLICT: { label: "Conflict", color: "#7c2d12", bgColor: "#ffedd5" },
};

function StatusBadge({ status }: { status: ResolutionStatus }): React.ReactElement {
  const config = STATUS_CONFIG[status];
  return (
    <span
      data-testid="status-badge"
      style={{
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      {config.label}
    </span>
  );
}

// ─── Seam Action Indicator ──────────────────────────────────────

function SeamActionIndicator({ action }: { action: SeamAction }): React.ReactElement {
  const labels: Record<SeamAction, string> = {
    accepted: "Artifacts Generated",
    fail_closed: "Execution Halted (Fail-Closed)",
    preflight_failed: "Preflight Failed",
    pending: "Pending",
  };

  return (
    <div data-testid="seam-action" style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
      Runtime Action: <strong>{labels[action]}</strong>
    </div>
  );
}

// ─── Fail Reasons Section ───────────────────────────────────────

function FailReasonsList({ reasons }: { reasons: FailReason[] }): React.ReactElement | null {
  if (reasons.length === 0) return null;
  return (
    <div data-testid="fail-reasons" style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#991b1b" }}>Fail Reasons:</div>
      <ul style={{ margin: "4px 0", paddingLeft: 16, fontSize: 11 }}>
        {reasons.map((r, i) => (
          <li key={i} data-testid={`fail-reason-${i}`}>
            <strong>[{r.stage}]</strong> {r.code}: {r.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Conflict Details Section ───────────────────────────────────

function ConflictDetails({ conflicts }: { conflicts: ConflictRecord[] }): React.ReactElement | null {
  if (conflicts.length === 0) return null;
  return (
    <div data-testid="conflict-details" style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#7c2d12" }}>Conflicts:</div>
      <ul style={{ margin: "4px 0", paddingLeft: 16, fontSize: 11 }}>
        {conflicts.map((c) => (
          <li key={c.conflict_id}>
            <strong>{c.severity}</strong>: {c.description || c.conflict_id}
            {c.resolution_strategy && (
              <span style={{ color: "#6b7280" }}> — Strategy: {c.resolution_strategy}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Constraint Violations Section ──────────────────────────────

function ConstraintViolationDetails({
  violations,
}: {
  violations: ConstraintViolation[];
}): React.ReactElement | null {
  if (violations.length === 0) return null;
  return (
    <div data-testid="constraint-violations" style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#991b1b" }}>Constraint Violations:</div>
      <ul style={{ margin: "4px 0", paddingLeft: 16, fontSize: 11 }}>
        {violations.map((v) => (
          <li key={v.constraint_id}>
            <strong>[{v.constraint_type}]</strong> {v.violation}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Score Breakdown ────────────────────────────────────────────

function ScoreDisplay({ score }: { score: ScoreBreakdown | null }): React.ReactElement | null {
  if (!score) return null;
  return (
    <div data-testid="score-breakdown" style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#065f46" }}>
        Score: {(score.total_score * 100).toFixed(1)}%
      </div>
      {score.breakdown && (
        <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
          Family: {(score.breakdown.family_confidence * 100).toFixed(0)}%
          {" | "}Pattern: {(score.breakdown.pattern_fit * 100).toFixed(0)}%
          {" | "}Variant: {(score.breakdown.variant_match * 100).toFixed(0)}%
          {" | "}Constraint: {(score.breakdown.constraint_compliance * 100).toFixed(0)}%
          {" | "}Conflict-Free: {(score.breakdown.conflict_free * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

// ─── Artifact State Section ─────────────────────────────────────

function ArtifactState({
  types,
  lineageId,
}: {
  types: string[];
  lineageId: string | null;
}): React.ReactElement | null {
  if (types.length === 0) return null;
  return (
    <div data-testid="artifact-state" style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#065f46" }}>
        Executed Artifacts:
      </div>
      <div style={{ fontSize: 10, color: "#374151" }}>{types.join(", ")}</div>
      {lineageId && (
        <div style={{ fontSize: 10, color: "#6b7280" }}>Lineage: {lineageId}</div>
      )}
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────

export interface PatternResolutionPanelProps {
  state: PatternResolutionState | null;
}

/**
 * PatternResolutionPanel — displays the full resolution seam state.
 *
 * Clearly distinguishes:
 * - Advisory resolution state (from ALEXANDER, Ring 2)
 * - Executed artifact state (from Runtime, deterministic)
 */
export function PatternResolutionPanel({
  state,
}: PatternResolutionPanelProps): React.ReactElement {
  if (!state) {
    return (
      <div
        data-testid="resolution-panel"
        style={{
          padding: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        No pattern resolution in progress.
      </div>
    );
  }

  return (
    <div
      data-testid="resolution-panel"
      style={{
        padding: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 6,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Pattern Resolution</div>
        <StatusBadge status={state.status} />
      </div>

      {/* IDs */}
      <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
        Result: {state.resultId} | Condition: {state.conditionId}
      </div>

      {/* Seam action — distinguishes advisory from executed */}
      <SeamActionIndicator action={state.seamAction} />

      {/* Advisory resolution IDs (from ALEXANDER) */}
      {state.patternId && (
        <div style={{ fontSize: 10, color: "#374151", marginTop: 4 }}>
          <span style={{ color: "#6b7280" }}>Advisory:</span>{" "}
          Pattern {state.patternId}
          {state.variantId && <> | Variant {state.variantId}</>}
        </div>
      )}

      {/* Fail context */}
      <FailReasonsList reasons={state.failReasons} />
      <ConflictDetails conflicts={state.conflicts} />
      <ConstraintViolationDetails violations={state.constraintViolations} />

      {/* Score for resolved */}
      <ScoreDisplay score={state.score} />

      {/* Executed artifact state */}
      <ArtifactState types={state.artifactTypesGenerated} lineageId={state.lineageRecordId} />
    </div>
  );
}

export default PatternResolutionPanel;
