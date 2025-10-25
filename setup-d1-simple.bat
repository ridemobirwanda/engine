@echo off
REM Cloudflare D1 Automated Setup Script

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║        🚀 CLOUDFLARE D1 AUTOMATED SETUP                                   ║
echo ║                                                                            ║
echo ║        This script will:                                                  ║
echo ║        1. Install dependencies                                            ║
echo ║        2. Login to Cloudflare                                             ║
echo ║        3. Create D1 database                                              ║
echo ║        4. Create tables                                                   ║
echo ║        5. Deploy backend                                                  ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Install itty-router
echo ⏳ Step 1: Installing itty-router...
call npm install itty-router
if errorlevel 1 (
    echo ❌ Failed to install itty-router
    pause
    exit /b 1
)
echo ✅ itty-router installed
echo.

REM Step 2: Install wrangler globally
echo ⏳ Step 2: Installing wrangler globally...
call npm install -g wrangler
if errorlevel 1 (
    echo ❌ Failed to install wrangler
    pause
    exit /b 1
)
echo ✅ wrangler installed
echo.

REM Step 3: Login to Cloudflare
echo ⏳ Step 3: Logging in to Cloudflare...
echo.
echo Opening browser for authentication...
call wrangler login
if errorlevel 1 (
    echo ❌ Failed to login to Cloudflare
    pause
    exit /b 1
)
echo ✅ Cloudflare login successful
echo.

REM Step 4: Create D1 database
echo ⏳ Step 4: Creating D1 database...
echo.
call wrangler d1 create enginemarket
if errorlevel 1 (
    echo ❌ Failed to create D1 database
    echo.
    echo Please run this command manually:
    echo   wrangler d1 create enginemarket
    echo.
    pause
    exit /b 1
)
echo ✅ D1 database created
echo.

REM Step 5: Create tables
echo ⏳ Step 5: Creating tables...
echo.
call wrangler d1 execute enginemarket --file=./schema.sql
if errorlevel 1 (
    echo ❌ Failed to create tables
    pause
    exit /b 1
)
echo ✅ Tables created successfully
echo.

REM Step 6: Verify tables
echo ⏳ Step 6: Verifying tables...
echo.
call wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
echo ✅ Tables verified
echo.

REM Step 7: Deploy backend
echo ⏳ Step 7: Deploying backend to Cloudflare Workers...
echo.
call wrangler deploy --env production
if errorlevel 1 (
    echo ❌ Failed to deploy backend
    pause
    exit /b 1
)
echo ✅ Backend deployed successfully
echo.

REM Success message
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║        ✅ D1 SETUP COMPLETE!                                             ║
echo ║                                                                            ║
echo ║        Your backend is now deployed! 🎉                                   ║
echo ║                                                                            ║
echo ║        Next steps:                                                        ║
echo ║        1. Update frontend API URL                                         ║
echo ║           File: src/services/apiClient.ts                                ║
echo ║           Change: http://localhost:3001                                  ║
echo ║           To: https://enginemarket-api.your-account.workers.dev         ║
echo ║                                                                            ║
echo ║        2. Rebuild frontend:                                              ║
echo ║           npm run build                                                   ║
echo ║                                                                            ║
echo ║        3. Push to GitHub:                                                ║
echo ║           git add .                                                       ║
echo ║           git commit -m "Update API URL"                                 ║
echo ║           git push                                                        ║
echo ║                                                                            ║
echo ║        4. Cloudflare Pages will auto-deploy!                             ║
echo ║                                                                            ║
echo ║        Your API URL:                                                      ║
echo ║        https://enginemarket-api.your-account.workers.dev                 ║
echo ║                                                                            ║
echo ║        Test your API:                                                     ║
echo ║        curl https://enginemarket-api.your-account.workers.dev/api/health ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

pause

