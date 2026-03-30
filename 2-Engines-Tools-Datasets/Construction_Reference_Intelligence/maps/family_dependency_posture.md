# Family Dependency Posture

## Position

Construction_Reference_Intelligence is a **read-only consumer** of kernel truth.
It depends on five kernel repositories and shared artifacts but never writes to them.

## Kernel Dependencies

| Kernel Repository               | Dependency Type | What Intelligence Reads           |
|---------------------------------|----------------|-----------------------------------|
| Construction_Specification_Kernel | read-only      | Product data, performance criteria |
| Construction_Assembly_Kernel      | read-only      | Systems, layers, transitions       |
| Construction_Material_Kernel      | read-only      | Properties, compatibility, aging   |
| Construction_Chemistry_Kernel     | read-only      | Cure, adhesion, chemical compat    |
| Construction_Scope_Kernel         | read-only      | Trade boundaries, interfaces       |

## Shared Artifacts

| Artifact                    | Usage                                    |
|----------------------------|------------------------------------------|
| Control layer taxonomy      | Classifying observations by control layer |
| Interface zone registry     | Mapping observations to interface zones   |
| Climate zone definitions    | Contextualizing climate-sensitive patterns |
| Division structure (CSI)    | Organizing records by specification division|

## Dependency Rules

1. Intelligence references kernel entries by stable ID — never by copy.
2. If a kernel entry is updated, intelligence records remain valid (they point, not embed).
3. If a kernel entry is retired, referencing intelligence records are flagged for review.
4. Intelligence never proposes changes to kernel content directly.
5. Intelligence may create `data_gap_record` entries when kernel data is missing.

## What Intelligence Owns

- Failure patterns, success patterns, trends, precedents.
- Evidence records and confidence scoring.
- Data gap identification and dataset candidate tracking.
- Schema change and DB expansion proposals (for its own domain).

## What Intelligence Does Not Own

- Material properties, assembly definitions, spec data, chemistry rules, scope boundaries.
- These belong to their respective kernels and are referenced, not duplicated.
