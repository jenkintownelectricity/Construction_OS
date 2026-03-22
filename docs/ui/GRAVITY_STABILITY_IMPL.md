# Construction OS — Gravity Stability + Control Fix Implementation Notes

**Document ID**: L0-CMD-CONOS-VKGL04R-GRAVITYFIX-001-IMPL
**Date**: 2026-03-22
**Authority**: Armand Lefebvre

## Summary

Stabilized gravity UI from reactive prototype behavior into deterministic intent-state model.
Replaced continuous raw-pointer layout resizing with discrete state transitions.

## Touched Files

### New Files

| File | Purpose |
|------|---------|
| `src/ui/gravity/LayoutState.ts` | Shared layout-state store with all required fields |
| `src/ui/gravity/NudgeControls.tsx` | Panel-local nudge controls (low-visibility, glow on approach) |

### Modified Files

| File | Changes |
|------|---------|
| `src/ui/gravity/ProximityConstants.ts` | Added entry/exit thresholds for hysteresis, collapse cooldown, collapsedAt field |
| `src/ui/gravity/ProximityField.ts` | Full rewrite: hysteresis, transition lock, cooldown enforcement, discrete state transitions, no continuous proximity-driven width |
| `src/ui/gravity/EdgePanel.tsx` | Discrete state-based widths only — removed `proximity * width` continuous multiplication |
| `src/ui/gravity/WorkspaceBias.tsx` | Controls now wire to shared LayoutState — changes real layout state |
| `src/ui/layout/BottomDock.tsx` | Close button with cooldown, proximity respects cooldown, nudge controls on dock host |
| `src/ui/panels/PanelShell.tsx` | Added panel-local nudge controls on Explorer, Work, Reference |
| `src/ui/workspace/WorkspaceShell.tsx` | Discrete edge widths, bias-driven layout dimensions, removed continuous pointer sizing |

## Shared Layout-State Fields

Defined in `src/ui/gravity/LayoutState.ts`:

| Field | Type | Purpose |
|-------|------|---------|
| `workspace_scale` | number (40-90) | Workspace dominance percentage |
| `horizontal_bias` | number (-40 to +40) | Left/right bias for edge panels |
| `active_edge` | EdgeId \| null | Which edge is currently dominant |
| `edge_preview_state` | Record<EdgeId, state> | Per-edge preview state (idle/armed/preview/locked) |
| `edge_locked_state` | Record<EdgeId, boolean> | Per-edge lock state |
| `dock_collapsed` | boolean | Whether dock is collapsed |
| `dock_pinned` | boolean | Whether dock is pinned open |
| `dock_cooldown_until` | number | Timestamp until which proximity cannot reopen dock |
| `transition_in_progress` | boolean | Prevents re-layout during animation |

## Thresholds and Delays

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Entry threshold | 80px | Distance from edge to start sensing |
| Exit threshold | 120px | Distance to disengage (wider = hysteresis) |
| Ramp band | 40px | Deep proximity for preview promotion |
| Center safe zone | 200px | No edge reaction in center |
| Intent delay | 180ms | Hover time before preview opens |
| Expand duration | 200ms | Animation time for expansion |
| Collapse duration | 220ms | Animation time for collapse |
| Collapse cooldown | 300ms | Period after close where proximity cannot reopen |
| Max animation | 220ms | Upper bound for all motion |

## Intent-State Model

```
idle → sensing (edge_armed) → preview → locked
  ↑                                        ↓
  └──── (release / unlock) ────────────────┘
```

State transitions are **discrete** — no intermediate continuous sizing.

| State | Edge Width | Behavior |
|-------|-----------|----------|
| idle | 4px | Invisible strip, no content |
| sensing | 4px | Subtle glow on strip, intent timer started |
| preview | 320px | Full panel content visible, glass morph |
| locked | 380px | Panel locked open, explicit unlock required |

## Hysteresis Behavior

- **Entry**: Cursor crosses 80px threshold → start sensing
- **Exit**: Must move beyond 120px threshold to disengage
- Gap of 40px prevents flickering at edge boundary

## Collapse Cooldown

- Dock close button sets `dock_cooldown_until = now + 300ms`
- Edge `unlockEdge` sets `collapsedAt = now` on the edge field
- Proximity field checks `collapsedAt` — refuses to re-arm during cooldown
- Pin/lock explicitly overrides cooldown

## Transition Lock

- When any edge state changes, `transitionInProgress` is set to `true`
- Auto-releases after `maxDuration + 30ms` (250ms)
- While locked, no proximity updates are processed
- Prevents repeated re-layout thrash during animations

## Workspace Bias Controls

| Button | Action | Layout Effect |
|--------|--------|---------------|
| + | `setWorkspaceScale(+8)` | Increases workspace_scale, edge panels compress |
| - | `setWorkspaceScale(-8)` | Decreases workspace_scale, edge panels expand |
| ← | `setHorizontalBias(-8)` | Shifts bias left, right panels get more space |
| → | `setHorizontalBias(+8)` | Shifts bias right, left panels get more space |

Controls wire to both local BiasState and shared LayoutState simultaneously.

## Panel-Local Nudge Controls

| Panel | Position | Controls |
|-------|----------|----------|
| Explorer | left | ← → |
| Work | center | ← → + - |
| Reference | right | ← → |
| Right edge (Spatial) | right | ← → |
| Bottom dock | bottom | + - |

Nudge control visibility:
- Default: opacity 0.15 (barely visible)
- Cursor approach: opacity ramps via CSS transition
- Hover/focus: opacity 0.9 with subtle box-shadow glow
- No permanent chrome added — controls are ephemeral

## Bottom Dock Close Behavior

1. Close button (`×`) clicked → `setUserOpened(false)`, `setExpanded(false)`
2. `cooldownUntilRef.current = Date.now() + 300`
3. Proximity checks `isInCooldown()` before allowing reopen
4. Pin overrides: `pinned = true` always keeps dock open regardless of cooldown

## Motion Doctrine Compliance

| Property | Value |
|----------|-------|
| Expand duration | 200ms |
| Collapse duration | 220ms |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Allowed motion | slide, scale |
| Forbidden motion | spin, bounce, decorative |

## FAIL_CLOSED Behavior

| Scenario | Response |
|----------|----------|
| Invalid mouse coordinates | No proximity update, idle persists |
| Transition in progress | No re-layout, wait for transition end |
| Cooldown active | Proximity cannot reopen collapsed panel |
| Missing proximity snapshot | All edges default to idle |
| LayoutState invalid | Falls back to defaults (65% workspace, 0 bias) |

## Scope Verification

- [x] Only `Construction_Application_OS` modified
- [x] No kernel, runtime, atlas, bus, cache, or assistant files modified
- [x] No authority changes
- [x] No schema changes
- [x] Behavior fix only — no new feature expansion
