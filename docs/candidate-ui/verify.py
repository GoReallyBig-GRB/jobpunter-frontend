"""Verify archived handoff files without third-party dependencies."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
for name, expected in manifest["files"].items():
    actual = hashlib.sha256((root / name).read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit(f"Checksum mismatch: {name}. Review intentional edits and update manifest.")
register = json.loads((root / "gap-register.json").read_text(encoding="utf-8"))
ids = [gap["id"] for gap in register["gaps"]]
assert len(ids) == len(set(ids)), "Duplicate gap IDs"
assert all(gap["status"] in register["allowed_statuses"] for gap in register["gaps"])
print(f"Verified {len(manifest['files'])} file checksums and {len(ids)} gap records.")
