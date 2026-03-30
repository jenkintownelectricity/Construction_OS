# Dataset Discovery Posture

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## Purpose

Intelligence quality depends on evidence quality, which depends on access to relevant datasets. This document identifies dataset categories that the intelligence layer should actively seek, evaluate, and register as potential evidence sources. Discovery is ongoing; this is a living inventory of dataset types, not a catalog of specific datasets.

## Candidate Dataset Categories

### 1. Standards Datasets
Published standards and codes relevant to Division 07 assemblies, materials, and testing methods. Sources: ASTM, ASHRAE, AAMA, NRCA, SMACNA, SPRI, IBC/IRC, IECC.
**Registry path:** `shared/shared_standards_registry.json`

### 2. Manufacturer Datasets
Technical data from manufacturers of Division 07 materials and systems: product data sheets, technical bulletins, application guides, compatibility matrices.
**Value:** Primary evidence for material behavior, limitations, and manufacturer-stated performance.

### 3. Product Data Sheets
Structured product performance data: physical properties, test results, application parameters, limitations, storage requirements.
**Value:** Enables material-level intelligence and compatibility analysis.

### 4. Submittal Corpora
Collections of product submittals organized by project, assembly type, or specification section. Submittals document what was actually specified and approved.
**Value:** Gap analysis between specification intent and submitted products.

### 5. Warranty Documents
Manufacturer warranty terms, exclusions, and conditions. Warranty language reveals manufacturer-recognized failure risks.
**Value:** Implicit failure pattern intelligence embedded in exclusion clauses.

### 6. Installation Instructions
Manufacturer-published installation procedures, including substrate preparation, environmental limitations, sequencing requirements, and quality control checkpoints.
**Value:** Deviation from installation instructions is a leading contributor to failure patterns.

### 7. Compatibility Charts
Manufacturer or industry-published material compatibility matrices showing which materials can safely contact each other.
**Value:** Direct evidence for chemical incompatibility failure patterns.

### 8. Failure / Defect Datasets
Structured records of building envelope failures: forensic investigation reports, deficiency logs, punch lists, warranty claims, litigation discovery documents.
**Value:** Primary evidence for failure pattern intelligence.

### 9. Defect Image Datasets
Photographic documentation of building envelope defects, failures, and deterioration organized by failure mode, material, and location.
**Value:** Visual evidence supporting failure pattern records; potential training data for AI defect recognition.

### 10. Inspection Datasets
Quality assurance and quality control inspection records: field inspection reports, third-party testing results, commissioning observations.
**Value:** Evidence of installation quality variance and its correlation with failure patterns.

### 11. Maintenance Datasets
Building envelope maintenance records: repair logs, re-coating schedules, sealant replacement cycles, cleaning records.
**Value:** Lifecycle performance intelligence; evidence for degradation rate patterns.

### 12. Commissioning Datasets
Building envelope commissioning reports: air barrier testing results, water penetration testing, thermal imaging surveys.
**Value:** Baseline performance data and early-life deficiency identification.

### 13. Climate / Weather Datasets
Meteorological data relevant to building envelope performance: wind-driven rain intensity, freeze-thaw cycles, UV exposure indices, humidity profiles by climate zone.
**Value:** Climate-linkage for failure and success patterns.

### 14. Drawing / Detail Corpora
Collections of architectural details, shop drawings, and as-built drawings showing building envelope assembly configurations and interface conditions.
**Value:** Geometric and design context for failure and success patterns.

### 15. Leak / Moisture / Sensor Datasets
Data from in-situ moisture sensors, leak detection systems, and continuous monitoring installations.
**Value:** Real-time and longitudinal evidence for moisture intrusion patterns and assembly drying behavior.

## Discovery Process

1. **Identify** candidate datasets within each category.
2. **Evaluate** data quality, accessibility, licensing, and relevance.
3. **Register** viable sources in `shared/shared_evidence_registry.json` with quality tier and provenance metadata.
4. **Link** registered sources to intelligence records as evidence.

## Constraints

- No dataset is ingested into this repository. Datasets are referenced, not stored.
- Proprietary datasets are referenced by metadata only; content is not reproduced.
- Dataset discovery does not create intelligence. It creates the evidence foundation from which the pattern-seeking loop generates intelligence.
