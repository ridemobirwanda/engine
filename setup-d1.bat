@echo off
REM Setup Cloudflare D1 Database

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║        🚀 CLOUDFLARE D1 SETUP - AUTOMATED                                ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Install wrangler globally
echo ⏳ Step 1: Installing Wrangler CLI...
call npm install -g wrangler
if errorlevel 1 (
    echo ❌ Failed to install wrangler
    pause
    exit /b 1
)
echo ✅ Wrangler installed successfully!
echo.

REM Step 2: Create D1 database
echo ⏳ Step 2: Creating D1 Database...
call wrangler d1 create enginemarket
if errorlevel 1 (
    echo ❌ Failed to create D1 database
    echo.
    echo 💡 Make sure you're logged in to Cloudflare:
    echo    wrangler login
    pause
    exit /b 1
)
echo ✅ D1 Database created successfully!
echo.

REM Step 3: Execute schema
echo ⏳ Step 3: Creating tables...
call wrangler d1 execute enginemarket --file=./schema.sql
if errorlevel 1 (
    echo ❌ Failed to execute schema
    pause
    exit /b 1
)
echo ✅ Tables created successfully!
echo.

REM Step 4: Verify tables
echo ⏳ Step 4: Verifying tables...
call wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
echo ✅ Tables verified!
echo.

echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                                                                            ║
echo ║        ✅ D1 DATABASE SETUP COMPLETE!                                    ║
echo ║                                                                            ║
echo ║        Next steps:                                                        ║
echo ║        1. Copy the Database ID from above                                ║
echo ║        2. Update wrangler.toml with the Database ID                      ║
echo ║        3. Create src/index.ts with API handler                           ║
echo ║        4. Run: wrangler deploy --env production                          ║
echo ║                                                                            ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

pause

