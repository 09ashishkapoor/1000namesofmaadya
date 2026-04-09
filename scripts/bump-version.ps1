# scripts/bump-version.ps1
# PowerShell script to increment minor version in version.json and commit the change with [skip version]

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$vfile = Join-Path $repoRoot 'public/version.json'

if (-not (Test-Path $vfile)) {
    Write-Error "version.json not found at $vfile"
    exit 1
}

$json = Get-Content -Raw -Path $vfile | ConvertFrom-Json
if (-not $json.version) { $json.version = '1.1' }

$parts = $json.version -split '\.'
$major = [int]$parts[0]
$minor = if ($parts.Count -gt 1) { [int]$parts[1] } else { 0 }
$newMinor = $minor + 1
$newVersion = "$major.$newMinor"
$buildDate = (Get-Date).ToString('yyyy-MM-dd')

$newObj = @{
    version   = $newVersion
    buildDate = $buildDate
}

# Write new version.json
$newObj | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 -Path $vfile
Write-Output "version.json updated to $newVersion ($buildDate)"

# Stage and commit
try {
    git add public/version.json
    git commit -m "chore: auto-increment version to $newVersion [skip version]" | Out-Null
    Write-Output "Committed version bump to $newVersion"
} catch {
    Write-Warning "No commit made (maybe no changes) or git not available: $_"
}
