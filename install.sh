#!/usr/bin/env bash
# AI Outsourcing Studio — curl one-line installer
#
#   curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash
#   curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash -s -- --force
#   curl -fsSL https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.sh | bash -s -- uninstall
#
# Installs into your global ~/.claude/ directory (not into the current project).
# Requires Node.js ≥ 18 for the npx wrapper.

set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "error: Node.js ≥ 18 is required but 'node' was not found on PATH." >&2
  echo "  install it from https://nodejs.org/ and re-run this script." >&2
  exit 1
fi

# Pass through any args (e.g. --force, uninstall, update)
exec npx --yes ai-outsourcing-studio@latest "${@:-install}"
