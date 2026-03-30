# Standards Reference Posture

**Version:** 0.1
**Status:** Active
**Governing Doctrine:** [Reference Intelligence Doctrine](../doctrine/reference-intelligence-doctrine.md)

## Core Rule

This repository **references standards by citation only**. It does not reproduce, excerpt, paraphrase, or summarize standards text. Standards text is copyrighted by its issuing body and is not ours to redistribute.

## What Is Permitted

- **Citation by designation:** Referencing a standard by its alphanumeric identifier (e.g., ASTM E2178, AAMA 714, NRCA 10-56).
- **Scope statement reference:** Stating what a standard covers at a high level (e.g., "ASTM E2178 addresses air leakage testing of building envelope assemblies").
- **Requirement characterization:** Noting that a standard imposes a requirement without quoting the requirement text (e.g., "ASTM D4541 defines minimum pull-off adhesion test methods applicable to coatings and membranes").
- **Cross-reference to registry:** Linking to the standard's entry in `shared/shared_standards_registry.json`.

## What Is NOT Permitted

- Copying tables, figures, or test procedures from standards.
- Quoting requirement language verbatim.
- Paraphrasing specific clauses in a way that substitutes for reading the standard.
- Reproducing annexes, appendices, or commentary sections.
- Hosting PDF or scanned copies of standards documents.

## Standards Registry

All referenced standards are cataloged in:

```
shared/shared_standards_registry.json
```

Each registry entry contains:

| Field | Description |
|---|---|
| `standard_id` | Alphanumeric designation (e.g., "ASTM E2178") |
| `issuing_body` | Standards development organization |
| `title` | Official title of the standard |
| `year` | Edition year |
| `scope_summary` | Brief, non-infringing description of what the standard covers |
| `relevance` | Why this standard matters to Division 07 intelligence |
| `url` | Link to the official source where the standard can be purchased or accessed |

## Intelligence Records and Standards

Intelligence records (failure patterns, trends, precedents) may reference standards as evidence sources. When doing so:

1. The standard must have an entry in `shared/shared_standards_registry.json`.
2. The evidence link in the intelligence record references the registry entry by `standard_id`.
3. The standard is classified as a Tier 1 (primary) evidence source per the [Source Trust Policy](../doctrine/source-trust-policy.md).
4. The intelligence record does not reproduce any standards text; it describes observations in the repository's own language.

## Rationale

Respecting intellectual property of standards bodies is both a legal requirement and a trust obligation. The value of this intelligence layer comes from structured observations and pattern recognition, not from redistributing standards content. Practitioners and AI consumers are expected to access standards through legitimate channels.
