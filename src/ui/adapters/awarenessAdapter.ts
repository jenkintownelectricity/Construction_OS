/**
 * Construction OS — Awareness Cache Adapter (Bounded UI Facade)
 *
 * Bounded UI-side adapter that provides the Awareness Panel with snapshot
 * data from the Awareness Cache. This adapter is a FACADE — it does not
 * execute upstream logic; it only consumes snapshot data and derives
 * display state.
 *
 * ASSUMED PAYLOAD SHAPE:
 * Upstream: Construction_Awareness_Cache/awareness/snapshot_model.py
 *
 * Snapshot envelope: {
 *   snapshot_id: string,
 *   schema_version: "0.1",
 *   frozen: true,
 *   content_hash: string (sha256 hex),
 *   compiled_at: string (ISO-8601),
 *   entry_count: number,
 *   source_summary: { total_events: number, by_class: Record<string, number>, by_source: Record<string, number> },
 *   entries: Array<{
 *     event_id: string,
 *     event_class: "Observation" | "Proposal" | "ExternallyValidatedEvent",
 *     event_type: string,
 *     source_component: string,
 *     source_repo: string,
 *     timestamp: string (ISO-8601),
 *     payload: object
 *   }>
 * }
 *
 * Entry payloads vary by event_type:
 * - ConditionDetected: { condition_signature_id, node_type, pipeline_stage, project_id }
 * - ArtifactRendered: { artifact_id, artifact_type, renderer_name, pipeline_stage, instruction_set_id, lineage_hash }
 * - ValidationFailed: { validation_stage, error_code, failure_reason, pipeline_stage, object_id }
 * - RuntimeError: { exception_type, failure_reason, pipeline_stage, error_code }
 *
 * FAIL_CLOSED: If snapshot data does not conform, adapter returns error state.
 * MOCK: This adapter currently provides mock data. isMock = true.
 */

import type {
  AwarenessSnapshot,
  AwarenessState,
  ActiveCondition,
  ArtifactState,
  OpenProposal,
  FailClosedEntry,
} from '../contracts/cockpit-types';

export interface AwarenessAdapter {
  readonly adapterName: string;
  readonly isMock: boolean;
  getSnapshot(): Promise<AwarenessSnapshot | null>;
  getAwarenessState(): Promise<AwarenessState>;
}

// ─── Snapshot → Derived State ──────────────────────────────────────────────

function deriveAwarenessState(snapshot: AwarenessSnapshot | null): AwarenessState {
  if (!snapshot) {
    return {
      snapshot_id: null,
      compiled_at: null,
      active_conditions: [],
      pending_artifacts: [],
      delivered_artifacts: [],
      quarantined_artifacts: [],
      open_proposals: [],
      fail_closed_log: [],
      status: 'empty',
      error: null,
      last_updated: Date.now(),
    };
  }

  const active_conditions: ActiveCondition[] = [];
  const pending_artifacts: ArtifactState[] = [];
  const delivered_artifacts: ArtifactState[] = [];
  const quarantined_artifacts: ArtifactState[] = [];
  const open_proposals: OpenProposal[] = [];
  const fail_closed_log: FailClosedEntry[] = [];

  // Track artifact IDs that have validation failures for quarantine
  const failedArtifactIds = new Set<string>();
  for (const entry of snapshot.entries) {
    if (entry.event_type === 'ValidationFailed') {
      const objectId = (entry.payload as Record<string, unknown>).object_id;
      if (typeof objectId === 'string') failedArtifactIds.add(objectId);
    }
    if (entry.event_type === 'RuntimeError') {
      fail_closed_log.push({
        event_id: entry.event_id,
        event_type: entry.event_type,
        reason: String((entry.payload as Record<string, unknown>).failure_reason ?? 'Unknown runtime error'),
        timestamp: entry.timestamp,
        source_component: entry.source_component,
      });
    }
  }

  for (const entry of snapshot.entries) {
    const p = entry.payload as Record<string, unknown>;

    switch (entry.event_type) {
      case 'ConditionDetected':
        active_conditions.push({
          condition_signature_id: String(p.condition_signature_id ?? ''),
          node_type: String(p.node_type ?? ''),
          pipeline_stage: String(p.pipeline_stage ?? ''),
          project_id: String(p.project_id ?? ''),
          detected_at: entry.timestamp,
        });
        break;

      case 'ArtifactRendered': {
        const artifactId = String(p.artifact_id ?? '');
        const isQuarantined = failedArtifactIds.has(artifactId);
        const artifact: ArtifactState = {
          artifact_id: artifactId,
          artifact_type: String(p.artifact_type ?? ''),
          renderer_name: String(p.renderer_name ?? ''),
          pipeline_stage: String(p.pipeline_stage ?? ''),
          lifecycle: isQuarantined ? 'quarantined' : 'delivered',
          timestamp: entry.timestamp,
          quarantine_reason: isQuarantined ? 'Validation failure detected for this artifact' : undefined,
        };
        if (isQuarantined) {
          quarantined_artifacts.push(artifact);
        } else {
          delivered_artifacts.push(artifact);
        }
        break;
      }

      case 'ValidationFailed':
        fail_closed_log.push({
          event_id: entry.event_id,
          event_type: entry.event_type,
          reason: String(p.failure_reason ?? 'Validation failed'),
          timestamp: entry.timestamp,
          source_component: entry.source_component,
        });
        break;
    }

    if (entry.event_class === 'Proposal') {
      open_proposals.push({
        event_id: entry.event_id,
        source_component: entry.source_component,
        timestamp: entry.timestamp,
        payload: p,
      });
    }
  }

  // Check staleness (snapshot older than 5 minutes)
  const compiledAt = new Date(snapshot.compiled_at).getTime();
  const isStale = Date.now() - compiledAt > 5 * 60 * 1000;

  return {
    snapshot_id: snapshot.snapshot_id,
    compiled_at: snapshot.compiled_at,
    active_conditions,
    pending_artifacts,
    delivered_artifacts,
    quarantined_artifacts,
    open_proposals,
    fail_closed_log,
    status: isStale ? 'stale' : 'current',
    error: null,
    last_updated: Date.now(),
  };
}

// ─── Mock Adapter ──────────────────────────────────────────────────────────

const MOCK_SNAPSHOT: AwarenessSnapshot = {
  snapshot_id: 'snap-mock-001',
  schema_version: '0.1',
  frozen: true,
  content_hash: 'sha256:mock-0000000000000000',
  compiled_at: new Date().toISOString(),
  entry_count: 8,
  source_summary: {
    total_events: 8,
    by_class: { Observation: 6, Proposal: 2 },
    by_source: { Construction_Runtime: 6, Construction_Intelligence_Workers: 2 },
  },
  entries: [
    {
      event_id: 'evt-001',
      event_class: 'Observation',
      event_type: 'ConditionDetected',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      payload: { condition_signature_id: 'CS-PARAPET-001', node_type: 'PARAPET', pipeline_stage: 'pipeline_entry', project_id: 'highland-medical' },
    },
    {
      event_id: 'evt-002',
      event_class: 'Observation',
      event_type: 'ConditionDetected',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 90000).toISOString(),
      payload: { condition_signature_id: 'CS-DRAIN-002', node_type: 'DRAIN', pipeline_stage: 'pipeline_entry', project_id: 'highland-medical' },
    },
    {
      event_id: 'evt-003',
      event_class: 'Observation',
      event_type: 'DetailResolved',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      payload: { condition_signature_id: 'CS-PARAPET-001', resolved_detail_id: 'DET-TERM-001', resolution_source: 'detail_index', pipeline_stage: 'detail_resolution', pattern_id: 'cpat-termination-failure', variant_id: 'V001' },
    },
    {
      event_id: 'evt-004',
      event_class: 'Observation',
      event_type: 'ArtifactRendered',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      payload: { artifact_id: 'ART-DWG-001', artifact_type: 'shop_drawing', renderer_name: 'SVGRenderer', pipeline_stage: 'artifact_rendering', instruction_set_id: 'IS-001', lineage_hash: 'lin-abc123' },
    },
    {
      event_id: 'evt-005',
      event_class: 'Observation',
      event_type: 'ValidationFailed',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 20000).toISOString(),
      payload: { validation_stage: 'structural', error_code: 'VAL-STRUCT-003', failure_reason: 'Bolt spacing exceeds maximum allowable for W12x26 connection', pipeline_stage: 'input_validation', object_id: 'ART-DWG-002' },
    },
    {
      event_id: 'evt-006',
      event_class: 'Observation',
      event_type: 'ArtifactRendered',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      payload: { artifact_id: 'ART-DWG-002', artifact_type: 'shop_drawing', renderer_name: 'SVGRenderer', pipeline_stage: 'artifact_rendering', instruction_set_id: 'IS-002', lineage_hash: 'lin-def456' },
    },
    {
      event_id: 'evt-007',
      event_class: 'Proposal',
      event_type: 'ProposalSubmitted',
      source_component: 'Construction_Intelligence_Workers',
      source_repo: 'Construction_Intelligence_Workers',
      timestamp: new Date(Date.now() - 10000).toISOString(),
      payload: { proposal_type: 'detail_substitution', reasoning_summary: 'Alternative flashing detail DET-FLASH-003 may resolve termination gap at parapet condition CS-PARAPET-001', target_condition: 'CS-PARAPET-001' },
    },
    {
      event_id: 'evt-008',
      event_class: 'Observation',
      event_type: 'RuntimeError',
      source_component: 'Construction_Runtime',
      source_repo: 'Construction_Runtime',
      timestamp: new Date(Date.now() - 5000).toISOString(),
      payload: { exception_type: 'RenderTimeout', failure_reason: 'SVG render exceeded 30s timeout for complex geometry', pipeline_stage: 'artifact_rendering', error_code: 'RT-TIMEOUT-001' },
    },
  ],
};

export const mockAwarenessAdapter: AwarenessAdapter = {
  adapterName: 'MockAwarenessAdapter',
  isMock: true,

  async getSnapshot(): Promise<AwarenessSnapshot | null> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_SNAPSHOT;
  },

  async getAwarenessState(): Promise<AwarenessState> {
    const snapshot = await this.getSnapshot();
    return deriveAwarenessState(snapshot);
  },
};
