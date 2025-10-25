@echo off
echo ========================================
echo   CLEAN INSTALL (Remove Supabase)
echo ========================================
echo.
echo This will:
echo  1. Remove old Supabase files
echo  2. Reinstall clean dependencies
echo.
echo ========================================
pause

echo.
echo [1/2] Removing old Supabase files...
if exist "node_modules\supabase" (
    echo     Removing supabase folder...
    rmdir /s /q "node_modules\supabase" 2>nul
    echo     ✅ Removed
) else (
    echo     ℹ️  No supabase folder found
)

if exist "node_modules\@supabase" (
    echo     Removing @supabase folder...
    rmdir /s /q "node_modules\@supabase" 2>nul
    echo     ✅ Removed
) else (
    echo     ℹ️  No @supabase folder found
)

echo.
echo [2/2] Installing clean dependencies...
npm install --legacy-peer-deps

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo   CLEAN INSTALL COMPLETE!
    echo ========================================
    echo.
    echo ✅ All dependencies installed
    echo ✅ No Supabase packages
    echo.
    echo Next Steps:
    echo    1. Run: START-PROJECT.bat
    echo    2. Open: http://localhost:21201/
    echo.
) else (
    echo   INSTALLATION FAILED
    echo ========================================
    echo.
    echo Try running again or delete node_modules manually
    echo.
)
echo ========================================
pause


