# Trend Model

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## Definition

A **trend** is a directional shift observed over time in failure frequency, material usage, practice adoption, regulatory emphasis, or performance outcomes within the Division 07 building envelope domain. Trends are not point-in-time observations; they represent patterns of change.

## Trend Record Structure

| Field | Required | Description |
|---|---|---|
| `trend_id` | Yes | Unique identifier |
| `title` | Yes | Concise description of the trend |
| `direction` | Yes | `increasing`, `decreasing`, `emerging`, `stabilizing`, `reversing` |
| `category` | Yes | One of: `failure_frequency`, `material_usage`, `practice_adoption`, `regulatory`, `performance_outcome`, `market_shift` |
| `observation_period` | Yes | Start and end dates of the observed period |
| `affected_control_layers` | When applicable | Control layers impacted (from `shared/control_layers.json`) |
| `affected_interface_zones` | When applicable | Interface zones impacted (from `shared/interface_zones.json`) |
| `climate_linkage` | When applicable | ASHRAE climate zones or exposure conditions relevant to the trend |
| `evidence_links` | Yes | References to supporting sources in the evidence registry |
| `confidence` | Yes | `low`, `medium`, `high`, `established` |
| `ambiguity_flags` | When applicable | Flags per [Knowledge Quality Policy](../doctrine/knowledge_quality_policy.md) |
| `status` | Yes | Lifecycle state: `draft`, `active`, `superseded`, `deprecated` |
| `supersedes` | When applicable | Predecessor trend record identifier |

## Trend Categories

### Failure Frequency
Observed increase or decrease in the rate of specific failure modes. Example: rising incidence of adhesion loss in fluid-applied air barriers on CMU substrates in humid climates.

### Material Usage
Shifts in market adoption of specific material classes or products. Example: declining use of solvent-based sealants in favor of silicone and hybrid chemistries.

### Practice Adoption
Changes in installation methods, detailing approaches, or specification patterns. Example: increasing specification of self-adhered membrane flashings at window rough openings.

### Regulatory
Changes in code requirements, standard revisions, or jurisdictional mandates. Example: expanding continuous insulation requirements under energy code updates.

### Performance Outcome
Shifts in measured or observed performance of assemblies over service life. Example: improving long-term air leakage rates in buildings using integrated air/water-resistive barriers.

### Market Shift
Changes in the competitive landscape, supply chain, or product availability that affect building envelope practice. Example: consolidation of spray foam insulation manufacturers affecting product availability.

## Trend Lifecycle

Trends follow the standard record lifecycle (`draft` -> `active` -> `superseded` -> `deprecated`). A trend may be superseded when:

- The observation period is extended with new data.
- The direction changes (e.g., an `increasing` trend begins `stabilizing`).
- Evidence contradicts the previously observed direction.

## Relationship to Failure Patterns

Trends and failure patterns are complementary:

- A **failure pattern** describes a recurring failure mode (what fails, how, and why).
- A **trend** describes how the frequency or severity of that failure mode is changing over time.

A trend record may reference one or more failure pattern records. A failure pattern may be referenced by multiple trend records tracking different dimensions of change.
