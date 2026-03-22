# Command Decks — Architecture Documentation

**Document ID:** L0-DOC-CONOS-COMMAND-DECKS
**Authority:** Construction_Application_OS (Ring 3)
**Status:** Active
**Last Updated:** 2026-03-22

## Overview

Command Decks are named, deterministic saved cockpit states. A deck stores
the complete operator context and can be activated to instantly restore a
specific investigation or review configuration.

Decks upgrade the cockpit from a context-driven interface to a
**mission-console interface** — operators switch among saved investigation
states without manually rebuilding panel layout, reference focus, spatial
focus, or system filters.

## Architecture

### DeckState Contract

Location: `src/ui/contracts/deck-types.ts`

```typescript
interface DeckState {
  deck_id: string;                    // "sys-*" for system, "usr-*" for user
  deck_name: string;                  // Human-readable name
  gravity_context: GravityContext;    // Active object focus
  panel_modes: PanelMode[];          // Per-panel operational modes
  layout_state: LayoutState;         // Panel visibility and arrangement
  promoted_panel: PanelId;           // Primary visual emphasis panel
  filters: PanelFilter[];            // Per-panel filter configurations
  pinned_references: PinnedReference[]; // Optional pinned references
  spatial_focus: SpatialFocus | null;   // Optional spatial focus
  is_system_deck: boolean;
  created_at: number;
  updated_at: number;
}
```

### Gravity Context

The gravity context captures the focal point of the cockpit — which object
the operator is investigating and how they arrived there.

```typescript
interface GravityContext {
  activeObject: ActiveObjectIdentity | null;
  basis: SourceBasis;
  sourcePanel: PanelId | null;
  compareObject: ActiveObjectIdentity | null;
  workspaceMode: WorkspaceMode;
}
```

### Gravity Stack

Location: `src/ui/decks/GravityStack.ts`

The GravityStack tracks the operator's navigation context history. Each
focus change (object selection, zone navigation, Truth Echo propagation)
pushes a GravityContext onto the stack.

- **Max depth:** 50 entries (oldest evicted)
- **Deck activation:** Clears the stack and pushes the deck's context as root
- **Future:** Back/forward navigation (not yet implemented)

### Deck Store

Location: `src/ui/decks/DeckStore.ts`

Registry and persistence for Command Decks.

| Operation | System Decks | User Decks |
|-----------|--------------|------------|
| Create    | Pre-loaded   | Supported  |
| Read      | Yes          | Yes        |
| Rename    | No           | Yes        |
| Delete    | No           | Yes        |
| Update    | No           | Yes        |

**Persistence:** localStorage (user decks only). System decks are always
loaded from `defaultDecks.ts`.

### Deck Activation

Location: `src/ui/decks/DeckActivation.ts`

Activation applies cockpit state **atomically** in this order:

1. **Clear GravityStack** — remove all navigation history
2. **Apply gravity context** — set active object, workspace mode, compare state
3. **Push deck context** — set as new GravityStack root
4. **Apply layout** — set panel visibility and arrangement
5. **Apply promoted panel** — ensure promoted panel is visible and centered
6. **Apply panel modes** — stored for panel reading on mount
7. **Apply filters** — stored for panel reading on mount
8. **Apply spatial focus** — stored for Spatial panel reading on mount

### FAIL_CLOSED Behavior

If a saved deck references unavailable context:

| Scenario | Behavior |
|----------|----------|
| Invalid active object shape | Warning, proceeds without object focus |
| Unknown panel in layout | Warning, panel omitted from layout |
| No valid panels in layout | Error, falls back to hero cockpit default |
| Invalid promoted panel | Warning, falls back to Work |
| Unknown panel in modes/filters | Warning, mode/filter ignored |
| Spatial focus without zoneId | Warning, spatial focus ignored |

All FAIL_CLOSED conditions are reported in `DeckActivationResult.unavailable`
and displayed as a visible UI notice.

## Default System Decks

### 1. Condition Investigation
- **Promoted:** Awareness
- **Layout:** Explorer | Awareness | Diagnostics | Work | System
- **Arrangement:** investigation
- **Focus:** Awareness conditions tab, Diagnostics pipeline view

### 2. Artifact Review
- **Promoted:** Work
- **Layout:** Work | Awareness | Diagnostics | Reference | System
- **Arrangement:** review
- **Focus:** Work artifact tab, Awareness artifacts tab

### 3. Spatial Navigation
- **Promoted:** Spatial
- **Layout:** Spatial | Explorer | Work | Reference
- **Arrangement:** spatial-nav
- **Focus:** Spatial atlas view, Explorer zones filter

### 4. Proposal Review
- **Promoted:** Proposals
- **Layout:** Proposals | Assistant | Awareness | Work | Diagnostics
- **Arrangement:** review
- **Focus:** Proposals pending filter, Awareness proposals tab

## Ring Authority

| Action | Authority |
|--------|-----------|
| Deck create/save | Ring 3 (UI state only) |
| Deck load/activate | Ring 3 (UI state only) |
| Deck rename | Ring 3 (UI state only) |
| Deck delete | Ring 3 (UI state only) |
| Runtime execution | NEVER (forbidden in deck activation) |
| Assistant execution | NEVER (forbidden in deck activation) |
| Proposal auto-approval | NEVER (forbidden in deck activation) |
| Kernel mutation | NEVER (forbidden in deck activation) |
| Bus schema changes | NEVER (forbidden in deck activation) |

## UI Integration

The DeckPicker component is rendered in the WorkspaceShell status bar. It
provides:

- **Deck selector dropdown** with system and user deck sections
- **Active deck indicator** (blue highlight when a deck is active)
- **Save current state** as a new user deck
- **Rename** user decks (inline editing)
- **Delete** user decks
- **FAIL_CLOSED notification** when activation encounters unavailable fields

## File Inventory

| File | Purpose |
|------|---------|
| `src/ui/contracts/deck-types.ts` | DeckState contract and related types |
| `src/ui/decks/GravityStack.ts` | Navigation context history stack |
| `src/ui/decks/DeckStore.ts` | Deck registry with CRUD and persistence |
| `src/ui/decks/DeckActivation.ts` | Atomic deck activation logic |
| `src/ui/decks/defaultDecks.ts` | Default system deck definitions |
| `src/ui/decks/DeckPicker.tsx` | Deck picker UI component |
| `src/ui/workspace/WorkspaceShell.tsx` | Workspace shell with deck integration |
| `docs/ui/command-decks.md` | This documentation |
