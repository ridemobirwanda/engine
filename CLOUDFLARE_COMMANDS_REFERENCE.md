# 🔧 Cloudflare Commands Reference

## Frontend Commands

### Build
```bash
npm run build
```
Creates optimized `dist` folder for production.

### Deploy to Cloudflare Pages (CLI)
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=enginemarket
```

### Preview Locally
```bash
npm run preview
```
Test production build locally before deploying.

---

## Backend Commands

### Install Wrangler
```bash
npm install -g wrangler
```
One-time installation of Cloudflare CLI.

### Login to Cloudflare
```bash
wrangler login
```
Opens browser to authorize Wrangler.

### Create wrangler.toml
```bash
wrangler init
```
Interactive setup for Wrangler configuration.

### Deploy Backend
```bash
wrangler publish --env production
```
Deploy Express API to Cloudflare Workers.

### View Live Logs
```bash
wrangler tail
```
Stream real-time logs from your Worker.

### View Logs (Specific)
```bash
wrangler tail --format pretty
```
Pretty-printed logs.

### Test Locally
```bash
wrangler dev
```
Run Worker locally for testing.

---

## Database Commands

### Export MySQL Database
```bash
mysqldump -u enginedb -p enginedb > backup.sql
```
Creates SQL backup file.

### Import to Railway
```bash
mysql -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```
Replace brackets with Railway credentials.

### Import to PlanetScale
```bash
mysql -h [PLANETSCALE_HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```
Replace brackets with PlanetScale credentials.

### Test Database Connection
```bash
mysql -h [HOST] -u [USER] -p [PASSWORD] -e "SELECT 1"
```
Quick connection test.

---

## Testing Commands

### Test Frontend
```bash
curl https://yourdomain.com
```
Should return HTML.

### Test API Health
```bash
curl https://api.yourdomain.com/api/health
```
Should return: `{"ok": true, "db": "enginedb"}`

### Test API Products
```bash
curl https://api.yourdomain.com/api/products
```
Should return product list.

### Test with Headers
```bash
curl -H "Content-Type: application/json" https://api.yourdomain.com/api/health
```

---

## Environment Variables

### Set in Cloudflare Pages
```
VITE_API_URL = https://api.yourdomain.com
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_key
```

### Set in Cloudflare Workers (wrangler.toml)
```toml
[[env.production.vars]]
MYSQL_HOST = "your_host"
MYSQL_USER = "your_user"
MYSQL_PASSWORD = "your_password"
MYSQL_DATABASE = "your_db"
MYSQL_PORT = "3306"
NODE_ENV = "production"
```

### Set Secrets
```bash
wrangler secret put MYSQL_PASSWORD
wrangler secret put STRIPE_KEY
```

### List Secrets
```bash
wrangler secret list
```

---

## DNS Commands

### Check DNS Records
```bash
nslookup yourdomain.com
```

### Check CNAME
```bash
nslookup yourdomain.com
```
Should show Cloudflare Pages CNAME.

### Check API DNS
```bash
nslookup api.yourdomain.com
```
Should show Cloudflare Workers CNAME.

---

## Monitoring Commands

### View Deployment History
```bash
wrangler deployments list
```

### Rollback to Previous Version
```bash
wrangler rollback
```

### View Worker Metrics
```bash
wrangler analytics
```

---

## Troubleshooting Commands

### Check Build Locally
```bash
npm run build
npm run lint
```

### Check for Errors
```bash
npm run build 2>&1 | grep -i error
```

### View Wrangler Version
```bash
wrangler --version
```

### Update Wrangler
```bash
npm install -g wrangler@latest
```

### Clear Wrangler Cache
```bash
rm -rf .wrangler
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Git Commands

### Push to GitHub
```bash
git add .
git commit -m "Deploy to Cloudflare"
git push origin main
```

### Check Git Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -10
```

---

## File Management

### List Files in dist
```bash
ls -la dist/
```

### Check dist Size
```bash
du -sh dist/
```

### Remove dist Folder
```bash
rm -rf dist
```

### Rebuild Everything
```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## Quick Deployment Script

```bash
#!/bin/bash

# Build frontend
npm run build

# Deploy frontend
wrangler pages deploy dist --project-name=enginemarket

# Deploy backend
wrangler publish --env production

# Test
curl https://api.yourdomain.com/api/health

echo "✅ Deployment complete!"
```

Save as `deploy.sh` and run:
```bash
bash deploy.sh
```

---

## Useful Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Pages**: https://pages.cloudflare.com
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com

---

## Common Issues & Fixes

### Build fails
```bash
npm run build
```

### API 500 error
```bash
wrangler tail
```

### Can't connect to database
```bash
mysql -h [HOST] -u [USER] -p [PASSWORD] -e "SELECT 1"
```

### CORS error
Update `server/index.js` and redeploy:
```bash
wrangler publish --env production
```

### Domain not working
Check DNS:
```bash
nslookup yourdomain.com
```

---

**Keep this file handy for quick reference!**

