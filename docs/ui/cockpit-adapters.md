# Cockpit Adapters — Assumed Payload Shape Documentation

**Document ID:** L0-DOC-CONOS-COCKPIT-ADAPTERS
**Authority:** Construction_Application_OS (Ring 3)
**Status:** Active
**Last Updated:** 2026-03-22

## Purpose

This document records every assumed payload shape used by bounded UI adapters
(facades) inside Construction_Application_OS. These adapters exist to wire
cockpit panels to upstream system interfaces when those interfaces may be
incomplete or unavailable. Each assumed shape is derived from reading upstream
source code and schemas.

**FAIL_CLOSED Rule:** If upstream data does not match the assumed shape, the
adapter MUST return an error state. Silent coercion is forbidden.

---

## 1. Awareness Adapter

**File:** `src/ui/adapters/awarenessAdapter.ts`
**Upstream Source:** `Construction_Awareness_Cache/awareness/snapshot_model.py`
**Panel:** Awareness Panel (`src/ui/panels/awareness/AwarenessPanel.tsx`)

### Assumed Snapshot Envelope

```typescript
interface AwarenessSnapshot {
  snapshot_id: string;              // Unique snapshot identifier
  schema_version: string;          // "0.1"
  frozen: boolean;                 // Always true for compiled snapshots
  content_hash: string;            // SHA-256 hex digest
  compiled_at: string;             // ISO-8601 timestamp
  entry_count: number;             // Total entries in snapshot
  source_summary: {
    total_events: number;
    by_class: Record<string, number>;   // e.g. { "Observation": 6, "Proposal": 2 }
    by_source: Record<string, number>;  // e.g. { "Construction_Runtime": 6 }
  };
  entries: AwarenessEntry[];
}
```

### Assumed Entry Shape

```typescript
interface AwarenessEntry {
  event_id: string;
  event_class: "Observation" | "Proposal" | "ExternallyValidatedEvent";
  event_type: string;              // e.g. "ConditionDetected", "ArtifactRendered"
  source_component: string;        // e.g. "Construction_Runtime"
  source_repo: string;
  timestamp: string;               // ISO-8601
  payload: Record<string, unknown>; // Event-type-specific payload
}
```

### Derived State

The adapter computes the following from the snapshot:

| Field | Derivation |
|---|---|
| `active_conditions` | Entries where `event_type === "ConditionDetected"` |
| `pending_artifacts` | Currently empty (no pending state in snapshot) |
| `delivered_artifacts` | Entries where `event_type === "ArtifactRendered"` AND artifact_id NOT in failed set |
| `quarantined_artifacts` | Entries where `event_type === "ArtifactRendered"` AND artifact_id IN failed set |
| `open_proposals` | Entries where `event_class === "Proposal"` |
| `fail_closed_log` | Entries where `event_type === "ValidationFailed"` OR `event_type === "RuntimeError"` |
| `status` | `"stale"` if snapshot older than 5 minutes, `"current"` otherwise |

### Staleness Detection

A snapshot is considered stale if `compiled_at` is more than 5 minutes in the past.

---

## 2. Proposal Adapter

**File:** `src/ui/adapters/proposalAdapter.ts`
**Upstream Source:** `Construction_Cognitive_Bus/schemas/event-envelope.schema.json` (event_class: "Proposal")
**Panel:** Proposal Mailbox (`src/ui/panels/proposals/ProposalMailbox.tsx`)

### Assumed Proposal Event Envelope

From the Cognitive Bus event envelope schema:

```typescript
{
  event_id: string;
  event_class: "Proposal";
  event_type: string;
  schema_version: "0.1";
  source_component: "Construction_Runtime" | "Construction_Intelligence_Workers" | "Construction_Reference_Intelligence";
  source_repo: string;
  timestamp: string;               // ISO-8601
  payload: {
    proposal_type: string;         // e.g. "detail_substitution", "parameter_adjustment", "scope_clarification"
    reasoning_summary: string;     // Human-readable reasoning
    target_condition?: string;     // Condition ID this proposal targets
    // ... additional fields vary by proposal_type
  }
}
```

### UI Proposal Item Shape

```typescript
interface ProposalItem {
  proposal_id: string;            // Mapped from event_id
  source: string;                 // source_component
  proposal_type: string;          // From payload.proposal_type
  reasoning_summary: string;      // From payload.reasoning_summary
  timestamp: string;              // ISO-8601
  status: "pending" | "approved" | "rejected" | "elaborating";
  payload: Record<string, unknown>;
  origin: "runtime" | "assistant" | "operator" | "external";
}
```

### Ring Authority for Actions

| Action | Ring | Behavior |
|---|---|---|
| **Approve** | Routes to Ring 1 | UI emits intent only. Ring 3 does NOT execute approval. |
| **Reject** | Routes to Ring 1 | UI emits intent only. Ring 3 does NOT execute rejection. |
| **Elaborate** | Ring 3 (query only) | Requests additional reasoning from assistant. Does NOT execute changes. |

---

## 3. Runtime Diagnostics Adapter

**File:** `src/ui/adapters/runtimeDiagnosticsAdapter.ts`
**Upstream Source:** `Construction_Runtime/runtime/events/event_types.py`
**Panel:** Runtime Diagnostics (`src/ui/panels/diagnostics/RuntimeDiagnosticsPanel.tsx`)

### Assumed Event Type Payloads

#### ConditionDetected
```typescript
{
  condition_signature_id: string;  // e.g. "CS-PARAPET-001"
  node_type: string;               // e.g. "PARAPET", "DRAIN", "CURB"
  pipeline_stage: string;          // "pipeline_entry"
  project_id: string;              // Default ""
}
```

#### DetailResolved
```typescript
{
  condition_signature_id: string;
  resolved_detail_id: string;      // e.g. "DET-TERM-001"
  resolution_source: string;       // e.g. "detail_index"
  pipeline_stage: string;          // "detail_resolution"
  pattern_id: string;              // Default ""
  variant_id: string;              // Default ""
}
```

#### ArtifactRendered
```typescript
{
  artifact_id: string;             // e.g. "ART-DWG-001"
  artifact_type: string;           // e.g. "shop_drawing"
  renderer_name: string;           // e.g. "SVGRenderer"
  pipeline_stage: string;          // "artifact_rendering"
  instruction_set_id: string;      // Default ""
  lineage_hash: string;            // Default ""
}
```

#### ValidationFailed
```typescript
{
  validation_stage: string;        // e.g. "structural"
  error_code: string;              // e.g. "VAL-STRUCT-003"
  failure_reason: string;          // Human-readable failure description
  pipeline_stage: string;          // e.g. "input_validation"
  object_id: string;               // Default ""
}
```

#### RuntimeError
```typescript
{
  exception_type: string;          // e.g. "RenderTimeout"
  failure_reason: string;          // Human-readable error
  pipeline_stage: string;          // e.g. "artifact_rendering"
  error_code: string;              // Default ""
}
```

### Pipeline Stage Ordering

```
pipeline_entry → input_validation → detail_resolution →
parameterization → ir_emission → rendering → artifact_rendering →
pipeline_complete
```

### Severity Derivation

| Event Type | Derived Severity |
|---|---|
| ConditionDetected | `info` |
| DetailResolved | `info` |
| ArtifactRendered | `info` |
| ValidationFailed | `error` |
| RuntimeError | `critical` |

### Artifact Lifecycle

| State | Condition |
|---|---|
| `pending` | ArtifactRendered received, pipeline not complete |
| `delivered` | ArtifactRendered AND no ValidationFailed for this artifact_id |
| `quarantined` | ArtifactRendered AND ValidationFailed exists for this artifact_id/object_id |

---

## 4. Assistant Adapter

**File:** `src/ui/adapters/assistantAdapter.ts`
**Upstream Source:** `Construction_Assistant/assistant/bounded_output_contract.py`
**Panel:** Assistant Console (`src/ui/panels/assistant/AssistantConsole.tsx`)

### Assumed Bounded Output Shape

```typescript
{
  output_type: "verified_truth" | "uncertainty" | "insufficiency" | "next_valid_action";
  content: string;                 // The actual response text
  confidence_basis: string;        // Why the assistant has this confidence
  snapshot_id: string;             // Which snapshot this derives from
}
```

### Output Type Semantics

| Type | Meaning | UI Treatment |
|---|---|---|
| `verified_truth` | Factual statement backed by snapshot | Green indicator |
| `uncertainty` | Cannot determine with confidence | Yellow/warning indicator |
| `insufficiency` | Insufficient data to answer | Red/error indicator |
| `next_valid_action` | Suggested next step (may generate proposal) | Blue/info indicator |

### Ring Authority

- Assistant responses CANNOT invoke runtime directly from Ring 3.
- When `output_type === "next_valid_action"` and a proposal is generated,
  it is routed into the Proposal Mailbox via `eventBus.emit('proposal.created', ...)`.
- The UI NEVER executes proposals — it only routes them.

### Proposal Routing

When an assistant response includes `has_proposal: true`, the proposal is
automatically emitted to the event bus as a `proposal.created` event. The
Proposal Mailbox subscribes to this event and renders the proposal for
operator review.

---

## Adapter Implementation Status

| Adapter | File | Mock? | Real Upstream Wiring |
|---|---|---|---|
| Awareness | `awarenessAdapter.ts` | Yes | Requires Awareness Cache HTTP/event interface |
| Proposal | `proposalAdapter.ts` | Yes | Requires Cognitive Bus proposal stream interface |
| Runtime Diagnostics | `runtimeDiagnosticsAdapter.ts` | Yes | Requires Runtime event stream interface |
| Assistant | `assistantAdapter.ts` | Yes | Requires Assistant bounded output interface |

All adapters are currently mock implementations labeled with `isMock: true`.
When real upstream interfaces become available, replace the mock implementations
with real adapters that consume the documented payload shapes. If the upstream
payload does not match the assumed shape, the adapter MUST fail closed with an
explicit error state.
