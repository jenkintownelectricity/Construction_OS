# Signal Doctrine v2

## Authority
Armand Lefebvre, L0 — Lefebvre Design Solutions LLC

## Classification
FROZEN DOCTRINE — Ring 0

## Purpose
Defines the rules governing signal propagation within the Construction OS v2 system.

## Principles

1. **Signals Are Observable, Not Authoritative**
   Signals carry information about system state but do not constitute truth.
   Only Ring 0 doctrine and Ring 1 governance are authoritative.

2. **Signal Sources Must Be Declared**
   Every signal must declare its source system, type, and confidence level.

3. **Signals Do Not Cross Ring 0**
   No signal may modify or override frozen doctrine.
   Signals flow from Ring 1 outward, never inward to Ring 0.

4. **Signal Integrity**
   Signals must be traceable to their origin. Unsigned or unattributed signals
   are discarded.

5. **Signal Latency Is Acceptable**
   The system tolerates signal delay. No architectural decision depends on
   real-time signal delivery.

6. **Cognitive Bus Is the Signal Carrier**
   Construction_Cognitive_Bus is the canonical signal transport layer.
   Direct point-to-point signaling between systems is prohibited.

## Frozen State
This doctrine is frozen as of Construction OS v2 genesis.
Modification requires L0 command authority.
