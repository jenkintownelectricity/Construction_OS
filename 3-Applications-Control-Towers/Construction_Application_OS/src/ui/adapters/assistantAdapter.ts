/**
 * Construction OS — Assistant Adapter (Bounded UI Facade)
 *
 * Bounded UI-side adapter for the Assistant Console. Consumes assistant
 * bounded output and routes assistant-generated proposals into the
 * Proposal Mailbox via event emission.
 *
 * ASSUMED PAYLOAD SHAPE:
 * Upstream: Construction_Assistant/assistant/bounded_output_contract.py
 *
 * BoundedOutput: {
 *   output_type: "verified_truth" | "uncertainty" | "insufficiency" | "next_valid_action",
 *   content: string,
 *   confidence_basis: string,
 *   snapshot_id: string
 * }
 *
 * Allowed output_types (from Construction_Assistant/assistant/config.py):
 *   "verified_truth" — Factual statement backed by snapshot
 *   "uncertainty" — Cannot determine with confidence
 *   "insufficiency" — Insufficient data to answer
 *   "next_valid_action" — Suggested next step (may generate proposal)
 *
 * RING AUTHORITY:
 * - Assistant responses CANNOT invoke runtime directly from Ring 3.
 * - Assistant-generated proposals are routed into the Proposal Mailbox
 *   via the event bus, NOT executed directly.
 * - The assistant has NO execution authority in the UI layer.
 *
 * FAIL_CLOSED: If response data does not conform, adapter returns error state.
 * MOCK: This adapter currently provides mock data. isMock = true.
 */

import type { AssistantResponse, AssistantConsoleState, ProposalItem } from '../contracts/cockpit-types';

export interface AssistantAdapter {
  readonly adapterName: string;
  readonly isMock: boolean;
  getResponses(): Promise<readonly AssistantResponse[]>;
  getConsoleState(): Promise<AssistantConsoleState>;
  /**
   * Submit a query to the assistant. The assistant processes against
   * the current awareness snapshot and returns bounded output.
   * Ring 3 — this does NOT execute any changes.
   */
  submitQuery(query: string): Promise<AssistantResponse>;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const mockResponses: AssistantResponse[] = [
  {
    response_id: 'asst-resp-001',
    output_type: 'verified_truth',
    content: 'Parapet condition CS-PARAPET-001 has been detected at the Highland Medical Center project. Detail DET-TERM-001 was resolved via the detail index using pattern cpat-termination-failure, variant V001. The termination detail addresses the base-of-wall flashing interface.',
    confidence_basis: 'Snapshot snap-mock-001 contains ConditionDetected and DetailResolved events for CS-PARAPET-001 with complete resolution chain.',
    snapshot_id: 'snap-mock-001',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    has_proposal: false,
  },
  {
    response_id: 'asst-resp-002',
    output_type: 'uncertainty',
    content: 'The drainage capacity for condition CS-DRAIN-002 cannot be confirmed from the current snapshot. The ConditionDetected event is present but no DetailResolved event has been recorded, suggesting resolution is still pending.',
    confidence_basis: 'Snapshot snap-mock-001 contains ConditionDetected for CS-DRAIN-002 but no corresponding DetailResolved or ArtifactRendered events.',
    snapshot_id: 'snap-mock-001',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    has_proposal: false,
  },
  {
    response_id: 'asst-resp-003',
    output_type: 'next_valid_action',
    content: 'Expansion joint EJ-NORTH-01 has ambiguous scope ownership between roofing and waterproofing trades. Recommend resolving scope assignment before proceeding with detail resolution to prevent coordination gaps.',
    confidence_basis: 'Pattern analysis indicates SIG_SCOPE_BOUNDARY_GAP conditions require explicit trade assignment before detail resolution can produce reliable output.',
    snapshot_id: 'snap-mock-001',
    timestamp: new Date(Date.now() - 10000).toISOString(),
    has_proposal: true,
    proposal: {
      proposal_id: 'prop-asst-001',
      source: 'Construction_Assistant',
      proposal_type: 'scope_clarification',
      reasoning_summary: 'Expansion joint EJ-NORTH-01 scope ownership is ambiguous between roofing and waterproofing trades. Recommend explicit scope assignment before detail resolution proceeds.',
      timestamp: new Date(Date.now() - 10000).toISOString(),
      status: 'pending',
      payload: { target_condition: 'EJ-NORTH-01', trades: ['roofing', 'waterproofing'] },
      origin: 'assistant',
    },
  },
];

export const mockAssistantAdapter: AssistantAdapter = {
  adapterName: 'MockAssistantAdapter',
  isMock: true,

  async getResponses(): Promise<readonly AssistantResponse[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockResponses;
  },

  async getConsoleState(): Promise<AssistantConsoleState> {
    const responses = await this.getResponses();
    return {
      responses,
      status: 'idle',
      error: null,
      last_response_at: responses.length > 0 ? new Date(responses[responses.length - 1].timestamp).getTime() : 0,
    };
  },

  async submitQuery(query: string): Promise<AssistantResponse> {
    await new Promise((r) => setTimeout(r, 800));
    // Mock: return an insufficiency response for any query
    return {
      response_id: `asst-resp-${Date.now()}`,
      output_type: 'insufficiency',
      content: `The current awareness snapshot does not contain sufficient data to answer: "${query}". Additional runtime events or detail resolution steps may be required.`,
      confidence_basis: 'Query does not match any verified conditions in the current snapshot.',
      snapshot_id: 'snap-mock-001',
      timestamp: new Date().toISOString(),
      has_proposal: false,
    };
  },
};
