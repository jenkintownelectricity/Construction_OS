/**
 * Construction OS — Gravity Stack
 *
 * Tracks the operator's navigation context history. Each focus change
 * (object selection, zone navigation, Truth Echo propagation) pushes
 * a GravityContext onto the stack.
 *
 * Deck activation clears the GravityStack before applying new state.
 * The stack enables future back/forward navigation (not yet implemented).
 *
 * Max stack depth: 50 entries (oldest entries are evicted).
 */

import type { GravityContext, GravityStackEntry } from '../contracts/deck-types';
import type { ActiveObjectIdentity, PanelId, SourceBasis, WorkspaceMode } from '../contracts/events';

const MAX_STACK_DEPTH = 50;

type Listener = () => void;

function createGravityStack() {
  let stack: GravityStackEntry[] = [];
  let currentIndex = -1;
  const listeners = new Set<Listener>();

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    /** Get current stack state */
    getStack(): readonly GravityStackEntry[] {
      return stack;
    },

    /** Get current gravity context (top of stack) */
    getCurrentContext(): GravityContext | null {
      if (currentIndex < 0 || currentIndex >= stack.length) return null;
      return stack[currentIndex].context;
    },

    /** Get stack depth */
    getDepth(): number {
      return stack.length;
    },

    /** Get current index in stack */
    getCurrentIndex(): number {
      return currentIndex;
    },

    /** Subscribe to stack changes */
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * Push a new gravity context onto the stack.
     * If we're not at the top (after back navigation), truncate forward entries.
     */
    push(
      activeObject: ActiveObjectIdentity | null,
      sourcePanel: PanelId | null,
      basis: SourceBasis,
      workspaceMode: WorkspaceMode,
      compareObject: ActiveObjectIdentity | null,
      trigger: GravityStackEntry['trigger']
    ): void {
      const context: GravityContext = {
        activeObject,
        basis,
        sourcePanel,
        compareObject,
        workspaceMode,
      };

      const entry: GravityStackEntry = {
        context,
        timestamp: Date.now(),
        trigger,
      };

      // Truncate any forward entries if we navigated back
      if (currentIndex < stack.length - 1) {
        stack = stack.slice(0, currentIndex + 1);
      }

      stack.push(entry);

      // Evict oldest if over max depth
      if (stack.length > MAX_STACK_DEPTH) {
        stack = stack.slice(stack.length - MAX_STACK_DEPTH);
      }

      currentIndex = stack.length - 1;
      notify();
    },

    /**
     * Clear the entire gravity stack. Called before deck activation.
     */
    clear(): void {
      stack = [];
      currentIndex = -1;
      notify();
    },

    /**
     * Push a deck activation entry and set it as current.
     */
    pushDeckActivation(context: GravityContext): void {
      const entry: GravityStackEntry = {
        context,
        timestamp: Date.now(),
        trigger: 'deck_activation',
      };
      stack = [entry]; // Clear and replace
      currentIndex = 0;
      notify();
    },
  };
}

export const gravityStack = createGravityStack();
