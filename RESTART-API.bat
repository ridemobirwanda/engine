@echo off
echo ========================================
echo    RESTARTING API SERVER
echo ========================================
echo.

REM Set MySQL connection details
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo.
echo Starting API server on port 3001...
echo Press Ctrl+C to stop the server
echo.

node server/index.js

