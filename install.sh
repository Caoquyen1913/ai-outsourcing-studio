#!/usr/bin/env bash
# AI Outsourcing Studio — one-line installer
#
#   curl -fsSL https://raw.githubusercontent.com/<user>/<repo>/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/<user>/<repo>/main/install.sh | bash -s -- ./my-startup
#   curl -fsSL https://raw.githubusercontent.com/<user>/<repo>/main/install.sh | bash -s -- ./my-startup --force
#
# Without arguments installs into the current directory.
# Replace <user>/<repo> in the URL above with your GitHub repo path before publishing.

set -euo pipefail

# ----- config -----
REPO="${AOS_REPO:-yourname/ai-outsourcing-studio}"   # override with AOS_REPO=owner/repo
REF="${AOS_REF:-main}"                                # branch / tag / commit
ARCHIVE_URL="https://codeload.github.com/${REPO}/tar.gz/${REF}"

# ----- args -----
TARGET="."
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    --help|-h)
      cat <<EOF
AI Outsourcing Studio installer

Usage:
  install.sh [target-dir] [--force]

Env vars:
  AOS_REPO=owner/repo   override source repo (default: ${REPO})
  AOS_REF=branch|tag    override ref (default: ${REF})
EOF
      exit 0
      ;;
    -*) echo "unknown flag: $arg" >&2; exit 2 ;;
    *)  TARGET="$arg" ;;
  esac
done

# ----- preflight -----
need() { command -v "$1" >/dev/null 2>&1 || { echo "missing required tool: $1" >&2; exit 1; }; }
need curl
need tar
need mkdir
need cp
need rm

mkdir -p "$TARGET"
ABS_TARGET="$(cd "$TARGET" && pwd)"

collisions=()
for p in CLAUDE.md AGENTS.md GEMINI.md .claude .company .gemini .cursor scripts .mcp.json .gitignore README.md; do
  if [ -e "$ABS_TARGET/$p" ]; then collisions+=("$p"); fi
done
if [ ${#collisions[@]} -gt 0 ] && [ "$FORCE" -ne 1 ]; then
  echo "The target directory already contains studio files:" >&2
  echo "  $ABS_TARGET" >&2
  for c in "${collisions[@]}"; do echo "  - $c" >&2; done
  echo "" >&2
  echo "Re-run with --force to overwrite, or pick a different directory." >&2
  exit 1
fi

# ----- download + extract -----
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ downloading ${REPO}@${REF}"
curl -fsSL "$ARCHIVE_URL" -o "$TMP/src.tar.gz"

echo "→ extracting"
tar -xzf "$TMP/src.tar.gz" -C "$TMP"

# Find the extracted dir (codeload names it <repo>-<ref> with slashes flattened)
SRC_DIR="$(find "$TMP" -maxdepth 1 -type d -name "*-*" | head -n 1)"
if [ -z "$SRC_DIR" ] || [ ! -d "$SRC_DIR/template" ]; then
  echo "extracted archive missing template/ directory" >&2
  exit 1
fi

# ----- copy with dot-prefix restoration -----
TPL="$SRC_DIR/template"

echo "→ installing into $ABS_TARGET"
cp -R "$TPL/_claude"   "$ABS_TARGET/.claude"
cp -R "$TPL/_company"  "$ABS_TARGET/.company"
cp -R "$TPL/_gemini"   "$ABS_TARGET/.gemini"
cp -R "$TPL/_cursor"   "$ABS_TARGET/.cursor"
cp -R "$TPL/scripts"   "$ABS_TARGET/scripts"
cp    "$TPL/CLAUDE.md" "$ABS_TARGET/CLAUDE.md"
cp    "$TPL/AGENTS.md" "$ABS_TARGET/AGENTS.md"
cp    "$TPL/GEMINI.md" "$ABS_TARGET/GEMINI.md"
cp    "$TPL/README.md" "$ABS_TARGET/README.md"
cp    "$TPL/mcp.json"  "$ABS_TARGET/.mcp.json"
cp    "$TPL/gitignore" "$ABS_TARGET/.gitignore"

# ----- done -----
cat <<EOF

✓ AI Outsourcing Studio installed.
  Location: $ABS_TARGET

Next steps:
  cd "$ABS_TARGET"
  claude
  /aos-idea "your product pitch"

Then watch the company work via /aos-board and /aos-tasks.
Read CLAUDE.md for the full operating model.
EOF
