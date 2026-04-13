# AI Outsourcing Studio — Windows / PowerShell installer
#
#   irm https://raw.githubusercontent.com/<user>/<repo>/main/install.ps1 | iex
#   iex "& { $(irm https://raw.githubusercontent.com/<user>/<repo>/main/install.ps1) } -Target ./my-startup -Force"
#
# Replace <user>/<repo> with your GitHub repo path before publishing.

[CmdletBinding()]
param(
  [string]$Target = ".",
  [string]$Repo   = $env:AOS_REPO,
  [string]$Ref    = $env:AOS_REF,
  [switch]$Force
)

if (-not $Repo) { $Repo = "yourname/ai-outsourcing-studio" }
if (-not $Ref)  { $Ref  = "main" }

$ErrorActionPreference = "Stop"
$ArchiveUrl = "https://codeload.github.com/$Repo/tar.gz/$Ref"

# preflight
foreach ($cmd in @("tar")) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Write-Error "missing required tool: $cmd (Windows 10+ ships with tar.exe)"
    exit 1
  }
}

if (-not (Test-Path $Target)) { New-Item -ItemType Directory -Path $Target | Out-Null }
$AbsTarget = (Resolve-Path $Target).Path

$collisions = @()
foreach ($p in @("CLAUDE.md", "AGENTS.md", "GEMINI.md", ".claude", ".company", ".gemini", ".cursor", "scripts", ".mcp.json", ".gitignore", "README.md")) {
  if (Test-Path (Join-Path $AbsTarget $p)) { $collisions += $p }
}
if ($collisions.Count -gt 0 -and -not $Force) {
  Write-Host "The target directory already contains studio files:" -ForegroundColor Red
  Write-Host "  $AbsTarget" -ForegroundColor Red
  $collisions | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
  Write-Host ""
  Write-Host "Re-run with -Force to overwrite, or pick a different directory." -ForegroundColor Yellow
  exit 1
}

# download
$Tmp = Join-Path $env:TEMP ("aos-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $Tmp | Out-Null
try {
  Write-Host "-> downloading $Repo@$Ref"
  Invoke-WebRequest -Uri $ArchiveUrl -OutFile (Join-Path $Tmp "src.tar.gz") -UseBasicParsing

  Write-Host "-> extracting"
  & tar -xzf (Join-Path $Tmp "src.tar.gz") -C $Tmp
  if ($LASTEXITCODE -ne 0) { throw "tar extraction failed" }

  $SrcDir = Get-ChildItem -Path $Tmp -Directory | Where-Object { $_.Name -match "-" } | Select-Object -First 1
  if (-not $SrcDir -or -not (Test-Path (Join-Path $SrcDir.FullName "template"))) {
    throw "extracted archive missing template/ directory"
  }
  $Tpl = Join-Path $SrcDir.FullName "template"

  Write-Host "-> installing into $AbsTarget"
  Copy-Item -Recurse -Force (Join-Path $Tpl "_claude")   (Join-Path $AbsTarget ".claude")
  Copy-Item -Recurse -Force (Join-Path $Tpl "_company")  (Join-Path $AbsTarget ".company")
  Copy-Item -Recurse -Force (Join-Path $Tpl "_gemini")   (Join-Path $AbsTarget ".gemini")
  Copy-Item -Recurse -Force (Join-Path $Tpl "_cursor")   (Join-Path $AbsTarget ".cursor")
  Copy-Item -Recurse -Force (Join-Path $Tpl "scripts")   (Join-Path $AbsTarget "scripts")
  Copy-Item        -Force (Join-Path $Tpl "CLAUDE.md") (Join-Path $AbsTarget "CLAUDE.md")
  Copy-Item        -Force (Join-Path $Tpl "AGENTS.md") (Join-Path $AbsTarget "AGENTS.md")
  Copy-Item        -Force (Join-Path $Tpl "GEMINI.md") (Join-Path $AbsTarget "GEMINI.md")
  Copy-Item        -Force (Join-Path $Tpl "README.md") (Join-Path $AbsTarget "README.md")
  Copy-Item        -Force (Join-Path $Tpl "mcp.json")  (Join-Path $AbsTarget ".mcp.json")
  Copy-Item        -Force (Join-Path $Tpl "gitignore") (Join-Path $AbsTarget ".gitignore")
}
finally {
  Remove-Item -Recurse -Force $Tmp -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "✓ AI Outsourcing Studio installed." -ForegroundColor Green
Write-Host "  Location: $AbsTarget"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  cd `"$AbsTarget`""
Write-Host "  claude"
Write-Host "  /aos-idea `"your product pitch`""
Write-Host ""
Write-Host "Then watch the company work via /aos-board and /aos-tasks."
