@echo off
echo ================================================
echo  Export MySQL Database for Cloudflare
echo ================================================
echo.

set DB_NAME=enginedb
set DB_USER=root
set OUTPUT_FILE=enginedb-cloudflare-export.sql

echo Database: %DB_NAME%
echo Output: %OUTPUT_FILE%
echo.

echo [Step 1] Exporting database...
echo Enter MySQL root password when prompted:
echo.

mysqldump -u %DB_USER% -p --compatible=ansi --skip-extended-insert %DB_NAME% > %OUTPUT_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Export failed!
    echo.
    echo Troubleshooting:
    echo 1. Make sure MySQL is running
    echo 2. Check if database '%DB_NAME%' exists
    echo 3. Verify MySQL is in your PATH
    pause
    exit /b 1
)

echo.
echo ================================================
echo  SUCCESS! Database exported
echo ================================================
echo.
echo File created: %OUTPUT_FILE%
echo.

REM Get file size
for %%A in (%OUTPUT_FILE%) do set SIZE=%%~zA
echo Size: %SIZE% bytes
echo.
echo Next steps:
echo 1. Choose database hosting:
echo    - PlanetScale (recommended for MySQL)
echo    - Railway.app (easy setup)
echo    - Cloudflare D1 (requires conversion to SQLite)
echo.
echo 2. Follow instructions in: EXPORT_DATABASE_FOR_CLOUDFLARE.md
echo.
pause

