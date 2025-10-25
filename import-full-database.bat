@echo off
echo ========================================================
echo    IMPORT COMPLETE SUPABASE DATABASE
echo ========================================================
echo.
echo This will:
echo   1. Drop existing tables
echo   2. Recreate with proper Supabase schema
echo   3. Import all your data (28 products + everything)
echo.

set /p password="Enter your MySQL password (yourpass): "

if "%password%"=="" (
    echo Error: Password cannot be empty!
    pause
    exit /b 1
)

set MYSQL_PASSWORD=%password%

echo.
echo Starting import...
echo.

node recreate-and-import.js

echo.
pause

