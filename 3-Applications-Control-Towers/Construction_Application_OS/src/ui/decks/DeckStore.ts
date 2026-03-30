/**
 * Construction OS — Deck Store
 *
 * Registry and persistence for Command Decks. Supports:
 *   - Save (create new deck from current cockpit state)
 *   - Load (retrieve deck by ID)
 *   - Rename
 *   - Delete
 *   - List all decks
 *
 * System decks are pre-loaded and cannot be deleted.
 * User decks are fully CRUD-capable.
 *
 * Storage: In-memory with optional localStorage persistence.
 * Deck IDs are prefixed: "sys-" for system, "usr-" for user.
 */

import type { DeckState, GravityContext, PanelMode, PanelFilter, LayoutState, PinnedReference, SpatialFocus } from '../contracts/deck-types';
import type { PanelId } from '../contracts/events';
import { DEFAULT_DECKS } from './defaultDecks';

type Listener = () => void;

const STORAGE_KEY = 'construction-os-command-decks';

function createDeckStore() {
  let decks = new Map<string, DeckState>();
  const listeners = new Set<Listener>();

  // Initialize with default system decks
  for (const deck of DEFAULT_DECKS) {
    decks.set(deck.deck_id, deck);
  }

  // Attempt to load user decks from localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DeckState[] = JSON.parse(stored);
        for (const deck of parsed) {
          if (!deck.is_system_deck) {
            decks.set(deck.deck_id, deck);
          }
        }
      }
    }
  } catch {
    // FAIL_CLOSED: localStorage unavailable, proceed with defaults only
  }

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  function persist() {
    try {
      if (typeof localStorage !== 'undefined') {
        const userDecks = Array.from(decks.values()).filter((d) => !d.is_system_deck);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userDecks));
      }
    } catch {
      // FAIL_CLOSED: persistence unavailable, deck exists in memory only
    }
  }

  return {
    /** Subscribe to store changes */
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Get all decks */
    getAll(): readonly DeckState[] {
      return Array.from(decks.values());
    },

    /** Get system decks only */
    getSystemDecks(): readonly DeckState[] {
      return Array.from(decks.values()).filter((d) => d.is_system_deck);
    },

    /** Get user decks only */
    getUserDecks(): readonly DeckState[] {
      return Array.from(decks.values()).filter((d) => !d.is_system_deck);
    },

    /** Get deck by ID */
    getDeck(deckId: string): DeckState | null {
      return decks.get(deckId) ?? null;
    },

    /**
     * Save a new user deck from the current cockpit state.
     * Returns the created deck ID.
     */
    saveDeck(params: {
      deck_name: string;
      gravity_context: GravityContext;
      panel_modes: readonly PanelMode[];
      layout_state: LayoutState;
      promoted_panel: PanelId;
      filters: readonly PanelFilter[];
      pinned_references?: readonly PinnedReference[];
      spatial_focus?: SpatialFocus | null;
    }): string {
      const deckId = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const now = Date.now();

      const deck: DeckState = {
        deck_id: deckId,
        deck_name: params.deck_name,
        gravity_context: params.gravity_context,
        panel_modes: params.panel_modes,
        layout_state: params.layout_state,
        promoted_panel: params.promoted_panel,
        filters: params.filters,
        pinned_references: params.pinned_references ?? [],
        spatial_focus: params.spatial_focus ?? null,
        is_system_deck: false,
        created_at: now,
        updated_at: now,
      };

      decks.set(deckId, deck);
      persist();
      notify();
      return deckId;
    },

    /**
     * Rename an existing deck. System decks cannot be renamed.
     * Returns true if successful, false if deck not found or is system deck.
     */
    renameDeck(deckId: string, newName: string): boolean {
      const deck = decks.get(deckId);
      if (!deck || deck.is_system_deck) return false;

      const updated: DeckState = {
        ...deck,
        deck_name: newName,
        updated_at: Date.now(),
      };
      decks.set(deckId, updated);
      persist();
      notify();
      return true;
    },

    /**
     * Delete an existing deck. System decks cannot be deleted.
     * Returns true if successful, false if deck not found or is system deck.
     */
    deleteDeck(deckId: string): boolean {
      const deck = decks.get(deckId);
      if (!deck || deck.is_system_deck) return false;

      decks.delete(deckId);
      persist();
      notify();
      return true;
    },

    /**
     * Update an existing user deck with new state.
     * System decks cannot be updated.
     */
    updateDeck(deckId: string, updates: Partial<Omit<DeckState, 'deck_id' | 'is_system_deck' | 'created_at'>>): boolean {
      const deck = decks.get(deckId);
      if (!deck || deck.is_system_deck) return false;

      const updated: DeckState = {
        ...deck,
        ...updates,
        deck_id: deck.deck_id,
        is_system_deck: false,
        created_at: deck.created_at,
        updated_at: Date.now(),
      };
      decks.set(deckId, updated);
      persist();
      notify();
      return true;
    },

    /** Get deck count */
    getCount(): number {
      return decks.size;
    },
  };
}

export const deckStore = createDeckStore();
