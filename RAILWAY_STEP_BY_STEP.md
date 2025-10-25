# 🎯 Railway Deployment - Step by Step

## Phase 1: Preparation (5 minutes)

### ✅ Step 1: Run Setup Script

**Windows:**
```bash
railway-setup.bat
```

**Mac/Linux:**
```bash
bash railway-setup.sh
```

This will:
- Create `.env.railway` template
- Create `Procfile`
- Create `railway.json`
- Test your build
- Create database backup

### ✅ Step 2: Update Environment File

Open `.env.railway` and update:
```env
VITE_API_URL=https://your-api-domain.railway.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
MYSQL_PASSWORD=your_secure_password
```

---

## Phase 2: Railway Account Setup (5 minutes)

### ✅ Step 3: Create Railway Account

1. Go to https://railway.app
2. Click **"Start Building"**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your GitHub

### ✅ Step 4: Create New Project

1. Click **"+ New Project"**
2. Select **"Deploy from GitHub"**
3. Select your repository
4. Choose the branch to deploy

---

## Phase 3: Database Setup (10 minutes)

### ✅ Step 5: Add MySQL Service

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway creates MySQL automatically
4. Copy connection details:
   - `MYSQL_HOST` (internal hostname)
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`

### ✅ Step 6: Import Your Database

```bash
# Export local database
mysqldump -u enginedb -p enginedb > backup.sql

# Import to Railway
mysql -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```

---

## Phase 4: API Deployment (10 minutes)

### ✅ Step 7: Configure API Service

1. In Railway, select your GitHub repo service
2. Go to **"Variables"** tab
3. Add environment variables:

```
MYSQL_HOST=mysql
MYSQL_USER=enginedb
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=enginedb
MYSQL_PORT=3306
PORT=3001
NODE_ENV=production
IMAGE_BASE_URL=https://your-api-domain.railway.app
```

### ✅ Step 8: Link MySQL Service

1. In API service, go to **"Plugins"**
2. Add the MySQL service
3. Railway auto-injects connection variables

### ✅ Step 9: Configure Build & Start

1. Go to **"Settings"** tab
2. Set **Build Command**: `npm install`
3. Set **Start Command**: `npm run api`
4. Save changes

### ✅ Step 10: Deploy API

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Check logs for errors

---

## Phase 5: Frontend Deployment (5 minutes)

### Option A: Deploy to Railway

1. Create new Railway service from GitHub
2. Set **Build Command**: `npm run build`
3. Set **Start Command**: `npm run preview`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-api.railway.app
   ```
5. Deploy

### Option B: Deploy to Cloudflare Pages (Recommended)

1. Go to https://pages.cloudflare.com
2. Connect your GitHub repo
3. Set **Build Command**: `npm run build`
4. Set **Publish Directory**: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-api.railway.app
   ```
6. Deploy

---

## Phase 6: Domain & SSL (5 minutes)

### ✅ Step 11: Configure Custom Domain

1. In Railway API service, go to **"Settings"**
2. Click **"Domain"**
3. Add your custom domain (e.g., `api.yourdomain.com`)
4. Update DNS records as instructed
5. SSL certificate is automatic!

### ✅ Step 12: Update Frontend Domain

If using Cloudflare Pages:
1. Go to Cloudflare dashboard
2. Add your custom domain
3. Update DNS records
4. SSL is automatic!

---

## Phase 7: Testing (10 minutes)

### ✅ Step 13: Test API Health

```bash
curl https://your-api-domain.railway.app/api/health
```

Expected response:
```json
{"ok": true, "db": "enginedb"}
```

### ✅ Step 14: Test Frontend

1. Visit your frontend domain
2. Check if products load
3. Test login functionality
4. Try adding to cart
5. Test checkout process

### ✅ Step 15: Test Admin Panel

1. Login with: `admin@admin.com` / `admin123`
2. Check dashboard stats
3. Verify product management works
4. Test order management

---

## Phase 8: Monitoring & Maintenance (Ongoing)

### ✅ Step 16: Set Up Monitoring

1. In Railway dashboard, go to **"Alerts"**
2. Enable notifications for:
   - Build failures
   - Deployment errors
   - High resource usage

### ✅ Step 17: Configure Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
mysqldump -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE > backup-$DATE.sql
```

### ✅ Step 18: Monitor Logs

```bash
# View API logs
railway logs --service api

# View MySQL logs
railway logs --service mysql

# Follow logs in real-time
railway logs --follow
```

---

## Troubleshooting Quick Fixes

### Build Fails
```bash
railway up --force
```

### Can't Connect to Database
```bash
railway status
railway variables | grep MYSQL
```

### API Returns 500 Errors
```bash
railway logs --service api
```

### Frontend Can't Reach API
```bash
# Check VITE_API_URL is correct
# Verify API is accessible
curl https://your-api-domain.railway.app/api/health
```

---

## ✅ Deployment Checklist

- [ ] Run setup script
- [ ] Update `.env.railway`
- [ ] Create Railway account
- [ ] Deploy MySQL database
- [ ] Import database backup
- [ ] Configure API service
- [ ] Link MySQL to API
- [ ] Deploy API
- [ ] Deploy frontend
- [ ] Configure custom domains
- [ ] Test API health endpoint
- [ ] Test frontend functionality
- [ ] Test admin panel
- [ ] Set up monitoring
- [ ] Configure backups

---

## 🎉 You're Done!

Your EngineMarket is now live on Railway! 🚀

**Total Time**: ~45 minutes
**Cost**: $10-25/month
**Uptime**: 99.9%+

---

**Need Help?**
- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support
- Community: https://discord.gg/railway

