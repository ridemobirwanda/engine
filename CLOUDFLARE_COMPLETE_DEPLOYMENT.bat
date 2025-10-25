@echo off
echo ================================================
echo  COMPLETE Cloudflare Deployment Wizard
echo ================================================
echo.
echo This script will guide you through:
echo 1. Building production files
echo 2. Deploying to Cloudflare Pages
echo 3. Setting up database
echo.
pause

echo.
echo ================================================
echo  STEP 1: Build Production Files
echo ================================================
echo.
echo Building optimized production bundle...
echo This may take 1-2 minutes...
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build complete! Checking dist folder...
if not exist "dist\" (
    echo [ERROR] dist folder not created!
    pause
    exit /b 1
)

echo ✅ dist folder ready
echo.
pause

echo.
echo ================================================
echo  STEP 2: Deploy to Cloudflare Pages
echo ================================================
echo.
echo Choose deployment method:
echo.
echo 1. Via GitHub (Recommended - automatic updates)
echo 2. Direct Upload (Quick - manual updates)
echo.
set /p METHOD="Enter choice (1 or 2): "

if "%METHOD%"=="1" goto GITHUB_DEPLOY
if "%METHOD%"=="2" goto DIRECT_DEPLOY

echo Invalid choice
pause
exit /b 1

:GITHUB_DEPLOY
echo.
echo Preparing GitHub deployment...
call deploy-dist-to-github.bat
echo.
echo Now:
echo 1. Go to https://dash.cloudflare.com
echo 2. Workers ^& Pages ^> Create Application ^> Pages
echo 3. Connect to Git
echo 4. Select your repository: enginemarket-dist
echo 5. Build settings: Leave all empty (already built)
echo 6. Deploy!
echo.
pause
goto DATABASE

:DIRECT_DEPLOY
echo.
echo Installing Wrangler (if needed)...
call npm install -g wrangler
echo.
echo Logging into Cloudflare...
call wrangler login
echo.
echo Deploying to Cloudflare Pages...
call wrangler pages deploy dist --project-name=enginemarket
echo.
echo ✅ Deployment initiated!
echo.
pause

:DATABASE
echo.
echo ================================================
echo  STEP 3: Database Setup
echo ================================================
echo.
echo Choose database hosting:
echo.
echo 1. PlanetScale (MySQL - Recommended)
echo 2. Railway.app (MySQL - Easy)
echo 3. Cloudflare D1 (SQLite - Requires conversion)
echo.
set /p DB_CHOICE="Enter choice (1, 2, or 3): "

if "%DB_CHOICE%"=="1" goto PLANETSCALE
if "%DB_CHOICE%"=="2" goto RAILWAY
if "%DB_CHOICE%"=="3" goto D1

echo Invalid choice
pause
exit /b 1

:PLANETSCALE
echo.
echo Exporting database for PlanetScale...
call export-database.bat
echo.
echo Next steps:
echo 1. Go to https://planetscale.com
echo 2. Create account and database
echo 3. Install CLI: npm install -g @planetscale/cli
echo 4. Login: pscale auth login
echo 5. Import data (see EXPORT_DATABASE_FOR_CLOUDFLARE.md)
echo 6. Get connection string
echo 7. Add to Cloudflare Pages environment variables
echo.
goto DONE

:RAILWAY
echo.
echo Exporting database for Railway...
call export-database.bat
echo.
echo Next steps:
echo 1. Go to https://railway.app
echo 2. Create project and add MySQL
echo 3. Get connection details from Railway dashboard
echo 4. Import: mysql -h HOST -P PORT -u root -p DATABASE ^< enginedb-cloudflare-export.sql
echo 5. Add connection string to Cloudflare Pages
echo.
goto DONE

:D1
echo.
echo Exporting and converting database for Cloudflare D1...
call export-database.bat
echo.
echo Converting MySQL to SQLite...
node convert-mysql-to-sqlite.js
echo.
echo Creating D1 database...
call wrangler d1 create enginemarket-db
echo.
echo Please copy the database_id from above, then:
echo.
set /p D1_ID="Paste the database_id: "
echo.
echo Importing data to D1...
call wrangler d1 execute enginemarket-db --file=./cloudflare-d1-schema.sql
echo.
echo ✅ D1 database setup complete!
echo.
goto DONE

:DONE
echo.
echo ================================================
echo  🎉 Deployment Complete!
echo ================================================
echo.
echo Your site should be live at:
echo https://enginemarket.pages.dev
echo.
echo Final steps:
echo 1. Add environment variables in Cloudflare Dashboard
echo 2. Test your live site
echo 3. Configure custom domain (optional)
echo.
echo Documentation:
echo - deploy-to-cloudflare-guide.md
echo - EXPORT_DATABASE_FOR_CLOUDFLARE.md
echo.
pause

