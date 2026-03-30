/**
 * Construction OS — Proximity Field Constants
 *
 * Configurable constants for deterministic proximity field behavior.
 * All values stored in UI scope only — no hidden inference, no random motion.
 *
 * FAIL_CLOSED: Invalid or missing proximity state results in idle layout.
 */

export const PROXIMITY = {
  // ─── Edge bands (pixels from viewport edge) ────────────────────────
  /** Entry threshold: start sensing cursor intent */
  entryThreshold: 80,
  /** Exit threshold: must move further out before state resets (hysteresis) */
  exitThreshold: 120,
  /** Ramp band: deeper proximity for preview promotion */
  rampBand: 40,
  /** Center safe zone: no edge expansion within this region */
  centerSafeZone: 200,

  // Backwards compat aliases
  get triggerBand() { return this.entryThreshold; },

  // ─── Timing ────────────────────────────────────────────────────────
  /** Intent delay before expansion begins (ms) */
  intentDelay: 180,
  /** Expansion animation duration (ms) */
  expandDuration: 200,
  /** Collapse animation duration (ms) */
  collapseDuration: 220,
  /** Collapse cooldown — proximity cannot reopen during this period (ms) */
  collapseCooldown: 300,

  // ─── Expansion sizes ──────────────────────────────────────────────
  /** Idle strip width for edge panels (px) */
  edgeIdleWidth: 4,
  /** Preview width for edge panels (px) */
  edgePreviewWidth: 320,
  /** Full expanded width for locked edge panels (px) */
  edgeLockedWidth: 380,
  /** Idle height for bottom dock (px) */
  dockIdleHeight: 28,
  /** Preview height for bottom dock (px) */
  dockPreviewHeight: 260,
  /** Full expanded height for bottom dock (px) */
  dockExpandedHeight: 380,

  // ─── Workspace bias ───────────────────────────────────────────────
  /** Bias step size per click (percentage points) */
  biasStep: 8,
  /** Minimum workspace share (%) */
  workspaceMinShare: 40,
  /** Maximum workspace share (%) */
  workspaceMaxShare: 90,
  /** Default workspace share (%) */
  workspaceDefaultShare: 65,

  // ─── Hover peek ───────────────────────────────────────────────────
  peekDelay: 200,
  peekShare: 50,

  // ─── Deck fan-out ─────────────────────────────────────────────────
  fanIdleWidth: 6,
  fanExpandedWidth: 280,
  fanCardHeight: 64,
  fanCardGap: 4,

  // ─── Motion doctrine ──────────────────────────────────────────────
  /** Allowed easing function */
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)' as const,
  /** Minimum animation duration (ms) */
  minDuration: 150,
  /** Maximum animation duration (ms) */
  maxDuration: 220,
} as const;

export type EdgeId = 'left' | 'right' | 'top' | 'bottom';

/**
 * Intent-state model:
 *   idle → edge_armed → preview → locked → (release → idle)
 * No continuous raw-pointer sizing. Only discrete state transitions.
 */
export type EdgeState = 'idle' | 'sensing' | 'expanding' | 'preview' | 'locked';

export interface EdgeFieldState {
  edge: EdgeId;
  proximity: number;
  state: EdgeState;
  intentTimestamp: number | null;
  lockedAt: number | null;
  /** Timestamp of last collapse — used for cooldown enforcement */
  collapsedAt: number | null;
}

export interface ProximityFieldSnapshot {
  left: EdgeFieldState;
  right: EdgeFieldState;
  top: EdgeFieldState;
  bottom: EdgeFieldState;
  dominantEdge: EdgeId | null;
  mouseX: number;
  mouseY: number;
  viewportWidth: number;
  viewportHeight: number;
  transitionInProgress: boolean;
}

export function createIdleFieldState(edge: EdgeId): EdgeFieldState {
  return {
    edge,
    proximity: 0,
    state: 'idle',
    intentTimestamp: null,
    lockedAt: null,
    collapsedAt: null,
  };
}

export function createIdleSnapshot(): ProximityFieldSnapshot {
  return {
    left: createIdleFieldState('left'),
    right: createIdleFieldState('right'),
    top: createIdleFieldState('top'),
    bottom: createIdleFieldState('bottom'),
    dominantEdge: null,
    mouseX: -1,
    mouseY: -1,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    transitionInProgress: false,
  };
}
