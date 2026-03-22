/**
 * Construction OS — Cockpit Type Contracts
 *
 * Type definitions for the four cockpit panels:
 *   - Awareness Panel (Awareness Cache snapshot)
 *   - Proposal Mailbox (proposal review workflow)
 *   - Runtime Diagnostics (pipeline events)
 *   - Assistant Console (bounded assistant output)
 *
 * ASSUMED PAYLOAD SHAPES: These types are bounded UI-side contracts derived
 * from upstream system schemas. Each type documents its upstream source.
 * See docs/ui/cockpit-adapters.md for full documentation.
 *
 * FAIL_CLOSED: If upstream data does not match these shapes, adapters
 * must return an error state rather than silently coerce data.
 */

// ─── Awareness Cache Snapshot ──────────────────────────────────────────────
// Source: Construction_Awareness_Cache/awareness/snapshot_model.py

export interface AwarenessSnapshot {
  readonly snapshot_id: string;
  readonly schema_version: string;
  readonly frozen: boolean;
  readonly content_hash: string;
  readonly compiled_at: string;  // ISO-8601
  readonly entry_count: number;
  readonly source_summary: {
    readonly total_events: number;
    readonly by_class: Readonly<Record<string, number>>;
    readonly by_source: Readonly<Record<string, number>>;
  };
  readonly entries: readonly AwarenessEntry[];
}

export interface AwarenessEntry {
  readonly event_id: string;
  readonly event_class: 'Observation' | 'Proposal' | 'ExternallyValidatedEvent';
  readonly event_type: string;
  readonly source_component: string;
  readonly source_repo: string;
  readonly timestamp: string;  // ISO-8601
  readonly payload: Record<string, unknown>;
}

// ─── Derived Awareness State (computed from snapshot) ──────────────────────

export interface AwarenessState {
  readonly snapshot_id: string | null;
  readonly compiled_at: string | null;
  readonly active_conditions: readonly ActiveCondition[];
  readonly pending_artifacts: readonly ArtifactState[];
  readonly delivered_artifacts: readonly ArtifactState[];
  readonly quarantined_artifacts: readonly ArtifactState[];
  readonly open_proposals: readonly OpenProposal[];
  readonly fail_closed_log: readonly FailClosedEntry[];
  readonly status: 'loading' | 'current' | 'stale' | 'empty' | 'error';
  readonly error: string | null;
  readonly last_updated: number;
}

export interface ActiveCondition {
  readonly condition_signature_id: string;
  readonly node_type: string;
  readonly pipeline_stage: string;
  readonly project_id: string;
  readonly detected_at: string;
}

export interface ArtifactState {
  readonly artifact_id: string;
  readonly artifact_type: string;
  readonly renderer_name: string;
  readonly pipeline_stage: string;
  readonly lifecycle: 'pending' | 'delivered' | 'quarantined';
  readonly timestamp: string;
  readonly quarantine_reason?: string;
}

export interface OpenProposal {
  readonly event_id: string;
  readonly source_component: string;
  readonly timestamp: string;
  readonly payload: Record<string, unknown>;
}

export interface FailClosedEntry {
  readonly event_id: string;
  readonly event_type: string;
  readonly reason: string;
  readonly timestamp: string;
  readonly source_component: string;
}

// ─── Proposal Mailbox ──────────────────────────────────────────────────────
// Source: Construction_Cognitive_Bus event envelope (event_class: "Proposal")
// + Construction_Runtime proposal payloads

export type ProposalStatus = 'pending' | 'approved' | 'rejected' | 'elaborating';

export interface ProposalItem {
  readonly proposal_id: string;
  readonly source: string;
  readonly proposal_type: string;
  readonly reasoning_summary: string;
  readonly timestamp: string;  // ISO-8601
  readonly status: ProposalStatus;
  readonly payload: Record<string, unknown>;
  readonly origin: 'runtime' | 'assistant' | 'operator' | 'external';
}

export interface ProposalAction {
  readonly proposal_id: string;
  readonly action: 'approve' | 'reject' | 'elaborate';
  readonly operator_note?: string;
  readonly timestamp: number;
}

// ─── Runtime Diagnostics ───────────────────────────────────────────────────
// Source: Construction_Runtime/runtime/events/event_types.py

export type RuntimeEventType =
  | 'ConditionDetected'
  | 'DetailResolved'
  | 'ArtifactRendered'
  | 'ValidationFailed'
  | 'RuntimeError';

export interface RuntimeDiagnosticEvent {
  readonly event_id: string;
  readonly event_type: RuntimeEventType;
  readonly timestamp: string;
  readonly pipeline_stage: string;
  readonly payload: RuntimeEventPayload;
  readonly severity: 'info' | 'warning' | 'error' | 'critical';
}

export type RuntimeEventPayload =
  | ConditionDetectedPayload
  | DetailResolvedPayload
  | ArtifactRenderedPayload
  | ValidationFailedPayload
  | RuntimeErrorPayload;

// Source: Construction_Runtime/runtime/events/event_types.py — ConditionDetectedPayload
export interface ConditionDetectedPayload {
  readonly type: 'ConditionDetected';
  readonly condition_signature_id: string;
  readonly node_type: string;
  readonly pipeline_stage: string;
  readonly project_id: string;
}

// Source: Construction_Runtime/runtime/events/event_types.py — DetailResolvedPayload
export interface DetailResolvedPayload {
  readonly type: 'DetailResolved';
  readonly condition_signature_id: string;
  readonly resolved_detail_id: string;
  readonly resolution_source: string;
  readonly pipeline_stage: string;
  readonly pattern_id: string;
  readonly variant_id: string;
}

// Source: Construction_Runtime/runtime/events/event_types.py — ArtifactRenderedPayload
export interface ArtifactRenderedPayload {
  readonly type: 'ArtifactRendered';
  readonly artifact_id: string;
  readonly artifact_type: string;
  readonly renderer_name: string;
  readonly pipeline_stage: string;
  readonly instruction_set_id: string;
  readonly lineage_hash: string;
}

// Source: Construction_Runtime/runtime/events/event_types.py — ValidationFailedPayload
export interface ValidationFailedPayload {
  readonly type: 'ValidationFailed';
  readonly validation_stage: string;
  readonly error_code: string;
  readonly failure_reason: string;
  readonly pipeline_stage: string;
  readonly object_id: string;
}

// Source: Construction_Runtime/runtime/events/event_types.py — RuntimeErrorPayload
export interface RuntimeErrorPayload {
  readonly type: 'RuntimeError';
  readonly exception_type: string;
  readonly failure_reason: string;
  readonly pipeline_stage: string;
  readonly error_code: string;
}

export interface RuntimeDiagnosticsState {
  readonly events: readonly RuntimeDiagnosticEvent[];
  readonly pipeline_stages: readonly PipelineStageStatus[];
  readonly artifact_states: readonly ArtifactState[];
  readonly status: 'loading' | 'connected' | 'disconnected' | 'error';
  readonly error: string | null;
  readonly last_event_at: number;
}

export interface PipelineStageStatus {
  readonly stage: string;
  readonly status: 'idle' | 'active' | 'completed' | 'failed' | 'error';
  readonly last_event_type: RuntimeEventType | null;
  readonly last_updated: number;
}

// ─── Assistant Console ─────────────────────────────────────────────────────
// Source: Construction_Assistant/assistant/bounded_output_contract.py

export type AssistantOutputType = 'verified_truth' | 'uncertainty' | 'insufficiency' | 'next_valid_action';

export interface AssistantResponse {
  readonly response_id: string;
  readonly output_type: AssistantOutputType;
  readonly content: string;
  readonly confidence_basis: string;
  readonly snapshot_id: string;
  readonly timestamp: string;  // ISO-8601
  readonly has_proposal: boolean;
  readonly proposal?: ProposalItem;
}

export interface AssistantConsoleState {
  readonly responses: readonly AssistantResponse[];
  readonly status: 'idle' | 'thinking' | 'error';
  readonly error: string | null;
  readonly last_response_at: number;
}
