@echo off
echo ========================================
echo   COPYING PROJECT TO projmsql FOLDER
echo ========================================
echo.

REM Create the target directory
if not exist "F:\xampp\htdocs\enginecore\projmsql" (
    echo Creating projmsql folder...
    mkdir "F:\xampp\htdocs\enginecore\projmsql"
)

echo.
echo Copying project files...
echo This may take a few minutes...
echo.

REM Copy all files except node_modules, dist, and .git
echo [1/10] Copying source files...
xcopy /E /I /Y /EXCLUDE:copy-exclude.txt "src" "projmsql\src" >nul 2>&1
echo     ✅ src\ copied

echo [2/10] Copying server files...
xcopy /E /I /Y "server" "projmsql\server" >nul 2>&1
echo     ✅ server\ copied

echo [3/10] Copying public files...
xcopy /E /I /Y "public" "projmsql\public" >nul 2>&1
echo     ✅ public\ copied

echo [4/10] Copying MySQL folder...
xcopy /E /I /Y "mysql" "projmsql\mysql" >nul 2>&1
echo     ✅ mysql\ copied

echo [5/10] Copying configuration files...
copy /Y "package.json" "projmsql\package.json" >nul 2>&1
copy /Y "package-lock.json" "projmsql\package-lock.json" >nul 2>&1
copy /Y "vite.config.ts" "projmsql\vite.config.ts" >nul 2>&1
copy /Y "tsconfig.json" "projmsql\tsconfig.json" >nul 2>&1
copy /Y "tsconfig.app.json" "projmsql\tsconfig.app.json" >nul 2>&1
copy /Y "tsconfig.node.json" "projmsql\tsconfig.node.json" >nul 2>&1
copy /Y "tailwind.config.ts" "projmsql\tailwind.config.ts" >nul 2>&1
copy /Y "postcss.config.js" "projmsql\postcss.config.js" >nul 2>&1
copy /Y "components.json" "projmsql\components.json" >nul 2>&1
copy /Y ".env.example" "projmsql\.env.example" >nul 2>&1
echo     ✅ Config files copied

echo [6/10] Copying HTML and other root files...
copy /Y "index.html" "projmsql\index.html" >nul 2>&1
copy /Y "*.md" "projmsql\" >nul 2>&1
echo     ✅ Root files copied

echo [7/10] Copying batch files...
copy /Y "*.bat" "projmsql\" >nul 2>&1
echo     ✅ Batch files copied

echo [8/10] Copying scripts...
copy /Y "*.js" "projmsql\" >nul 2>&1
echo     ✅ Scripts copied

echo [9/10] Creating .env file...
(
    echo MYSQL_HOST=localhost
    echo MYSQL_USER=enginedb
    echo MYSQL_PASSWORD=yourpass
    echo MYSQL_DATABASE=enginedb
    echo MYSQL_PORT=3306
    echo.
    echo # Vite config
    echo VITE_API_URL=http://localhost:3001
) > "projmsql\.env"
echo     ✅ .env file created

echo [10/10] Creating README...
(
    echo # Engine Core - MySQL Version
    echo.
    echo This is the clean MySQL version of the project.
    echo.
    echo ## Setup
    echo.
    echo 1. Install dependencies:
    echo    npm install
    echo.
    echo 2. Start API server:
    echo    npm run api
    echo.
    echo 3. Start dev server:
    echo    npm run dev
    echo.
    echo ## Login
    echo.
    echo - Email: admin@admin.com
    echo - Password: admin123
    echo.
    echo ## Database
    echo.
    echo - Type: MySQL
    echo - Name: enginedb
    echo - Products: 27
    echo - Images: 32 local files
) > "projmsql\README.md"
echo     ✅ README created

echo.
echo ========================================
echo   COPY COMPLETE!
echo ========================================
echo.
echo Location: F:\xampp\htdocs\enginecore\projmsql
echo.
echo 📂 Copied:
echo    ✅ Source code (src\)
echo    ✅ Server (server\)
echo    ✅ Public files + images (public\)
echo    ✅ MySQL schemas (mysql\)
echo    ✅ Configuration files
echo    ✅ All scripts and batch files
echo    ✅ Documentation
echo.
echo 📝 Next Steps:
echo    1. cd projmsql
echo    2. npm install
echo    3. npm run api (in one terminal)
echo    4. npm run dev (in another terminal)
echo.
echo ⚠️  Note: node_modules NOT copied (run npm install)
echo ⚠️  Note: dist NOT copied (will be built)
echo.
echo ========================================
pause

