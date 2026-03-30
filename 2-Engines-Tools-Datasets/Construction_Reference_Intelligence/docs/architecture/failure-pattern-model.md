# Failure Pattern Model

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## Definition

A **failure pattern** captures a recurring failure mode observed at material interfaces, assembly transitions, control-layer discontinuities, or material boundaries within Division 07 building envelope systems. Failure patterns are structured observations, not prescriptive fixes.

## Failure Pattern Record Structure

| Field | Required | Description |
|---|---|---|
| `pattern_id` | Yes | Unique identifier |
| `title` | Yes | Concise name for the failure mode |
| `description` | Yes | Detailed description of the failure mechanism |
| `failure_mode` | Yes | Classification: `adhesion_loss`, `moisture_intrusion`, `air_leakage`, `thermal_bypass`, `mechanical_damage`, `chemical_incompatibility`, `UV_degradation`, `biological_growth`, `structural_movement`, `drainage_failure`, `vapor_drive_failure`, `fire_propagation`, `other` |
| `affected_control_layers` | Yes | Control layers impacted (references `shared/control_layers.json`) |
| `affected_interface_zones` | When applicable | Interface zones where the failure occurs (references `shared/interface_zones.json`) |
| `contributing_conditions` | Yes | Conditions that enable or accelerate the failure |
| `observable_symptoms` | Yes | How the failure manifests (visible, measurable, or detectable indicators) |
| `progression` | When applicable | How the failure develops over time if unaddressed |
| `climate_linkage` | When applicable | Climate conditions associated with the pattern |
| `lifecycle_stage` | When applicable | When in the building lifecycle the failure typically appears |
| `geometry_linkage` | When applicable | Geometric conditions associated with the pattern |
| `evidence_links` | Yes | References to supporting sources in the evidence registry |
| `confidence` | Yes | `low`, `medium`, `high`, `established` |
| `ambiguity_flags` | When applicable | Flags per [Knowledge Quality Policy](../doctrine/knowledge_quality_policy.md) |
| `related_patterns` | When applicable | Cross-references to related failure or success patterns |
| `status` | Yes | Lifecycle state: `draft`, `active`, `superseded`, `deprecated` |
| `supersedes` | When applicable | Predecessor record identifier |

## Contributing Conditions

Failure patterns rarely have a single cause. Contributing conditions are structured as:

| Condition Category | Examples |
|---|---|
| **Material** | Age, generation, formulation change, substrate type |
| **Installation** | Temperature at application, surface preparation, primer omission, sequencing error |
| **Design** | Insufficient slope, missing kickout flashing, inadequate drainage gap |
| **Environmental** | Freeze-thaw cycles, UV exposure, sustained moisture, wind-driven rain |
| **Interface** | Incompatible sealant-to-membrane contact, dissimilar metal corrosion, movement differential |
| **Maintenance** | Deferred caulk replacement, blocked drainage, debris accumulation |

## Failure at Interfaces

The highest-value failure patterns are those at **interfaces** — boundaries where:

- One control layer meets another (e.g., air barrier to window frame).
- One trade's work meets another's (e.g., roofing to sheet metal).
- One material meets another (e.g., EPDM to TPO, sealant to coating).
- One specification section's scope meets another's (e.g., 07 62 00 to 07 92 00).

Interface failures are frequently underdocumented because no single trade, specification section, or material manufacturer fully owns the boundary. This repository's intelligence layer fills that observational gap.

## Relationship to Other Models

- **Trend Model:** Trends track how the frequency or severity of failure patterns changes over time. A failure pattern may be referenced by one or more trend records.
- **Success Patterns:** Success patterns capture approaches that prevent or mitigate known failure patterns. Cross-referencing is encouraged.
- **Interface Risks:** Interface risk records may generalize across multiple related failure patterns at a given interface zone.

## Example Failure Pattern (Conceptual)

> **Title:** Adhesion Loss of Fluid-Applied Air Barrier at CMU Substrate in Humid Climates
>
> **Failure mode:** `adhesion_loss`
> **Affected control layers:** Air barrier, Water-resistive barrier
> **Interface zone:** Substrate-to-membrane interface
> **Contributing conditions:** High substrate moisture content at application, insufficient primer application, CMU surface profile variability
> **Climate linkage:** ASHRAE zones 2A, 3A, 4A (humid)
> **Confidence:** `medium`
> **Ambiguity flags:** `geographic_constraint`, `limited_sample`

This is a conceptual illustration, not a committed intelligence record.
