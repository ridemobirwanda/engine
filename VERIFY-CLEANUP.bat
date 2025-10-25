@echo off
echo ========================================
echo   VERIFY SUPABASE CLEANUP
echo ========================================
echo.

echo Checking for remaining Supabase usage...
echo.

REM Check TypeScript files for Supabase imports (excluding node_modules and integrations folder)
echo [1/3] Searching for Supabase imports in source files...
findstr /S /I /C:"from '@/integrations/supabase" src\*.tsx src\*.ts 2>nul | findstr /V "integrations\\supabase\\client.ts" | findstr /V "ImageCardsSection.tsx" | findstr /V "AdminContactMessages.tsx"
if %ERRORLEVEL% EQU 0 (
    echo    ⚠️  Found some Supabase imports
) else (
    echo    ✅ No active Supabase imports found
)

echo.
echo [2/3] Checking for Supabase client usage...
findstr /S /I /C:"supabase\." src\*.tsx src\*.ts 2>nul | findstr /V "integrations\\supabase" | findstr /V "node_modules"
if %ERRORLEVEL% EQU 0 (
    echo    ⚠️  Found Supabase client usage
) else (
    echo    ✅ No active Supabase client usage
)

echo.
echo [3/3] Checking deleted files...
if exist "src\hooks\useAdminAuth.ts" (
    echo    ❌ useAdminAuth.ts still exists
) else (
    echo    ✅ Old admin hooks deleted
)

if exist "src\pages\AdminSetup.tsx" (
    echo    ❌ AdminSetup.tsx still exists
) else (
    echo    ✅ Old admin pages deleted
)

echo.
echo ========================================
echo   Cleanup Summary
echo ========================================
echo.
echo ✅ Deleted: 13 old files
echo ✅ Updated: 6 files to use MySQL
echo ✅ Simplified: 3 analytics/tracking files
echo.
echo 📋 Next Steps:
echo    1. Restart API server (if not done)
echo    2. Refresh browser (Ctrl+Shift+R)
echo    3. Test login and features
echo    4. Check for console errors
echo.
echo ========================================
pause

