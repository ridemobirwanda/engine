@echo off
echo ================================================
echo  Update GitHub Repository
echo  git@github.com:mobiride123/enginemarkets.git
echo ================================================
echo.

REM Build latest version
echo [Step 1] Building latest production files...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo [✓] Build successful
echo.

set DEPLOY_DIR=..\enginemarkets-deploy

REM Check if deployment directory exists
if not exist "%DEPLOY_DIR%\" (
    echo [ERROR] Deployment directory not found!
    echo Please run: deploy-to-my-github.bat first
    pause
    exit /b 1
)

echo [Step 2] Updating files in deployment directory...
cd "%DEPLOY_DIR%"

REM Remove old files (except .git)
for /D %%d in (*) do (
    if /i not "%%d"==".git" (
        rmdir /S /Q "%%d"
    )
)
del /Q * 2>nul

echo [Step 3] Copying new dist files...
xcopy /E /I /Y ..\projmsql\dist\* .

REM Update README
echo # EngineMarkets - Production Build > README.md
echo. >> README.md
echo Updated: %date% at %time% >> README.md

REM Ensure _redirects exists
echo /*    /index.html    200 > _redirects

echo [Step 4] Committing changes...
git add .
git commit -m "Update build - %date% %time%"

echo [Step 5] Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo  ✓✓✓ UPDATE SUCCESSFUL! ✓✓✓
    echo ================================================
    echo.
    echo GitHub repository updated!
    echo Cloudflare will auto-deploy in 1-2 minutes.
    echo.
) else (
    echo.
    echo [ERROR] Push failed!
    echo Please check your internet connection and GitHub access.
    echo.
)

pause

