/**
 * Construction OS — InteractionProvider
 *
 * Wraps WorkspaceShell to initialize and manage the VKBUS InteractionKernel
 * lifecycle. Provides interaction context to all descendant panels.
 *
 * Rules:
 *   - UI emits commands only.
 *   - UI never mutates truth.
 *   - All computation occurs in VKBUS + Runtime.
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import interactionClient, {
  type InteractionKernel,
} from '../bus/interactionClient';
import { useInteraction, type UseInteractionReturn } from '../hooks/useInteraction';

// ─── Context ────────────────────────────────────────────────────────────────

const InteractionKernelContext = createContext<InteractionKernel | null>(null);
const InteractionContext = createContext<UseInteractionReturn | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

interface InteractionProviderProps {
  children: ReactNode;
}

export function InteractionProvider({ children }: InteractionProviderProps) {
  const interaction = useInteraction();

  // Cleanup kernel on unmount
  useEffect(() => {
    return () => {
      interactionClient.destroy();
    };
  }, []);

  return (
    <InteractionKernelContext.Provider value={interactionClient}>
      <InteractionContext.Provider value={interaction}>
        {children}
      </InteractionContext.Provider>
    </InteractionKernelContext.Provider>
  );
}

// ─── Consumer Hooks ─────────────────────────────────────────────────────────

/**
 * Access the raw InteractionKernel instance (for advanced/direct subscriptions).
 */
export function useInteractionKernel(): InteractionKernel {
  const ctx = useContext(InteractionKernelContext);
  if (!ctx) {
    throw new Error('useInteractionKernel must be used within <InteractionProvider>');
  }
  return ctx;
}

/**
 * Access the interaction state and commands via context.
 * Equivalent to useInteraction() but guaranteed to be within provider scope.
 */
export function useInteractionContext(): UseInteractionReturn {
  const ctx = useContext(InteractionContext);
  if (!ctx) {
    throw new Error('useInteractionContext must be used within <InteractionProvider>');
  }
  return ctx;
}
