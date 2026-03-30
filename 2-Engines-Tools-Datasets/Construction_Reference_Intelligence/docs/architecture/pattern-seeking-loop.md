# Pattern-Seeking Loop

**Version:** 0.1
**Status:** Active
**Domain:** CSI Division 07 — Building Envelope Systems

## Conceptual Model

Intelligence is not imported wholesale from external sources. It is developed through a disciplined observation-to-publication loop. This loop ensures that every active intelligence record has been through a structured process of discovery, hypothesis, evidence linkage, and confidence assessment.

```
Observe --> Hypothesize --> Evidence-Link --> Confidence-Track --> Publish
   ^                                                                |
   |________________________________________________________________|
                        (feedback / supersession)
```

## Loop Stages

### 1. Observe

Identify a candidate pattern from raw inputs:

- Field investigation reports revealing recurring failures.
- Warranty claim data showing geographic or temporal clustering.
- Specification review revealing repeated interface gaps.
- Literature review surfacing documented failure modes.
- Practitioner experience highlighting known-but-undocumented issues.

**Output:** A candidate observation — unstructured, unvalidated, not yet intelligence.

### 2. Hypothesize

Formulate a structured hypothesis about the pattern:

- What is failing (or succeeding), and at which control layer / interface zone?
- What conditions contribute to the pattern?
- Is this a point observation or a recurring pattern?
- What would confirming or disconfirming evidence look like?

**Output:** A draft intelligence record with preliminary field population. Status: `draft`. Confidence: `low`.

### 3. Evidence-Link

Connect the hypothesis to traceable evidence:

- Register evidence sources in `shared/shared_evidence_registry.json`.
- Classify each source by quality tier (primary, secondary, tertiary).
- Link the draft record to registered sources with relevance notes.
- Assess whether evidence confirms, partially supports, or contradicts the hypothesis.

**Output:** An evidence-linked draft record. The evidence set determines the confidence ceiling.

### 4. Confidence-Track

Assign and justify a confidence level:

- Does the evidence tier support the proposed confidence level?
- Are there ambiguity flags that should be applied?
- Is the pattern geographically, temporally, or scope-constrained?
- Does corroborating or contradicting evidence from other records affect confidence?

**Output:** A confidence-assessed draft record ready for validation review.

### 5. Publish

Submit the record for validation and transition to `active`:

- Schema validation confirms structural compliance.
- Evidence linkage meets minimum thresholds for the stated confidence level.
- No standards text reproduction.
- No kernel truth assertions.
- Unique identifier assigned.

**Output:** An active intelligence record in the corpus.

## Feedback and Supersession

The loop is not linear. Active records re-enter the loop when:

- New evidence emerges that strengthens or weakens confidence.
- A related failure pattern is discovered that refines understanding.
- A trend record indicates the pattern's frequency is changing.
- Contradicting evidence requires a confidence downgrade or deprecation.

Re-entry produces a **new record** that supersedes the prior one. The prior record is never modified in place.

## Loop Discipline

- Skipping stages is not permitted. A record cannot jump from observation to publication.
- Evidence-linking before hypothesis is acceptable (evidence may arrive before a pattern is recognized).
- Multiple loops may run concurrently for related patterns.
- The loop is a conceptual framework, not an enforced workflow engine. This repository has no runtime; discipline is maintained through review and validation.
