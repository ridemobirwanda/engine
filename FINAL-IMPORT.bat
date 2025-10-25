@echo off
cls
echo.
echo ============================================================
echo          FINAL DATABASE IMPORT - FIX ALL ISSUES
echo ============================================================
echo.
echo This will:
echo   1. Drop old tables with wrong schemas
echo   2. Create fresh tables with correct Supabase schemas  
echo   3. Import all 28 products + data
echo   4. Create auth tables and default admin
echo.
echo Press CTRL+C to cancel, or
pause

set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo.
echo ============================================================
echo.
echo Running import...
echo.

node recreate-and-import.js

echo.
echo ============================================================
echo.

if errorlevel 1 (
    echo ❌ IMPORT FAILED!
    echo.
    echo Check the error messages above.
    echo.
) else (
    echo.
    echo ✅ IMPORT COMPLETE!
    echo.
    echo ============================================================
    echo   NEXT STEPS:
    echo ============================================================
    echo.
    echo 1. CLOSE the current API server (if running)
    echo.
    echo 2. START API SERVER (Terminal 1):
    echo    npm run api
    echo.
    echo 3. REFRESH your browser page (F5)
    echo.
    echo 4. LOGIN with:
    echo    Email: admin@admin.com
    echo    Password: admin123
    echo.
    echo 5. CHECK PRODUCTS:
    echo    http://localhost:21201/admin/products
    echo.
    echo ============================================================
)

echo.
pause

