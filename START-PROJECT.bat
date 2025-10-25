@echo off
echo ========================================
echo   ENGINE CORE - MySQL Version
echo ========================================
echo.
echo Starting project...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️  node_modules not found!
    echo.
    echo Please run: npm install
    echo.
    echo ========================================
    pause
    exit /b 1
)

echo ✅ Dependencies found
echo.
echo This will start TWO terminals:
echo   1. API Server (port 3001)
echo   2. Dev Server (port 21201)
echo.
echo ========================================
pause

REM Set environment variables
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

REM Start API server in new window
echo.
echo [1/2] Starting API server...
start "API Server - Port 3001" cmd /k "npm run api"

REM Wait 3 seconds for API to start
timeout /t 3 /nobreak >nul

REM Start dev server in new window
echo [2/2] Starting dev server...
start "Dev Server - Port 21201" cmd /k "npm run dev"

echo.
echo ========================================
echo   PROJECT STARTED!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:21201/
echo 🔧 API:      http://localhost:3001/
echo.
echo 🔐 Admin Login:
echo    Email:    admin@admin.com
echo    Password: admin123
echo.
echo ✅ Two terminal windows opened:
echo    - API Server (port 3001)
echo    - Dev Server (port 21201)
echo.
echo Press Ctrl+C in each window to stop
echo.
echo ========================================


