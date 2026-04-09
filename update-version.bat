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

:END
exit /b 0
