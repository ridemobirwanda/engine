@echo off
echo ========================================================
echo    IMPORTING YOUR SUPABASE DATABASE TO MYSQL
echo ========================================================
echo.

set /p password="Enter your MySQL password (yourpass): "

if "%password%"=="" (
    echo Error: Password cannot be empty!
    pause
    exit /b 1
)

set MYSQL_PASSWORD=%password%

echo.
echo Importing data...
echo.

node fix-and-import-enginedb.js

echo.
pause

