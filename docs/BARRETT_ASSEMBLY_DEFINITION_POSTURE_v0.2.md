# Barrett Assembly Definition Posture v0.2

**Date:** 2026-04-03
**Wave:** PART 6+7 -- Assembly Validation and Readiness Audit
**Author:** dxf_validation_readiness_wave
**Status:** All 4 families PARTIAL -- none can be READY without local DXF layer confirmation

---

## Executive Summary

This document captures the current state of Barrett Company's four product family assembly definitions after the assembly validation and readiness audit wave. All families remain at **PARTIAL** readiness. No family has been inflated to READY because the core requirement -- validated layer mapping from parsed DXF JSON -- cannot be satisfied without local operator access to gitignored DXF source files.

---

## Family Status Overview

| Family | Type | DXF Files | Cleanest Score | Golden Seed | Semantic Seed | Validation Pass/Fail | Status |
|--------|------|-----------|----------------|-------------|---------------|---------------------|--------|
| RamProof GC | Waterproofing | 26 | 3.8034 | Yes | Yes | 5/5 | PARTIAL |
| RT-250 | Waterproofing | 26 | 4.6852 | No | No | 3/7 | PARTIAL |
| Black Pearl | Waterproofing | 21 | 5.8118 | No | No | 3/6 | PARTIAL |
| PMMA | Flashing | 1 | 18.4205 | No | No | 3/7 | PARTIAL |

---

## Per-Family Analysis

### 1. RamProof GC Waterproofing System (FAM-BARRETT-RAMPROOF-GC)

**Closest to READY.** Best DXF evidence of all families.

**What is evidence-validated:**
- GOLDEN_SEED file exists (noise score 3.8034, rank 1 of 74)
- Semantic seed layer map exists with 11 layer mappings including ownership roles
- 26 DXF files across multiple condition types (roof assembly, parapet, drain, corner, penetration, expansion joint)

**What is product-knowledge-derived (not yet validated):**
- Component list (2 components in definition: membrane + primer)
- Owned layer names in definition file (RamProof GC, RamProof, Membrane)
- Supported conditions list

**What needs local operator confirmation:**
- Validate semantic seed layer mappings against parsed DXF JSON
- Resolve component gap: semantic seed shows 7 SYSTEM_OWNED layers (liquid membrane, mesh, mastic, filter fabric, drainage mat, protection course, primer) but definition only lists 2 components
- Confirm ownership classifications (SYSTEM_OWNED vs CONTEXT_ONLY vs ANNOTATION)

**Key finding:** The definition file likely undercounts components. The semantic seed reveals product layers (mesh, mastic, filter fabric, drainage mat) that are not represented in the definition's component list.

---

### 2. RamTough 250 Waterproofing System (FAM-BARRETT-RT250)

**Strong DXF evidence but unresolved layer aliases.**

**What is evidence-validated:**
- 26 DXF files across multiple condition types
- Second-cleanest file in entire census (noise score 4.6852, CLEAN_5 phase)

**What is product-knowledge-derived (not yet validated):**
- Component list (3 components: membrane, primer, protection course)
- Owned layer names with multiple aliases (RamTough 250, RT-250, RT250, Membrane, Protection Course)
- Supported conditions list

**What needs local operator confirmation:**
- Resolve which layer name aliases are actual DXF layer names vs. product name variants
- Validate layer inventory from parsed DXF JSON
- Confirm ownership classifications
- Create semantic seed from confirmed layer mapping

**Key finding:** The multiple layer name aliases (RamTough 250, RT-250, RT250) suggest uncertainty about actual DXF layer names. This must be resolved from the parsed JSON before READY.

---

### 3. Black Pearl Waterproofing System (FAM-BARRETT-BLACK-PEARL)

**Moderate DXF evidence, no semantic seed.**

**What is evidence-validated:**
- 21 DXF files across multiple condition types
- DXF JSON known to exist locally with identified layers (RAM Black Pearl Sheet, Protection Course, Others, Text, Defpoints)

**What is product-knowledge-derived (not yet validated):**
- Component list (3 components: adhesive, sheet membrane, protection course)
- Owned layer names
- Supported conditions list

**What needs local operator confirmation:**
- Parse and validate DXF JSON layer inventory
- Confirm layer-to-ownership mapping
- Create semantic seed from confirmed layer mapping
- Validate condition support from representative details

---

### 4. RamFlash PMMA Flashing System (FAM-BARRETT-PMMA)

**Weakest DXF evidence. Furthest from READY.**

**What is evidence-validated:**
- Only 1 DXF file in census (a curb detail, REMAINDER phase, noise score 18.4205)
- Manufacturer Atlas system record exists (SYS-BARRETT-PMMA-001)

**What is product-knowledge-derived (not yet validated):**
- Component list (4 components: primer, membrane, fleece, catalyst)
- All layer names (PMMA, RamFlash, Fleece, Primer) are speculative
- All supported conditions are estimated

**What needs local operator confirmation:**
- Locate additional PMMA DXF source files (PMMA layers may exist within RT-250 or Black Pearl detail files as flashing components)
- Parse and validate the single DXF JSON
- Confirm layer names from DXF evidence
- Validate that claimed conditions have representative details

**Key finding:** PMMA may not have standalone DXF details because it functions as a flashing/detail companion to field membrane systems. PMMA layers should be searched for within RT-250 and Black Pearl DXF files.

---

## Cross-Family Relationships

### RT-250 + PMMA Pairing

RT-250 (hot fluid-applied field membrane) is the primary partner system for PMMA (flashing/detail). In practice:
- RT-250 handles field membrane, plaza deck, and below-grade conditions
- PMMA handles parapet flashings, penetration flashings, and wall transitions at detail locations
- Both appear in the same project details, with PMMA layers appearing in RT-250 family DXF files

**Implication for validation:** PMMA layer names may be discoverable in RT-250 DXF files. A local operator reviewing RT-250 parsed JSON should also catalog any PMMA-related layers found.

### Black Pearl + PMMA Pairing (Secondary)

Black Pearl can also pair with PMMA for detail/flashing work, though this is a secondary relationship. The same search strategy applies: look for PMMA layers within Black Pearl DXF files.

---

## What This Wave Accomplished

1. Created comprehensive assembly system definition files for all 4 families
2. Created per-family validation files with honest PASS/FAIL checks
3. Created JSON Schema for assembly definition files
4. Documented DXF evidence state from the 74-file cleanliness ranking census
5. Identified the RamProof GC component completeness gap (2 vs. 7 SYSTEM_OWNED layers)
6. Documented cross-family relationships
7. Updated readiness audit with expanded checklist items

## What This Wave Did NOT Do (Honestly)

- Did not inflate any family to READY status
- Did not fabricate layer names beyond what definition files and semantic seed provide
- Did not assume DXF JSON parse results without local operator confirmation
- Did not model PMMA as a standalone system with sufficient evidence (it has only 1 DXF file)

---

## Path to READY -- Per Family

### RamProof GC (shortest path)
1. Local operator runs: validate semantic seed against GOLDEN_SEED parsed JSON
2. Reconcile component list with semantic seed's 7 SYSTEM_OWNED layers
3. Confirm ownership classifications
4. Mark layers_mapped = true, ownership_classified = true
5. Validate conditions against detail inventory

### RT-250 (medium path)
1. Local operator parses DXF JSON for cleanest file (CLEAN_5, noise 4.6852)
2. Resolve layer name aliases (which of RamTough 250 / RT-250 / RT250 appear in DXF?)
3. Create semantic seed from confirmed layers
4. Confirm ownership and conditions

### Black Pearl (medium path)
1. Local operator validates known layer names against parsed DXF JSON
2. Create semantic seed from confirmed layers
3. Confirm ownership and conditions

### PMMA (longest path)
1. Search RT-250 and Black Pearl DXF files for PMMA-related layers
2. Locate additional standalone PMMA DXF files if they exist
3. Parse and validate layer inventory
4. Create semantic seed
5. Confirm components, ownership, and conditions

---

## Lineage

| Artifact | Path |
|----------|------|
| Black Pearl system definition | assemblies/barrett/black_pearl_systems.json |
| PMMA system definition | assemblies/barrett/pmma_systems.json |
| RamProof GC system definition | assemblies/barrett/ramproof_gc_systems.json |
| RT-250 system definition | assemblies/barrett/rt250_systems.json |
| Assembly definition schema | schemas/barrett_assembly_definition.schema.json |
| Black Pearl validation | source/barrett/validations/black_pearl.validation.json |
| PMMA validation | source/barrett/validations/pmma.validation.json |
| RamProof GC validation | source/barrett/validations/ramproof_gc.validation.json |
| RT-250 validation | source/barrett/validations/rt250.validation.json |
| Readiness audit | output/assembly_readiness/barrett_assembly_readiness_audit.json |
| Previous audit | source/barrett/audits/barrett_assembly_readiness_audit.json |
| Semantic seed (RamProof GC) | config/manufacturer/barrett_layer_semantic_seed_ramproof_gc.json |
| Cleanliness ranking | source/barrett/census/barrett_dxf_cleanliness_ranking.md |
