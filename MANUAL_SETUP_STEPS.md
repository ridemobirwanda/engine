# 🚀 Manual D1 Setup - Copy & Paste Commands

Since the automated script needs user interaction, here are the exact commands to run one by one.

---

## ⏳ Step 1: Install Dependencies (2 minutes)

Run these commands in PowerShell or Command Prompt:

```bash
npm install itty-router
npm install -g wrangler
```

**Expected output:**
```
added X packages
```

---

## ⏳ Step 2: Login to Cloudflare (1 minute)

```bash
wrangler login
```

**What happens:**
- Browser opens automatically
- You authorize Cloudflare
- Returns to terminal

---

## ⏳ Step 3: Create D1 Database (2 minutes)

```bash
wrangler d1 create enginemarket
```

**Expected output:**
```
✓ Successfully created DB 'enginemarket'
Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ IMPORTANT:** Copy the Database ID!

---

## ⏳ Step 4: Update wrangler.toml (1 minute)

Open `wrangler.toml` and replace `REPLACE_WITH_YOUR_DATABASE_ID` with your actual Database ID from Step 3.

**Find these 3 lines:**

Line 8:
```toml
database_id = "REPLACE_WITH_YOUR_DATABASE_ID"
```

Line 17:
```toml
database_id = "REPLACE_WITH_YOUR_DATABASE_ID"
```

Line 25:
```toml
database_id = "REPLACE_WITH_YOUR_DATABASE_ID"
```

**Replace with your Database ID:**
```toml
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## ⏳ Step 5: Create Tables (2 minutes)

```bash
wrangler d1 execute enginemarket --file=./schema.sql
```

**Expected output:**
```
✓ Executed SQL
```

---

## ⏳ Step 6: Verify Tables (1 minute)

```bash
wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**Expected output:**
```
products
categories
users
orders
order_items
cart
```

---

## ⏳ Step 7: Deploy Backend (3 minutes)

```bash
wrangler deploy --env production
```

**Expected output:**
```
✓ Uploaded enginemarket-api-prod
✓ Deployed to https://enginemarket-api.your-account.workers.dev
```

**Save your API URL!**

---

## ⏳ Step 8: Test API (1 minute)

```bash
curl https://enginemarket-api.your-account.workers.dev/api/health
```

**Expected output:**
```json
{"status":"ok","timestamp":"2024-10-25T..."}
```

---

## ⏳ Step 9: Update Frontend API URL (2 minutes)

Open: `src/services/apiClient.ts`

Find this line:
```javascript
export const API_URL = 'http://localhost:3001';
```

Replace with:
```javascript
export const API_URL = 'https://enginemarket-api.your-account.workers.dev';
```

---

## ⏳ Step 10: Rebuild Frontend (3 minutes)

```bash
npm run build
```

**Expected output:**
```
✓ built in XXXms
```

---

## ⏳ Step 11: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Update API URL to Cloudflare Workers"
git push
```

**Expected output:**
```
[main xxxxxxx] Update API URL to Cloudflare Workers
```

---

## ✅ Done! 🎉

Cloudflare Pages will auto-deploy your frontend!

---

## 🧪 Verify Everything Works

### Test Frontend
```
https://engine.pages.dev
```

### Test Backend
```bash
curl https://enginemarket-api.your-account.workers.dev/api/health
curl https://enginemarket-api.your-account.workers.dev/api/products
```

### Test Database
```bash
wrangler d1 execute enginemarket --command="SELECT COUNT(*) FROM products;"
```

---

## 📊 Your URLs

```
Frontend: https://engine.pages.dev
Backend: https://enginemarket-api.your-account.workers.dev
GitHub: https://github.com/ridemobirwanda/engine
```

---

## 🆘 Troubleshooting

### "wrangler: command not found"
```bash
npm install -g wrangler
```

### "Not authenticated"
```bash
wrangler login
```

### "Database not found"
```bash
wrangler d1 list
```

### "API returns 500 error"
```bash
wrangler tail
```

### "SQL syntax error"
- Check schema.sql
- Verify SQLite syntax
- Run one table at a time

---

## 📝 Quick Reference

| Step | Command | Time |
|------|---------|------|
| 1 | npm install itty-router | 2 min |
| 2 | wrangler login | 1 min |
| 3 | wrangler d1 create enginemarket | 2 min |
| 4 | Update wrangler.toml | 1 min |
| 5 | wrangler d1 execute enginemarket --file=./schema.sql | 2 min |
| 6 | wrangler d1 execute enginemarket --command="SELECT..." | 1 min |
| 7 | wrangler deploy --env production | 3 min |
| 8 | curl /api/health | 1 min |
| 9 | Update API URL | 2 min |
| 10 | npm run build | 3 min |
| 11 | git push | 2 min |
| **TOTAL** | | **~20 min** |

---

## 💰 Cost

- Cloudflare D1: FREE
- Cloudflare Workers: FREE
- Cloudflare Pages: FREE
- **Total: $0/month** 🎉

---

## 🎯 Success Indicators

✅ D1 database created
✅ Tables created
✅ Backend deployed
✅ API responds to requests
✅ Frontend updated
✅ Everything deployed

---

**Ready to start?** Run Step 1! 🚀

