# Workers Role Specification

## System Role

Construction_Intelligence_Workers serves as the active thought and proposal generation layer within Construction OS. Workers are non-authority cognitive processors. They analyze inputs, form proposals, emit observations, and produce signals — but they hold no authority over truth, validation, or canonical state. Workers must never self-canonicalize.

## Worker Task Types

All worker tasks produce non-authority outputs. No task type grants a worker validation power or canonical write access.

- **Analysis tasks** — ingest structural intelligence and compiled awareness, perform reasoning and pattern detection, produce analytical findings as non-authority proposals or observations
- **Proposal generation** — synthesize analyzed inputs into suggested actions, recommendations, or next steps, emitted as proposals with full lineage
- **Observation emission** — detect and report factual conditions, state changes, or data characteristics as observations (factual signals without authority claim)
- **Signal production** — compute alerts, insights, anomaly detections, and derived metrics, emitted as signals for downstream evaluation

## Proposal Generation Model

The proposal generation pipeline follows a strict sequence with a terminal hand-off:

1. **Input acquisition** — Workers consume CRI structural intelligence and frozen compiled awareness from the Awareness Cache. These are the two sanctioned input sources for cognitive processing.

2. **Active thought** — Workers perform analysis, reasoning, pattern matching, correlation, and inference over acquired inputs. This is the core cognitive work of the system.

3. **Proposal formation with lineage** — Workers structure their cognitive outputs into typed proposals (proposals, observations, or signals). Every output is tagged with full lineage: source identifiers, processing steps, worker identity, timestamps, and confidence metadata.

4. **Emission into cognitive event/admission layer** — Formed proposals are emitted into the Cognitive Bus for independent validation and admission. Workers use bus-defined emission interfaces and conform to bus-published contracts.

5. **Hand-off** — Upon emission, workers relinquish all control over the output. Workers do not track admission outcomes, do not retry rejected outputs around governance, and do not attempt to force admission. Self-canonicalization is prohibited at this and every other stage.

## Extraction Pipelines

Workers operate extraction pipelines that follow a governed sequence:

1. **Source ingestion** — Raw or structured data is acquired from sanctioned input sources (CRI, Awareness Cache, or other governed feeds)
2. **Extraction** — Relevant data points, entities, relationships, and attributes are extracted from ingested sources
3. **Classification** — Extracted data is classified into output types (observation, proposal, or signal) according to its nature and intended use
4. **Lineage attachment** — Full provenance metadata is attached: source origin, extraction method, classification rationale, worker identity, and processing timestamp
5. **Emission** — Classified, lineage-tagged outputs are emitted into the Cognitive Bus for validation and admission

## Classification Roles

Workers classify their outputs into three non-authority categories:

### Observation (factual signal)
A report of a detected condition, state, or data characteristic. Observations describe what a worker has detected but carry no authority claim. They are factual signals, not validated facts.

### Proposal (suggested action)
A recommended action, decision, or next step derived from worker analysis. Proposals are suggestions, not directives. They require downstream validation and admission before any system acts on them.

### Signal (computed alert/insight)
A computed metric, anomaly detection, threshold breach, trend identification, or derived insight. Signals alert downstream systems to conditions that may warrant attention but carry no authority to trigger action directly.

All three categories are non-authority outputs. Workers do not emit validated events.

## Relationship to Construction_Cognitive_Bus

- Workers emit all outputs — proposals, observations, and signals — into the Cognitive Bus
- The bus validates all incoming emissions independently according to its own governance rules
- Workers do not validate their own outputs before or after emission
- Workers do not route events within the bus
- Workers do not bypass the bus for any reason — there is no alternate path for worker outputs
- If the bus rejects an emission, the worker does not retry around the rejection or attempt alternate admission

## Relationship to Construction_Awareness_Cache

- Workers read frozen compiled awareness from the cache as contextual input for analysis and proposal generation
- Workers do not write to the cache
- Workers do not trigger awareness compilation
- Workers do not modify, invalidate, or update cache contents
- The cache is a strictly read-only input source from the workers' perspective

## Relationship to Construction_Assistant

- Workers do not direct the assistant
- Workers do not send outputs to the assistant
- Worker outputs reach the assistant indirectly, only after passing through bus admission and subsequent awareness compilation
- There is no direct communication channel, API, or message path from workers to the assistant
- The assistant consumes compiled awareness and validated events — not raw worker outputs

## Non-Canonical Output Constraints

1. **Emit proposals/observations/signals only** — workers produce exclusively non-authoritative cognitive outputs; no other output type is permitted
2. **NOT truth authorities** — no worker, task, pipeline, or output constitutes a truth authority within Construction OS
3. **Never self-canonicalize** — workers are structurally and operationally prohibited from writing their own outputs into any system of record, registry, cache, or truth store
4. **Must hand off into governed validation/admission surfaces** — every worker output must be emitted into the Cognitive Bus; no output may be routed around governed admission
5. **Fail-closed** — if emission fails, validation rejects, or the bus is unavailable, the output is dropped; workers do not degrade to ungoverned emission paths
6. **Lineage preservation** — every output carries complete, unbroken lineage from source acquisition through processing to emission; outputs without valid lineage are not emitted
