# Consolidation Doctrine v2

## Authority
Armand Lefebvre, L0 — Lefebvre Design Solutions LLC

## Classification
FROZEN DOCTRINE — Ring 0

## Purpose
Defines the rules governing how sovereign Construction repositories are consolidated
into the Construction OS v2 monorepo container.

## Principles

1. **Absorption, Not Duplication**
   Each sovereign repo is absorbed exactly once into its designated folder.
   No repo may exist in more than one location within the monorepo.

2. **Lineage Preservation**
   Every absorbed repo must retain a lineage record in `6-Archive-Lineage/`.
   The record must include: source repo, absorption date, commit SHA at absorption,
   and destination folder.

3. **Identity Preservation**
   Absorbed repos retain their original identity as a subfolder.
   Internal structure is preserved unless explicitly restructured by L0 command.

4. **No Premature Absorption**
   No repo is absorbed until its target folder exists, its boundary file is frozen,
   and an L0 command authorizes the absorption.

5. **Sovereign Repos Remain Sovereign Until Absorbed**
   Until absorption is executed, each Construction repo operates independently.
   The monorepo container does not govern sovereign repo internals.

6. **Absorption Receipt Required**
   Every absorption must produce a receipt in `6-Archive-Lineage/` conforming
   to the ABSORPTION_RECEIPT_SCHEMA_v2.json schema.

## Frozen State
This doctrine is frozen as of Construction OS v2 genesis.
Modification requires L0 command authority.
