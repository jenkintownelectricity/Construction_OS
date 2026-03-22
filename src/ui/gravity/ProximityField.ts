/**
 * Construction OS — Deterministic Proximity Field Model (Stabilized)
 *
 * Intent-state transitions replace continuous raw-pointer layout resizing:
 *   idle → sensing (edge_armed) → preview → locked → (release → idle)
 *
 * Hysteresis: entry threshold (80px) vs exit threshold (120px) prevents flicker.
 * Cooldown: collapsed edges cannot be re-triggered for 300ms.
 * Transition lock: no re-layout while transition_in_progress = true.
 * Strongest-edge-wins: only one edge dominates at a time.
 *
 * FAIL_CLOSED: Invalid coordinates or state → idle layout.
 */

import {
  PROXIMITY,
  type EdgeId,
  type EdgeFieldState,
  type ProximityFieldSnapshot,
  createIdleSnapshot,
  createIdleFieldState,
} from './ProximityConstants';

type Listener = (snapshot: ProximityFieldSnapshot) => void;

class ProximityFieldEngine {
  private snapshot: ProximityFieldSnapshot;
  private listeners = new Set<Listener>();
  private animFrame: number | null = null;
  private active = false;
  private transitionTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.snapshot = createIdleSnapshot();
  }

  start(): void {
    if (this.active) return;
    this.active = true;
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('click', this.handleClick);
    window.addEventListener('resize', this.handleResize);
    this.tick();
  }

  stop(): void {
    this.active = false;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('resize', this.handleResize);
    if (this.animFrame != null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    if (this.transitionTimer != null) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
    this.snapshot = createIdleSnapshot();
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): ProximityFieldSnapshot {
    return this.snapshot;
  }

  /** Unlock a specific edge, returning it to idle with cooldown */
  unlockEdge(edge: EdgeId): void {
    const field = this.snapshot[edge];
    if (field.state === 'locked' || field.state === 'preview') {
      this.collapseEdge(edge);
    }
  }

  /** Lock a specific edge open */
  lockEdge(edge: EdgeId): void {
    if (this.snapshot.transitionInProgress) return;
    const field = this.snapshot[edge];
    this.beginTransition();
    this.snapshot = {
      ...this.snapshot,
      [edge]: { ...field, state: 'locked', lockedAt: Date.now(), proximity: 1 },
    };
    this.notify();
  }

  // ─── Private ─────────────────────────────────────────────────────────

  private collapseEdge(edge: EdgeId): void {
    const field = this.snapshot[edge];
    this.beginTransition();
    this.snapshot = {
      ...this.snapshot,
      [edge]: {
        ...field,
        state: 'idle',
        lockedAt: null,
        intentTimestamp: null,
        proximity: 0,
        collapsedAt: Date.now(),
      },
      dominantEdge: this.snapshot.dominantEdge === edge ? null : this.snapshot.dominantEdge,
    };
    this.notify();
  }

  private beginTransition(): void {
    this.snapshot = { ...this.snapshot, transitionInProgress: true };
    if (this.transitionTimer != null) clearTimeout(this.transitionTimer);
    this.transitionTimer = setTimeout(() => {
      this.snapshot = { ...this.snapshot, transitionInProgress: false };
      this.transitionTimer = null;
      this.notify();
    }, PROXIMITY.maxDuration + 30);
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.snapshot = { ...this.snapshot, mouseX: e.clientX, mouseY: e.clientY };
  };

  private handleClick = (_e: MouseEvent): void => {
    const dom = this.snapshot.dominantEdge;
    if (dom) {
      const field = this.snapshot[dom];
      if (field.state === 'preview' || field.state === 'expanding') {
        this.lockEdge(dom);
      }
    }
  };

  private handleResize = (): void => {
    this.snapshot = {
      ...this.snapshot,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  };

  private tick = (): void => {
    if (!this.active) return;
    this.update();
    this.animFrame = requestAnimationFrame(this.tick);
  };

  private update(): void {
    const { mouseX, mouseY, viewportWidth, viewportHeight, transitionInProgress } = this.snapshot;

    // FAIL_CLOSED: invalid coordinates → no update
    if (mouseX < 0 || mouseY < 0 || viewportWidth <= 0 || viewportHeight <= 0) return;

    // No re-layout while transition is in progress
    if (transitionInProgress) return;

    const now = Date.now();
    const leftDist = mouseX;
    const rightDist = viewportWidth - mouseX;
    const topDist = mouseY;
    const bottomDist = viewportHeight - mouseY;

    // Center safe zone check
    const inCenterX = mouseX > PROXIMITY.centerSafeZone && mouseX < viewportWidth - PROXIMITY.centerSafeZone;
    const inCenterY = mouseY > PROXIMITY.centerSafeZone && mouseY < viewportHeight - PROXIMITY.centerSafeZone;
    const inCenter = inCenterX && inCenterY;

    // Calculate proximity with hysteresis per edge
    const leftProx = inCenter ? 0 : this.calcProximityWithHysteresis(leftDist, this.snapshot.left);
    const rightProx = inCenter ? 0 : this.calcProximityWithHysteresis(rightDist, this.snapshot.right);
    const topProx = inCenter ? 0 : this.calcProximityWithHysteresis(topDist, this.snapshot.top);
    const bottomProx = inCenter ? 0 : this.calcProximityWithHysteresis(bottomDist, this.snapshot.bottom);

    // Determine dominant edge (strongest proximity wins, locked edges persist)
    let dominantEdge: EdgeId | null = null;
    let maxProx = 0;
    const prox: [EdgeId, number][] = [['left', leftProx], ['right', rightProx], ['top', topProx], ['bottom', bottomProx]];
    for (const [edge, p] of prox) {
      // Locked edges always stay active
      if (this.snapshot[edge].state === 'locked') {
        if (!dominantEdge || this.snapshot[dominantEdge].state !== 'locked') {
          dominantEdge = edge;
          maxProx = 1;
        }
        continue;
      }
      if (p > maxProx) {
        maxProx = p;
        dominantEdge = edge;
      }
    }

    // Update each edge with deterministic intent-state model
    const left = this.updateEdge(this.snapshot.left, leftProx, dominantEdge === 'left', now);
    const right = this.updateEdge(this.snapshot.right, rightProx, dominantEdge === 'right', now);
    const top = this.updateEdge(this.snapshot.top, topProx, dominantEdge === 'top', now);
    const bottom = this.updateEdge(this.snapshot.bottom, bottomProx, dominantEdge === 'bottom', now);

    const newSnapshot: ProximityFieldSnapshot = {
      left, right, top, bottom,
      dominantEdge: maxProx > 0 ? dominantEdge : null,
      mouseX, mouseY, viewportWidth, viewportHeight,
      transitionInProgress: false,
    };

    // Only notify on state changes (not continuous proximity noise)
    if (this.hasStateChanged(newSnapshot)) {
      // Begin transition lock if any edge changed state
      if (this.hasEdgeStateChanged(newSnapshot)) {
        newSnapshot.transitionInProgress = true;
        if (this.transitionTimer != null) clearTimeout(this.transitionTimer);
        this.transitionTimer = setTimeout(() => {
          this.snapshot = { ...this.snapshot, transitionInProgress: false };
          this.transitionTimer = null;
          this.notify();
        }, PROXIMITY.maxDuration + 30);
      }
      this.snapshot = newSnapshot;
      this.notify();
    }
  }

  /** Hysteresis-aware proximity: use entryThreshold to enter, exitThreshold to leave */
  private calcProximityWithHysteresis(distFromEdge: number, current: EdgeFieldState): number {
    const isCurrentlyActive = current.state !== 'idle';

    if (isCurrentlyActive) {
      // Use wider exit threshold — must move further away to disengage
      if (distFromEdge > PROXIMITY.exitThreshold) return 0;
      if (distFromEdge <= PROXIMITY.rampBand) return 1;
      return 1 - (distFromEdge - PROXIMITY.rampBand) / (PROXIMITY.exitThreshold - PROXIMITY.rampBand);
    }

    // Use tighter entry threshold
    if (distFromEdge > PROXIMITY.entryThreshold) return 0;
    if (distFromEdge <= PROXIMITY.rampBand) return 1;
    return 1 - (distFromEdge - PROXIMITY.rampBand) / (PROXIMITY.entryThreshold - PROXIMITY.rampBand);
  }

  /** Intent-state transitions: idle → sensing → preview → locked */
  private updateEdge(current: EdgeFieldState, proximity: number, isDominant: boolean, now: number): EdgeFieldState {
    // Locked state ignores proximity — only explicit unlock releases
    if (current.state === 'locked') {
      return { ...current, proximity: 1 };
    }

    // Cooldown enforcement — cannot re-arm during collapse cooldown
    if (current.collapsedAt && now - current.collapsedAt < PROXIMITY.collapseCooldown) {
      return { ...current, proximity: 0, state: 'idle', intentTimestamp: null };
    }

    // Zero proximity → idle
    if (proximity === 0) {
      if (current.state !== 'idle') {
        return { ...current, proximity: 0, state: 'idle', intentTimestamp: null, collapsedAt: now };
      }
      return current;
    }

    // Not dominant → demote to idle (but preserve collapsedAt)
    if (!isDominant) {
      if (current.state === 'preview' || current.state === 'expanding') {
        return { ...current, proximity, state: 'idle', intentTimestamp: null, collapsedAt: now };
      }
      return { ...current, proximity: 0, state: 'idle', intentTimestamp: null };
    }

    // === This is the dominant edge ===

    // idle/sensing → wait for intent delay, then promote to preview
    if (current.state === 'idle' || current.state === 'sensing') {
      const intentTs = current.intentTimestamp ?? now;
      const elapsed = now - intentTs;
      if (elapsed >= PROXIMITY.intentDelay) {
        // Intent confirmed → jump straight to preview (no continuous expanding)
        return { ...current, proximity, state: 'preview', intentTimestamp: intentTs, collapsedAt: null };
      }
      return { ...current, proximity, state: 'sensing', intentTimestamp: intentTs };
    }

    // expanding → promote to preview (legacy compat)
    if (current.state === 'expanding') {
      return { ...current, proximity, state: 'preview', collapsedAt: null };
    }

    // preview → stay in preview
    if (current.state === 'preview') {
      return { ...current, proximity };
    }

    return { ...current, proximity };
  }

  /** Check if any edge state changed (not just proximity values) */
  private hasStateChanged(next: ProximityFieldSnapshot): boolean {
    const prev = this.snapshot;
    return (
      prev.left.state !== next.left.state ||
      prev.right.state !== next.right.state ||
      prev.top.state !== next.top.state ||
      prev.bottom.state !== next.bottom.state ||
      prev.dominantEdge !== next.dominantEdge
    );
  }

  private hasEdgeStateChanged(next: ProximityFieldSnapshot): boolean {
    const prev = this.snapshot;
    return (
      prev.left.state !== next.left.state ||
      prev.right.state !== next.right.state ||
      prev.top.state !== next.top.state ||
      prev.bottom.state !== next.bottom.state
    );
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }
}

/** Singleton proximity field engine */
export const proximityField = new ProximityFieldEngine();
