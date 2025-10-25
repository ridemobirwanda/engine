# ⚡ Cloudflare D1 - Quick Start (10 Minutes)

## 🎯 Your Mission

Deploy Cloudflare D1 database + backend to Workers in 10 minutes!

---

## 📋 What You'll Do

1. Create D1 database (2 min)
2. Create tables (2 min)
3. Deploy backend (3 min)
4. Connect frontend (3 min)

---

## 🚀 Part 1: Create D1 Database (2 Minutes)

### Step 1: Create Database

```bash
wrangler d1 create enginemarket
```

**Save the Database ID!** You'll see something like:
```
✓ Successfully created DB 'enginemarket'
Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## 🚀 Part 2: Create Tables (2 Minutes)

### Step 1: Create schema.sql

Create file: `schema.sql`

```sql
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Step 2: Execute Schema

```bash
wrangler d1 execute enginemarket --file=./schema.sql
```

### Step 3: Verify Tables

```bash
wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 🚀 Part 3: Deploy Backend (3 Minutes)

### Step 1: Update wrangler.toml

Add to your `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "enginemarket"
database_id = "YOUR_DATABASE_ID_HERE"

[env.production]
name = "enginemarket-api-prod"

[[env.production.d1_databases]]
binding = "DB"
database_name = "enginemarket"
database_id = "YOUR_DATABASE_ID_HERE"
```

Replace `YOUR_DATABASE_ID_HERE` with your actual ID from Part 1.

### Step 2: Create API Handler

Create `src/index.ts`:

```typescript
import { Router } from 'itty-router';

const router = Router();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
});

router.get('/api/products', async (request, env) => {
  try {
    const db = env.DB;
    const products = await db.prepare('SELECT * FROM products').all();
    return new Response(JSON.stringify(products.results), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

router.options('*', () => new Response(null, { headers: corsHeaders }));
router.all('*', () => new Response('Not Found', { status: 404 }));

export default router.handle;
```

### Step 3: Deploy

```bash
wrangler deploy --env production
```

Your API URL:
```
https://enginemarket-api.your-account.workers.dev
```

### Step 4: Test

```bash
curl https://enginemarket-api.your-account.workers.dev/api/health
# Should return: {"status":"ok"}
```

---

## 🚀 Part 4: Connect Frontend (3 Minutes)

### Step 1: Update API URL

In your React code, update the API URL:

```javascript
// src/config/api.js
export const API_URL = 'https://enginemarket-api.your-account.workers.dev';
```

Or use environment variable:

```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'https://enginemarket-api.your-account.workers.dev';
```

### Step 2: Update .env

Create `.env` file:

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

Cloudflare Pages automatically deploys!

---

## ✅ Verification Checklist

### D1 Database
- [ ] Database created
- [ ] Database ID saved
- [ ] schema.sql created
- [ ] Tables created
- [ ] Tables verified

### Backend
- [ ] wrangler.toml updated
- [ ] API handler created
- [ ] Backend deployed
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
Database: Cloudflare D1 (enginemarket)
```

---

## 💰 Pricing

- **Cloudflare D1**: FREE
  - 5 GB/month storage
  - 100k writes/day
  - 5M reads/day

- **Cloudflare Workers**: FREE
  - 100,000 requests/day

- **Total**: $0/month! 🎉

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Database not found | Run: `wrangler d1 list` |
| SQL error | Check schema.sql syntax |
| API returns 500 | Check database binding in wrangler.toml |
| CORS errors | Check corsHeaders in API handler |

---

## 📝 Commands Reference

```bash
# Create database
wrangler d1 create enginemarket

# List databases
wrangler d1 list

# Execute SQL
wrangler d1 execute enginemarket --file=./schema.sql

# Query database
wrangler d1 execute enginemarket --command="SELECT * FROM products"

# Deploy backend
wrangler deploy --env production

# View logs
wrangler tail
```

---

## 🎉 Success Indicators

You'll know it's working when:

- ✅ D1 database created
- ✅ Tables created successfully
- ✅ Backend deployed to Workers
- ✅ API responds to requests
- ✅ Frontend connects to backend
- ✅ Data flows from frontend → backend → database

---

## ⏭️ Next Steps

1. ✅ Frontend deployed (Cloudflare Pages)
2. ⏳ Create D1 database
3. ⏳ Deploy backend to Workers
4. ⏳ Connect frontend to backend
5. ⏳ Test everything

**Ready to start?** Let me know! 🚀

