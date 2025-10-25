# ⚡ Backend Deployment - Quick Start (15 Minutes)

## 🎯 Your Mission

Deploy backend to Cloudflare Workers + PlanetScale in 15 minutes!

---

## 📋 What You'll Do

1. Create PlanetScale database (5 min)
2. Deploy to Cloudflare Workers (5 min)
3. Connect frontend to backend (5 min)

---

## 🚀 Part 1: PlanetScale Database (5 Minutes)

### Step 1: Create Account
```
Go to: https://planetscale.com
Click: "Sign up with GitHub"
Authorize: PlanetScale
Done! ✅
```

### Step 2: Create Database
```
Go to: https://app.planetscale.com
Click: "Create a database"
Name: enginemarket
Region: Closest to you
Plan: Free
Click: "Create database"
Wait: 1-2 minutes
```

### Step 3: Get Connection String
```
Go to your database
Click: "Connect"
Select: "Node.js"
Copy: Connection string
Save: Somewhere safe
```

Connection string format:
```
mysql://[username]:[password]@[host]/enginemarket?sslaccept=strict
```

### Step 4: Create Tables
```
Go to: PlanetScale Console
Paste: SQL commands (see PLANETSCALE_SETUP_GUIDE.md)
Execute: Run SQL
Done! ✅
```

---

## 🚀 Part 2: Cloudflare Workers (5 Minutes)

### Step 1: Install Wrangler
```bash
npm install -g wrangler
wrangler --version
```

### Step 2: Login
```bash
wrangler login
# Browser opens, authorize
# Done! ✅
```

### Step 3: Create Worker
```bash
wrangler init enginemarket-api
# Choose: No for TypeScript, Yes for Fetch handler
```

### Step 4: Update wrangler.toml
```toml
name = "enginemarket-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[env.production.vars]]
DATABASE_URL = "your-planetscale-connection-string"
NODE_ENV = "production"
```

### Step 5: Create API Handler
```
Create: src/index.ts
Copy: Code from CLOUDFLARE_WORKERS_DEPLOYMENT.md
```

### Step 6: Deploy
```bash
wrangler deploy --env production
# You'll see your URL:
# https://enginemarket-api.your-account.workers.dev
```

### Step 7: Set Environment Variables
```
Go to: https://dash.cloudflare.com
Workers & Pages → enginemarket-api
Settings → Environment variables
Add: DATABASE_URL and NODE_ENV
Save: ✅
```

### Step 8: Test
```bash
curl https://enginemarket-api.your-account.workers.dev/api/health
# Should return: {"status":"ok"}
```

---

## 🚀 Part 3: Connect Frontend (5 Minutes)

### Step 1: Update API URL
In your React code:

```javascript
// src/config/api.js
export const API_URL = 'https://enginemarket-api.your-account.workers.dev';

// Or use environment variable
export const API_URL = process.env.REACT_APP_API_URL || 'https://enginemarket-api.your-account.workers.dev';
```

### Step 2: Update .env File
```
REACT_APP_API_URL=https://enginemarket-api.your-account.workers.dev
```

### Step 3: Rebuild Frontend
```bash
npm run build
```

### Step 4: Push to GitHub
```bash
git add .
git commit -m "Update API URL to Cloudflare Workers"
git push
```

### Step 5: Cloudflare Auto-Deploys
```
Cloudflare Pages automatically deploys
Wait: 1-2 minutes
Done! ✅
```

---

## ✅ Verification Checklist

### PlanetScale
- [ ] Account created
- [ ] Database created
- [ ] Connection string copied
- [ ] Tables created
- [ ] Can connect to database

### Cloudflare Workers
- [ ] Wrangler installed
- [ ] Logged in to Cloudflare
- [ ] Worker project created
- [ ] wrangler.toml updated
- [ ] API handler created
- [ ] Deployed to Workers
- [ ] Environment variables set
- [ ] API responds to requests

### Frontend
- [ ] API URL updated
- [ ] .env file updated
- [ ] Frontend rebuilt
- [ ] Pushed to GitHub
- [ ] Cloudflare Pages deployed

---

## 🎯 Your URLs

After deployment:

```
Frontend: https://engine.pages.dev
Backend API: https://enginemarket-api.your-account.workers.dev
Database: PlanetScale dashboard
```

---

## 💰 Pricing

- **Cloudflare Workers**: FREE (100,000 requests/day)
- **PlanetScale**: FREE (5GB storage)
- **Total**: FREE! 🎉

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrangler not found | `npm install -g wrangler` |
| Login failed | `wrangler login` again |
| Deployment failed | Check `wrangler.toml` syntax |
| API returns 500 | Check environment variables |
| Database connection failed | Verify connection string |
| CORS errors | Check frontend API URL |

---

## 📝 Commands Reference

```bash
# Wrangler commands
wrangler login                    # Login to Cloudflare
wrangler init [name]             # Create new worker
wrangler deploy                   # Deploy to production
wrangler tail                     # View logs
wrangler delete                   # Delete worker

# Git commands
git add .                         # Stage changes
git commit -m "message"           # Commit changes
git push                          # Push to GitHub
```

---

## 🎉 Success Indicators

You'll know it's working when:

- ✅ PlanetScale database created
- ✅ Cloudflare Worker deployed
- ✅ API responds to requests
- ✅ Frontend connects to backend
- ✅ Data flows from frontend → backend → database

---

## ⏭️ Next Steps

1. ✅ Frontend deployed (Cloudflare Pages)
2. ⏳ PlanetScale database setup
3. ⏳ Cloudflare Workers deployment
4. ⏳ Connect frontend to backend
5. ⏳ Test everything

**Ready to start?** Let me know! 🚀

