@echo off
REM Railway Deployment Setup Script for EngineMarket (Windows)
REM This script prepares your project for Railway deployment

echo.
echo ========================================
echo 🚀 EngineMarket - Railway Deployment Setup
echo ========================================
echo.

REM Step 1: Check if .env.railway exists
echo [Step 1] Checking environment files...
if not exist ".env.railway" (
    echo Creating .env.railway template...
    (
        echo # Frontend Configuration
        echo VITE_API_URL=https://your-railway-api-domain.railway.app
        echo VITE_SUPABASE_URL=your_supabase_url
        echo VITE_SUPABASE_ANON_KEY=your_supabase_key
        echo.
        echo # Backend Configuration
        echo PORT=3001
        echo NODE_ENV=production
        echo.
        echo # MySQL Configuration
        echo MYSQL_HOST=mysql
        echo MYSQL_USER=enginedb
        echo MYSQL_PASSWORD=your_secure_password_here
        echo MYSQL_DATABASE=enginedb
        echo MYSQL_PORT=3306
        echo.
        echo # Image Configuration
        echo IMAGE_BASE_URL=https://your-railway-api-domain.railway.app
    ) > .env.railway
    echo ✓ .env.railway created
    echo ⚠️  Please update .env.railway with your actual values!
) else (
    echo ✓ .env.railway already exists
)

REM Step 2: Check if Procfile exists
echo.
echo [Step 2] Checking Procfile...
if not exist "Procfile" (
    echo Creating Procfile...
    (
        echo web: npm run build ^&^& npm run api
    ) > Procfile
    echo ✓ Procfile created
) else (
    echo ✓ Procfile already exists
)

REM Step 3: Check if railway.json exists
echo.
echo [Step 3] Checking railway.json...
if not exist "railway.json" (
    echo Creating railway.json...
    (
        echo {
        echo   "$schema": "https://railway.app/railway.schema.json",
        echo   "build": {
        echo     "builder": "NIXPACKS"
        echo   },
        echo   "deploy": {
        echo     "startCommand": "npm run api",
        echo     "restartPolicyType": "ON_FAILURE",
        echo     "restartPolicyMaxRetries": 5
        echo   }
        echo }
    ) > railway.json
    echo ✓ railway.json created
) else (
    echo ✓ railway.json already exists
)

REM Step 4: Verify package.json has required scripts
echo.
echo [Step 4] Verifying package.json scripts...
findstr /M "\"build\"" package.json >nul
if %errorlevel% equ 0 (
    echo ✓ Required scripts found in package.json
) else (
    echo ⚠️  Some scripts might be missing from package.json
)

REM Step 5: Build check
echo.
echo [Step 5] Testing build...
echo Running: npm run build
call npm run build
if %errorlevel% equ 0 (
    echo ✓ Build successful!
) else (
    echo ⚠️  Build failed. Please fix errors before deploying.
)

REM Step 6: Summary
echo.
echo ========================================
echo ✅ Railway Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env.railway with your Railway MySQL credentials
echo 2. Install Railway CLI: npm install -g @railway/cli
echo 3. Login to Railway: railway login
echo 4. Link project: railway link
echo 5. Deploy: railway up
echo.
echo For more info, see: RAILWAY_HOSTING_GUIDE.md
echo.
pause

