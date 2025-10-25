@echo off
echo ========================================
echo    TESTING API IMAGE RESPONSE
echo ========================================
echo.

REM Set MySQL connection details
set MYSQL_HOST=localhost
set MYSQL_USER=enginedb
set MYSQL_PASSWORD=yourpass
set MYSQL_DATABASE=enginedb
set MYSQL_PORT=3306

echo Testing API endpoint...
echo.

node -e "const http = require('http'); http.get('http://localhost:3001/api/products?limit=1', (res) => { let data = ''; res.on('data', chunk => data += chunk); res.on('end', () => { try { const json = JSON.parse(data); console.log('API Response:'); console.log(JSON.stringify(json, null, 2)); console.log('\nImages field:'); console.log(json[0]?.images); console.log('\nImages type:', typeof json[0]?.images); console.log('Is array?', Array.isArray(json[0]?.images)); } catch(e) { console.error('Error:', e.message); console.log('Raw response:', data); } }); }).on('error', (e) => console.error('HTTP Error:', e.message));"

echo.
echo ========================================
pause

