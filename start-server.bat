@echo off
echo Starting local web server for Adya Mahakali Sahasranama...
echo.
echo Server will be available at: http://localhost:8010
echo.
echo Press Ctrl+C to stop the server
echo.

REM Change to the script's directory
cd /d "%~dp0"

REM Start Python HTTP server on port 8010
python -m http.server 8010

pause

