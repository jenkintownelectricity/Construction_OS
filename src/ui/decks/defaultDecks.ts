/**
 * Construction OS — Default System Decks
 *
 * Pre-configured cockpit states for common operator workflows.
 * System decks cannot be deleted or renamed.
 *
 * Default Decks:
 *   1. Condition Investigation — focus on awareness + diagnostics
 *   2. Artifact Review — focus on work + artifacts + validation
 *   3. Spatial Navigation — focus on spatial + explorer
 *   4. Proposal Review — focus on proposals + assistant + awareness
 */

import type { DeckState } from '../contracts/deck-types';

const SYSTEM_DECK_TIMESTAMP = Date.now();

export const DEFAULT_DECKS: readonly DeckState[] = [
  // ─── Condition Investigation ─────────────────────────────────────────────
  {
    deck_id: 'sys-condition-investigation',
    deck_name: 'Condition Investigation',
    gravity_context: {
      activeObject: null,
      basis: 'canonical',
      sourcePanel: null,
      compareObject: null,
      workspaceMode: 'default',
    },
    panel_modes: [
      { panelId: 'awareness', activeTab: 'conditions', flags: {} },
      { panelId: 'diagnostics', activeTab: 'pipeline', flags: {} },
      { panelId: 'explorer', activeTab: 'tree', flags: {} },
      { panelId: 'work', activeTab: 'detail', flags: {} },
      { panelId: 'system', activeTab: 'validation', flags: {} },
    ],
    layout_state: {
      visiblePanels: ['explorer', 'awareness', 'diagnostics', 'work', 'system'],
      arrangement: 'investigation',
    },
    promoted_panel: 'awareness',
    filters: [
      { panelId: 'awareness', filters: { tab: 'conditions' } },
      { panelId: 'diagnostics', filters: { showFailedOnly: false } },
    ],
    pinned_references: [],
    spatial_focus: null,
    is_system_deck: true,
    created_at: SYSTEM_DECK_TIMESTAMP,
    updated_at: SYSTEM_DECK_TIMESTAMP,
  },

  // ─── Artifact Review ─────────────────────────────────────────────────────
  {
    deck_id: 'sys-artifact-review',
    deck_name: 'Artifact Review',
    gravity_context: {
      activeObject: null,
      basis: 'canonical',
      sourcePanel: null,
      compareObject: null,
      workspaceMode: 'review',
    },
    panel_modes: [
      { panelId: 'work', activeTab: 'artifact', flags: {} },
      { panelId: 'awareness', activeTab: 'artifacts', flags: {} },
      { panelId: 'diagnostics', activeTab: 'artifacts', flags: {} },
      { panelId: 'reference', activeTab: 'specs', flags: {} },
      { panelId: 'system', activeTab: 'validation', flags: {} },
    ],
    layout_state: {
      visiblePanels: ['work', 'awareness', 'diagnostics', 'reference', 'system'],
      arrangement: 'review',
    },
    promoted_panel: 'work',
    filters: [
      { panelId: 'awareness', filters: { tab: 'artifacts' } },
      { panelId: 'diagnostics', filters: { tab: 'artifacts' } },
    ],
    pinned_references: [],
    spatial_focus: null,
    is_system_deck: true,
    created_at: SYSTEM_DECK_TIMESTAMP,
    updated_at: SYSTEM_DECK_TIMESTAMP,
  },

  // ─── Spatial Navigation ──────────────────────────────────────────────────
  {
    deck_id: 'sys-spatial-navigation',
    deck_name: 'Spatial Navigation',
    gravity_context: {
      activeObject: null,
      basis: 'canonical',
      sourcePanel: null,
      compareObject: null,
      workspaceMode: 'default',
    },
    panel_modes: [
      { panelId: 'spatial', activeTab: 'atlas', flags: {} },
      { panelId: 'explorer', activeTab: 'zones', flags: {} },
      { panelId: 'work', activeTab: 'detail', flags: {} },
      { panelId: 'reference', activeTab: 'documents', flags: {} },
    ],
    layout_state: {
      visiblePanels: ['spatial', 'explorer', 'work', 'reference'],
      arrangement: 'spatial-nav',
    },
    promoted_panel: 'spatial',
    filters: [
      { panelId: 'explorer', filters: { filterType: 'zones' } },
    ],
    pinned_references: [],
    spatial_focus: null,
    is_system_deck: true,
    created_at: SYSTEM_DECK_TIMESTAMP,
    updated_at: SYSTEM_DECK_TIMESTAMP,
  },

  // ─── Proposal Review ─────────────────────────────────────────────────────
  {
    deck_id: 'sys-proposal-review',
    deck_name: 'Proposal Review',
    gravity_context: {
      activeObject: null,
      basis: 'canonical',
      sourcePanel: null,
      compareObject: null,
      workspaceMode: 'review',
    },
    panel_modes: [
      { panelId: 'proposals', activeTab: 'pending', flags: {} },
      { panelId: 'assistant', activeTab: 'responses', flags: {} },
      { panelId: 'awareness', activeTab: 'proposals', flags: {} },
      { panelId: 'work', activeTab: 'detail', flags: {} },
      { panelId: 'diagnostics', activeTab: 'events', flags: {} },
    ],
    layout_state: {
      visiblePanels: ['proposals', 'assistant', 'awareness', 'work', 'diagnostics'],
      arrangement: 'review',
    },
    promoted_panel: 'proposals',
    filters: [
      { panelId: 'proposals', filters: { status: 'pending' } },
      { panelId: 'awareness', filters: { tab: 'proposals' } },
    ],
    pinned_references: [],
    spatial_focus: null,
    is_system_deck: true,
    created_at: SYSTEM_DECK_TIMESTAMP,
    updated_at: SYSTEM_DECK_TIMESTAMP,
  },
];
