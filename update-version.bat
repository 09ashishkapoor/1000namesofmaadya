@echo off
REM =====================================================
REM Manual Version Updater (single robust copy only)
REM =====================================================
@echo off
REM =====================================================
REM Manual Version Updater (Robust)
REM - Controls `version` and `buildDate` fields in version.json
REM - Usage:
REM    update-version.bat            -> increment minor version (default) and set buildDate to today
REM    update-version.bat --minor    -> increment minor
REM    update-version.bat --patch    -> increment patch
REM    update-version.bat --major    -> increment major
REM    update-version.bat 1.8.2      -> set exact version
REM    update-version.bat --date YYYY-MM-DD  -> set explicit build date (optional second arg when setting version)
REM Notes:
REM - This script updates both `version` and `buildDate` in-place and preserves other fields.
REM - It DOES NOT commit or push changes; commit manually when ready.
REM =====================================================

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    Manual Version Update Tool (Robust)
echo ==========================================
echo.

REM Get current directory
set "SCRIPT_DIR=%~dp0"
set "VERSION_FILE=%SCRIPT_DIR%version.json"

REM Check if version.json exists
if not exist "%VERSION_FILE%" (
    echo ERROR: version.json not found!
    echo Expected location: %VERSION_FILE%
    exit /b 1
)

REM Read current version from version.json
for /f "delims=" %%a in ('powershell -NoProfile -Command "try{ (Get-Content -Raw '%VERSION_FILE%' | ConvertFrom-Json).version } catch { write-host '' }"') do set "CURRENT_VERSION=%%a"

if "%CURRENT_VERSION%"=="" (
    echo WARNING: current version not found in version.json; defaulting to 0.0.0
    set "CURRENT_VERSION=0.0.0"
)

echo Current Version: %CURRENT_VERSION%

REM Default operation
set "OP=minor"
set "SET_VERSION="
set "EXPLICIT_DATE="

REM Parse args
if not "%~1"=="" (
    if "%~1"=="--minor" set "OP=minor"
    if "%~1"=="--patch" set "OP=patch"
    if "%~1"=="--major" set "OP=major"
    if "%~1"=="--date" (
        if not "%~2"=="" set "EXPLICIT_DATE=%~2"
    )
    rem if arg starts with digit, treat as set-version
    echo %~1 | findstr /r "^[0-9]" >nul 2>&1 && (set "OP=set" & set "SET_VERSION=%~1")
)

REM Validate explicit date if provided (YYYY-MM-DD)
if not "%EXPLICIT_DATE%"=="" (
    echo %EXPLICIT_DATE% | findstr /r "^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$" >nul 2>&1
    if errorlevel 1 (
        echo ERROR: --date must be in YYYY-MM-DD format. Received: %EXPLICIT_DATE%
        exit /b 1
    )
)

REM Use the PowerShell helper `update-version.ps1` to compute & update version.json reliably
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update-version.ps1" "%OP%" "%SET_VERSION%" "%EXPLICIT_DATE%" "%VERSION_FILE%"
if not "%ERRORLEVEL%"=="0" (
    echo ERROR: PowerShell script failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
goto :END
set "TMP_PS1=%TEMP%\update-version-%RANDOM%.ps1"
powershell -NoProfile -Command "Set-Content -Path '%TMP_PS1%' -Value @'
Param(
 [string]$currentVersion,
 [string]$op,
 [string]$setVersion,
 [string]$explicitDate,
 [string]$versionFile
)
if ([string]::IsNullOrWhiteSpace($currentVersion)) { $currentVersion = '0.0.0' }
$parts = $currentVersion.Split('.') | ForEach-Object { try { [int]$_ } catch { 0 } }
while ($parts.Count -lt 3) { $parts += 0 }
$major = $parts[0]; $minor = $parts[1]; $patch = $parts[2];
switch ($op) {
 'major' { $major += 1; $minor = 0; $patch = 0 }
 'minor' { $minor += 1; $patch = 0 }
 'patch' { $patch += 1 }
 'set' {
    if ($setVersion -match '^[0-9]+(\\.[0-9]+){0,2}$') {
        $vparts = $setVersion.Split('.') | ForEach-Object { [int]$_ }
        while ($vparts.Count -lt 3) { $vparts += 0 }
        $major = $vparts[0]; $minor = $vparts[1]; $patch = $vparts[2]
    } else { Write-Error 'Invalid version format'; exit 2 }
 }
 default { $minor += 1; $patch = 0 }
}
$newVersion = '{0}.{1}.{2}' -f $major,$minor,$patch
if ($explicitDate -and $explicitDate -match '^\d{4}-\d{2}-\d{2}$') { $newDate = $explicitDate } else { $newDate = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd') }
try { $json = Get-Content -Raw $versionFile | ConvertFrom-Json } catch { $json = [PSCustomObject]@{ version = $null; buildDate = $null } }
$json.version = $newVersion
$json.buildDate = $newDate
($json | ConvertTo-Json -Depth 10) | Set-Content -Path $versionFile -Encoding UTF8
($json | Select-Object version, buildDate | ConvertTo-Json -Depth 2) | Write-Output
exit 0
'@ -Encoding UTF8" 2>nul

set "TMP_OUT=%TEMP%\update-version-out-%RANDOM%.txt"
powershell -NoProfile -ExecutionPolicy Bypass -File "%TMP_PS1%" "%CURRENT_VERSION%" "%OP%" "%SET_VERSION%" "%EXPLICIT_DATE%" "%VERSION_FILE%" > "%TMP_OUT%" 2>&1
set "PS_EXIT=%ERRORLEVEL%"
type "%TMP_OUT%"
del "%TMP_PS1%"
del "%TMP_OUT%"
if not "%PS_EXIT%"=="0" (
    echo ERROR: PowerShell script failed.
    exit /b %PS_EXIT%
)

REM Determine build date (explicit or today UTC)
if not "%EXPLICIT_DATE%"=="" (
    set "NEW_DATE=%EXPLICIT_DATE%"
) else (
    for /f "delims=" %%d in ('powershell -NoProfile -Command "(Get-Date).ToUniversalTime().ToString(''yyyy-MM-dd'')"') do set "NEW_DATE=%%d"
)

echo New Version: %NEW_VERSION%
echo New Build Date: %NEW_DATE%

REM Read updated values from version.json for final confirmation
for /f "delims=" %%a in ('powershell -NoProfile -Command "try{ (Get-Content -Raw '%VERSION_FILE%' | ConvertFrom-Json).version } catch { write-host '' }"') do set "NEW_VERSION=%%a"
for /f "delims=" %%a in ('powershell -NoProfile -Command "try{ (Get-Content -Raw '%VERSION_FILE%' | ConvertFrom-Json).buildDate } catch { write-host '' }"') do set "NEW_DATE=%%a"

if "%NEW_VERSION%"=="" (
    echo ERROR: Failed to update version.json
    exit /b 1
)

echo.
echo ==========================================
echo SUCCESS: version and buildDate updated in version.json
echo ==========================================
echo Updated Version: %NEW_VERSION%
echo Updated Build Date (UTC): %NEW_DATE%
echo Note: This script does NOT commit or push changes. Commit manually when ready.
echo.
powershell -NoProfile -Command "try { (Get-Content -Raw '%VERSION_FILE%' | ConvertFrom-Json) | Select-Object version, buildDate | ConvertTo-Json -Depth 2 | Write-Output } catch { Write-Error 'Unable to read version.json' }"
:END
exit /b 0
