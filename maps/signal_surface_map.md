# Signal Surface Map

## Purpose

Maps signal types to their governed validation surfaces.

## Signal Routing

| Signal Type | Source Worker(s) | Validation Surface | Post-Validation Consumer |
|---|---|---|---|
| Extracted assembly structure | assembly_interpreter | CR validation pipeline | CAO for routing |
| Extracted spec requirement | spec_parser | CR validation pipeline | CAO for routing |
| Extracted detail structure | detail_extractor | CR validation pipeline | CAO for routing |
| Material fit signal | material_intelligence | CR signal audit surface | CAO for routing |
| Material spec compliance signal | material_intelligence | CR signal audit surface | CAO for routing |
| Substitution proposal | material_intelligence | CAO proposal review surface | Manual review |
| Conformance signal | compliance_signal | CR signal audit surface | CAO for routing |
| Deviation signal | compliance_signal | CR signal audit surface | CAO for routing |
| Ambiguity signal | compliance_signal | CR signal audit surface | Manual review |
| Insufficient data signal | compliance_signal | CR signal audit surface | Manual review |

## Routing Rules

- All signals must reach a governed validation surface before downstream consumption.
- Signals tagged `unbound` (no governed reference) route to manual review regardless of type.
- Signals with confidence below a governed threshold route to manual review.
- The confidence threshold is defined by Construction_Runtime, not by workers.
