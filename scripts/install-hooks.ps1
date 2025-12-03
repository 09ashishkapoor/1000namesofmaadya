# scripts/install-hooks.ps1
# Installs a post-commit hook that runs the PowerShell bump script

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$hookPath = Join-Path $repoRoot '.git\hooks\post-commit'

$hookContent = @'
#!/usr/bin/env sh
# Auto-generated post-commit hook: runs PowerShell bump script if available
REPO_ROOT="$(cd "$(dirname "$0")/.."; pwd -P)"

if command -v pwsh >/dev/null 2>&1; then
  pwsh -NoProfile -ExecutionPolicy Bypass -File "$REPO_ROOT/scripts/bump-version.ps1"
elif command -v powershell >/dev/null 2>&1; then
  powershell -NoProfile -ExecutionPolicy Bypass -File "$REPO_ROOT/scripts/bump-version.ps1"
fi
'@

# Ensure hooks directory exists
$hooksDir = Split-Path -Parent $hookPath
if (-not (Test-Path $hooksDir)) { New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null }

# Write hook
Set-Content -Path $hookPath -Value $hookContent -Encoding UTF8
# Make the hook executable if possible
try { icacls $hookPath /grant "${env:USERNAME}:(R,W)" | Out-Null } catch {}

Write-Output "Installed post-commit hook to $hookPath"
