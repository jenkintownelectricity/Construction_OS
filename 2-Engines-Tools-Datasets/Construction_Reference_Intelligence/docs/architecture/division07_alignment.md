# Division 07 Alignment

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## Division 07 as Enclosure Control-Layer System

CSI Division 07 is not merely a collection of roofing, waterproofing, and insulation products. It is the **enclosure control-layer system** — the integrated set of materials, assemblies, and details that manage the transfer of water, air, vapor, heat, fire, sound, light, and structural loads across the building envelope boundary.

This repository's intelligence is organized around control-layer and interface-zone thinking, not product-category thinking.

## 11 Control Layers

The building envelope manages environmental separation through distinct control layers. Each layer has a primary function, and failures occur when a layer is discontinuous, bridged, or incompatible at interfaces.

| # | Control Layer | Primary Function |
|---|---|---|
| 1 | Water Control (Bulk Moisture) | Shed and drain liquid water away from the structure |
| 2 | Water-Resistive Barrier | Secondary defense against moisture that bypasses cladding |
| 3 | Air Barrier | Control air leakage across the enclosure boundary |
| 4 | Vapor Retarder / Barrier | Manage vapor diffusion to prevent interstitial condensation |
| 5 | Thermal Control (Insulation) | Resist heat flow; maintain thermal boundary continuity |
| 6 | Fire Control | Resist fire spread across or within the envelope assembly |
| 7 | Sound Control | Attenuate sound transmission through the envelope |
| 8 | Light / Solar Control | Manage daylight, glare, and solar heat gain |
| 9 | Structural Support | Transfer loads (dead, live, wind, seismic) to the structure |
| 10 | Finish / Aesthetics | Protect underlying layers; provide visual appearance |
| 11 | Drainage / Ventilation | Provide pathways for incidental moisture to drain and dry |

Control layer definitions are maintained in `shared/control_layers.json`.

## 10 Interface Zones

The highest risk in building envelope performance is at **interfaces** — transitions where control layers change material, direction, plane, or ownership. Intelligence records focus heavily on these zones.

| # | Interface Zone | Description |
|---|---|---|
| 1 | Roof-to-Wall | Transition from horizontal/sloped roofing to vertical wall assembly |
| 2 | Wall-to-Foundation | Transition from above-grade wall to below-grade or at-grade condition |
| 3 | Wall-to-Opening | Perimeter of windows, doors, louvers, and other penetrations |
| 4 | Roof Penetration | Pipes, ducts, equipment supports, and other through-roof elements |
| 5 | Wall Penetration | Pipes, conduit, fasteners, and through-wall elements |
| 6 | Material Transition | Where one cladding or membrane material meets a different one |
| 7 | Expansion / Movement Joint | Joints designed to accommodate structural or thermal movement |
| 8 | Termination / Edge | Top, bottom, and lateral terminations of control layers |
| 9 | Inside / Outside Corner | Re-entrant and projecting corners where geometry concentrates stress |
| 10 | Plane Change | Transitions from one geometric plane to another (steps, offsets, slopes) |

Interface zone definitions are maintained in `shared/interface_zones.json`.

## Intelligence Alignment

Every intelligence record (failure pattern, success pattern, trend, precedent, interface risk) is linked to:

- One or more **control layers** affected.
- Zero or more **interface zones** where the observation applies.

This linkage enables queries such as:

- "What failure patterns affect the air barrier at roof-to-wall transitions?"
- "What trends exist in thermal control continuity at wall-to-opening interfaces?"
- "What success patterns exist for vapor control at inside corners in cold climates?"

## Relationship to Kernel Repos

The five kernel repositories define the truth about specifications, assemblies, materials, chemistry, and scope. This intelligence repository observes how those truths interact at control-layer and interface-zone boundaries, where failures and successes emerge from the combination of correct individual elements that are incorrectly integrated.
