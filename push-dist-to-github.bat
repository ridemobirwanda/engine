@echo off
REM Push DIST folder to GitHub

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          Push DIST Folder to GitHub                           ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo ❌ ERROR: dist folder not found!
    echo.
    echo Please run: npm run build
    echo.
    pause
    exit /b 1
)

echo ✅ dist folder found
echo.

REM Get GitHub URL
set /p GITHUB_URL="Enter your GitHub repository URL (https://github.com/USERNAME/REPO.git): "

if "%GITHUB_URL%"=="" (
    echo ❌ ERROR: GitHub URL is required!
    pause
    exit /b 1
)

echo.
echo 📝 GitHub URL: %GITHUB_URL%
echo.

REM Navigate to dist folder
cd dist

REM Check if git is already initialized
if exist ".git" (
    echo ✅ Git already initialized in dist folder
    echo.
    echo Updating remote...
    git remote remove origin 2>nul
    git remote add origin %GITHUB_URL%
) else (
    echo 📝 Initializing Git in dist folder...
    git init
    git branch -M main
    git remote add origin %GITHUB_URL%
)

echo.
echo 📝 Adding all files...
git add .

echo.
echo 📝 Committing files...
git commit -m "Production build - %date% %time%"

echo.
echo 📝 Pushing to GitHub...
echo.
echo ⚠️  You will be asked for your GitHub credentials:
echo    - Username: your GitHub username
echo    - Password: your Personal Access Token (NOT your password!)
echo.
echo 📖 To get a Personal Access Token:
echo    1. Go to: https://github.com/settings/tokens
echo    2. Click "Generate new token (classic)"
echo    3. Select "repo" permission
echo    4. Copy the token
echo    5. Paste it when asked for password
echo.
pause

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║                                                                ║
    echo ║          ✅ SUCCESS! Pushed to GitHub!                        ║
    echo ║                                                                ║
    echo ║  Your dist folder is now on GitHub!                          ║
    echo ║                                                                ║
    echo ║  Next steps:                                                  ║
    echo ║  1. Go to Cloudflare Pages: https://pages.cloudflare.com     ║
    echo ║  2. Connect your GitHub repository                           ║
    echo ║  3. Deploy!                                                  ║
    echo ║                                                                ║
    echo ╚════════════════════════════════════════════════════════════════╝
    echo.
) else (
    echo.
    echo ❌ ERROR: Failed to push to GitHub!
    echo.
    echo Troubleshooting:
    echo - Make sure you used your Personal Access Token (not password)
    echo - Make sure the token has "repo" permission
    echo - Make sure the GitHub URL is correct
    echo.
)

cd ..
pause

