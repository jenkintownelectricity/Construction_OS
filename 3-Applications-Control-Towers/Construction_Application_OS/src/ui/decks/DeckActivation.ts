/**
 * Construction OS — Deck Activation
 *
 * Applies a saved deck state to the cockpit atomically:
 *   1. Clears GravityStack
 *   2. Applies gravity context (active object, workspace mode)
 *   3. Applies layout state (panel visibility)
 *   4. Applies promoted panel
 *   5. Applies panel modes
 *   6. Applies filters
 *   7. Applies spatial focus (if present)
 *
 * FAIL_CLOSED: If any saved deck field references unavailable context
 * (e.g., an object ID that no longer exists), activation proceeds with
 * available fields and reports unavailable ones in the result.
 *
 * RING 3 ONLY: Deck activation NEVER executes runtime actions,
 * NEVER invokes assistant execution, NEVER auto-approves proposals.
 * It is strictly UI state restoration.
 */

import type { DeckState, DeckActivationResult, DeckFieldUnavailable } from '../contracts/deck-types';
import type { PanelId } from '../contracts/events';
import { activeObjectStore } from '../stores/activeObjectStore';
import { gravityStack } from './GravityStack';

/** All valid panel IDs for validation */
const VALID_PANELS: ReadonlySet<PanelId> = new Set([
  'explorer', 'work', 'reference', 'spatial', 'system',
  'awareness', 'proposals', 'diagnostics', 'assistant',
]);

/**
 * Activate a deck, applying its state to the cockpit atomically.
 * Returns a result indicating success and any unavailable fields.
 *
 * @param deck The deck state to activate
 * @param applyLayout Callback to apply layout changes in the workspace shell
 */
export function activateDeck(
  deck: DeckState,
  applyLayout: (visiblePanels: readonly PanelId[], promotedPanel: PanelId) => void,
): DeckActivationResult {
  const unavailable: DeckFieldUnavailable[] = [];
  const activatedAt = Date.now();

  // ─── Step 1: Clear GravityStack ────────────────────────────────────
  gravityStack.clear();

  // ─── Step 2: Apply Gravity Context ─────────────────────────────────
  const gc = deck.gravity_context;

  if (gc.activeObject) {
    // Validate that the object has a valid shape
    if (gc.activeObject.id && gc.activeObject.name && gc.activeObject.type) {
      activeObjectStore.setActiveObject(gc.activeObject, gc.sourcePanel ?? 'system', gc.basis);
    } else {
      unavailable.push({
        field: 'gravity_context.activeObject',
        reason: 'Saved active object has invalid shape (missing id, name, or type)',
        severity: 'warning',
      });
    }
  } else {
    // Null active object is valid — it means no focus
    activeObjectStore.setActiveObject(null as never, 'system', gc.basis);
  }

  if (gc.compareObject) {
    activeObjectStore.setCompareObject(gc.compareObject);
  } else {
    activeObjectStore.setCompareObject(null);
  }

  activeObjectStore.setWorkspaceMode(gc.workspaceMode);

  // Push the deck's gravity context as the new stack root
  gravityStack.pushDeckActivation(gc);

  // ─── Step 3: Apply Layout State ────────────────────────────────────
  const validPanels = deck.layout_state.visiblePanels.filter((p) => VALID_PANELS.has(p));
  const invalidPanels = deck.layout_state.visiblePanels.filter((p) => !VALID_PANELS.has(p));

  if (invalidPanels.length > 0) {
    unavailable.push({
      field: 'layout_state.visiblePanels',
      reason: `Unknown panels referenced: ${invalidPanels.join(', ')}`,
      severity: 'warning',
    });
  }

  if (validPanels.length === 0) {
    unavailable.push({
      field: 'layout_state.visiblePanels',
      reason: 'No valid panels in saved layout — falling back to default',
      severity: 'error',
    });
    // Fallback to hero cockpit default
    applyLayout(['explorer', 'work', 'reference', 'spatial', 'system'], 'work');
  } else {
    // ─── Step 4: Apply Promoted Panel ──────────────────────────────
    let promotedPanel = deck.promoted_panel;
    if (!VALID_PANELS.has(promotedPanel)) {
      unavailable.push({
        field: 'promoted_panel',
        reason: `Invalid promoted panel "${promotedPanel}" — falling back to work`,
        severity: 'warning',
      });
      promotedPanel = 'work';
    }

    // Ensure promoted panel is in the visible set
    const visibleSet = new Set(validPanels);
    if (!visibleSet.has(promotedPanel)) {
      visibleSet.add(promotedPanel);
    }

    applyLayout(Array.from(visibleSet), promotedPanel);
  }

  // ─── Step 5: Panel Modes ───────────────────────────────────────────
  // Panel modes are stored but applied via event bus or direct panel state.
  // Panels read their mode from the deck store during render.
  // No additional action needed here — panels check active deck on mount.

  for (const mode of deck.panel_modes) {
    if (!VALID_PANELS.has(mode.panelId)) {
      unavailable.push({
        field: `panel_modes[${mode.panelId}]`,
        reason: `Unknown panel "${mode.panelId}" in panel modes`,
        severity: 'warning',
      });
    }
  }

  // ─── Step 6: Filters ──────────────────────────────────────────────
  // Filters are stored and available via getDeck(). Panels read on mount.
  for (const filter of deck.filters) {
    if (!VALID_PANELS.has(filter.panelId)) {
      unavailable.push({
        field: `filters[${filter.panelId}]`,
        reason: `Unknown panel "${filter.panelId}" in filters`,
        severity: 'warning',
      });
    }
  }

  // ─── Step 7: Spatial Focus ────────────────────────────────────────
  if (deck.spatial_focus) {
    if (!deck.spatial_focus.zoneId) {
      unavailable.push({
        field: 'spatial_focus',
        reason: 'Saved spatial focus has no zoneId — cannot restore',
        severity: 'warning',
      });
    }
    // Spatial focus is read by the Spatial panel from the active deck
  }

  return {
    success: unavailable.filter((u) => u.severity === 'error').length === 0,
    unavailable,
    deck_id: deck.deck_id,
    activated_at: activatedAt,
  };
}
