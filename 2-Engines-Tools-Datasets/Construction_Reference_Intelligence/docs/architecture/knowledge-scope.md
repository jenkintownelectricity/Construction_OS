# Knowledge Scope

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## What This Repository Contains

This repository holds structured intelligence about Division 07 building envelope systems. Intelligence is organized into the following knowledge categories:

### Failure Patterns

Recurring failure modes observed at material interfaces, assembly transitions, and control-layer discontinuities. Each failure pattern identifies:

- The affected control layer(s) and interface zone(s)
- Contributing conditions (climate, geometry, material age, installation practice)
- Observable symptoms and progression
- Evidence sources documenting the pattern

See [Failure Pattern Model](failure-pattern-model.md).

### Success Patterns

Documented approaches, details, and practices that have demonstrated reliable performance over time. Success patterns are the inverse of failure patterns — they capture what works and under what conditions.

### Precedents

Historical cases (projects, investigations, litigation, warranty claims) that provide context for current intelligence. Precedents link to specific failure or success patterns and carry their own evidence chains.

### Trends

Directional shifts in failure frequency, material usage, practice adoption, or regulatory emphasis. Trends are time-series observations, not point-in-time snapshots.

See [Trend Model](trend-model.md).

### Interface Risks

Risks arising at the boundaries between control layers, between assemblies, between trades, or between specification sections. Interface risks are the primary domain where intelligence adds value beyond what individual kernel truths provide.

## Dimensional Linkages

Intelligence records are linked to contextual dimensions that affect their applicability:

| Dimension | Examples |
|---|---|
| **Climate** | ASHRAE climate zones, marine exposure, freeze-thaw cycles, UV intensity |
| **Lifecycle stage** | Design, construction, early service, mid-service, end-of-life |
| **Geometry** | Slope, height, orientation, re-entrant corners, penetration density |
| **Building use** | Occupancy type, interior humidity class, ventilation strategy |
| **Era** | Construction decade, material generation, code cycle |

## Confidence Evolution Tracking

Intelligence is not static. The repository tracks how confidence in a pattern or trend changes over time through the supersession chain. Consumers can query:

- Current confidence level for any active record
- Historical confidence trajectory (via supersession chain)
- Evidence accumulation rate
- Contradicting evidence events

## Scope Boundaries

Intelligence scope is limited to CSI Division 07 and its interfaces with adjacent divisions (primarily Division 03 structure, Division 04 masonry, Division 05 metals, Division 08 openings, and Division 09 finishes). Intelligence that belongs primarily to another division is out of scope, though interface observations that span divisions are in scope.
