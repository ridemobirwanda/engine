@echo off
echo ========================================
echo   FINAL FIX - RESTART API SERVER
echo ========================================
echo.
echo This will:
echo  1. Kill old API server
echo  2. Start fresh with fixes for:
echo     - Images as arrays (not strings)
echo     - Prices as numbers (not strings)
echo.

REM Kill any node processes running on port 3001
echo [1/2] Stopping old API server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo [2/2] Starting fixed API server...
echo.

REM Set MySQL connection details
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo ✅ API server starting on port 3001
echo ✅ Images will be arrays
echo ✅ Prices will be numbers
echo.
echo Press Ctrl+C to stop
echo.

node server/index.js

