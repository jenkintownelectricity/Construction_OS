# Mirror Registry System — Registry Control Plane (COMMAND F)

## Overview

The Mirror Registry System is the authoritative control plane for all mirror lifecycle management within Construction OS. A **mirror** is a bounded integration surface that reflects an external system's capabilities into the kernel trust boundary. Each mirror is composed of **slices** — discrete functional units that can be independently managed through their own lifecycle.

This registry system provides complete observability and governance over mirror creation, chartering, staging, activation, drift detection, breakaway handling, promotion to core, transfer readiness, and retirement.

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         REGISTRY CONTROL PLANE           │
                    │            (COMMAND F)                    │
                    ├─────────────────────────────────────────┤
                    │                                         │
                    │  mirrors-registry.json                  │
                    │    └── Master record of all mirrors     │
                    │                                         │
                    │  mirror-slices-registry.json            │
                    │    └── All slices across all mirrors    │
                    │                                         │
                    │  mirror-lifecycle-registry.json         │
                    │    └── Immutable transition audit log   │
                    │                                         │
                    │  mirror-drift-registry.json             │
                    │    └── Drift detection events           │
                    │                                         │
                    │  mirror-breakaway-registry.json         │
                    │    └── Terminal drift / breakaway       │
                    │                                         │
                    │  mirror-promotion-registry.json         │
                    │    └── Promotion reviews to core        │
                    │                                         │
                    │  mirror-transfer-registry.json          │
                    │    └── Slice transfer readiness         │
                    │                                         │
                    │  commands/                              │
                    │    └── Command specifications           │
                    │                                         │
                    └─────────────────────────────────────────┘
```

## Mirror Lifecycle States

Every mirror progresses through a defined set of lifecycle states. Transitions are governed by preconditions, validated by the control plane, and recorded immutably in the lifecycle registry.

```
  ┌──────────┐     ┌───────────┐     ┌────────┐     ┌────────┐     ┌────────┐     ┌─────────┐
  │ PROPOSED │────>│ CHARTERED │────>│ STAGED │────>│ ACTIVE │────>│ FROZEN │────>│ RETIRED │
  └──────────┘     └───────────┘     └────────┘     └────────┘     └────────┘     └─────────┘
       │                │                │               │               │
       │                │                │               │               │
       └────────────────┴────────────────┴───────────────┴──> RETIRED <──┘
                        (any state can transition to RETIRED)
```

| State | Description |
|-------|-------------|
| **PROPOSED** | Mirror has been proposed. Source system identified, scope outlined. Awaiting charter review. |
| **CHARTERED** | Charter approved by architecture board. Integration contract defined, trust boundary established, slice inventory finalized. |
| **STAGED** | Slices registered, core configuration complete, initial slices may be activated. Undergoing operational validation. |
| **ACTIVE** | Mirror is fully operational. All designated slices active. Parity monitoring engaged. |
| **FROZEN** | Mirror is frozen. No mutations allowed. Triggered by breakaway, security incident, or planned maintenance. |
| **RETIRED** | Mirror is permanently decommissioned. All slices disabled. Record retained for audit. |

## Registry Files

### mirrors-registry.json

The master registry of all mirrors. Each entry contains:

- **Identity**: mirror_id, mirror_name, display_name
- **Source**: source_system, source_system_type, source_system_provider
- **Lifecycle**: lifecycle_state with timestamps for each state transition
- **Trust**: trust_boundary classification and security details
- **Ownership**: owner, owner_contact
- **Versioning**: version, kernel_ref, kernel_ref_version
- **Metrics**: slice_count, active_slice_count, parity_score, drift_count

Use this file to answer: "What mirrors exist? What state are they in? Who owns them?"

### mirror-slices-registry.json

The complete inventory of all slices across all mirrors. Each slice entry contains:

- **Identity**: slice_id, mirror_id, slice_name
- **State**: state (STAGED, ACTIVE, DISABLED, DEPRECATED) with reason
- **Dependencies**: which slices this slice depends on and which depend on it
- **Transfer**: transfer_class indicating the functional category
- **Health**: last_health_check timestamp and health_status

Use this file to answer: "What slices does a mirror have? Which are active? What are the dependencies?"

### mirror-lifecycle-registry.json

An append-only audit log of every lifecycle state transition. Each transition record contains:

- **Transition**: from_state, to_state with timestamp
- **Provenance**: who initiated it and why
- **Validation**: results of all pre-transition checks
- **Artifacts**: references to supporting documents

Use this file to answer: "When did this mirror change state? Who approved it? What checks were run?"

### mirror-drift-registry.json

Records of all detected drift events — cases where a mirror's behavior diverges from its source system. Each record contains:

- **Classification**: category (schema, behavioral, performance, etc.) and severity
- **Status**: lifecycle of the drift event from detection through resolution
- **Impact**: assessment of downstream effects
- **Resolution**: how the drift was addressed (remediation or approved divergence)

Use this file to answer: "Is any mirror drifting? How severe? Has it been addressed?"

### mirror-breakaway-registry.json

Records of breakaway events — terminal drift conditions where the reflection relationship is no longer maintainable. Each record contains:

- **Cause**: what triggered the breakaway
- **Impact**: structured assessment of affected systems and risk levels
- **Resolution path**: freeze-and-remediate, promote-to-core, retire, etc.
- **Actions taken**: freeze record, remediation record, promotion/retirement records

Use this file to answer: "Has any mirror broken away? What was done about it?"

### mirror-promotion-registry.json

Records of promotion reviews — evaluations of whether a mirror (or slice) should be absorbed into the kernel as a first-class capability. Each record contains:

- **Nomination**: who nominated it, justification, promotion type
- **Evaluation**: assessment against promotion criteria (parity, stability, coverage)
- **Decision**: approval/rejection with rationale
- **Implementation**: execution plan and completion status

Use this file to answer: "Has anything been promoted to core? What criteria were evaluated?"

### mirror-transfer-registry.json

Transfer readiness status for every slice. Tracks whether a slice has reached sufficient maturity to be handed off. Each record contains:

- **Transfer class**: functional category (FOUNDATIONAL, CORE_LOGIC, etc.)
- **Readiness**: qualification state and evidence
- **Transfer status**: lifecycle from pending through completion

Use this file to answer: "Which slices are transfer-ready? What class are they?"

## Command Specifications

All commands that mutate registry state are formally specified in the `commands/` directory. Each command spec defines:

| Section | Purpose |
|---------|---------|
| **Command Name** | The canonical name used to invoke the command |
| **Description** | What the command does and when to use it |
| **Preconditions** | What must be true before the command can execute |
| **Required Parameters** | Input parameters with types and validation rules |
| **Validation Rules** | Checks performed before mutation |
| **Side Effects** | Which registry files are updated and how |
| **Postconditions** | What must be true after successful execution |
| **Error Conditions** | Failure modes and how they are handled |

### Available Commands

| Command | File | Purpose |
|---------|------|---------|
| `create-mirror` | `commands/create-mirror.md` | Register a new mirror in PROPOSED state |
| `charter-mirror` | `commands/charter-mirror.md` | Transition PROPOSED to CHARTERED |
| `enable-slice` | `commands/enable-slice.md` | Activate a slice on a mirror |
| `disable-slice` | `commands/disable-slice.md` | Deactivate a slice on a mirror |
| `record-parity-review` | `commands/record-parity-review.md` | Record a parity review result |
| `record-drift` | `commands/record-drift.md` | Record a detected drift event |
| `approve-divergence` | `commands/approve-divergence.md` | Approve a drift as acceptable divergence |
| `freeze-breakaway` | `commands/freeze-breakaway.md` | Freeze a mirror in breakaway state |
| `mark-transfer-ready` | `commands/mark-transfer-ready.md` | Mark a slice as transfer-ready |
| `approve-promotion` | `commands/approve-promotion.md` | Approve a reflection promotion to core |
| `retire-mirror` | `commands/retire-mirror.md` | Permanently retire a mirror |

## Kernel Reference

All mirrors reference a kernel integration nucleus: `KERN-INTEGRATION-MIRROR-NUCLEUS`. This kernel reference defines the foundational contract that all mirrors must satisfy, including:

- Reflection fidelity requirements
- Trust boundary enforcement rules
- Parity monitoring obligations
- Drift detection thresholds
- Breakaway escalation procedures

## Conventions

- **IDs** follow the pattern `TYPE-CONTEXT-NNNN` (e.g., `MIRROR-GCP-SHOPDRAWING-001`)
- **Timestamps** are ISO 8601 in UTC (e.g., `2026-03-20T00:00:00Z`)
- **States** are uppercase with underscores (e.g., `TRANSFER_READY`)
- **Registries** are append-only for audit records (lifecycle, drift, breakaway, promotion)
- **Registries** are mutable for status records (mirrors, slices, transfer)
- **Schema versions** follow semantic versioning
