@echo off
echo ================================================
echo  BUILD AND DEPLOY TO GITHUB - ONE COMMAND
echo ================================================
echo.
echo This will:
echo 1. Build production files (2-5 minutes)
echo 2. Push to git@github.com:mobiride123/enginemarkets.git
echo.
echo IMPORTANT: Do NOT cancel the build! Be patient!
echo.
pause

echo.
echo ================================================
echo  STEP 1: Building Production Files
echo ================================================
echo.
echo Please wait 2-5 minutes... Do NOT close this window!
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ================================================
    echo  BUILD FAILED!
    echo ================================================
    echo.
    echo Check the errors above and fix them first.
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo  ✓✓✓ BUILD SUCCESS! ✓✓✓
echo ================================================
echo.
pause

echo.
echo ================================================
echo  STEP 2: Deploying to GitHub
echo ================================================
echo.

call deploy-to-my-github.bat

