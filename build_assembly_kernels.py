import json
from pathlib import Path

INPUT_DIR = Path("source/barrett/processed_json")
OUTPUT_DIR = Path("kernels/assemblies")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def build_kernel(data):

    filename = data["source_file"]

    parts = filename.replace(".dxf", "").split("-")

    manufacturer = parts[4]
    system = parts[5]
    condition = parts[6]

    kernel = {
        "kernel_type": "assembly_detail",
        "manufacturer": manufacturer,
        "system": system,
        "condition": condition,
        "source_file": filename,
        "entity_count": data["entity_count"],
        "layers": data["layers"]
    }

    return kernel


def main():

    count = 0

    for file in INPUT_DIR.glob("*.json"):

        with open(file) as f:
            data = json.load(f)

        kernel = build_kernel(data)

        output_file = OUTPUT_DIR / (file.stem + ".kernel.json")

        with open(output_file, "w") as f:
            json.dump(kernel, f, indent=2)

        print("Kernel built:", file.name)

        count += 1

    print("")
    print("Finished building", count, "assembly kernels")


if __name__ == "__main__":
    main()