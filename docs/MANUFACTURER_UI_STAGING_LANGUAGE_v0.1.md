# Manufacturer UI Staging Language v0.1

**Document Type:** Internal Terminology Reference
**Purpose:** Define manufacturer-facing vocabulary for any future UI
**Audience:** Platform developers building manufacturer-facing interfaces
**Version:** 0.1
**Date:** April 2026
**Authority:** 10-Construction_OS

---

## 1. Purpose

This document defines the external-facing vocabulary to use in any
manufacturer-facing user interface, communication, status messages, or
documentation. Internal architecture terms must never appear in
manufacturer-facing surfaces.

---

## 2. Vocabulary Map

### 2.1 Ownership Classes

| Internal Term | External Term | Usage Context |
|---|---|---|
| `SYSTEM_OWNED` | **Your System Materials** | Layer classification |
| `CONTEXT_ONLY` | **Surrounding Construction** | Layer classification |
| `ANNOTATION` | **Notes & Dimensions** | Layer classification |
| `ownership_role` | **Ownership Category** | Column headers, labels |
| `ownership_class` | **Material Ownership** | Configuration screens |

### 2.2 Semantic Classification

| Internal Term | External Term | Usage Context |
|---|---|---|
| `semantic_role` | **Material Function** | Layer detail view |
| `membrane` | **Membrane** | Component role |
| `primer_adhesive` | **Primer / Adhesive** | Component role |
| `flashing` | **Flashing** | Component role |
| `reinforcement` | **Reinforcement** | Component role |
| `protection_course` | **Protection Layer** | Component role |
| `substrate` | **Substrate** | Context element |
| `context_geometry` | **Context Element** | Unclassified context |
| `annotation` | **Annotation** | Notes and text |
| `liquid_applied_membrane` | **Liquid-Applied Membrane** | Component role |
| `reinforcement_mesh` | **Reinforcement Mesh** | Component role |
| `filter_fabric` | **Filter Fabric** | Component role |
| `drainage_layer` | **Drainage Layer** | Component role |
| `sealant` | **Sealant** | Component role |

### 2.3 Validation and Processing

| Internal Term | External Term | Usage Context |
|---|---|---|
| `noise_score` | **Detail Complexity Score** | File quality indicator |
| `GOLDEN_SEED` | **Reference Detail** | Validation stage |
| `CLEAN_5` | **Standard Details** | Validation stage |
| `MODERATE_5` | **Complex Details** | Validation stage |
| `NOISY_10` | **High-Complexity Details** | Validation stage |
| `REMAINDER` | **Remaining Details** | Validation stage |
| `progressive_phase` | **Validation Stage** | Progress tracking |
| `progressive_rank` | **Processing Order** | Priority indicator |
| `layer_census` | **Layer Summary** | Analysis output |
| `enrichment` | **Classification** | Processing step |
| `additive_enrichment` | **Layer Classification** | Processing step |
| `cleanliness_ranking` | **Detail Quality Ranking** | Analysis output |

### 2.4 Readiness Status

| Internal Term | External Term | Status Message |
|---|---|---|
| `READY` | **Ready for Detail Generation** | "Your system is fully configured and ready to generate details." |
| `PARTIAL` | **Additional Information Needed** | "Your system is partially configured. We may have a few questions for you." |
| `BLOCKED` | **Cannot Proceed — Action Required** | "We need additional information before we can process your system." |
| `NO_SOURCE` | **No Files Received** | "We haven't received DXF files for this system family yet." |

### 2.5 Assembly and System

| Internal Term | External Term | Usage Context |
|---|---|---|
| `assembly_definition` | **System Configuration** | Setup screen |
| `family_id` | **System Family** | Navigation |
| `family_definition` | **System Profile** | Detail view |
| `product_components` | **System Components** | Component list |
| `supported_conditions` | **Supported Detail Types** | Capability list |
| `condition_type` | **Detail Type** | Selection |
| `DXF JSON` | **Parsed Drawing Data** | Technical context only |
| `ingestor_output` | **Processing Results** | Status view |
| `batch_plan` | **Validation Schedule** | Progress view |

---

## 3. Manufacturer-Facing Status Messages

### 3.1 Family Status Messages

**Ready for Detail Generation:**
> Your [System Name] system is fully configured. All layers have been
> identified, components are mapped, and representative details have been
> validated. The platform can now generate details for any supported
> condition type.

**Additional Information Needed:**
> Your [System Name] system is being configured. We've processed your
> submitted details and identified most of your system layers. To complete
> configuration, we need your input on [N] items. Please review the
> questions below.

**Cannot Proceed — Action Required:**
> We were unable to process your [System Name] system. [Specific reason].
> Please review the requirements below and resubmit the affected files.

**No Files Received:**
> We don't have any detail files for your [System Name] system yet.
> Please submit your input package to get started. See the submission
> checklist for requirements.

### 3.2 Layer Classification Messages

**When asking about an unknown layer:**
> We found a layer called "[Layer Name]" in your detail files. Does this
> layer represent one of your system materials, or is it part of the
> surrounding construction (like a wall, slab, or structural element)?

**When confirming a classification:**
> We've identified "[Layer Name]" as [Your System Material / Surrounding
> Construction / Notes & Dimensions]. Is this correct?

### 3.3 Validation Progress Messages

**Reference detail selected:**
> We've selected "[File Name]" as the reference detail for your
> [System Name] system. This detail will be used to establish the
> baseline configuration for all other details in this family.

**Validation stage complete:**
> [N] of [Total] details have been validated for your [System Name]
> system. [Summary of findings].

---

## 4. Manufacturer Dashboard Concepts

### 4.1 Family Overview

What a manufacturer should see at the top level:

- List of submitted system families
- Readiness status badge for each family (color-coded)
- Number of details submitted per family
- Number of details validated per family
- Action items count (questions pending)

### 4.2 Per-Detail Status

For each detail file:

- File name
- Detail type (parapet, drain, etc.)
- Validation stage (Reference / Standard / Complex / Remaining)
- Quality score (1-100, derived from complexity score — lower internal
  noise score = higher quality score)
- Layer count
- Status (Validated / Pending / Needs Review)

### 4.3 Layer Review Screen

When manufacturer input is needed:

- Layer name
- Current classification (Your System Material / Surrounding Construction / Notes)
- Confidence indicator (High / Medium / Low)
- Action: Confirm or Change classification
- Context: which detail files contain this layer

### 4.4 Submission Checklist

Interactive checklist tracking:

- Files uploaded (count and list)
- Product data sheets (uploaded / missing)
- Installation instructions (uploaded / missing)
- Component list (provided / missing)
- Layer ownership summary (provided / missing)

---

## 5. Prohibited Terms

The following internal terms must NEVER appear in manufacturer-facing
UI, documentation, email, or any external communication:

| Prohibited Term | Reason |
|---|---|
| kernel | Internal architecture |
| governance | Internal architecture |
| foundry | Internal architecture |
| domain | Internal architecture (use "system" or "family") |
| signal | Internal architecture |
| bus | Internal architecture |
| fabric | Internal architecture |
| registry | Internal architecture |
| VKG | Internal acronym |
| doctrine | Internal governance |
| sentinel | Internal architecture |
| truth model | Internal concept |
| receipt (as status) | Internal tracking (use "confirmation" or "record") |
| wave | Internal process (use "stage" or "step") |
| enrichment | Internal process (use "classification") |
| posture | Internal assessment (use "status" or "readiness") |
| census | Internal analysis (use "summary" or "inventory") |
| noise score | Internal metric (use "complexity score" or "quality score") |
| golden seed | Internal term (use "reference detail") |
| SYSTEM_OWNED | Internal code (use "Your System Materials") |
| CONTEXT_ONLY | Internal code (use "Surrounding Construction") |
| ingestor | Internal tool (use "processing" or "analysis") |
| semantic map | Internal config (use "layer mapping" or "configuration") |
| ownership map | Internal config (use "layer classification") |
| absorption | Internal process |
| lineage | Internal tracking (use "history" or "source") |

---

## 6. Tone Guidelines

### 6.1 Voice

- **Professional:** Respect the manufacturer's expertise in their products
- **Clear:** Use plain language; avoid jargon
- **Action-oriented:** Tell the manufacturer what to do, not what went wrong
- **Collaborative:** "We need your help with..." not "You failed to..."

### 6.2 Examples

| Instead of... | Write... |
|---|---|
| "Layer classification failed for 3 layers" | "We need your input on 3 layers" |
| "Noise score exceeds threshold" | "This detail has higher complexity than usual" |
| "PARTIAL readiness — blockers exist" | "Almost there — we have a few questions" |
| "Ownership map incomplete" | "Please confirm which layers belong to your system" |
| "Assembly definition validation failed" | "Some system information is still needed" |
| "Ingestion complete with errors" | "We've processed your files and have a few questions" |

### 6.3 Numbers and Metrics

- Show quality as a positive score (higher = better), not noise score (lower = better)
- Convert internal noise_score to quality: `quality = max(0, 100 - noise_score * 4)`
- Show progress as percentage complete, not items remaining
- Use concrete counts ("3 of 15 details validated") not ratios

---

*End of Manufacturer UI Staging Language v0.1*
