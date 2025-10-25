@echo off
echo ========================================
echo   INSTALLING DEPENDENCIES
echo ========================================
echo.
echo This will install all required packages.
echo Time: 2-3 minutes
echo Size: ~500MB
echo.
echo ========================================
pause

echo.
echo Installing...
echo.

npm install

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   INSTALLATION COMPLETE!
    echo ========================================
    echo.
    echo ✅ All dependencies installed
    echo.
    echo Next Steps:
    echo    1. Run: START-PROJECT.bat
    echo    2. Open: http://localhost:21201/
    echo    3. Login: admin@admin.com / admin123
    echo.
) else (
    echo   INSTALLATION FAILED
    echo ========================================
    echo.
    echo ❌ Installation encountered errors
    echo.
    echo Try:
    echo    1. Delete node_modules folder
    echo    2. Run this script again
    echo.
)
echo ========================================
pause


