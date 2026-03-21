/**
 * Construction OS — useInteraction Hook
 *
 * React hook that exposes the VKBUS InteractionKernel state and commands.
 * UI panels use this hook to read interaction state and issue commands.
 * UI emits commands only — UI never mutates truth.
 *
 * Returns:
 *   activeObject       — current active object identity
 *   activeTime         — current active timestamp
 *   simulationBranch   — current simulation branch (if any)
 *   setActiveObject    — command: set active object by ID
 *   setActiveTime      — command: set active time
 *   startSimulation    — command: start a simulation branch
 *   updateSimulation   — command: patch the running simulation
 *   commitSimulation   — command: commit the running simulation
 *   discardSimulation  — command: discard the running simulation
 */

import { useCallback, useEffect, useState } from 'react';
import interactionClient from '../bus/interactionClient';
import type {
  InteractionState,
  SimulationBranch,
} from '../bus/interactionClient';
import type { ActiveObjectIdentity, PanelId, SourceBasis } from '../contracts/events';

export interface UseInteractionReturn {
  // State
  activeObject: ActiveObjectIdentity | null;
  activeTime: number;
  simulationBranch: SimulationBranch | null;
  // Commands
  setActiveObject: (objectId: string, source: PanelId, basis?: SourceBasis) => void;
  setActiveTime: (timestamp: number) => void;
  startSimulation: (changeSet: Record<string, unknown>) => SimulationBranch;
  updateSimulation: (patch: Record<string, unknown>) => SimulationBranch | null;
  commitSimulation: () => SimulationBranch | null;
  discardSimulation: () => void;
}

export function useInteraction(): UseInteractionReturn {
  const [state, setState] = useState<InteractionState>(
    () => interactionClient.getState()
  );

  useEffect(() => {
    const handler = (next: InteractionState) => setState(next);

    const unsubs = [
      interactionClient.subscribe('interaction.object.changed', handler),
      interactionClient.subscribe('interaction.time.changed', handler),
      interactionClient.subscribe('interaction.simulation.updated', handler),
    ];

    // Sync initial state in case it changed between render and effect
    setState(interactionClient.getState());

    return () => {
      for (const unsub of unsubs) unsub();
    };
  }, []);

  const setActiveObject = useCallback(
    (objectId: string, source: PanelId, basis?: SourceBasis) => {
      interactionClient.setActiveObject(objectId, source, basis);
    },
    []
  );

  const setActiveTime = useCallback((timestamp: number) => {
    interactionClient.setActiveTime(timestamp);
  }, []);

  const startSimulation = useCallback(
    (changeSet: Record<string, unknown>) => interactionClient.startSimulation(changeSet),
    []
  );

  const updateSimulation = useCallback(
    (patch: Record<string, unknown>) => interactionClient.updateSimulation(patch),
    []
  );

  const commitSimulation = useCallback(
    () => interactionClient.commitSimulation(),
    []
  );

  const discardSimulation = useCallback(
    () => interactionClient.discardSimulation(),
    []
  );

  return {
    activeObject: state.activeObject,
    activeTime: state.activeTime,
    simulationBranch: state.simulationBranch,
    setActiveObject,
    setActiveTime,
    startSimulation,
    updateSimulation,
    commitSimulation,
    discardSimulation,
  };
}
