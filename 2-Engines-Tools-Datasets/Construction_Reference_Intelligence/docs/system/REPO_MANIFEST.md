# REPO_MANIFEST — Construction_Reference_Intelligence

## Identity

| Field | Value |
|---|---|
| Repository | `Construction_Reference_Intelligence` |
| Organization | `jenkintownelectricity` |
| Layer | Cognitive Layer |
| Primary Role | Memory formation and structural intelligence |

## Purpose

Construction_Reference_Intelligence (CRI) is the memory formation and structural intelligence layer for Construction OS. It ingests construction-domain source data, synthesizes structured intelligence artifacts, and emits intelligence signals into the cognitive event layer for downstream consumption.

## Classification

- **Service type:** Cognitive-layer service
- **Authority status:** Non-authority
- **Truth delegation:** Defers to kernels for truth
- **Registration:** Registered by `Construction_OS_Registry`

## What It IS

- Memory formation and structural intelligence layer for Construction OS
- Producer of intelligence signals
- Consumer of construction-domain source data
- Store of structured intelligence artifacts

## What It IS NOT

- **NOT** a truth authority — CRI does not establish canonical truth
- **NOT** the Cognitive Bus — CRI does not govern, validate, or route events
- **NOT** the Awareness Cache — CRI does not compile or serve frozen awareness
- **NOT** a kernel — CRI does not hold domain authority
- **NOT** a registry — CRI does not register or govern components

## Interactions

| Component | Relationship |
|---|---|
| Cognitive Bus | CRI emits signals as events onto the bus |
| Awareness Cache | CRI provides signals for compilation into frozen awareness |
| Assistant | Indirect only — Assistant consumes compiled awareness, never CRI directly |
| Workers | Workers consume structural intelligence produced by CRI |
| VKBUS | CRI receives governed relay, observation, and guidance from VKBUS |
| Registry | CRI is a registered component within Construction_OS_Registry |

## Non-Authority Guarantees

1. **No canonical truth.** CRI never establishes, holds, or asserts canonical truth. Truth authority belongs exclusively to kernels.
2. **Lineage metadata.** Every intelligence artifact and signal produced by CRI carries full lineage metadata tracing its provenance to source data.
3. **Fail-closed behavior.** If lineage is missing, malformed, or unverifiable, CRI fails closed — it does not emit, store, or propagate the artifact.
4. **No self-canonicalization.** CRI never treats its own outputs as authoritative source material. Its artifacts are always classified as non-authority intelligence signals.

## Signal Contract v0.1 Components

| Component | Path | Purpose |
|---|---|---|
| `cri/__init__.py` | `cri/__init__.py` | Package init with module docstring |
| `cri/config.py` | `cri/config.py` | CRI identity constants, schema version, allowed signal types, payload limit |
| `cri/signal_contract.py` | `cri/signal_contract.py` | Signal type definitions, descriptions, and validation rules |
| `cri/signal_mapper.py` | `cri/signal_mapper.py` | Maps CRI signal types to Cognitive Bus event_class values |
| `cri/signal_envelope_builder.py` | `cri/signal_envelope_builder.py` | Builds valid Cognitive Bus event envelopes from CRI signals |
| `tests/test_signal_mapping.py` | `tests/test_signal_mapping.py` | Tests for signal type to event class mapping |
| `tests/test_signal_format.py` | `tests/test_signal_format.py` | Tests for envelope format, schema compliance, and constraints |

### Signal Types

- **observation** maps to Cognitive Bus `Observation` event class
- **proposal** maps to Cognitive Bus `Proposal` event class
- **ExternallyValidatedEvent** is explicitly forbidden for CRI

## Governance

CRI conforms to the Cognitive Layer Boundary Matrix. All vocabulary used in signals, metadata, and inter-component communication follows the locked vocabulary verbatim. No synonyms, paraphrases, or alternative terms are substituted for governed vocabulary.
