/**
 * Construction OS — Runtime Diagnostics Adapter (Bounded UI Facade)
 *
 * Bounded UI-side adapter for the Runtime Diagnostics panel. Consumes
 * runtime pipeline events and provides visualization state.
 *
 * ASSUMED PAYLOAD SHAPE:
 * Upstream: Construction_Runtime/runtime/events/event_types.py
 *
 * Event types and their payloads:
 *
 * ConditionDetected: {
 *   condition_signature_id: string,
 *   node_type: string,
 *   pipeline_stage: string,
 *   project_id: string (default "")
 * }
 *
 * DetailResolved: {
 *   condition_signature_id: string,
 *   resolved_detail_id: string,
 *   resolution_source: string,
 *   pipeline_stage: string,
 *   pattern_id: string (default ""),
 *   variant_id: string (default "")
 * }
 *
 * ArtifactRendered: {
 *   artifact_id: string,
 *   artifact_type: string,
 *   renderer_name: string,
 *   pipeline_stage: string,
 *   instruction_set_id: string (default ""),
 *   lineage_hash: string (default "")
 * }
 *
 * ValidationFailed: {
 *   validation_stage: string,
 *   error_code: string,
 *   failure_reason: string,
 *   pipeline_stage: string,
 *   object_id: string (default "")
 * }
 *
 * RuntimeError: {
 *   exception_type: string,
 *   failure_reason: string,
 *   pipeline_stage: string,
 *   error_code: string (default "")
 * }
 *
 * Pipeline stages (ordered):
 *   pipeline_entry → input_validation → detail_resolution →
 *   parameterization → ir_emission → rendering → artifact_rendering →
 *   pipeline_complete
 *
 * FAIL_CLOSED: If event data does not conform, adapter returns error state.
 * MOCK: This adapter currently provides mock data. isMock = true.
 */

import type {
  RuntimeDiagnosticEvent,
  RuntimeDiagnosticsState,
  PipelineStageStatus,
  RuntimeEventType,
  ArtifactState,
} from '../contracts/cockpit-types';

export interface RuntimeDiagnosticsAdapter {
  readonly adapterName: string;
  readonly isMock: boolean;
  getEvents(): Promise<readonly RuntimeDiagnosticEvent[]>;
  getDiagnosticsState(): Promise<RuntimeDiagnosticsState>;
}

// ─── Pipeline stage ordering ───────────────────────────────────────────────

const PIPELINE_STAGES = [
  'pipeline_entry',
  'input_validation',
  'detail_resolution',
  'parameterization',
  'ir_emission',
  'rendering',
  'artifact_rendering',
  'pipeline_complete',
] as const;

function deriveSeverity(eventType: RuntimeEventType): 'info' | 'warning' | 'error' | 'critical' {
  switch (eventType) {
    case 'ConditionDetected': return 'info';
    case 'DetailResolved': return 'info';
    case 'ArtifactRendered': return 'info';
    case 'ValidationFailed': return 'error';
    case 'RuntimeError': return 'critical';
  }
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const mockEvents: RuntimeDiagnosticEvent[] = [
  {
    event_id: 'rt-evt-001',
    event_type: 'ConditionDetected',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    pipeline_stage: 'pipeline_entry',
    payload: { type: 'ConditionDetected', condition_signature_id: 'CS-PARAPET-001', node_type: 'PARAPET', pipeline_stage: 'pipeline_entry', project_id: 'highland-medical' },
    severity: 'info',
  },
  {
    event_id: 'rt-evt-002',
    event_type: 'ConditionDetected',
    timestamp: new Date(Date.now() - 110000).toISOString(),
    pipeline_stage: 'pipeline_entry',
    payload: { type: 'ConditionDetected', condition_signature_id: 'CS-DRAIN-002', node_type: 'DRAIN', pipeline_stage: 'pipeline_entry', project_id: 'highland-medical' },
    severity: 'info',
  },
  {
    event_id: 'rt-evt-003',
    event_type: 'DetailResolved',
    timestamp: new Date(Date.now() - 80000).toISOString(),
    pipeline_stage: 'detail_resolution',
    payload: { type: 'DetailResolved', condition_signature_id: 'CS-PARAPET-001', resolved_detail_id: 'DET-TERM-001', resolution_source: 'detail_index', pipeline_stage: 'detail_resolution', pattern_id: 'cpat-termination-failure', variant_id: 'V001' },
    severity: 'info',
  },
  {
    event_id: 'rt-evt-004',
    event_type: 'ArtifactRendered',
    timestamp: new Date(Date.now() - 40000).toISOString(),
    pipeline_stage: 'artifact_rendering',
    payload: { type: 'ArtifactRendered', artifact_id: 'ART-DWG-001', artifact_type: 'shop_drawing', renderer_name: 'SVGRenderer', pipeline_stage: 'artifact_rendering', instruction_set_id: 'IS-001', lineage_hash: 'lin-abc123' },
    severity: 'info',
  },
  {
    event_id: 'rt-evt-005',
    event_type: 'ValidationFailed',
    timestamp: new Date(Date.now() - 25000).toISOString(),
    pipeline_stage: 'input_validation',
    payload: { type: 'ValidationFailed', validation_stage: 'structural', error_code: 'VAL-STRUCT-003', failure_reason: 'Bolt spacing exceeds maximum allowable for W12x26 connection', pipeline_stage: 'input_validation', object_id: 'ART-DWG-002' },
    severity: 'error',
  },
  {
    event_id: 'rt-evt-006',
    event_type: 'RuntimeError',
    timestamp: new Date(Date.now() - 5000).toISOString(),
    pipeline_stage: 'artifact_rendering',
    payload: { type: 'RuntimeError', exception_type: 'RenderTimeout', failure_reason: 'SVG render exceeded 30s timeout for complex geometry', pipeline_stage: 'artifact_rendering', error_code: 'RT-TIMEOUT-001' },
    severity: 'critical',
  },
];

function derivePipelineStages(events: readonly RuntimeDiagnosticEvent[]): PipelineStageStatus[] {
  const stageMap = new Map<string, PipelineStageStatus>();
  for (const stage of PIPELINE_STAGES) {
    stageMap.set(stage, { stage, status: 'idle', last_event_type: null, last_updated: 0 });
  }
  for (const evt of events) {
    const stage = evt.pipeline_stage;
    if (stageMap.has(stage)) {
      const isFail = evt.event_type === 'ValidationFailed' || evt.event_type === 'RuntimeError';
      const ts = new Date(evt.timestamp).getTime();
      stageMap.set(stage, {
        stage,
        status: isFail ? 'failed' : 'completed',
        last_event_type: evt.event_type,
        last_updated: ts,
      });
    }
  }
  return Array.from(stageMap.values());
}

function deriveArtifactStates(events: readonly RuntimeDiagnosticEvent[]): ArtifactState[] {
  const artifacts: ArtifactState[] = [];
  const failedObjects = new Set<string>();
  for (const evt of events) {
    if (evt.event_type === 'ValidationFailed' && evt.payload.type === 'ValidationFailed') {
      failedObjects.add(evt.payload.object_id);
    }
  }
  for (const evt of events) {
    if (evt.event_type === 'ArtifactRendered' && evt.payload.type === 'ArtifactRendered') {
      const p = evt.payload;
      const isQuarantined = failedObjects.has(p.artifact_id);
      artifacts.push({
        artifact_id: p.artifact_id,
        artifact_type: p.artifact_type,
        renderer_name: p.renderer_name,
        pipeline_stage: p.pipeline_stage,
        lifecycle: isQuarantined ? 'quarantined' : 'delivered',
        timestamp: evt.timestamp,
        quarantine_reason: isQuarantined ? 'Validation failure' : undefined,
      });
    }
  }
  return artifacts;
}

export const mockRuntimeDiagnosticsAdapter: RuntimeDiagnosticsAdapter = {
  adapterName: 'MockRuntimeDiagnosticsAdapter',
  isMock: true,

  async getEvents(): Promise<readonly RuntimeDiagnosticEvent[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockEvents;
  },

  async getDiagnosticsState(): Promise<RuntimeDiagnosticsState> {
    const events = await this.getEvents();
    return {
      events,
      pipeline_stages: derivePipelineStages(events),
      artifact_states: deriveArtifactStates(events),
      status: 'connected',
      error: null,
      last_event_at: events.length > 0 ? new Date(events[events.length - 1].timestamp).getTime() : 0,
    };
  },
};
