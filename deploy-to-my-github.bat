@echo off
echo ================================================
echo  Deploy to YOUR GitHub Repository
echo  https://github.com/mobiride123/enginemarkets.git
echo ================================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo [ERROR] dist folder not found!
    echo.
    echo Building production files now...
    call npm run build
    
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed!
        pause
        exit /b 1
    )
)

echo [✓] dist folder found
echo.

REM Create deployment directory
set DEPLOY_DIR=..\enginemarkets-deploy

echo [Step 1] Creating deployment directory...
if exist "%DEPLOY_DIR%\" (
    echo Cleaning existing deployment directory...
    rmdir /S /Q "%DEPLOY_DIR%"
)
mkdir "%DEPLOY_DIR%"

echo [Step 2] Copying dist files...
xcopy /E /I /Y dist\* "%DEPLOY_DIR%\"

echo [Step 3] Setting up Git repository...
cd "%DEPLOY_DIR%"

REM Create README
echo # EngineMarkets - Production Build > README.md
echo. >> README.md
echo This repository contains the production build of EngineMarkets. >> README.md
echo. >> README.md
echo ## Live Site >> README.md
echo Deployed to Cloudflare Pages >> README.md
echo. >> README.md
echo ## Last Updated >> README.md
echo %date% at %time% >> README.md

REM Create .gitignore
echo .DS_Store > .gitignore
echo Thumbs.db >> .gitignore
echo *.log >> .gitignore

REM Create _redirects for SPA routing
echo /*    /index.html    200 > _redirects

echo [Step 4] Initializing Git...
git init

echo [Step 5] Adding remote repository...
git remote add origin https://github.com/mobiride123/enginemarkets.git

REM Check if remote already exists
git remote -v

echo [Step 6] Creating initial commit...
git add .
git commit -m "Production build - %date% %time%"

echo [Step 7] Setting main branch...
git branch -M main

echo.
echo ================================================
echo  Ready to Push!
echo ================================================
echo.
echo Repository: https://github.com/mobiride123/enginemarkets.git
echo Branch: main
echo.
echo [IMPORTANT] You will need:
echo  1. GitHub username
echo  2. GitHub password or Personal Access Token
echo  3. Repository must exist at: https://github.com/mobiride123/enginemarkets
echo.
set /p CONFIRM="Push to GitHub now? (Y/N): "

if /i "%CONFIRM%"=="Y" (
    echo.
    echo Pushing to GitHub...
    git push -u origin main --force
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ================================================
        echo  ✓✓✓ SUCCESS! ✓✓✓
        echo ================================================
        echo.
        echo Your code is now on GitHub!
        echo Repository: https://github.com/mobiride123/enginemarkets
        echo.
        echo Next steps:
        echo 1. Go to https://dash.cloudflare.com
        echo 2. Workers ^& Pages → Create Application
        echo 3. Connect to Git → Select enginemarkets repository
        echo 4. Build settings: Leave empty (already built)
        echo 5. Deploy!
        echo.
        echo Your site will be live at: https://enginemarkets.pages.dev
        echo.
    ) else (
        echo.
        echo [ERROR] Push failed!
        echo.
        echo Possible issues:
        echo 1. SSH key not configured
        echo 2. Repository doesn't exist
        echo 3. No permission to push
        echo.
        echo Run this manually:
        echo   cd "%DEPLOY_DIR%"
        echo   git push -u origin main
        echo.
    )
) else (
    echo.
    echo Push canceled. To push manually later:
    echo   cd "%DEPLOY_DIR%"
    echo   git push -u origin main
    echo.
)

pause

