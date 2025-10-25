# Cloudflare D1 Automated Setup Script
# This script will set up your entire D1 database and backend

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗"
Write-Host "║                                                                            ║"
Write-Host "║        🚀 CLOUDFLARE D1 AUTOMATED SETUP                                   ║"
Write-Host "║                                                                            ║"
Write-Host "║        This script will:                                                  ║"
Write-Host "║        1. Install dependencies                                            ║"
Write-Host "║        2. Login to Cloudflare                                             ║"
Write-Host "║        3. Create D1 database                                              ║"
Write-Host "║        4. Create tables                                                   ║"
Write-Host "║        5. Deploy backend                                                  ║"
Write-Host "║                                                                            ║"
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝"
Write-Host ""

# Step 1: Install dependencies
Write-Host "⏳ Step 1: Installing dependencies..."
Write-Host ""

Write-Host "Installing itty-router..."
npm install itty-router
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install itty-router"
    exit 1
}
Write-Host "✅ itty-router installed"
Write-Host ""

Write-Host "Installing wrangler globally..."
npm install -g wrangler
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install wrangler"
    exit 1
}
Write-Host "✅ wrangler installed"
Write-Host ""

# Step 2: Check if logged in
Write-Host "⏳ Step 2: Checking Cloudflare login..."
Write-Host ""

$wranglerConfig = "$env:USERPROFILE\.wrangler\config.toml"
if (-not (Test-Path $wranglerConfig)) {
    Write-Host "⚠️  You need to login to Cloudflare"
    Write-Host ""
    Write-Host "Running: wrangler login"
    Write-Host ""
    wrangler login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to login to Cloudflare"
        exit 1
    }
}
Write-Host "✅ Cloudflare login verified"
Write-Host ""

# Step 3: Create D1 database
Write-Host "⏳ Step 3: Creating D1 database..."
Write-Host ""

$dbOutput = wrangler d1 create enginemarket 2>&1
Write-Host $dbOutput
Write-Host ""

# Extract database ID
$dbId = $dbOutput | Select-String -Pattern "database_id: ([a-f0-9-]+)" | ForEach-Object { $_.Matches.Groups[1].Value }

if (-not $dbId) {
    Write-Host "Could not extract database ID automatically"
    Write-Host ""
    Write-Host "Please run this command and copy the Database ID:"
    Write-Host "  wrangler d1 list"
    Write-Host ""
    Write-Host "Then update wrangler.toml with your Database ID"
    Write-Host ""
    exit 1
}

Write-Host "✅ D1 database created"
Write-Host "📝 Database ID: $dbId"
Write-Host ""

# Step 4: Update wrangler.toml
Write-Host "⏳ Step 4: Updating wrangler.toml..."
Write-Host ""

$wranglerPath = "wrangler.toml"
$wranglerContent = Get-Content $wranglerPath -Raw
$wranglerContent = $wranglerContent -replace 'database_id = "REPLACE_WITH_YOUR_DATABASE_ID"', "database_id = `"$dbId`""
Set-Content $wranglerPath $wranglerContent

Write-Host "✅ wrangler.toml updated with Database ID"
Write-Host ""

# Step 5: Create tables
Write-Host "⏳ Step 5: Creating tables..."
Write-Host ""

wrangler d1 execute enginemarket --file=./schema.sql
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create tables"
    exit 1
}
Write-Host "✅ Tables created successfully"
Write-Host ""

# Step 6: Verify tables
Write-Host "⏳ Step 6: Verifying tables..."
Write-Host ""

wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
Write-Host "✅ Tables verified"
Write-Host ""

# Step 7: Deploy backend
Write-Host "⏳ Step 7: Deploying backend to Cloudflare Workers..."
Write-Host ""

wrangler deploy --env production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy backend"
    exit 1
}
Write-Host "✅ Backend deployed successfully"
Write-Host ""

# Success message
Write-Host "╔════════════════════════════════════════════════════════════════════════════╗"
Write-Host "║                                                                            ║"
Write-Host "║        ✅ D1 SETUP COMPLETE!                                             ║"
Write-Host "║                                                                            ║"
Write-Host "║        Your backend is now deployed! 🎉                                   ║"
Write-Host "║                                                                            ║"
Write-Host "║        Next steps:                                                        ║"
Write-Host "║        1. Update frontend API URL                                         ║"
Write-Host "║        2. Run: npm run build                                              ║"
Write-Host "║        3. Push to GitHub: git push                                        ║"
Write-Host "║        4. Cloudflare Pages will auto-deploy                               ║"
Write-Host "║                                                                            ║"
Write-Host "║        Your API URL:                                                      ║"
Write-Host "║        https://enginemarket-api.your-account.workers.dev                 ║"
Write-Host "║                                                                            ║"
Write-Host "║        Test your API:                                                     ║"
Write-Host "║        curl https://enginemarket-api.your-account.workers.dev/api/health ║"
Write-Host "║                                                                            ║"
Write-Host "╚════════════════════════════════════════════════════════════════════════════╝"
Write-Host ""

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

