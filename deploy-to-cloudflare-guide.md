# 🚀 Complete Cloudflare Deployment Guide

## Overview
This guide will help you deploy your EngineMarket application to Cloudflare Pages with database support.

---

## Part 1: Build & Prepare Distribution Files

### Step 1: Build Production Files
```bash
npm run build
```
This creates the `dist` folder with optimized production files (~2-5MB instead of 500MB+ source code).

---

## Part 2: GitHub Repository Setup (Dist Only)

### Option A: Create New Repository for Dist Only

1. **Create a new folder for dist deployment:**
```bash
mkdir enginemarket-dist
cd enginemarket-dist
```

2. **Copy dist files:**
```bash
xcopy /E /I ..\dist\* .
```

3. **Initialize Git:**
```bash
git init
git add .
git commit -m "Initial deployment build"
```

4. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name: `enginemarket-dist` or `enginemarket-app`
   - Make it Public or Private
   - Don't initialize with README

5. **Push to GitHub:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/enginemarket-dist.git
git branch -M main
git push -u origin main
```

### Option B: Use Existing Repository with .gitignore

Create `.gitignore` in your main project (if you want to push everything):
```
# Dependencies
node_modules/

# Build cache
.vite/
node_modules/.vite/

# Environment
.env
.env.local

# Logs
*.log
server_output.txt

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Keep dist for deployment
!dist/
```

---

## Part 3: Deploy to Cloudflare Pages

### Method 1: Connect GitHub to Cloudflare (Recommended)

1. **Login to Cloudflare:**
   - Go to https://dash.cloudflare.com
   - Navigate to **Workers & Pages**

2. **Create New Project:**
   - Click **"Create Application"**
   - Select **"Pages"**
   - Click **"Connect to Git"**

3. **Connect GitHub:**
   - Authorize Cloudflare to access your GitHub
   - Select the repository: `enginemarket-dist`
   - Click **"Begin setup"**

4. **Configure Build Settings:**
   ```
   Project name: enginemarket
   Production branch: main
   Build command: (leave empty - already built)
   Build output directory: / (root, since entire repo is dist)
   ```

5. **Deploy:**
   - Click **"Save and Deploy"**
   - Wait 1-2 minutes
   - Your site will be live at: `https://enginemarket.pages.dev`

### Method 2: Direct Upload (Quick & Simple)

1. **Using Wrangler CLI:**
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=enginemarket
```

2. **Using Cloudflare Dashboard:**
   - Go to **Workers & Pages** → **Create Application** → **Pages** → **Upload assets**
   - Drag & drop your `dist` folder
   - Name: `enginemarket`
   - Click **"Deploy"**

---

## Part 4: Custom Domain (Optional)

1. In Cloudflare Pages dashboard
2. Go to your project → **Custom domains**
3. Click **"Set up a custom domain"**
4. Enter your domain: `www.enginemarket.com`
5. Follow DNS instructions
6. SSL certificate auto-generated (free)

---

## Part 5: Database Migration to Cloudflare

### Option 1: Cloudflare D1 (Recommended for SQLite)

**Note:** D1 is SQLite-based. If you need MySQL compatibility, use Option 2.

1. **Create D1 Database:**
```bash
wrangler d1 create enginemarket-db
```

2. **Export your MySQL data:**
See `EXPORT_DATABASE_FOR_CLOUDFLARE.md`

3. **Import to D1:**
```bash
wrangler d1 execute enginemarket-db --file=./cloudflare-schema.sql
```

### Option 2: Use External MySQL (PlanetScale/Railway)

Since Cloudflare doesn't host MySQL directly, use these free tiers:

#### **A. PlanetScale (Best for MySQL):**
1. Go to https://planetscale.com
2. Create free database
3. Import your MySQL dump
4. Get connection string
5. Add to Cloudflare Pages environment variables

#### **B. Railway.app:**
1. Go to https://railway.app
2. Create MySQL database
3. Import your data
4. Get connection details
5. Configure in Cloudflare

### Option 3: Cloudflare Workers + Upstash Redis

For high-performance key-value storage:
1. Go to https://upstash.com
2. Create Redis database
3. Migrate data structure
4. Connect via Workers

---

## Part 6: Environment Variables in Cloudflare

1. **In Cloudflare Dashboard:**
   - Go to your Pages project
   - Click **Settings** → **Environment variables**

2. **Add Variables:**
   ```
   DATABASE_URL=mysql://user:pass@host:3306/dbname
   API_URL=https://your-api.com
   STRIPE_KEY=your_stripe_key
   TAWK_PROPERTY_ID=your_tawk_id
   ```

3. **For Production & Preview:**
   - Set for both environments
   - Click **"Save"**
   - Redeploy for changes to take effect

---

## Part 7: API Server Deployment

Your `server` folder needs separate hosting:

### Option A: Cloudflare Workers
```bash
cd server
wrangler init
wrangler deploy
```

### Option B: Railway/Render (Easier for Express)
1. Push server folder to GitHub
2. Connect to Railway.app or Render.com
3. Auto-deploys Node.js/Express
4. Update API_URL in Cloudflare Pages

---

## Quick Commands Summary

```bash
# 1. Build
npm run build

# 2. Deploy to Cloudflare
wrangler pages deploy dist --project-name=enginemarket

# 3. Set environment variable
wrangler pages secret put DATABASE_URL --project-name=enginemarket

# 4. View logs
wrangler pages deployment list --project-name=enginemarket
```

---

## Troubleshooting

### Build is too large
- Already solved! Using dist folder only (~2-5MB)

### Database connection fails
- Check environment variables
- Verify database allows external connections
- Use connection pooling

### 404 on routes
Add `_redirects` file in `dist/`:
```
/*    /index.html    200
```

### Images not loading
- Ensure images are in `dist/assets/`
- Check CORS settings
- Use absolute paths

---

## Cost Estimate

- **Cloudflare Pages:** FREE (500 builds/month, unlimited requests)
- **Cloudflare D1:** FREE (5GB storage, 5M reads/day)
- **Custom Domain:** $0 (if using Cloudflare)
- **Total:** $0/month 🎉

---

## Next Steps

1. ✅ Build dist folder: `npm run build`
2. ✅ Push to GitHub (dist only)
3. ✅ Connect to Cloudflare Pages
4. ✅ Deploy database
5. ✅ Set environment variables
6. ✅ Test your live site!

Your site will be live at: `https://enginemarket.pages.dev`

---

**Need Help?** Check individual guides:
- `EXPORT_DATABASE_FOR_CLOUDFLARE.md`
- `CLOUDFLARE_API_DEPLOYMENT.md`
- `CLOUDFLARE_ENV_SETUP.md`

