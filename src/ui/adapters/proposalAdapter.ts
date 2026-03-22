/**
 * Construction OS — Proposal Adapter (Bounded UI Facade)
 *
 * Bounded UI-side adapter for the Proposal Mailbox. Consumes proposals
 * from the Cognitive Bus event stream and provides approve/reject/elaborate
 * workflow routing.
 *
 * ASSUMED PAYLOAD SHAPE:
 * Upstream: Construction_Cognitive_Bus/schemas/event-envelope.schema.json
 *           (event_class: "Proposal")
 *
 * Proposal event envelope: {
 *   event_id: string,
 *   event_class: "Proposal",
 *   event_type: string,
 *   schema_version: "0.1",
 *   source_component: "Construction_Runtime" | "Construction_Intelligence_Workers" | "Construction_Reference_Intelligence",
 *   source_repo: string,
 *   timestamp: string (ISO-8601),
 *   payload: {
 *     proposal_type: string,
 *     reasoning_summary: string,
 *     target_condition?: string,
 *     ...additional fields vary by proposal_type
 *   }
 * }
 *
 * RING AUTHORITY:
 * - Approve/Reject actions route to Ring 1 pathway via event emission only.
 *   Ring 3 (UI) NEVER executes approval — it only emits the intent.
 * - Elaborate action triggers a request for additional reasoning; it does
 *   NOT execute any changes.
 *
 * FAIL_CLOSED: If proposal data does not conform, adapter returns error state.
 * MOCK: This adapter currently provides mock data. isMock = true.
 */

import type { ProposalItem, ProposalAction, ProposalStatus } from '../contracts/cockpit-types';

export interface ProposalAdapter {
  readonly adapterName: string;
  readonly isMock: boolean;
  getProposals(): Promise<readonly ProposalItem[]>;
  /**
   * Submit a proposal action (approve/reject/elaborate).
   * This routes to a Ring 1 pathway — Ring 3 does NOT execute the action.
   * Returns the updated proposal status.
   */
  submitAction(action: ProposalAction): Promise<{ success: boolean; new_status: ProposalStatus; error?: string }>;
}

// ─── Mock Adapter ──────────────────────────────────────────────────────────

const mockProposals: ProposalItem[] = [
  {
    proposal_id: 'prop-001',
    source: 'Construction_Intelligence_Workers',
    proposal_type: 'detail_substitution',
    reasoning_summary: 'Alternative flashing detail DET-FLASH-003 may resolve termination gap at parapet condition CS-PARAPET-001. The current detail lacks continuity at the base-of-wall interface.',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: 'pending',
    payload: { target_condition: 'CS-PARAPET-001', proposed_detail: 'DET-FLASH-003', current_detail: 'DET-FLASH-001' },
    origin: 'runtime',
  },
  {
    proposal_id: 'prop-002',
    source: 'Construction_Runtime',
    proposal_type: 'parameter_adjustment',
    reasoning_summary: 'Drain diameter at condition CS-DRAIN-002 should be increased from 4" to 6" based on calculated drainage area of 2,400 sq ft exceeding 4" capacity.',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    status: 'pending',
    payload: { target_condition: 'CS-DRAIN-002', parameter: 'drain_diameter', current_value: 4, proposed_value: 6, unit: 'inches' },
    origin: 'runtime',
  },
  {
    proposal_id: 'prop-003',
    source: 'Construction_Assistant',
    proposal_type: 'scope_clarification',
    reasoning_summary: 'Expansion joint EJ-NORTH-01 scope ownership is ambiguous between roofing and waterproofing trades. Recommend explicit scope assignment before detail resolution proceeds.',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    status: 'pending',
    payload: { target_condition: 'EJ-NORTH-01', trades: ['roofing', 'waterproofing'] },
    origin: 'assistant',
  },
];

export const mockProposalAdapter: ProposalAdapter = {
  adapterName: 'MockProposalAdapter',
  isMock: true,

  async getProposals(): Promise<readonly ProposalItem[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockProposals;
  },

  async submitAction(action: ProposalAction): Promise<{ success: boolean; new_status: ProposalStatus; error?: string }> {
    await new Promise((r) => setTimeout(r, 100));
    // Mock: update the local proposal status
    const proposal = mockProposals.find((p) => p.proposal_id === action.proposal_id);
    if (!proposal) {
      return { success: false, new_status: 'pending', error: `Proposal ${action.proposal_id} not found` };
    }
    const statusMap: Record<string, ProposalStatus> = {
      approve: 'approved',
      reject: 'rejected',
      elaborate: 'elaborating',
    };
    const newStatus = statusMap[action.action] ?? 'pending';
    // Note: In mock mode we mutate the local array for demo purposes.
    // In production, the Ring 1 pathway would handle state changes.
    (proposal as { status: ProposalStatus }).status = newStatus;
    return { success: true, new_status: newStatus };
  },
};
