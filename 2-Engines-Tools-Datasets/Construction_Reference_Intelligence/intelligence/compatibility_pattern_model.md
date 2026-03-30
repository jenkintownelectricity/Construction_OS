# Compatibility Pattern Model

## Purpose

Compatibility patterns document observed material and chemistry interactions across building envelope assemblies. They record which material combinations perform well together, which are incompatible, and under what conditions compatibility changes. This is critical for CSI Division 07 where multiple proprietary products from different manufacturers must coexist at interfaces.

## Key Fields

Inherits all fields from the base record model, plus:

| Field | Type | Required | Description |
|---|---|---|---|
| `material_a` | object | yes | `{ name, category, kernel_ref }` — first material in the pairing. |
| `material_b` | object | yes | `{ name, category, kernel_ref }` — second material in the pairing. |
| `compatibility_status` | enum | yes | `compatible`, `conditionally_compatible`, `incompatible`, `under_investigation`. |
| `interaction_type` | enum | yes | `chemical`, `physical`, `thermal`, `adhesive`, `galvanic`, `solvent_based`. |
| `failure_mechanism` | string | no | Description of what goes wrong when incompatible (e.g., "plasticizer migration softens adjacent sealant"). |
| `conditions` | object | no | Environmental or installation conditions that affect compatibility: temperature range, UV exposure, moisture presence. |
| `time_to_manifest` | object | no | `{ typical_range_years: [min, max] }` — how long before incompatibility symptoms appear. |
| `mitigation` | string | no | Barrier, primer, or separation technique that resolves conditional compatibility. |
| `manufacturer_guidance` | string | no | Whether manufacturers explicitly address this pairing in their literature. |
| `interface_zone` | string | no | Interface zone where this pairing most commonly occurs. |

## Compatibility Statuses

- **compatible** — No known adverse interaction. Validated through evidence.
- **conditionally_compatible** — Compatible only when specific conditions are met (primer, separator, temperature range).
- **incompatible** — Known adverse interaction documented. Should not be combined without mitigation.
- **under_investigation** — Suspected interaction, insufficient evidence to classify.

## Interaction Types

- **chemical** — Solvent attack, plasticizer migration, pH-driven degradation.
- **physical** — Differential movement, abrasion, compression incompatibility.
- **thermal** — Mismatched expansion coefficients causing stress at bond lines.
- **adhesive** — Failure of adhesion between the two materials over time.
- **galvanic** — Electrochemical corrosion between dissimilar metals.
- **solvent_based** — VOC off-gassing or solvent in one product attacking the other.

## Constraints

1. Both `material_a` and `material_b` must be identified with enough specificity to be actionable (generic "membrane" is insufficient).
2. An `incompatible` status requires at least one evidence item documenting the adverse interaction.
3. `conditionally_compatible` must specify the conditions in `conditions` or `mitigation`.
4. Compatibility is not assumed to be commutative in all cases — A-on-B may differ from B-on-A for adhesive interactions.

## Relationships

- References kernel material and product records via `kernel_refs`.
- Links to failure patterns where incompatibility is the root cause.
- Links to success patterns where compatible pairings are documented.
- Informed by evidence from test results, field forensics, and manufacturer data.
- Contextualized by climate model (temperature, UV, and moisture affect compatibility).
