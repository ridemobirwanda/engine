# 🗄️ Cloudflare D1 Database Setup - Complete Guide

## 📋 Overview

Cloudflare D1 is a serverless SQLite database. It's FREE, lightweight, and perfect for your EngineMarket backend!

---

## ✅ Prerequisites

- Cloudflare account (you have this)
- Wrangler CLI installed
- Node.js installed

---

## 🚀 Step-by-Step Setup

### Step 1: Install Wrangler (if not already installed)

```bash
npm install -g wrangler
wrangler --version
```

---

### Step 2: Create D1 Database

```bash
# Create new D1 database
wrangler d1 create enginemarket

# You'll see output like:
# ✓ Successfully created DB 'enginemarket'
# Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Save the Database ID!** You'll need it later.

---

### Step 3: Create Tables

Create a file: `schema.sql`

```sql
-- Products table
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

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table
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

---

### Step 4: Execute SQL Schema

```bash
# Execute schema
wrangler d1 execute enginemarket --file=./schema.sql

# You should see:
# ✓ Executed SQL
```

---

### Step 5: Verify Tables Created

```bash
# List tables
wrangler d1 execute enginemarket --command="SELECT name FROM sqlite_master WHERE type='table';"

# Should show all 6 tables
```

---

### Step 6: Update wrangler.toml

Add D1 binding to your `wrangler.toml`:

```toml
name = "enginemarket-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "enginemarket"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

[env.production]
name = "enginemarket-api-prod"

[[env.production.d1_databases]]
binding = "DB"
database_name = "enginemarket"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Replace `database_id` with your actual ID from Step 2.

---

### Step 7: Create API Handler

Create `src/index.ts`:

```typescript
import { Router } from 'itty-router';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Health check
router.get('/api/health', () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
});

// Get products
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

// Get product by ID
router.get('/api/products/:id', async (request, env) => {
  try {
    const db = env.DB;
    const id = request.params.id;
    const product = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    return new Response(JSON.stringify(product), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// Handle OPTIONS for CORS
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

// 404
router.all('*', () => {
  return new Response('Not Found', { status: 404 });
});

export default router.handle;
```

---

### Step 8: Deploy to Cloudflare Workers

```bash
# Deploy
wrangler deploy --env production

# You'll see your worker URL:
# https://enginemarket-api.your-account.workers.dev
```

---

### Step 9: Test Your API

```bash
# Test health endpoint
curl https://enginemarket-api.your-account.workers.dev/api/health

# Should return:
# {"status":"ok"}

# Test products endpoint
curl https://enginemarket-api.your-account.workers.dev/api/products

# Should return:
# []
```

---

## 📊 Architecture

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

## 💰 Pricing

- **Cloudflare D1**: FREE tier
  - 5 GB monthly storage
  - 100k rows written per day
  - 5 million rows read per day
- **Cloudflare Workers**: FREE tier
  - 100,000 requests/day
- **Total**: FREE! 🎉

---

## ✅ Deployment Checklist

- [ ] Install Wrangler
- [ ] Create D1 database
- [ ] Create schema.sql
- [ ] Execute SQL schema
- [ ] Verify tables created
- [ ] Update wrangler.toml
- [ ] Create API handler
- [ ] Deploy to Workers
- [ ] Test API endpoints

---

## 🆘 Troubleshooting

### Database not found
```bash
# List all databases
wrangler d1 list
```

### SQL syntax error
- Check schema.sql for typos
- Run one table at a time
- Check SQLite syntax

### API returns 500 error
- Check Cloudflare Workers logs
- Verify database binding in wrangler.toml
- Check database ID

---

## 📝 Your Database Info

```
Database Name: enginemarket
Database Type: SQLite
Storage: 5 GB/month (FREE)
Reads: 5 million/day
Writes: 100k/day
Tables: 6 (products, categories, users, orders, order_items, cart)
```

---

## 🚀 Next Steps

1. ✅ Frontend deployed (Cloudflare Pages)
2. ⏳ Create D1 database
3. ⏳ Deploy backend to Workers
4. ⏳ Connect frontend to backend
5. ⏳ Test everything

**Ready to create your D1 database?** Let me know! 🎉

