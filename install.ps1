# AI Outsourcing Studio — PowerShell one-line installer
#
#   irm https://raw.githubusercontent.com/yourname/ai-outsourcing-studio/main/install.ps1 | iex
#
# Installs into your global ~/.claude/ directory (not into the current project).
# Requires Node.js >= 18 for the npx wrapper.

$ErrorActionPreference = "Stop"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js >= 18 is required but 'node' was not found on PATH. Install from https://nodejs.org/ and re-run."
    exit 1
}

# Default command is 'install'; callers can prepend args via
#   & ([scriptblock]::Create((irm .../install.ps1))) update
$argList = if ($args.Count -eq 0) { @("install") } else { $args }

& npx --yes ai-outsourcing-studio@latest @argList
exit $LASTEXITCODE
