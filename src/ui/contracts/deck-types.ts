/**
 * Construction OS — Command Deck Type Contracts
 *
 * A Command Deck is a named, deterministic saved cockpit state.
 * Decks store the complete operator context:
 *   - gravity context (active object focus)
 *   - panel modes (per-panel operational mode)
 *   - layout state (panel positions and visibility)
 *   - promoted panel (which panel has primary visual emphasis)
 *   - filters (per-panel filter configurations)
 *   - optional pinned references
 *   - optional spatial focus
 *
 * Deck activation applies full cockpit state atomically.
 * Deck activation clears GravityStack before applying new state.
 * Deck activation NEVER executes runtime or assistant actions.
 *
 * FAIL_CLOSED: If a saved deck references unavailable context,
 * the UI displays an explicit notice rather than silently failing.
 */

import type { ActiveObjectIdentity, PanelId, WorkspaceMode, SourceBasis } from './events';

// ─── Gravity Context ───────────────────────────────────────────────────────
// Represents the focal point of the cockpit — which object/zone the
// operator is investigating and how they arrived there.

export interface GravityContext {
  /** The active object the cockpit is oriented around */
  readonly activeObject: ActiveObjectIdentity | null;
  /** Source basis of the active object */
  readonly basis: SourceBasis;
  /** Which panel established the gravity context */
  readonly sourcePanel: PanelId | null;
  /** Compare target (if in compare mode) */
  readonly compareObject: ActiveObjectIdentity | null;
  /** Workspace mode at time of capture */
  readonly workspaceMode: WorkspaceMode;
}

// ─── Gravity Stack Entry ───────────────────────────────────────────────────
// Each navigation action pushes a gravity context onto the stack.

export interface GravityStackEntry {
  readonly context: GravityContext;
  readonly timestamp: number;
  readonly trigger: 'user_selection' | 'truth_echo' | 'deck_activation' | 'zone_navigation';
}

// ─── Panel Mode ────────────────────────────────────────────────────────────
// Per-panel operational mode. Each panel may define its own mode set.

export interface PanelMode {
  /** Panel this mode applies to */
  readonly panelId: PanelId;
  /** Active tab or view within the panel */
  readonly activeTab: string;
  /** Panel-specific mode flags */
  readonly flags: Readonly<Record<string, unknown>>;
}

// ─── Panel Filter ──────────────────────────────────────────────────────────
// Per-panel filter configuration saved with a deck.

export interface PanelFilter {
  readonly panelId: PanelId;
  /** Filter key-value pairs specific to the panel */
  readonly filters: Readonly<Record<string, unknown>>;
}

// ─── Pinned Reference ──────────────────────────────────────────────────────

export interface PinnedReference {
  readonly referenceId: string;
  readonly objectId: string;
  readonly referenceType: 'spec' | 'code' | 'citation' | 'document';
  readonly title: string;
}

// ─── Spatial Focus ─────────────────────────────────────────────────────────

export interface SpatialFocus {
  readonly zoneId: string;
  readonly zoneName: string;
  readonly viewportCenter?: { readonly x: number; readonly y: number };
  readonly zoomLevel?: number;
  readonly activeLayers?: readonly string[];
}

// ─── Layout State ──────────────────────────────────────────────────────────
// Captures which panels are visible and their arrangement.

export interface LayoutState {
  /** Ordered list of visible panels */
  readonly visiblePanels: readonly PanelId[];
  /** Panel arrangement descriptor (device-adaptive) */
  readonly arrangement: 'hero-cockpit' | 'investigation' | 'review' | 'spatial-nav' | 'custom';
}

// ─── Deck State ────────────────────────────────────────────────────────────
// The complete saved cockpit state. This is the core contract.

export interface DeckState {
  /** Unique deck identifier */
  readonly deck_id: string;
  /** Human-readable deck name */
  readonly deck_name: string;
  /** Gravity context — active object focus */
  readonly gravity_context: GravityContext;
  /** Per-panel operational modes */
  readonly panel_modes: readonly PanelMode[];
  /** Panel layout and visibility */
  readonly layout_state: LayoutState;
  /** Which panel is promoted (primary visual emphasis) */
  readonly promoted_panel: PanelId;
  /** Per-panel filter configurations */
  readonly filters: readonly PanelFilter[];
  /** Optional pinned references */
  readonly pinned_references: readonly PinnedReference[];
  /** Optional spatial focus */
  readonly spatial_focus: SpatialFocus | null;
  /** Whether this is a system-provided default deck */
  readonly is_system_deck: boolean;
  /** Creation timestamp */
  readonly created_at: number;
  /** Last modified timestamp */
  readonly updated_at: number;
}

// ─── Deck Activation Result ────────────────────────────────────────────────

export interface DeckActivationResult {
  readonly success: boolean;
  /** Fields that could not be restored (FAIL_CLOSED) */
  readonly unavailable: readonly DeckFieldUnavailable[];
  /** The deck that was activated */
  readonly deck_id: string;
  /** Timestamp of activation */
  readonly activated_at: number;
}

export interface DeckFieldUnavailable {
  readonly field: string;
  readonly reason: string;
  readonly severity: 'warning' | 'error';
}
