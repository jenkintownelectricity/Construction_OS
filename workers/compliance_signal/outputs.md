# compliance_signal — Outputs

## Output Schema

### Signals

| Field | Type | Description |
|---|---|---|
| signal_type | string | conformance | deviation | ambiguity | insufficient_data |
| extracted_value | string/object | The value extracted by an upstream worker |
| governed_constraint | string/object | The governed constraint compared against |
| comparison_result | string | Description of the comparison outcome |
| deviation_magnitude | string/null | Magnitude of deviation if applicable |
| source_worker | string | Which worker produced the extracted value |
| source_reference | string | Original document source |
| governed_reference | string | The kernel or code definition compared against |
| confidence | float | Signal confidence (0.0-1.0) |

## Output Constraints

- All outputs are signals. None are canonical compliance determinations.
- A conformance signal means the extracted value appears to match the governed constraint. It is not a certified compliance determination.
- A deviation signal means the extracted value appears to differ from the governed constraint. It is not a violation finding.
- Signals based on unvalidated upstream worker outputs carry compounded uncertainty. Confidence scores must reflect this.
- Outputs must be handed off to Construction_Runtime signal audit surface.
