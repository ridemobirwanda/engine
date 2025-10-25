@echo off
echo ================================================
echo  Deploy DIST folder to GitHub
echo ================================================
echo.

REM Check if dist folder exists
if not exist "dist\" (
    echo [ERROR] dist folder not found!
    echo Please run: npm run build
    pause
    exit /b 1
)

echo [Step 1] Creating deployment directory...
if not exist "..\enginemarket-dist\" (
    mkdir ..\enginemarket-dist
)

echo [Step 2] Copying dist files...
xcopy /E /I /Y dist\* ..\enginemarket-dist\

echo [Step 3] Creating .gitignore...
cd ..\enginemarket-dist
echo node_modules/ > .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore

echo [Step 4] Creating README...
(
echo # EngineMarket - Production Build
echo.
echo This repository contains the production build of EngineMarket.
echo.
echo ## Deployment
echo This is automatically deployed to Cloudflare Pages.
echo.
echo ## Last Build
echo Built on: %date% %time%
) > README.md

echo [Step 5] Initializing Git (if needed)...
if not exist ".git\" (
    git init
    git branch -M main
)

echo [Step 6] Committing changes...
git add .
git commit -m "Production build - %date% %time%"

echo.
echo ================================================
echo  SUCCESS! Files are ready to push
echo ================================================
echo.
echo Next steps:
echo 1. Create GitHub repository: https://github.com/new
echo 2. Name it: enginemarket-dist
echo 3. Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/enginemarket-dist.git
echo    git push -u origin main
echo.
echo Or if already setup:
echo    git push
echo.
pause

