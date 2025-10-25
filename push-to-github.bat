@echo off
REM Push DIST folder to GitHub

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          Pushing DIST to GitHub                               ║
echo ║          https://github.com/ridemobirwanda/engine.git         ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo ❌ ERROR: dist folder not found!
    pause
    exit /b 1
)

echo ✅ dist folder found
echo.

REM Navigate to dist folder
cd dist

REM Initialize Git
echo 📝 Initializing Git...
git init
git branch -M main

echo.
echo 📝 Adding all files...
git add .

echo.
echo 📝 Committing files...
git commit -m "Initial commit - Production build"

echo.
echo 📝 Adding remote...
git remote add origin https://github.com/ridemobirwanda/engine.git

echo.
echo 📝 Pushing to GitHub...
echo.
echo ⚠️  You will be asked for your GitHub credentials:
echo    - Username: ridemobirwanda
echo    - Password: your Personal Access Token
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
    echo ║  https://github.com/ridemobirwanda/engine                    ║
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

