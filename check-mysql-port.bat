@echo off
echo Checking MySQL port...
echo.
netstat -ano | findstr :3306
echo.
echo If you see a result above, MySQL is running on port 3306
echo If empty, MySQL is either not running or on a different port
echo.
pause






