@echo off
echo ========================================================
echo    EXPORT ENTIRE SUPABASE DATABASE
echo ========================================================
echo.

echo This script will try to export your entire Supabase database
echo.

echo Step 1: Installing Supabase CLI...
echo.
call npm install -g supabase
echo.

echo Step 2: Login to Supabase...
echo (A browser window will open - please login)
echo.
call supabase login
echo.

echo Step 3: Link to your project...
echo.
call supabase link --project-ref dfmbicodohmkyasuofov
echo.

echo Step 4: Export all data...
echo.
call supabase db dump --data-only -f supabase_data.sql
echo.

echo Step 5: Export schema...
echo.
call supabase db dump -f supabase_schema.sql
echo.

echo ========================================================
echo    EXPORT COMPLETE!
echo ========================================================
echo.
echo Files created:
echo   - supabase_data.sql (all your data)
echo   - supabase_schema.sql (table structure)
echo.
echo Next steps:
echo   1. Convert to MySQL: node convert-postgres-to-mysql.js supabase_data.sql mysql_import.sql
echo   2. Import to MySQL: Use phpMyAdmin or command line
echo   3. Start your site: npm run api
echo.

pause

