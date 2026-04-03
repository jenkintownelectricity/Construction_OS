# Manufacturer Detail System Input Manual v0.2

**Document Type:** External Manufacturer Guide
**Audience:** Manufacturers supplying detail systems to the platform
**Version:** 0.2
**Date:** April 2026
**Authority:** 10-Construction_OS

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Required Input Package](#2-required-input-package)
3. [DXF Requirements](#3-dxf-requirements)
4. [Three Ownership Classes](#4-three-ownership-classes)
5. [Assembly Definition Requirements](#5-assembly-definition-requirements)
6. [Quality Guidelines](#6-quality-guidelines)
7. [What Makes a Good Reference Detail](#7-what-makes-a-good-reference-detail)
8. [Layer Naming Best Practices](#8-layer-naming-best-practices)
9. [How Your Details Are Validated](#9-how-your-details-are-validated)
10. [Submission Checklist](#10-submission-checklist)
11. [What Happens After Submission](#11-what-happens-after-submission)
12. [Readiness Status Explained](#12-readiness-status-explained)
13. [Privacy](#13-privacy)
14. [FAQ](#14-faq)

---

## 1. Introduction

### 1.1 What the Platform Does

This platform generates construction details for roofing, waterproofing, and
envelope assemblies. It takes manufacturer-specific system data and produces
accurate, standards-compliant detail drawings that architects, specifiers, and
contractors can use directly in their project documentation.

The platform understands the layered composition of building envelope systems.
It knows which materials belong to which manufacturer, how they relate to
adjacent construction, and how to annotate them correctly.

### 1.2 Why Manufacturers Participate

Participation gives your systems direct representation in the detail generation
pipeline. When a specifier selects your system, the platform produces details
that show your specific products, layer sequences, and installation
configurations.

- Your products appear by name in generated details.
- Your system assemblies are drawn with correct layer order and geometry.
- Your installation requirements are reflected in the output.
- Your systems are available for selection alongside industry peers.

### 1.3 What You Get

- **Accurate representation.** Your system details are generated from your own
  source drawings, preserving the geometry and naming you control.
- **Broad coverage.** The platform generates details across multiple condition
  types for each system family you supply.
- **Consistency.** All details follow the same conventions, reducing errors.
- **No drafting burden.** Once submitted, the platform handles detail generation.

---

## 2. Required Input Package

To onboard a system family, submit the following materials.

### 2.1 Representative Detail DXF Files

Provide at least **5 DXF files per system family**. These should represent
different installation conditions.

Good representative details include:

- Field membrane section
- Parapet termination
- Roof drain
- Pipe penetration
- Edge condition or perimeter termination
- Expansion joint
- Wall flashing
- Transition between roof types

More details are better. A complete submission might include 15 to 25 details.

### 2.2 Product Data Sheets

Provide current product data sheets (PDF) for each component in the system,
including product name, material composition, thickness, and application method.

### 2.3 Installation Instructions

Submit installation guides for the system family. These help the platform
understand layer sequencing and substrate preparation requirements.

### 2.4 Warranty Terms

Provide warranty documentation describing types offered, duration, and
conditions.

### 2.5 System Compatibility Information

Include compatibility notes: approved substrates, insulation types, restrictions,
wind uplift ratings, fire ratings.

---

## 3. DXF Requirements

### 3.1 Clean Layer Naming

Every layer should have a descriptive name identifying the material or component.

**Good layer names (Barrett examples):**

| Layer Name | What It Represents |
|---|---|
| `RamProof SYSTEM LIQUID` | Liquid-applied membrane |
| `RamProof SYSTEM MESH` | Reinforcement mesh |
| `RAM Black Pearl Sheet` | Sheet membrane |
| `Protection Course` | Protective board |
| `Primer` | Surface primer |
| `Ram Mastic` | Sealant |
| `RAM POLY FELT 3.5 FILTER FABRIC` | Filter fabric |
| `Drainage Mat` | Drainage layer |

**Poor layer names:**

- `Layer1`, `0`, `Copy of Layer 3`, `TEMP`, `Misc`

Layer names are the primary mechanism for identifying what each piece of
geometry represents.

### 3.2 Supported Entity Types

| Entity Type | Usage |
|---|---|
| LWPOLYLINE | Closed and open shapes, outlines, profiles |
| HATCH | Filled areas, material patterns |
| LINE | Individual line segments |
| ARC | Curved segments |
| CIRCLE | Circular elements (pipes, fasteners) |
| MULTILEADER | Callout leaders with text |
| TEXT | Single-line text annotations |
| MTEXT | Multi-line text annotations |

### 3.3 Actual Scale Geometry

All geometry must be drawn at **actual scale** (1:1).

### 3.4 One Detail Per File

Each DXF file should contain **one detail**.

### 3.5 System Layer Identification

Your layer names should make it clear which layers belong to your system
assembly. The platform uses layer names to determine ownership.

---

## 4. Three Ownership Classes

### 4.1 Your System Materials (SYSTEM_OWNED)

Geometry belonging to your roofing, waterproofing, or envelope assembly.
Materials you manufacture, supply, or specify as part of your warranted system.

**Barrett examples:**

| Layer Name | Material |
|---|---|
| `RamProof SYSTEM LIQUID` | Liquid-applied waterproofing membrane |
| `RamProof SYSTEM MESH` | Reinforcement mesh embedded in membrane |
| `RAM Black Pearl Sheet` | Self-adhered sheet membrane |
| `Protection Course` | Protection board over membrane |
| `Primer` | Substrate primer |
| `Ram Mastic` | System sealant |
| `Drainage Mat` | Drainage composite |
| `RAM POLY FELT 3.5 FILTER FABRIC` | Filter/separation fabric |

**Rule:** If a component is listed on your product data sheet, appears in your
installation instructions, or is covered by your system warranty, it belongs here.

### 4.2 Surrounding Construction (CONTEXT_ONLY)

Geometry shown for readability but not owned by your system.

**Examples:**

- Structural concrete slab or deck
- Backup wall (CMU, concrete, stud framing)
- Insulation (unless manufacturer-supplied)
- Overburden (pavers, soil, ballast)
- Adjacent construction
- The `Others` layer (always context by default)

**Important:** The `Others` layer in your DXF files is NOT treated as junk.
It represents context geometry — the surrounding construction that shows
where your system is installed. Keep this geometry; it helps produce
accurate details.

### 4.3 Notes and Dimensions (ANNOTATION)

Text, dimensions, callouts, leaders, and other non-geometric elements.

- TEXT and MTEXT entities are always classified as notes
- MULTILEADER entities are always classified as notes
- DIMENSION entities are always classified as notes
- The `Text` and `Defpoints` layers are treated as annotation

You do not need to take special action for these layers.

---

## 5. Assembly Definition Requirements

### 5.1 System Family Name

Provide the official marketing name (e.g., "RAM Black Pearl System",
"RamProof GC Waterproofing System", "RamFlash PMMA Flashing System").

### 5.2 Product Components List

For each component, provide: product name, role (membrane, primer, etc.),
DXF layer name, and whether it is always present or conditionally present.

### 5.3 Supported Condition Types

Indicate which conditions your system supports: field membrane, parapet,
base flashing, roof drain, pipe penetration, expansion joint, edge
termination, curb, corner, wall transition, etc.

### 5.4 Layer Ownership Summary

Map every layer name used in your DXFs to its ownership class.

---

## 6. Quality Guidelines

### 6.1 Minimize Noise Layers

Remove layers not needed for the detail: unused defaults, temporary layers,
xref leftovers, duplicates.

### 6.2 Use Consistent Names Across Details

If your membrane is called `RamProof SYSTEM LIQUID` in one detail, use the
same name in every detail. Do not use variations.

### 6.3 Purge Before Submission

Run the AutoCAD `PURGE` command to remove unused layers, blocks, and styles.

### 6.4 Avoid Embedded Images and External References

DXF files should not contain embedded raster images, unresolved xrefs,
OLE objects, or proxy entities.

---

## 7. What Makes a Good Reference Detail

Every system family should include at least one "reference detail" (internally
called a "golden detail") that meets all of the following:

- **Low layer count.** Ten or fewer layers is ideal.
- **Clean geometry.** No overlapping entities, stray lines, or duplicates.
- **Descriptive layer names.** Every layer named after its material.
- **Clear ownership.** System layers clearly distinguishable from context.
- **Complete annotation.** Callouts identify all visible materials.
- **Single condition.** Shows one well-defined condition (e.g., a standard
  roof assembly section).

**Why it matters:** The reference detail is processed first and establishes
the baseline layer mapping for all subsequent details in the family. A clean
reference detail means faster, more accurate processing of your entire library.

**Barrett example:** The cleanest Barrett detail is a standard RamProof GC
roof assembly section with only 8 layers and 464 geometry entities. This
file has a very low complexity score because it uses descriptive layer names,
has minimal annotation, and represents a single clear condition.

---

## 8. Layer Naming Best Practices

### 8.1 Use Product Names as Layer Names

The best approach is to name each layer after the actual product:

| Instead of... | Use... |
|---|---|
| `Layer 1` | `RamProof SYSTEM LIQUID` |
| `Membrane` | `RAM Black Pearl Sheet` |
| `Layer 3` | `Protection Course` |
| `Misc` | `Ram Mastic` |

### 8.2 Keep Context Layers Descriptive

Context layers should describe what they represent:

| Instead of... | Use... |
|---|---|
| `Others` | `Concrete Substrate` (preferred) or `Others` (acceptable) |
| `BG` | `Foundation Wall` |
| `Struct` | `Structural Slab` |

### 8.3 Separate Annotation from Geometry

Keep text, dimensions, and callouts on dedicated layers separate from
material geometry layers.

### 8.4 Common Annotation Layers

These layer names are automatically recognized as annotation:

- `Text`
- `Defpoints`
- `Notes`
- `Dimensions`
- `Annotation`

---

## 9. How Your Details Are Validated

After submission, your details go through a progressive validation process:

### Stage 1 — Reference Detail

Your cleanest detail is selected as the reference. It is analyzed to establish:

- Which layers belong to your system
- Which layers are context construction
- What annotation patterns you use
- The baseline layer mapping for your family

### Stage 2 — Standard Details

The next 5 cleanest details are validated to confirm:

- Layer names are consistent with the reference
- Ownership classifications are stable
- Annotation patterns are recognized

### Stage 3 — Moderate Complexity

5 moderately complex details are checked to validate:

- The platform correctly identifies your system layers under more variation
- Context geometry is handled properly
- Rare layers are catalogued

### Stage 4 — Full Complexity

The remaining details are processed to measure noise tolerance and catch
edge cases.

**Your involvement:** If the platform cannot confidently classify a layer,
you may be asked to confirm whether it belongs to your system or is context
construction. This typically requires only a few yes/no answers.

---

## 10. Submission Checklist

1. [ ] System family name clearly stated
2. [ ] At least 5 representative DXF files included
3. [ ] Each DXF file contains one detail only
4. [ ] All files drawn at actual scale (1:1)
5. [ ] Layer names are descriptive and identify each material
6. [ ] Layer names are consistent across all files in the family
7. [ ] At least one clean reference detail identified
8. [ ] Product data sheets included (PDF)
9. [ ] Installation instructions included (PDF)
10. [ ] Warranty terms included (PDF)
11. [ ] System compatibility information provided
12. [ ] Product components list with roles and layer names provided
13. [ ] Supported condition types identified
14. [ ] Layer ownership summary completed
15. [ ] DXF files purged of unused layers and blocks
16. [ ] No embedded images, xrefs, or OLE objects
17. [ ] Files organized in a single folder or archive

---

## 11. What Happens After Submission

### 11.1 Ingestion

Your DXF files are parsed and analyzed. Layer names, entity counts, and
geometry characteristics are extracted. This is automated.

### 11.2 Validation

Parsed data is validated against requirements. Issues are documented and
communicated if corrections are needed.

### 11.3 Layer Classification

Each layer is mapped to an ownership class using your summary and automated
rules.

### 11.4 Readiness Assessment

Each system family is assigned a readiness status (see Section 12).

---

## 12. Readiness Status Explained

After validation, each of your system families receives a readiness status:

### Ready for Detail Generation

Your system is fully configured. All layers are mapped, components are
defined, and representative details have been validated. The platform can
generate details for this system.

### Additional Information Needed

Your system is partially configured. Some details are available, but
additional layer confirmations, component definitions, or condition types
may be needed. You may receive specific questions about layers or components.

### Cannot Proceed — Action Required

Critical information is missing that prevents processing. Common causes:

- DXF files could not be parsed
- Layer naming is too ambiguous to classify
- No product data sheets were provided
- Files contain unsupported formats

You will receive specific instructions on what is needed.

### No Files Received

No DXF files have been received for this system family. Submit your input
package to begin.

---

## 13. Privacy

### 13.1 Competitive Separation

Your data is not exposed to competing manufacturers. Each manufacturer's
data is stored and processed independently.

### 13.2 Output Control

Generated details that include your system are produced for use by
specifiers and project teams. Your product names and system configurations
appear as you defined them.

### 13.3 Data Handling

Submitted files are stored securely and used only for configuring your
system within the platform.

---

## 14. FAQ

**Q: How many DXF files should I submit?**
A: At least 5 per system family, ideally 15-25 covering all conditions.

**Q: What if I have multiple system families?**
A: Submit a separate input package for each family. Each is validated
independently.

**Q: What happens to the `Others` layer in my DXFs?**
A: It is treated as context construction (surrounding building elements),
not as junk. You can leave it in your files.

**Q: Do I need to remove text and dimensions from my DXFs?**
A: No. Text, dimensions, and leaders are automatically recognized as
annotation and handled separately from material geometry.

**Q: What if the platform asks me about a layer I don't recognize?**
A: Some layers may come from CAD defaults or old references. If a layer
does not represent one of your products, confirm it as context construction.

**Q: Can I update my submission after initial processing?**
A: Yes. Updated files go through the same validation process. The platform
preserves your existing configuration and applies changes incrementally.

**Q: How long does validation take?**
A: Initial parsing is automated and fast. Layer classification review may
require a few questions back to you, depending on layer naming clarity.

**Q: What if my DXFs use non-standard entity types?**
A: The platform handles standard DXF entity types (polylines, lines, arcs,
hatches, text). Non-standard entities (proxy objects, OLE) are skipped.
Where possible, explode blocks and convert splines before submission.

---

*End of Manufacturer Detail System Input Manual v0.2*
