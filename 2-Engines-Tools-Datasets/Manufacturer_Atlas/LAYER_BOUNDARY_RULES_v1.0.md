# Layer Boundary Rules v1.0

**Status:** FROZEN
**Version:** v1.0

---

## Layer Definitions

### 000-governance-truth
- **Purpose:** Canonical manufacturer authority
- **Contains:** Schemas, type definitions, constraint sets, governance state
- **Write Access:** Governed commits only (thaw/refreeze protocol)
- **Read Access:** All layers

### 100-knowledge-graph
- **Purpose:** Atlas graph and detail graph structures
- **Contains:** Nodes, edges, lenses, relations, coverage models, integrity reports
- **Write Access:** Knowledge layer commits
- **Read Access:** 200, 300, 400, 900
- **Dependency:** Reads from 000

### 200-engines
- **Purpose:** Deterministic logic consuming truth and graph
- **Contains:** Resolvers, validators, compatibility engines
- **Write Access:** Engine layer commits
- **Read Access:** 300, 400
- **Dependency:** Reads from 000, 100
- **Prohibition:** MUST NOT write to 000 or 100

### 300-tools
- **Purpose:** Operator-facing tools and UI surfaces
- **Contains:** Atlas UI, inspectors, browsers, workstations
- **Write Access:** Tool layer commits
- **Read Access:** 400
- **Dependency:** Calls engines (200) only
- **Prohibition:** MUST NOT write to 000, 100, or 200

### 400-adapters
- **Purpose:** Bridges to external systems
- **Contains:** OMNI View bridge, CAD/BIM export, importers, signal emitters
- **Write Access:** Adapter layer commits
- **Read Access:** None (terminal layer)
- **Dependency:** Consumes results from 200, 300
- **Prohibition:** MUST NOT modify truth (000)

### 900-archive-immutable
- **Purpose:** Append-only lineage archive
- **Contains:** Receipts, audits, phase logs, migration notes, frozen snapshots
- **Write Access:** Append-only (no overwrite, no delete)
- **Read Access:** All layers (read-only reference)

---

## Violation Protocol

Any commit that violates layer boundaries is a governance failure.
Governance failures must be remediated before proceeding.
