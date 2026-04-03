# Barrett Progressive Batch Plan v0.1

**Date:** 2026-04-03
**Source evidence:** `source/barrett/census/barrett_dxf_cleanliness_ranking.md`
**Total files:** 74
**Families:** Black_Pearl (21), PMMA (1), RamProof_GC (26), RT-250 (26)
**Status:** Batch plan derived from committed ranking evidence. LOCAL_OPERATOR_REQUIRED for execution.

---

## Progressive Ingestion Ladder

The 74 Barrett DXF files are divided into five progressive phases based on their noise score ranking. Each phase builds on schema and parsing confidence established in prior phases.

---

## PHASE 0 -- GOLDEN SEED (1 DXF)

**Purpose:** Establish the baseline schema, layer classification rules, and entity extraction pipeline on the single cleanest file.

| Rank | Family | File | Noise Score | Layers | Entities | Annot. Ratio | Context Ratio |
|---:|---|---|---:|---:|---:|---:|---:|
| 1 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RA-01-ROOFASSEMBLY-STD | 3.8034 | 8 | 464 | 0.0151 | 0.9698 |

**Selection rationale:**
- Lowest noise score of all 74 files (3.8034)
- Lowest layer count (8 layers) -- minimal classification surface
- Minimal annotation ratio (0.0151) -- almost no text/dimension noise
- Highest context ratio (0.9698) -- geometry is overwhelmingly structural/substrate context
- Roof assembly detail type -- representative of field membrane conditions

**Per-family distribution:** RamProof_GC: 1

**Noise score range:** 3.8034

**What this phase validates:**
- Layer classification pipeline (owned vs. context vs. annotation)
- Entity extraction and geometry parsing
- Schema structure for downstream phases
- Baseline quality metrics

---

## PHASE 1 -- CLEAN (5 DXFs)

**Purpose:** Expand coverage to additional families and detail types while noise remains low. Confirm that parsing rules from the golden seed generalize.

| Rank | Family | File | Noise Score | Layers | Entities | Annot. Ratio | Context Ratio |
|---:|---|---|---:|---:|---:|---:|---:|
| 2 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RA-01R-ROOFASSEMBLY-REINF | 4.3709 | 9 | 467 | 0.0193 | 0.9636 |
| 3 | RT-250 | 202-R00-V01-071413-BARR-RT250-RA-01-ROOFASSEMBLY-STD | 4.6852 | 10 | 467 | 0.0171 | 0.9636 |
| 4 | RamProof_GC | 202-R00-V01-071416-BARR-RP-PT-01-PARAPET-STD | 5.7728 | 14 | 4399 | 0.0043 | 0.0091 |
| 5 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RD-03-DRAIN-STD | 5.7823 | 13 | 893 | 0.0146 | 0.8096 |
| 6 | Black_Pearl | 202-R00-V01-071352-BARR-BP-PE-02-PENETRATION-STD | 5.8118 | 11 | 255 | 0.0353 | 0.0275 |

**Per-family distribution:** RamProof_GC: 3, RT-250: 1, Black_Pearl: 1

**Noise score range:** 4.3709 -- 5.8118

**What this phase validates:**
- Cross-family layer name consistency (RamProof_GC vs. RT-250 vs. Black_Pearl)
- Reinforcement variant handling (STD vs. REINF suffixes)
- High-entity-count files (rank 4 has 4399 entities)
- New detail types: parapet, drain, penetration
- Low-context-ratio files (rank 4 at 0.0091 -- mostly owned geometry)

---

## PHASE 2 -- MODERATE (5 DXFs)

**Purpose:** Introduce moderate annotation noise and test annotation-stripping logic. First exposure to higher noise scores.

| Rank | Family | File | Noise Score | Layers | Entities | Annot. Ratio | Context Ratio |
|---:|---|---|---:|---:|---:|---:|---:|
| 7 | RT-250 | 202-R00-V01-071413-BARR-RT250-RD-02-DRAIN-STD | 5.9544 | 11 | 386 | 0.0389 | 0.9093 |
| 8 | Black_Pearl | 202-R00-V01-071352-BARR-BP-ST-01-STACK-STD | 5.9858 | 7 | 113 | 0.0796 | 0.0088 |
| 9 | Black_Pearl | 202-R00-V01-071352-BARR-BP-RD-02-DRAIN-STD | 6.1115 | 12 | 427 | 0.0328 | 0.0141 |
| 10 | RT-250 | 202-R00-V01-071413-BARR-RT250-PT-01-PARAPET-STD | 6.1892 | 15 | 4228 | 0.0047 | 0.0132 |
| 11 | RamProof_GC | 202-R00-V01-071416-BARR-RP-PT-01R-PARAPET-REINF | 6.1919 | 15 | 4377 | 0.0048 | 0.0091 |

**Per-family distribution:** RT-250: 2, Black_Pearl: 2, RamProof_GC: 1

**Noise score range:** 5.9544 -- 6.1919

**What this phase validates:**
- Annotation ratio up to ~8% (rank 8 at 0.0796)
- Stack detail type (new condition)
- Very low context ratio files (ranks 8, 9, 10, 11 all below 0.02)
- High entity counts with low context (large owned-geometry files)
- Cross-family parapet handling (RT-250 vs. RamProof_GC)

---

## PHASE 3 -- NOISY (10 DXFs)

**Purpose:** Stress-test annotation filtering and validate robustness against higher noise scores. First files exceeding 10% annotation ratio.

| Rank | Family | File | Noise Score | Layers | Entities | Annot. Ratio | Context Ratio |
|---:|---|---|---:|---:|---:|---:|---:|
| 12 | RamProof_GC | 202-R00-V01-071416-BARR-RP-CO-02-CORNER-STD | 6.1959 | 11 | 735 | 0.0449 | 0.6558 |
| 13 | RamProof_GC | 202-R00-V01-071416-BARR-RP-CO-01-CORNER-STD | 6.1968 | 12 | 630 | 0.0349 | 0.7508 |
| 14 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RD-03R-DRAIN-REINF | 6.2696 | 14 | 896 | 0.0167 | 0.8069 |
| 15 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RD-01-DRAIN-STD | 6.5374 | 11 | 262 | 0.0534 | 0.8511 |
| 16 | RT-250 | 202-R00-V01-071413-BARR-RT250-RD-04-DRAIN-STD | 6.5891 | 12 | 313 | 0.0447 | 0.5911 |
| 17 | RT-250 | 202-R00-V01-071413-BARR-RT250-RD-03-DRAIN-STD | 6.6243 | 15 | 897 | 0.0156 | 0.8071 |
| 18 | Black_Pearl | 202-R00-V01-071352-BARR-BP-RD-01-DRAIN-STD | 6.9132 | 12 | 265 | 0.0528 | 0.0113 |
| 19 | RamProof_GC | 202-R00-V01-071416-BARR-RP-RD-01R-DRAIN-REINF | 7.2060 | 12 | 266 | 0.0602 | 0.8383 |
| 20 | RT-250 | 202-R00-V01-071413-BARR-RT250-RD-01-DRAIN-STD | 7.4472 | 13 | 267 | 0.0562 | 0.8352 |
| 21 | Black_Pearl | 202-R00-V01-071352-BARR-BP-WA-02-WALL-STD | 7.6678 | 9 | 59 | 0.1017 | 0.0169 |

**Per-family distribution:** RamProof_GC: 5, RT-250: 3, Black_Pearl: 2

**Noise score range:** 6.1959 -- 7.6678

**What this phase validates:**
- Corner detail type (new condition, ranks 12-13)
- Wall detail type (new condition, rank 21)
- Drain variant coverage across all three membrane families
- REINF variant pairs (RD-03 / RD-03R, RD-01 / RD-01R)
- Annotation ratio crossing 10% threshold (rank 21 at 0.1017)
- Mixed context ratios from very low (0.0113) to high (0.8511)

---

## PHASE 4 -- REMAINDER (53 DXFs)

**Purpose:** Bulk ingestion of remaining files. Do NOT process until Phases 0-3 stabilize with validated schema and classification rules.

**Ranks:** 22--74

| Family | Count | Noise Score Range |
|---|---:|---|
| RamProof_GC | 16 | 8.8860 -- 20.0941 |
| RT-250 | 20 | 7.7518 -- 21.1932 |
| Black_Pearl | 16 | 8.2847 -- 18.9846 |
| PMMA | 1 | 18.4205 |

**Total REMAINDER files:** 53

**Noise score range:** 7.7518 -- 21.1932

**Detail types first appearing in REMAINDER:**
- Joint (RT-250 JT-01, rank 22)
- Transition (Black_Pearl TR-01, rank 34)
- Termination (Black_Pearl TE-01, rank 44)
- BF/Unknown (Black_Pearl BF-01 and BF-02, ranks 29, 45)
- Curb (Black_Pearl CU-01, RT-250 CU-01/CU-02, ranks 46, 50, 51, 52, 55)
- Footing (Black_Pearl FO-01, rank 56)
- Control Joint (Black_Pearl CJ-01, RT-250 CJ-01, ranks 70, 72)

**Key characteristics:**
- Annotation ratios range from 0.0438 to 0.3898
- Many files with annotation ratio > 20% (high text/dimension noise)
- PMMA family appears only here (single file, rank 67)
- Includes all parapet variants for RamProof_GC (PT-02 through PT-05, plus REINF pairs) and RT-250
- Contains files with BP-prefixed filenames in the RT-250 directory (ranks 51, 52) -- likely cross-family references requiring attention

**What this phase validates:**
- Robustness at high annotation ratios (up to 39%)
- Rare detail types not seen in earlier phases
- PMMA family compatibility
- Cross-family filename anomalies
- Complete condition coverage across all families

---

## Phase Summary Matrix

| Phase | Files | Families Represented | Noise Score Range | Annotation Ratio Range |
|---|---:|---|---|---|
| GOLDEN_SEED | 1 | RamProof_GC | 3.8034 | 0.0151 |
| CLEAN_5 | 5 | RamProof_GC (3), RT-250 (1), Black_Pearl (1) | 4.3709 -- 5.8118 | 0.0043 -- 0.0353 |
| MODERATE_5 | 5 | RT-250 (2), Black_Pearl (2), RamProof_GC (1) | 5.9544 -- 6.1919 | 0.0047 -- 0.0796 |
| NOISY_10 | 10 | RamProof_GC (5), RT-250 (3), Black_Pearl (2) | 6.1959 -- 7.6678 | 0.0156 -- 0.1017 |
| REMAINDER | 53 | RT-250 (20), RamProof_GC (16), Black_Pearl (16), PMMA (1) | 7.7518 -- 21.1932 | 0.0438 -- 0.3898 |
| **Total** | **74** | | **3.8034 -- 21.1932** | **0.0043 -- 0.3898** |

---

## Family Distribution Across Phases

| Family | GOLDEN_SEED | CLEAN_5 | MODERATE_5 | NOISY_10 | REMAINDER | Total |
|---|---:|---:|---:|---:|---:|---:|
| RamProof_GC | 1 | 3 | 1 | 5 | 16 | 26 |
| RT-250 | 0 | 1 | 2 | 3 | 20 | 26 |
| Black_Pearl | 0 | 1 | 2 | 2 | 16 | 21 |
| PMMA | 0 | 0 | 0 | 0 | 1 | 1 |
| **Total** | **1** | **5** | **5** | **10** | **53** | **74** |

---

## Execution Requirements

This batch plan is derived entirely from the committed cleanliness ranking (`source/barrett/census/barrett_dxf_cleanliness_ranking.md`). Executing any phase requires LOCAL_OPERATOR_REQUIRED access to the gitignored DXF/JSON source files.

**Before executing each phase, the local operator must:**
1. Confirm that the DXF/JSON files exist at the paths listed in the ranking
2. Run the layer enumeration and entity extraction pipeline
3. Validate that layer classifications match the family definition files
4. Record results in per-file audit receipts

**Inventory files (committed alongside this plan):**
- `source/barrett/dxf_inventory_black_pearl.json` (21 files)
- `source/barrett/dxf_inventory_pmma.json` (1 file)
- `source/barrett/dxf_inventory_ramproof_gc.json` (26 files)
- `source/barrett/dxf_inventory_rt250.json` (26 files)

**Definition files (committed, PARTIAL readiness):**
- `source/barrett/definitions/black_pearl.definition.json`
- `source/barrett/definitions/pmma.definition.json`
- `source/barrett/definitions/ramproof_gc.definition.json`
- `source/barrett/definitions/rt250.definition.json`
