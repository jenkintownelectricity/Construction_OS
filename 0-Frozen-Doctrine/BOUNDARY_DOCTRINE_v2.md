# Boundary Doctrine v2

## Authority
Armand Lefebvre, L0 — Lefebvre Design Solutions LLC

## Classification
FROZEN DOCTRINE — Ring 0

## Purpose
Defines the rules governing folder boundaries within the Construction OS v2 monorepo.

## Principles

1. **Every Folder Has a Boundary**
   Each numbered root folder (0–6) must contain a BOUNDARY.md file that declares
   its classification, purpose, rules, and lock state.

2. **Boundaries Are Hierarchical**
   Lower-numbered folders have higher authority. No content in a higher-numbered
   folder may override doctrine from a lower-numbered folder.

3. **Boundary Files Are Frozen at Genesis**
   Once created during genesis, boundary files may only be modified by L0 command.

4. **Cross-Boundary References Must Be Explicit**
   Any file referencing content in another folder must declare the reference
   explicitly. Implicit cross-boundary coupling is prohibited.

5. **No Code in Doctrine Folders**
   Folder 0 (Frozen-Doctrine) may never contain executable code files.
   Doctrine is expressed in Markdown and JSON only.

6. **Boundary Violations Are Fail-Closed**
   Any detected boundary violation halts the affected operation.
   No fallback, no degraded mode, no implicit correction.

## Frozen State
This doctrine is frozen as of Construction OS v2 genesis.
Modification requires L0 command authority.
