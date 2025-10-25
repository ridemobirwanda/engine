@echo off
echo ================================================
echo  Push to GitHub - Account Selection
echo ================================================
echo.
echo You have multiple GitHub accounts on this computer.
echo.
echo Which account do you want to use?
echo.

REM Navigate to deployment directory
cd ..\enginemarkets-deploy

echo Current remote:
git remote -v
echo.

echo ================================================
echo  OPTION 1: Clear Saved Credentials
echo ================================================
echo.
echo This will make GitHub ask you to login again,
echo so you can choose which account to use.
echo.
set /p CLEAR="Clear saved credentials? (Y/N): "

if /i "%CLEAR%"=="Y" (
    echo.
    echo Clearing Windows Credential Manager...
    cmdkey /list | findstr github.com
    
    echo.
    echo Please manually remove GitHub credentials:
    echo 1. Press Windows Key
    echo 2. Search "Credential Manager"
    echo 3. Click "Windows Credentials"
    echo 4. Remove all "git:https://github.com" entries
    echo.
    pause
    
    echo.
    echo Also clearing Git credential cache...
    git config --global --unset credential.helper
    git config --local --unset credential.helper
)

echo.
echo ================================================
echo  OPTION 2: Configure Git for This Push
echo ================================================
echo.
echo Enter the GitHub username you want to use:
set /p GIT_USER="GitHub Username: "

if not "%GIT_USER%"=="" (
    echo.
    echo Setting Git user for this repository...
    git config user.name "%GIT_USER%"
    git config user.email "%GIT_USER%@users.noreply.github.com"
    
    echo.
    echo Configured:
    git config user.name
    git config user.email
)

echo.
echo ================================================
echo  Ready to Push
echo ================================================
echo.
echo Repository: https://github.com/mobiride123/enginemarkets.git
echo Branch: main
echo Account: %GIT_USER%
echo.
echo When you push, GitHub will ask for:
echo   Username: mobiride123
echo   Password: Your Personal Access Token or Password
echo.
echo If you have 2FA enabled, you MUST use a Personal Access Token:
echo   Create at: https://github.com/settings/tokens
echo.
set /p PUSH="Push to GitHub now? (Y/N): "

if /i "%PUSH%"=="Y" (
    echo.
    echo Adding remote...
    git remote remove origin 2>nul
    git remote add origin https://github.com/mobiride123/enginemarkets.git
    
    echo.
    echo Pushing to GitHub...
    echo GitHub will now ask for your credentials.
    echo.
    git push -u origin main --force
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ================================================
        echo  ✓✓✓ SUCCESS! ✓✓✓
        echo ================================================
        echo.
        echo Your code is on GitHub!
        echo https://github.com/mobiride123/enginemarkets
        echo.
        echo Next: Deploy to Cloudflare Pages
        echo 1. Go to https://dash.cloudflare.com
        echo 2. Workers ^& Pages ^> Create ^> Connect to Git
        echo 3. Select: enginemarkets repository
        echo 4. Deploy!
        echo.
    ) else (
        echo.
        echo ================================================
        echo  Push Failed
        echo ================================================
        echo.
        echo Possible issues:
        echo 1. Wrong username/password
        echo 2. Need Personal Access Token (if 2FA enabled)
        echo 3. Repository doesn't exist
        echo 4. No permission to push
        echo.
        echo Try again or create token at:
        echo https://github.com/settings/tokens
        echo.
    )
) else (
    echo.
    echo Push cancelled.
    echo.
    echo To push manually later:
    echo   cd ..\enginemarkets-deploy
    echo   git remote add origin https://github.com/mobiride123/enginemarkets.git
    echo   git push -u origin main
    echo.
)

pause

