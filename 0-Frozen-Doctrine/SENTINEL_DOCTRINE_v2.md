# Sentinel Doctrine v2

## Authority
Armand Lefebvre, L0 — Lefebvre Design Solutions LLC

## Classification
FROZEN DOCTRINE — Ring 0

## Purpose
Defines the rules governing sentinel behavior within the Construction OS v2 system.

## Principles

1. **Sentinels Guard Boundaries**
   Every sentinel is assigned to a specific boundary or contract.
   Sentinels do not operate outside their assigned scope.

2. **Sentinels Are Passive Observers**
   Sentinels detect violations and emit signals. They do not autonomously
   correct or modify system state.

3. **Sentinel Types**
   - Architecture Freeze Sentinel: Guards frozen doctrine integrity
   - Runtime Signal Sentinel: Monitors signal contract conformance
   - Intent Identity Sentinel: Validates identity and authorization claims
   - Drift Sentinel: Detects deviation between intent truth and actual truth

4. **Sentinel Output Is Auditable**
   All sentinel observations must produce structured output conforming to
   ValidKernel_Specs sentinel schemas.

5. **Sentinel Failure Is Fail-Closed**
   If a sentinel cannot determine compliance, it reports FAIL.
   No sentinel may report PASS under uncertainty.

6. **Sentinels Do Not Replace Governance**
   Sentinels inform governance decisions. They do not make governance decisions.
   L0 authority remains the final arbiter.

## Frozen State
This doctrine is frozen as of Construction OS v2 genesis.
Modification requires L0 command authority.
