# ⚡ D1 Quick Reference Card

## 🚀 One-Command Setup

```bash
powershell -ExecutionPolicy Bypass -File setup-d1-auto.ps1
```

That's it! The script will:
1. Install dependencies
2. Login to Cloudflare
3. Create D1 database
4. Create tables
5. Deploy backend

**Time: ~10 minutes**

---

## 📋 Manual Setup (If Needed)

```bash
# 1. Install dependencies
npm install itty-router
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create database
wrangler d1 create enginemarket

# 4. Update wrangler.toml with Database ID

# 5. Create tables
wrangler d1 execute enginemarket --file=./schema.sql

# 6. Deploy backend
wrangler deploy --env production

# 7. Test API
curl https://enginemarket-api.your-account.workers.dev/api/health
```

---

## 🎯 After Deployment

### Update Frontend API URL

**File:** `src/services/apiClient.ts`

```javascript
export const API_URL = 'https://enginemarket-api.your-account.workers.dev';
```

### Rebuild & Deploy

```bash
npm run build
git add .
git commit -m "Update API URL"
git push
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:category/products` | Get products by category |
| GET | `/api/users/:userId/orders` | Get user orders |
| GET | `/api/orders/:orderId` | Get order details |
| GET | `/api/users/:userId/cart` | Get user cart |
| POST | `/api/users/:userId/cart` | Add to cart |

---

## 🗄️ Database Tables

```sql
-- 6 Tables Created:
1. products
2. categories
3. users
4. orders
5. order_items
6. cart
```

---

## 💰 Pricing

| Service | Cost | Limit |
|---------|------|-------|
| Cloudflare D1 | FREE | 5 GB/month |
| Cloudflare Workers | FREE | 100k requests/day |
| Cloudflare Pages | FREE | Unlimited |
| **TOTAL** | **$0/month** | - |

---

## 🆘 Common Commands

```bash
# List databases
wrangler d1 list

# Query database
wrangler d1 execute enginemarket --command="SELECT * FROM products"

# View logs
wrangler tail

# Deploy
wrangler deploy --env production

# Test API
curl https://enginemarket-api.your-account.workers.dev/api/health
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| wrangler not found | `npm install -g wrangler` |
| Not authenticated | `wrangler login` |
| Database not found | `wrangler d1 list` |
| API returns 500 | `wrangler tail` (check logs) |
| SQL error | Check schema.sql syntax |

---

## 📁 Files Created

- ✅ `schema.sql` - Database schema
- ✅ `wrangler.toml` - Workers config
- ✅ `src/worker/index.ts` - API handler
- ✅ `setup-d1-auto.ps1` - Automated setup
- ✅ `setup-d1.bat` - Batch setup
- ✅ `SETUP_D1_COMPLETE.md` - Manual guide
- ✅ `D1_SETUP_SUMMARY.md` - Overview

---

## 🎯 Your URLs

After deployment:

```
Frontend: https://engine.pages.dev
Backend: https://enginemarket-api.your-account.workers.dev
Database: Cloudflare D1 (enginemarket)
```

---

## ✅ Success Checklist

- [ ] Setup script completed
- [ ] D1 database created
- [ ] Tables created
- [ ] Backend deployed
- [ ] API responds to requests
- [ ] Frontend API URL updated
- [ ] Frontend rebuilt
- [ ] Pushed to GitHub
- [ ] Cloudflare Pages deployed

---

## 🚀 Ready?

Run this command:

```bash
powershell -ExecutionPolicy Bypass -File setup-d1-auto.ps1
```

Then follow the prompts!

---

## 📞 Need Help?

1. Read: `SETUP_D1_COMPLETE.md`
2. Check logs: `wrangler tail`
3. Verify Database ID in `wrangler.toml`
4. Login: `wrangler login`

---

**Total time: ~10-20 minutes**

**Total cost: $0/month**

**Status: Ready to deploy! 🎉**

