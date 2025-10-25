#!/bin/bash

# Railway Deployment Setup Script for EngineMarket
# This script prepares your project for Railway deployment

echo "🚀 EngineMarket - Railway Deployment Setup"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if .env.railway exists
echo -e "${BLUE}Step 1: Checking environment files...${NC}"
if [ ! -f ".env.railway" ]; then
    echo -e "${YELLOW}Creating .env.railway template...${NC}"
    cat > .env.railway << 'EOF'
# Frontend Configuration
VITE_API_URL=https://your-railway-api-domain.railway.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Backend Configuration
PORT=3001
NODE_ENV=production

# MySQL Configuration
MYSQL_HOST=mysql
MYSQL_USER=enginedb
MYSQL_PASSWORD=your_secure_password_here
MYSQL_DATABASE=enginedb
MYSQL_PORT=3306

# Image Configuration
IMAGE_BASE_URL=https://your-railway-api-domain.railway.app
EOF
    echo -e "${GREEN}✓ .env.railway created${NC}"
    echo -e "${YELLOW}⚠️  Please update .env.railway with your actual values!${NC}"
else
    echo -e "${GREEN}✓ .env.railway already exists${NC}"
fi

# Step 2: Check if Procfile exists
echo ""
echo -e "${BLUE}Step 2: Checking Procfile...${NC}"
if [ ! -f "Procfile" ]; then
    echo -e "${YELLOW}Creating Procfile...${NC}"
    cat > Procfile << 'EOF'
web: npm run build && npm run api
EOF
    echo -e "${GREEN}✓ Procfile created${NC}"
else
    echo -e "${GREEN}✓ Procfile already exists${NC}"
fi

# Step 3: Check if railway.json exists
echo ""
echo -e "${BLUE}Step 3: Checking railway.json...${NC}"
if [ ! -f "railway.json" ]; then
    echo -e "${YELLOW}Creating railway.json...${NC}"
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run api",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}
EOF
    echo -e "${GREEN}✓ railway.json created${NC}"
else
    echo -e "${GREEN}✓ railway.json already exists${NC}"
fi

# Step 4: Verify package.json has required scripts
echo ""
echo -e "${BLUE}Step 4: Verifying package.json scripts...${NC}"
if grep -q '"build"' package.json && grep -q '"api"' package.json; then
    echo -e "${GREEN}✓ Required scripts found in package.json${NC}"
else
    echo -e "${YELLOW}⚠️  Some scripts might be missing from package.json${NC}"
fi

# Step 5: Create database backup
echo ""
echo -e "${BLUE}Step 5: Creating database backup...${NC}"
if command -v mysqldump &> /dev/null; then
    echo -e "${YELLOW}Backing up local database...${NC}"
    mysqldump -u enginedb -p enginedb > backup-$(date +%Y%m%d-%H%M%S).sql 2>/dev/null
    echo -e "${GREEN}✓ Database backup created${NC}"
else
    echo -e "${YELLOW}⚠️  mysqldump not found. Skipping database backup.${NC}"
fi

# Step 6: Build check
echo ""
echo -e "${BLUE}Step 6: Testing build...${NC}"
echo -e "${YELLOW}Running: npm run build${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Build failed. Please fix errors before deploying.${NC}"
fi

# Step 7: Summary
echo ""
echo -e "${GREEN}==========================================="
echo "✅ Railway Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env.railway with your Railway MySQL credentials"
echo "2. Install Railway CLI: npm install -g @railway/cli"
echo "3. Login to Railway: railway login"
echo "4. Link project: railway link"
echo "5. Deploy: railway up"
echo ""
echo "For more info, see: RAILWAY_HOSTING_GUIDE.md"
echo ""

