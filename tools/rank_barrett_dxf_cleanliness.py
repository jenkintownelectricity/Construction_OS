import json
from pathlib import Path
from collections import Counter

INPUT_DIR = Path("source/barrett/json")
OUTPUT_DIR = Path("source/barrett/census")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ANNOTATION_TYPES = {"TEXT", "MTEXT", "MULTILEADER", "DIMENSION"}
ANNOTATION_LAYERS = {"Text", "Notes", "Dimensions", "Anno", "Annotation"}
DEFAULT_CONTEXT_LAYERS = {"Others", "Defpoints"}

PHASES = {
    "GOLDEN_SEED": 1,
    "CLEAN_5": 5,
    "MODERATE_5": 5,
    "NOISY_10": 10,
}

def safe_ratio(numerator: int, denominator: int) -> float:
    return numerator / denominator if denominator else 0.0

def classify_entity(entity: dict) -> tuple[str, str]:
    etype = str(entity.get("type", "")).upper()
    layer = str(entity.get("layer", "")).strip()

    if etype in ANNOTATION_TYPES:
        return "annotation", "entity_type"

    if layer in ANNOTATION_LAYERS:
        return "annotation", "layer_name"

    if layer in DEFAULT_CONTEXT_LAYERS:
        return "context", "layer_name"

    if etype == "INSERT":
        return "block_insert", "entity_type"

    return "system_or_unknown", "fallback"

def compute_metrics(data: dict, path: Path) -> dict:
    entities = data.get("entities", [])
    total_entities = len(entities)

    layers = []
    annotation_entities = 0
    context_entities = 0
    block_insert_count = 0
    unknown_layer_entities = 0
    type_counter = Counter()

    for entity in entities:
        etype = str(entity.get("type", "UNKNOWN")).upper()
        layer = str(entity.get("layer", "UNKNOWN")).strip() or "UNKNOWN"

        layers.append(layer)
        type_counter[etype] += 1

        category, _basis = classify_entity(entity)

        if category == "annotation":
            annotation_entities += 1
        elif category == "context":
            context_entities += 1
        elif category == "block_insert":
            block_insert_count += 1

        if layer == "UNKNOWN":
            unknown_layer_entities += 1

    unique_layers = sorted(set(layers))
    layer_count = len(unique_layers)

    annotation_ratio = safe_ratio(annotation_entities, total_entities)
    context_ratio = safe_ratio(context_entities, total_entities)
    unknown_layer_ratio = safe_ratio(unknown_layer_entities, total_entities)

    noise_score = (
        layer_count * 0.4
        + annotation_ratio * 40
        + unknown_layer_ratio * 20
    )

    parse_status = data.get("parse_status", "unknown")
    basename = data.get("basename", path.stem)
    relative_source_file = data.get("relative_source_file", "")
    source_file = data.get("source_file", "")

    family = "UNKNOWN"
    parts = path.parts
    try:
        json_index = parts.index("json")
        if len(parts) > json_index + 1:
            family = parts[json_index + 1]
    except ValueError:
        pass

    return {
        "file": str(path).replace("\\", "/"),
        "basename": basename,
        "system_family": family,
        "parse_status": parse_status,
        "source_file": source_file,
        "relative_source_file": relative_source_file,
        "layer_count": layer_count,
        "unique_layers": unique_layers,
        "total_entities": total_entities,
        "annotation_entities": annotation_entities,
        "annotation_ratio": round(annotation_ratio, 4),
        "context_entities_estimate": context_entities,
        "context_ratio_estimate": round(context_ratio, 4),
        "unknown_layer_entities": unknown_layer_entities,
        "unknown_layer_ratio": round(unknown_layer_ratio, 4),
        "block_insert_count": block_insert_count,
        "entity_type_counts": dict(type_counter),
        "noise_score": round(noise_score, 4),
    }

def assign_progressive_batches(sorted_results: list[dict]) -> list[dict]:
    tagged = []
    index = 0

    for phase, size in PHASES.items():
        for _ in range(size):
            if index >= len(sorted_results):
                break
            item = dict(sorted_results[index])
            item["progressive_phase"] = phase
            item["progressive_rank"] = index + 1
            tagged.append(item)
            index += 1

    while index < len(sorted_results):
        item = dict(sorted_results[index])
        item["progressive_phase"] = "REMAINDER"
        item["progressive_rank"] = index + 1
        tagged.append(item)
        index += 1

    return tagged

def main() -> None:
    json_files = sorted(INPUT_DIR.rglob("*.json"))

    if not json_files:
        print(f"No JSON files found under: {INPUT_DIR}")
        return

    results = []
    errors = []

    for file_path in json_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            metrics = compute_metrics(data, file_path)
            results.append(metrics)

        except Exception as exc:
            errors.append({
                "file": str(file_path).replace("\\", "/"),
                "error": str(exc),
            })

    results.sort(key=lambda x: (x["noise_score"], x["layer_count"], x["total_entities"], x["file"]))
    results = assign_progressive_batches(results)

    ranking_path = OUTPUT_DIR / "barrett_dxf_cleanliness_ranking.json"
    summary_path = OUTPUT_DIR / "barrett_dxf_cleanliness_ranking.md"
    error_path = OUTPUT_DIR / "barrett_dxf_cleanliness_errors.json"

    with open(ranking_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    with open(error_path, "w", encoding="utf-8") as f:
        json.dump(errors, f, indent=2)

    lines = []
    lines.append("# Barrett DXF Cleanliness Ranking")
    lines.append("")
    lines.append(f"Input directory: `{INPUT_DIR.as_posix()}`")
    lines.append(f"Files ranked: **{len(results)}**")
    lines.append(f"Errors: **{len(errors)}**")
    lines.append("")
    lines.append("| Rank | Phase | Family | Noise Score | Layers | Entities | Annotation Ratio | Context Ratio | File |")
    lines.append("|---:|---|---|---:|---:|---:|---:|---:|---|")

    for item in results:
        lines.append(
            f"| {item['progressive_rank']} "
            f"| {item['progressive_phase']} "
            f"| {item['system_family']} "
            f"| {item['noise_score']:.4f} "
            f"| {item['layer_count']} "
            f"| {item['total_entities']} "
            f"| {item['annotation_ratio']:.4f} "
            f"| {item['context_ratio_estimate']:.4f} "
            f"| `{item['file']}` |"
        )

    if errors:
        lines.append("")
        lines.append("## Errors")
        lines.append("")
        for err in errors:
            lines.append(f"- `{err['file']}` → `{err['error']}`")

    with open(summary_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print("\nTop ranked candidates:\n")
    for item in results[:20]:
        print(
            f"{item['progressive_rank']:02d} | "
            f"{item['progressive_phase']:<12} | "
            f"{item['system_family']:<15} | "
            f"score={item['noise_score']:<8} | "
            f"layers={item['layer_count']:<3} | "
            f"entities={item['total_entities']:<4} | "
            f"{item['file']}"
        )

    print("\nWrote:")
    print(f"  {ranking_path.as_posix()}")
    print(f"  {summary_path.as_posix()}")
    print(f"  {error_path.as_posix()}")

if __name__ == "__main__":
    main()