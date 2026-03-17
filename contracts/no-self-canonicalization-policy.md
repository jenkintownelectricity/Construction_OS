# No-Self-Canonicalization Policy

## Purpose

Defines the policy prohibiting workers from canonicalizing their own outputs.

## Policy Statement

No worker in the Construction_Intelligence_Workers fleet may promote, reference, or treat its own output as canonical, authoritative, or validated.

## Prohibited Actions

1. **Self-reference as authority**: A worker must not cite its own prior output as an authoritative source for a subsequent output.
2. **Output promotion**: A worker must not tag its output as `canonical`, `authoritative`, `validated`, or `definitive`.
3. **Circular validation**: A worker must not validate its own output or participate in validating its own output.
4. **State persistence as truth**: A worker must not persist its outputs as final state that other systems consume as truth.
5. **Chain self-validation**: In worker chains, a downstream worker must not treat an upstream worker's output as validated merely because it passed through the chain.

## Permitted Actions

- A worker may reference its own output schema to ensure format consistency.
- A worker may log its own outputs for debugging and audit purposes.
- A worker may compare its current output against its prior output to detect extraction drift, provided neither is treated as canonical.

## Enforcement

- Output contract validation checks for prohibited tags.
- Runtime audit checks for self-referential patterns.
- Frozen seam #2 (No Self-Canonicalization) governs this policy at the architectural level.

## Violation Response

Any detected self-canonicalization:
- Invalidates the affected output.
- Triggers a frozen seam violation alert.
- Requires remediation before the worker may resume operation.
