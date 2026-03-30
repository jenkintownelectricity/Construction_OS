/**
 * Construction OS — Shared Layout State
 *
 * Centralized layout-state fields for the gravity workspace.
 * All layout decisions flow through this state — no ad-hoc calculations.
 *
 * Fields:
 *   workspace_scale — workspace dominance percentage (40-90)
 *   horizontal_bias — left/right bias (-40 to +40)
 *   active_edge — which edge is currently dominant (null = none)
 *   edge_preview_state — per-edge preview states
 *   edge_locked_state — per-edge lock states
 *   dock_collapsed — whether dock is collapsed
 *   dock_cooldown_until — timestamp until which proximity cannot reopen dock
 *   transition_in_progress — prevents re-layout during animation
 *
 * FAIL_CLOSED: Invalid state → idle defaults.
 */

import type { EdgeId } from './ProximityConstants';
import { PROXIMITY } from './ProximityConstants';

export interface LayoutState {
  workspace_scale: number;
  horizontal_bias: number;
  active_edge: EdgeId | null;
  edge_preview_state: Record<EdgeId, 'idle' | 'armed' | 'preview' | 'locked'>;
  edge_locked_state: Record<EdgeId, boolean>;
  dock_collapsed: boolean;
  dock_pinned: boolean;
  dock_cooldown_until: number;
  transition_in_progress: boolean;
}

type LayoutListener = (state: LayoutState) => void;

function createLayoutState(): LayoutState {
  return {
    workspace_scale: PROXIMITY.workspaceDefaultShare,
    horizontal_bias: 0,
    active_edge: null,
    edge_preview_state: { left: 'idle', right: 'idle', top: 'idle', bottom: 'idle' },
    edge_locked_state: { left: false, right: false, top: false, bottom: false },
    dock_collapsed: true,
    dock_pinned: false,
    dock_cooldown_until: 0,
    transition_in_progress: false,
  };
}

function createLayoutStore() {
  let state = createLayoutState();
  const listeners = new Set<LayoutListener>();

  function notify() {
    for (const listener of listeners) {
      listener(state);
    }
  }

  return {
    getState(): LayoutState { return state; },

    subscribe(listener: LayoutListener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Set workspace scale (clamped) */
    setWorkspaceScale(scale: number): void {
      const clamped = Math.max(PROXIMITY.workspaceMinShare, Math.min(PROXIMITY.workspaceMaxShare, scale));
      if (clamped === state.workspace_scale) return;
      state = { ...state, workspace_scale: clamped };
      notify();
    },

    /** Set horizontal bias (clamped) */
    setHorizontalBias(bias: number): void {
      const clamped = Math.max(-40, Math.min(40, bias));
      if (clamped === state.horizontal_bias) return;
      state = { ...state, horizontal_bias: clamped };
      notify();
    },

    /** Nudge workspace scale by step */
    nudgeWorkspaceScale(delta: number): void {
      this.setWorkspaceScale(state.workspace_scale + delta);
    },

    /** Nudge horizontal bias by step */
    nudgeHorizontalBias(delta: number): void {
      this.setHorizontalBias(state.horizontal_bias + delta);
    },

    /** Set edge preview state — only if no transition in progress */
    setEdgeState(edge: EdgeId, edgeState: 'idle' | 'armed' | 'preview' | 'locked'): void {
      if (state.transition_in_progress && edgeState !== 'locked' && edgeState !== 'idle') return;
      const prev = state.edge_preview_state[edge];
      if (prev === edgeState) return;
      state = {
        ...state,
        edge_preview_state: { ...state.edge_preview_state, [edge]: edgeState },
        edge_locked_state: { ...state.edge_locked_state, [edge]: edgeState === 'locked' },
        active_edge: edgeState === 'preview' || edgeState === 'locked' ? edge : (state.active_edge === edge ? null : state.active_edge),
      };
      notify();
    },

    /** Lock edge open */
    lockEdge(edge: EdgeId): void {
      this.setEdgeState(edge, 'locked');
    },

    /** Unlock edge → idle */
    unlockEdge(edge: EdgeId): void {
      state = {
        ...state,
        edge_preview_state: { ...state.edge_preview_state, [edge]: 'idle' },
        edge_locked_state: { ...state.edge_locked_state, [edge]: false },
        active_edge: state.active_edge === edge ? null : state.active_edge,
      };
      notify();
    },

    /** Collapse dock with cooldown */
    collapseDock(): void {
      state = {
        ...state,
        dock_collapsed: true,
        dock_cooldown_until: Date.now() + PROXIMITY.collapseCooldown,
      };
      notify();
    },

    /** Open dock (respects cooldown) */
    openDock(): void {
      if (Date.now() < state.dock_cooldown_until) return;
      state = { ...state, dock_collapsed: false };
      notify();
    },

    /** Pin/unpin dock */
    setDockPinned(pinned: boolean): void {
      state = { ...state, dock_pinned: pinned, dock_collapsed: pinned ? false : state.dock_collapsed };
      notify();
    },

    /** Check if dock is in cooldown */
    isDockInCooldown(): boolean {
      return Date.now() < state.dock_cooldown_until;
    },

    /** Begin transition lock */
    beginTransition(): void {
      state = { ...state, transition_in_progress: true };
      // Auto-release after max transition time
      setTimeout(() => {
        state = { ...state, transition_in_progress: false };
        notify();
      }, PROXIMITY.maxDuration + 20);
      notify();
    },

    /** End transition lock */
    endTransition(): void {
      state = { ...state, transition_in_progress: false };
      notify();
    },

    /** Reset to defaults */
    reset(): void {
      state = createLayoutState();
      notify();
    },

    /** Get computed edge width for layout */
    getEdgeWidth(edge: EdgeId): number {
      const edgeState = state.edge_preview_state[edge];
      switch (edgeState) {
        case 'idle': return PROXIMITY.edgeIdleWidth;
        case 'armed': return PROXIMITY.edgeIdleWidth;
        case 'preview': return PROXIMITY.edgePreviewWidth;
        case 'locked': return PROXIMITY.edgeLockedWidth;
        default: return PROXIMITY.edgeIdleWidth;
      }
    },

    /** Get dock height */
    getDockHeight(): number {
      if (state.dock_collapsed && !state.dock_pinned) return PROXIMITY.dockIdleHeight;
      return PROXIMITY.dockPreviewHeight;
    },
  };
}

export const layoutStore = createLayoutStore();
