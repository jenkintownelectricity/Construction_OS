from pathlib import Path
import re
import shutil

RAW_DXF = Path(r"D:\APP_CENTRAL\REPOS\Construction_OS\source\barrett\raw_dxf")
RENAMED = Path(r"D:\APP_CENTRAL\REPOS\Construction_OS\source\barrett\renamed_dxf")

RENAMED.mkdir(parents=True, exist_ok=True)

SPEC_MAP = {
    "BP": "071352",
    "RP": "071416",
    "RT250": "071413",
    "LF": "071416",
}

DETAIL_RE = re.compile(r"^(BP|RP|RT250|LF)-([A-Z]{2,3})-(\d{2}[A-Z]?)$", re.IGNORECASE)

TYPE_MAP = {
    "CO": "CORNER",
    "CJ": "CONTROLJOINT",
    "CU": "CURB",
    "EJ": "EXPANSION",
    "FO": "FOOTING",
    "JT": "JOINT",
    "PE": "PENETRATION",
    "PT": "PARAPET",
    "RA": "ROOFASSEMBLY",
    "RD": "DRAIN",
    "ST": "STACK",
    "TE": "TERMINATION",
    "TR": "TRANSITION",
    "WA": "WALL",
}

def detect_variant(detail_id: str) -> str:
    if detail_id.endswith("R"):
        return "REINF"
    return "STD"

def build_name(prefix: str, code: str, num: str) -> str:
    spec6 = SPEC_MAP[prefix]
    detail_id = f"{prefix}-{code}-{num}".upper()
    dtype = TYPE_MAP.get(code.upper(), "UNKNOWN")
    variant = detect_variant(num.upper())
    return f"202-R00-V01-{spec6}-BARR-{detail_id}-{dtype}-{variant}.dxf"

def main() -> None:
    copied = 0
    skipped = 0

    for path in RAW_DXF.rglob("*.dxf"):
        m = DETAIL_RE.match(path.stem)
        if not m:
            skipped += 1
            print(f"SKIP support/non-detail: {path.name}")
            continue

        prefix, code, num = m.groups()
        new_name = build_name(prefix.upper(), code.upper(), num.upper())

        rel_parts = path.relative_to(RAW_DXF).parts
        system_folder = rel_parts[0] if len(rel_parts) > 1 else "UNSORTED"

        target_dir = RENAMED / system_folder
        target_dir.mkdir(parents=True, exist_ok=True)

        target = target_dir / new_name
        shutil.copy2(path, target)
        copied += 1
        print(f"COPY {path.name} -> {target.name}")

    print()
    print(f"Done. Copied {copied} detail DXFs. Skipped {skipped} support files.")

if __name__ == "__main__":
    main()