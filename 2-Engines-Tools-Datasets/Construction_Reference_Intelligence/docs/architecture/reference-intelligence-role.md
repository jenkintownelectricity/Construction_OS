# Reference Intelligence Role Specification — Construction_Reference_Intelligence

## System Role

Construction_Reference_Intelligence (CRI) serves as the memory formation and structural intelligence layer within Construction OS. CRI is a **non-authority** component — it synthesizes and organizes intelligence but never establishes canonical truth.

## Architecture Position

CRI sits at the **ingestion boundary of the cognitive layer**. It is the entry point where raw construction-domain source data is received, validated for lineage, structurally organized, and transformed into intelligence signals that flow deeper into the cognitive architecture.

## Intelligence Ingestion Sources

CRI ingests from the following source categories:

- **Project documents** — plans, specifications, submittals, RFIs, change orders, and related project-level records
- **Regulatory references** — codes, standards, jurisdictional requirements, and compliance frameworks
- **Material standards** — manufacturer specifications, material properties, testing standards, and certification data
- **Historical intelligence** — past project data, lessons learned, historical performance records
- **Domain knowledge bases** — trade-specific references, best practices, and industry knowledge repositories

### Lineage Requirements

All ingested source data **must carry lineage**. Lineage includes provenance metadata identifying the origin, version, authority, and chain of custody of the data.

**Fail-closed on missing lineage.** If any source data arrives without valid lineage metadata, CRI rejects it. No processing, synthesis, storage, or emission occurs for unlineaged data. This is not configurable — fail-closed is the only mode.

## Synthesis Rules

CRI transforms ingested source data into structured intelligence artifacts according to the following rules:

1. **Lineage preservation.** Every synthesis operation preserves and extends the lineage chain. Output artifacts carry the full lineage of all input sources that contributed to their formation.
2. **Non-canonicalization.** Synthesized artifacts are never marked as canonical or authoritative. They remain classified as non-authority intelligence signals regardless of the authority level of their source inputs.
3. **Structural organization.** CRI organizes intelligence into structured forms — cross-referenced, indexed, and relationally linked — without asserting that the resulting structure constitutes truth.
4. **Fail-closed validation.** Every stage of the synthesis pipeline validates lineage integrity. If validation fails at any stage, the pipeline halts and the artifact is not produced.
5. **Append-only provenance.** Provenance records are append-only. Prior provenance entries are never modified, overwritten, or deleted. New synthesis steps append to the provenance chain.

## Intelligence Signal Production

CRI produces **structured synthesized knowledge** as its primary output. These intelligence signals have the following characteristics:

- They **carry lineage** — full provenance metadata traces each signal back to its source inputs
- They are **classified as non-authority** — signals are explicitly marked as non-authoritative intelligence
- They are **emitted into the cognitive event/admission layer as observations** — CRI publishes signals as observation events, not as directives or commands
- They are **consumed by workers and the Awareness Cache** — downstream components pull structured intelligence for their own purposes

## Relationship to Construction_Cognitive_Bus

CRI **emits signals as events** onto the Cognitive Bus. This is a publish-only relationship.

CRI does **not** govern the bus. CRI does **not** validate events on the bus. CRI does **not** route events on the bus. CRI has no control-plane authority over the Cognitive Bus. It is a signal producer, not a bus operator.

## Relationship to Construction_Awareness_Cache

CRI **provides signals for compilation** into frozen awareness snapshots maintained by the Awareness Cache.

CRI does **not** read from the Awareness Cache. CRI does **not** write to the Awareness Cache directly. The Awareness Cache pulls from CRI's emitted signals through the cognitive event layer — CRI has no direct interface to the cache.

## Relationship to Construction_Assistant

CRI's relationship to the Assistant is **indirect through frozen compiled awareness only**.

The Assistant consumes frozen awareness snapshots compiled by the Awareness Cache. Those snapshots may include intelligence signals that originated from CRI. The Assistant never queries CRI directly, never receives signals from CRI directly, and has no interface to CRI. The path is always: CRI -> Cognitive Bus -> Awareness Cache -> compiled awareness -> Assistant.

## Non-Authority Guarantees

CRI commits to the following non-authority guarantees without exception:

1. **NOT a truth authority.** CRI does not establish, hold, validate, or assert canonical truth. Truth authority is the exclusive domain of kernels.
2. **NOT the Cognitive Bus.** CRI does not operate, govern, validate, or route on the Cognitive Bus. It is a signal emitter only.
3. **NOT the Awareness Cache.** CRI does not compile, store, serve, or manage frozen awareness. It provides inputs that the Awareness Cache may consume.
4. **No self-canonicalization.** CRI never treats its own outputs as source-of-truth data. Its artifacts are always non-authority signals, even when derived from authoritative kernel-sourced inputs.
5. **Fail-closed.** Any failure in lineage validation, provenance verification, or synthesis integrity causes CRI to halt processing and reject the artifact. CRI never degrades to an open or permissive mode.
6. **Lineage preservation.** Every artifact, signal, and record produced by CRI carries unbroken lineage metadata. Lineage is never stripped, summarized, or approximated.
