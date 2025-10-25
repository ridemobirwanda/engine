# 🚀 Railway Hosting Guide for EngineMarket

## Overview
This guide will help you deploy your EngineMarket project (React frontend + Express API + MySQL database) to Railway.

---

## Step 1: Prepare Your Project

### 1.1 Create `.env.railway` file
Create a new file in your project root:

```env
# Frontend
VITE_API_URL=https://your-railway-api-domain.railway.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Backend
PORT=3001
NODE_ENV=production
MYSQL_HOST=mysql
MYSQL_USER=enginedb
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=enginedb
MYSQL_PORT=3306
IMAGE_BASE_URL=https://your-railway-api-domain.railway.app/images
```

### 1.2 Create `Procfile` (for Railway)
```
web: npm run build && npm run api
```

### 1.3 Update `package.json` scripts
Ensure you have:
```json
{
  "scripts": {
    "build": "vite build --mode production",
    "api": "node server/index.js",
    "start": "npm run api"
  }
}
```

---

## Step 2: Set Up Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)
3. Create a new project

---

## Step 3: Deploy MySQL Database

### 3.1 Add MySQL Service
1. In Railway dashboard, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway will create a MySQL instance automatically
4. Copy the connection details:
   - `MYSQL_HOST` (internal Railway hostname)
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`

### 3.2 Import Your Database Schema
```bash
# Export your local database
mysqldump -u enginedb -p enginedb > backup.sql

# Import to Railway MySQL (use Railway's connection details)
mysql -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DATABASE] < backup.sql
```

---

## Step 4: Deploy Backend API

### 4.1 Connect GitHub Repository
1. Click **"+ New"** in Railway
2. Select **"GitHub Repo"**
3. Connect your repository
4. Select the branch to deploy

### 4.2 Configure Environment Variables
In Railway dashboard for your API service:
1. Go to **Variables** tab
2. Add all variables from `.env.railway`:
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

### 4.3 Link MySQL Service
1. In API service, go to **"Plugins"**
2. Add the MySQL service you created
3. Railway will auto-inject connection variables

### 4.4 Set Build Command
In Railway deployment settings:
- **Build Command**: `npm install`
- **Start Command**: `npm run api`

---

## Step 5: Deploy Frontend

### 5.1 Build Locally First
```bash
npm run build
```

### 5.2 Deploy to Railway or Cloudflare Pages
**Option A: Railway Static Hosting**
1. Create new Railway service from GitHub
2. Set build command: `npm run build`
3. Set start command: `npm run preview`
4. Set `VITE_API_URL` to your Railway API domain

**Option B: Cloudflare Pages (Recommended)**
1. Connect your GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-railway-api.railway.app`

---

## Step 6: Configure Domain & SSL

### 6.1 Custom Domain
1. In Railway dashboard, go to **Deployments**
2. Click on your service
3. Go to **Settings** → **Domain**
4. Add your custom domain (e.g., `api.yourdomain.com`)
5. Update DNS records as instructed

### 6.2 SSL Certificate
Railway provides free SSL certificates automatically!

---

## Step 7: Verify Deployment

### 7.1 Test API Health
```bash
curl https://your-railway-api.railway.app/api/health
```

Expected response:
```json
{"ok": true, "db": "enginedb"}
```

### 7.2 Test Frontend
Visit your frontend domain and check:
- Products load correctly
- API calls work
- Admin login works

---

## Step 8: Database Backup & Maintenance

### 8.1 Regular Backups
```bash
# Backup from Railway MySQL
mysqldump -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DB] > backup.sql

# Restore if needed
mysql -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```

### 8.2 Monitor Logs
In Railway dashboard:
1. Select your service
2. Go to **Logs** tab
3. Monitor for errors

---

## Troubleshooting

### Issue: "Cannot connect to MySQL"
- ✅ Verify MySQL service is running in Railway
- ✅ Check environment variables are set correctly
- ✅ Ensure API service is linked to MySQL plugin

### Issue: "API returns 500 errors"
- ✅ Check logs in Railway dashboard
- ✅ Verify database tables exist (run migrations)
- ✅ Check environment variables

### Issue: "Frontend can't reach API"
- ✅ Verify `VITE_API_URL` is set correctly
- ✅ Check CORS settings in `server/index.js`
- ✅ Ensure API domain is accessible

### Issue: "Images not loading"
- ✅ Set `IMAGE_BASE_URL` to your API domain
- ✅ Verify images are in `/public/images` directory
- ✅ Check file permissions

---

## Cost Estimation

| Service | Cost |
|---------|------|
| MySQL Database | $5-15/month |
| API Service | $5-10/month |
| Frontend (Cloudflare) | Free |
| **Total** | **~$10-25/month** |

---

## Next Steps

1. ✅ Set up Railway account
2. ✅ Deploy MySQL database
3. ✅ Deploy API service
4. ✅ Deploy frontend
5. ✅ Configure custom domain
6. ✅ Test all functionality
7. ✅ Set up monitoring & backups

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- MySQL on Railway: https://docs.railway.app/databases/mysql
- Environment Variables: https://docs.railway.app/develop/variables
- Custom Domains: https://docs.railway.app/deploy/exposing-your-app

---

**Need help?** Check Railway's support or contact their community!

