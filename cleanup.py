"""Cleanup script for nutri-mood-ai project.

This script removes common "junk" folders and files that are not needed for running the Flask app
(e.g., virtualenv folders, __pycache__, documentation, and unused helper scripts).

Usage:
  python cleanup.py            # run deletion (asks for confirmation)
  python cleanup.py --dry-run  # show what would be removed without deleting
  python cleanup.py --yes      # run without prompting

Options:
  --keep-readme        Keep README.md when deleting markdown docs.
  --keep-docs          Skip deleting markdown docs.
  --keep-scripts       Skip deleting known unused helper scripts.

WARNING: This script deletes files. Use --dry-run first to review what will be removed.
"""

import argparse
import os
import pathlib
import shutil
import sys


def find_matches(root: pathlib.Path, patterns):
    for pattern in patterns:
        for path in root.rglob(pattern):
            yield path


def confirm(prompt: str) -> bool:
    resp = input(f"{prompt} [y/N]: ").strip().lower()
    return resp in ("y", "yes")


def main(argv=None):
    parser = argparse.ArgumentParser(description="Cleanup unneeded files/folders in the nutri-mood-ai project.")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be removed without deleting anything.")
    parser.add_argument("--yes", action="store_true", help="Proceed without prompting.")
    parser.add_argument("--keep-readme", action="store_true", help="Keep README.md when removing markdown docs.")
    parser.add_argument("--keep-docs", action="store_true", help="Do not remove any markdown/docs files.")
    parser.add_argument("--keep-scripts", action="store_true", help="Do not remove helper scripts (main.py, voice_emotion.py, etc.).")

    args = parser.parse_args(argv)

    root = pathlib.Path(__file__).resolve().parent

    dirs_to_remove = [
        ".venv",
        ".venv-1",
        "venv",
        "venv_fresh",
        "__pycache__",
        "build",
        "dist",
        "*.egg-info",
    ]

    patterns_to_remove = []
    if not args.keep_docs:
        patterns_to_remove += ["*.md", "*.markdown"]

    scripts_to_remove = []
    if not args.keep_scripts:
        scripts_to_remove += [
            "main.py",
            "face_emotion.py",
            "voice_emotion.py",
            "emotion_report.py",
        ]

    # Always keep README, unless explicitly allowed.
    keep_paths = set()
    if args.keep_readme:
        keep_paths.add(root / "README.md")

    candidates = []

    # Directories
    for d in dirs_to_remove:
        # allow glob patterns for egg-info
        if "*" in d or "?" in d:
            for match in root.glob(d):
                candidates.append(match)
        else:
            candidates.append(root / d)

    # Patterns (docs)
    for path in find_matches(root, patterns_to_remove):
        if path in keep_paths:
            continue
        candidates.append(path)

    # Scripts
    for s in scripts_to_remove:
        candidates.append(root / s)

    candidates = [p for p in candidates if p.exists()]

    if not candidates:
        print("Nothing to remove. Your project already looks clean.")
        return 0

    print("The following paths are eligible for removal:")
    for p in sorted(set(candidates)):
        print("  ", p.relative_to(root))
    print()

    if args.dry_run:
        print("Dry run enabled; no files will be deleted.")
        return 0

    if not args.yes and not confirm("Proceed with deletion?"):
        print("Aborted.")
        return 0

    for p in set(candidates):
        try:
            if p.is_dir():
                shutil.rmtree(p)
            else:
                p.unlink()
            print(f"Removed: {p.relative_to(root)}")
        except Exception as e:
            print(f"Failed to remove {p.relative_to(root)}: {e}")

    print("Cleanup complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
