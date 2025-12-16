Param(
    [string]$op = 'minor',
    [string]$setVersion = '',
    [string]$explicitDate = '',
    [string]$versionFile = "$PSScriptRoot\version.json"
)

function Pad-Version($parts) {
    while ($parts.Count -lt 3) { $parts += 0 }
    return "{0}.{1}.{2}" -f $parts[0], $parts[1], $parts[2]
}

# Read existing JSON (if any)
if (Test-Path -Path $versionFile) {
    try {
        $json = Get-Content -Raw -Path $versionFile | ConvertFrom-Json
    } catch {
        Write-Error "Failed to parse $($versionFile): $_"
        exit 2
    }
} else {
    $json = [PSCustomObject]@{ }
}

$currentVersion = if ($json.version) { $json.version.ToString() } else { '0.0.0' }

# Normalize current version
if ($currentVersion -notmatch '^[0-9]+(\.[0-9]+){0,2}$') {
    # Try to extract numeric parts
    $digits = $currentVersion -split '[^0-9]+' | Where-Object { $_ -ne '' }
    if ($digits.Count -gt 0) {
        $end = [Math]::Min(2, $digits.Count - 1)
        $currentVersion = ($digits[0..$end] -join '.')
    } else { $currentVersion = '0.0.0' }
}
$parts = $currentVersion.Split('.') | ForEach-Object { [int]$_ }
while ($parts.Count -lt 3) { $parts += 0 }
$major = $parts[0]; $minor = $parts[1]; $patch = $parts[2]

switch ($op.ToLower()) {
    'major' { $major += 1; $minor = 0; $patch = 0 }
    'minor' { $minor += 1; $patch = 0 }
    'patch' { $patch += 1 }
    'set' {
        if ($setVersion -match '^[0-9]+(\.[0-9]+){0,2}$') {
            $vparts = $setVersion.Split('.') | ForEach-Object { [int]$_ }
            while ($vparts.Count -lt 3) { $vparts += 0 }
            $major = $vparts[0]; $minor = $vparts[1]; $patch = $vparts[2]
        } else {
            Write-Error "Invalid version format for --set: $setVersion"
            exit 3
        }
    }
    default { # default is minor
        $minor += 1; $patch = 0
    }
}

$newVersion = "{0}.{1}.{2}" -f $major,$minor,$patch

# Determine date
if ($explicitDate -and ($explicitDate -match '^\d{4}-\d{2}-\d{2}$')) {
    $newDate = $explicitDate
} else {
    $newDate = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd')
}

# Apply changes
$json.version = $newVersion
$json.buildDate = $newDate

try {
    ($json | ConvertTo-Json -Depth 10) | Set-Content -Path $versionFile -Encoding UTF8
} catch {
    Write-Error "Failed to write $($versionFile): $_"
    exit 4
}

# Output human readable result and JSON confirmation
Write-Host "New Version: $newVersion"
Write-Host "New Build Date (UTC): $newDate"

try {
    $out = $json | Select-Object version, buildDate | ConvertTo-Json -Depth 2
    Write-Output $out
} catch {
    Write-Error "Unable to output confirmation JSON: $_"
}

exit 0
