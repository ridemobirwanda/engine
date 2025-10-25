@echo off
REM Clear Git credentials and push with new token

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          Clearing Git Credentials                             ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Clear cached credentials
echo 📝 Clearing cached Git credentials...
git credential reject
echo host=github.com
echo protocol=https
echo.

REM Go to dist folder
cd dist

REM Remove old remote
echo 📝 Removing old remote...
git remote remove origin

REM Add new remote
echo 📝 Adding new remote...
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

