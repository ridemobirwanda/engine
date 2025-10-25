@echo off
echo ========================================
echo    KILL OLD API AND RESTART
echo ========================================
echo.

REM Kill any node processes running on port 3001
echo Killing old API server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Found process %%a, killing...
    taskkill /F /PID %%a 2>nul
)

timeout /t 2 /nobreak >nul

echo.
echo Starting fresh API server...
echo.

REM Set MySQL connection details
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo API server starting on port 3001...
echo Press Ctrl+C to stop
echo.

node server/index.js

