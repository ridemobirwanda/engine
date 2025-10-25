# 🚀 Complete D1 Setup - Step by Step

## ✅ Files Already Created

I've created all the necessary files for you:

1. ✅ **schema.sql** - Database schema with 6 tables
2. ✅ **wrangler.toml** - Cloudflare Workers configuration
3. ✅ **src/worker/index.ts** - API handler with all endpoints
4. ✅ **setup-d1.bat** - Automated setup script

---

## 🎯 What You Need to Do Now

### Step 1: Install Dependencies (2 minutes)

```bash
npm install itty-router
npm install -g wrangler
```

Or run this command:
```bash
npm install itty-router && npm install -g wrangler
```

---

### Step 2: Login to Cloudflare (1 minute)

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

---

### Step 3: Create D1 Database (2 minutes)

```bash
wrangler d1 create enginemarket
```

**IMPORTANT:** Save the Database ID that appears in the output!

Example output:
```
✓ Successfully created DB 'enginemarket'
Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

### Step 4: Update wrangler.toml (1 minute)

Open `wrangler.toml` and replace `REPLACE_WITH_YOUR_DATABASE_ID` with your actual Database ID from Step 3.

**Before:**
```toml
database_id = "REPLACE_WITH_YOUR_DATABASE_ID"
```

**After:**
```toml
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Do this in 3 places:
1. Line 8 (main database)
2. Line 17 (production environment)
3. Line 25 (development environment)

---

### Step 5: Create Tables (2 minutes)

```bash
wrangler d1 execute enginemarket --file=./schema.sql
```

You should see:
```
✓ Executed SQL
```

---

### Step 6: Verify Tables (1 minute)

```bash
wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
```

You should see all 6 tables:
- products
- categories
- users
- orders
- order_items
- cart

---

### Step 7: Deploy Backend (3 minutes)

```bash
wrangler deploy --env production
```

You'll see your API URL:
```
https://enginemarket-api.your-account.workers.dev
```

**Save this URL!**

---

### Step 8: Test API (1 minute)

```bash
curl https://enginemarket-api.your-account.workers.dev/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-10-25T..."}
```

---

### Step 9: Update Frontend API URL (2 minutes)

Update your React code to use the new API URL.

Find where you define your API URL (usually in `src/config/api.ts` or `src/services/apiClient.ts`):

**Before:**
```javascript
export const API_URL = 'http://localhost:3001';
```

**After:**
```javascript
export const API_URL = 'https://enginemarket-api.your-account.workers.dev';
```

---

### Step 10: Rebuild and Deploy Frontend (3 minutes)

```bash
npm run build
git add .
git commit -m "Update API URL to Cloudflare Workers"
git push
```

Cloudflare Pages will auto-deploy!

---

## 📊 Your Complete Architecture

```
Frontend (React)
↓ (Cloudflare Pages)
https://engine.pages.dev
↓
↓ API calls
↓
Backend (Express.js)
↓ (Cloudflare Workers)
https://enginemarket-api.your-account.workers.dev
↓
↓ Database queries
↓
Database (SQLite)
↓ (Cloudflare D1)
enginemarket
```

---

## 🎯 API Endpoints Available

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:category/products` - Get products by category

### Orders
- `GET /api/users/:userId/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details

### Cart
- `GET /api/users/:userId/cart` - Get user cart
- `POST /api/users/:userId/cart` - Add to cart

### Health
- `GET /api/health` - Health check

---

## 💰 Pricing

- **Cloudflare D1**: FREE (5 GB/month)
- **Cloudflare Workers**: FREE (100,000 requests/day)
- **Cloudflare Pages**: FREE (unlimited)
- **Total**: $0/month! 🎉

---

## ✅ Checklist

- [ ] Install itty-router
- [ ] Install wrangler globally
- [ ] Login to Cloudflare
- [ ] Create D1 database
- [ ] Save Database ID
- [ ] Update wrangler.toml
- [ ] Execute schema.sql
- [ ] Verify tables created
- [ ] Deploy backend
- [ ] Test API health endpoint
- [ ] Update frontend API URL
- [ ] Rebuild frontend
- [ ] Push to GitHub
- [ ] Verify Cloudflare Pages deployment

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

### "SQL syntax error"
- Check schema.sql for typos
- Verify SQLite syntax

### "API returns 500 error"
- Check database binding in wrangler.toml
- Verify database ID is correct
- Check Cloudflare Workers logs: `wrangler tail`

---

## 📝 Quick Commands Reference

```bash
# Install dependencies
npm install itty-router
npm install -g wrangler

# Login
wrangler login

# Create database
wrangler d1 create enginemarket

# List databases
wrangler d1 list

# Execute SQL
wrangler d1 execute enginemarket --file=./schema.sql

# Query database
wrangler d1 execute enginemarket --command="SELECT * FROM products"

# Deploy
wrangler deploy --env production

# View logs
wrangler tail

# Test API
curl https://enginemarket-api.your-account.workers.dev/api/health
```

---

## 🎉 Success Indicators

You'll know it's working when:

✅ D1 database created
✅ Tables created successfully
✅ Backend deployed to Workers
✅ API responds to requests
✅ Frontend connects to backend
✅ Data flows from frontend → backend → database

---

## ⏭️ Next Steps

1. Follow the 10 steps above
2. Test your API
3. Update frontend
4. Deploy everything
5. Celebrate! 🎉

**Total time: ~20 minutes**

---

## 📞 Need Help?

If you get stuck:
1. Check the troubleshooting section
2. Run: `wrangler tail` to see logs
3. Verify all Database IDs match
4. Make sure you're logged in to Cloudflare

---

**Ready to deploy?** Start with Step 1! 🚀

