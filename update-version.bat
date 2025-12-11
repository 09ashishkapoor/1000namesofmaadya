@echo off
REM =====================================================
REM Manual Version Updater
REM Double-click this file to update version.json
REM with incremented build number and current date
REM =====================================================

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    Manual Version Update Tool
echo ==========================================
echo.

REM Get current directory
set "SCRIPT_DIR=%~dp0"
set "VERSION_FILE=%SCRIPT_DIR%version.json"

REM Check if version.json exists
if not exist "%VERSION_FILE%" (
    echo ERROR: version.json not found!
    echo Expected location: %VERSION_FILE%
    pause
    exit /b 1
)

REM Read current version.json
for /f "delims=" %%a in ('powershell -NoProfile -Command "(Get-Content '%VERSION_FILE%' | ConvertFrom-Json).version"') do set "CURRENT_VERSION=%%a"
for /f "delims=" %%a in ('powershell -NoProfile -Command "(Get-Content '%VERSION_FILE%' | ConvertFrom-Json).buildDate"') do set "OLD_DATE=%%a"

echo Current Version: %CURRENT_VERSION%
echo Current Build Date: %OLD_DATE%
echo.

REM Parse version and increment
for /f "tokens=1,2 delims=." %%a in ("%CURRENT_VERSION%") do (
    set "MAJOR=%%a"
    set "MINOR=%%b"
)

REM Increment minor version
set /a NEW_MINOR=%MINOR%+1
set "NEW_VERSION=%MAJOR%.%NEW_MINOR%"

REM Get current date in yyyy-MM-dd format
for /f "delims=" %%a in ('powershell -NoProfile -Command "Get-Date -Format 'yyyy-MM-dd'"') do set "NEW_DATE=%%a"

echo New Version: %NEW_VERSION%
echo New Build Date: %NEW_DATE%
echo.

REM Update version.json using PowerShell
powershell -NoProfile -Command "$json = @{version='%NEW_VERSION%'; buildDate='%NEW_DATE%'}; $json | ConvertTo-Json | Set-Content -Path '%VERSION_FILE%' -Encoding UTF8"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo SUCCESS! Version updated successfully.
    echo ==========================================
    echo.
    echo Version.json has been updated to:
    echo   Version: %NEW_VERSION%
    echo   Build Date: %NEW_DATE%
    echo.
) else (
    echo.
    echo ERROR: Failed to update version.json
    echo.
    pause
    exit /b 1
)

echo You can now commit and push your changes.
echo.
pause
