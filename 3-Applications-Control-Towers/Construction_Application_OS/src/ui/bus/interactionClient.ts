/**
 * Construction OS — VKBUS Interaction Client
 *
 * Facade over EventBus + ActiveObjectStore that exposes a VKBUS-compatible
 * InteractionKernel interface. UI panels issue commands through this client;
 * all computation occurs in VKBUS + Runtime — the UI never mutates truth.
 *
 * Event subscriptions:
 *   interaction.object.changed  — active object changed
 *   interaction.time.changed    — active time changed
 *   interaction.simulation.updated — simulation branch updated
 */

import { eventBus } from '../events/EventBus';
import { activeObjectStore } from '../stores/activeObjectStore';
import type {
  ActiveObjectIdentity,
  PanelId,
  SourceBasis,
} from '../contracts/events';

// ─── Interaction Event Types ────────────────────────────────────────────────

export type InteractionEventName =
  | 'interaction.object.changed'
  | 'interaction.time.changed'
  | 'interaction.simulation.updated';

export interface SimulationBranch {
  readonly id: string;
  readonly status: 'idle' | 'running' | 'committed' | 'discarded';
  readonly changeSet: Record<string, unknown>;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface InteractionState {
  readonly activeObject: ActiveObjectIdentity | null;
  readonly activeTime: number;
  readonly simulationBranch: SimulationBranch | null;
}

type InteractionHandler = (state: InteractionState) => void;

// ─── InteractionKernel ──────────────────────────────────────────────────────

class InteractionKernel {
  private activeTime: number = Date.now();
  private simulationBranch: SimulationBranch | null = null;
  private handlers = new Map<InteractionEventName, Set<InteractionHandler>>();
  private busUnsubscribers: Array<() => void> = [];

  constructor() {
    this.bindToBus();
  }

  // ─── Bus Bridge ─────────────────────────────────────────────────────────

  private bindToBus(): void {
    // Bridge object.selected → interaction.object.changed
    this.busUnsubscribers.push(
      eventBus.on('object.selected', () => {
        this.notify('interaction.object.changed');
      })
    );

    // Bridge zone.selected → interaction.object.changed
    this.busUnsubscribers.push(
      eventBus.on('zone.selected', () => {
        this.notify('interaction.object.changed');
      })
    );

    // Bridge truth-echo.propagated → interaction.object.changed
    this.busUnsubscribers.push(
      eventBus.on('truth-echo.propagated', () => {
        this.notify('interaction.object.changed');
      })
    );
  }

  // ─── State Accessors ───────────────────────────────────────────────────

  getState(): InteractionState {
    const storeState = activeObjectStore.getState();
    return {
      activeObject: storeState.activeObject,
      activeTime: this.activeTime,
      simulationBranch: this.simulationBranch,
    };
  }

  // ─── Commands (UI emits commands only) ─────────────────────────────────

  setActiveObject(objectId: string, source: PanelId, basis: SourceBasis = 'mock'): void {
    const object: ActiveObjectIdentity = {
      id: objectId,
      type: 'element',
      name: objectId,
    };
    eventBus.emit('object.selected', { object, source, basis });
  }

  setActiveTime(timestamp: number): void {
    this.activeTime = timestamp;
    this.notify('interaction.time.changed');
  }

  startSimulation(changeSet: Record<string, unknown>): SimulationBranch {
    this.simulationBranch = {
      id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'running',
      changeSet,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.notify('interaction.simulation.updated');
    return this.simulationBranch;
  }

  updateSimulation(patch: Record<string, unknown>): SimulationBranch | null {
    if (!this.simulationBranch || this.simulationBranch.status !== 'running') {
      return null;
    }
    this.simulationBranch = {
      ...this.simulationBranch,
      changeSet: { ...this.simulationBranch.changeSet, ...patch },
      updatedAt: Date.now(),
    };
    this.notify('interaction.simulation.updated');
    return this.simulationBranch;
  }

  commitSimulation(): SimulationBranch | null {
    if (!this.simulationBranch || this.simulationBranch.status !== 'running') {
      return null;
    }
    this.simulationBranch = {
      ...this.simulationBranch,
      status: 'committed',
      updatedAt: Date.now(),
    };
    this.notify('interaction.simulation.updated');
    const committed = this.simulationBranch;
    this.simulationBranch = null;
    return committed;
  }

  discardSimulation(): void {
    if (!this.simulationBranch) return;
    this.simulationBranch = {
      ...this.simulationBranch,
      status: 'discarded',
      updatedAt: Date.now(),
    };
    this.notify('interaction.simulation.updated');
    this.simulationBranch = null;
  }

  // ─── Subscriptions ────────────────────────────────────────────────────

  subscribe(event: InteractionEventName, handler: InteractionHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    const set = this.handlers.get(event)!;
    set.add(handler);
    return () => {
      set.delete(handler);
      if (set.size === 0) this.handlers.delete(event);
    };
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  destroy(): void {
    for (const unsub of this.busUnsubscribers) {
      unsub();
    }
    this.busUnsubscribers.length = 0;
    this.handlers.clear();
    this.simulationBranch = null;
  }

  // ─── Internal ─────────────────────────────────────────────────────────

  private notify(event: InteractionEventName): void {
    const set = this.handlers.get(event);
    if (!set || set.size === 0) return;
    const state = this.getState();
    for (const handler of set) {
      queueMicrotask(() => {
        try {
          handler(state);
        } catch (err) {
          console.error(`[InteractionKernel] Handler error for ${event}:`, err);
        }
      });
    }
  }
}

// Singleton instance
const interactionClient = new InteractionKernel();
export default interactionClient;
export { InteractionKernel };
