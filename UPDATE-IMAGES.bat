@echo off
echo ========================================
echo    UPDATE PRODUCTS WITH LOCAL IMAGES
echo ========================================
echo.

REM Set MySQL connection details
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo Starting image update...
echo.

node update-local-images.js

echo.
echo ========================================
echo Done! Press any key to exit...
pause >nul

