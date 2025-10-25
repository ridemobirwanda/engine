@echo off
echo ========================================================
echo    COMPLETE DATABASE IMPORT - FIXING ALL ISSUES
echo ========================================================
echo.

set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo Settings:
echo   Host: %MYSQL_HOST%
echo   User: %MYSQL_USER%
echo   Database: %MYSQL_DATABASE%
echo.
echo Starting import...
echo.

node recreate-and-import.js

if errorlevel 1 (
    echo.
    echo ❌ Import failed! Check the error above.
) else (
    echo.
    echo ✅ Import completed successfully!
    echo.
    echo Next: Start your servers!
    echo   1. Run: npm run api
    echo   2. Run: npm run dev
    echo   3. Visit: http://localhost:21201/admin/login
    echo   4. Login: admin@admin.com / admin123
)

echo.
pause

