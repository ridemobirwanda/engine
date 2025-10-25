# ⚙️ Cloudflare Workers Backend Deployment

## 📋 Overview

Deploy your Express.js backend to Cloudflare Workers (FREE serverless platform).

---

## ✅ Prerequisites

- Cloudflare account (you have this)
- PlanetScale database (we just created this)
- Connection string from PlanetScale
- Node.js installed locally

---

## 🚀 Deployment Steps

### Step 1: Install Wrangler CLI

Wrangler is Cloudflare's command-line tool.

```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version
```

---

### Step 2: Login to Cloudflare

```bash
# Login to your Cloudflare account
wrangler login

# Browser will open, authorize Wrangler
# You'll be logged in automatically
```

---

### Step 3: Create Worker Project

```bash
# Create new worker project
wrangler init enginemarket-api

# Choose options:
# - TypeScript: No (or Yes if you prefer)
# - Fetch handler: Yes
# - Git: No (optional)
```

---

### Step 4: Update wrangler.toml

Edit `wrangler.toml` file:

```toml
name = "enginemarket-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "enginemarket-api-prod"

[[env.production.vars]]
DATABASE_URL = "your-planetscale-connection-string"
NODE_ENV = "production"
```

---

### Step 5: Create API Handler

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
    // Connect to PlanetScale
    const response = await fetch(
      `${env.DATABASE_URL}/products`,
      { headers: { 'Authorization': `Bearer ${env.DATABASE_TOKEN}` } }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
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

### Step 6: Deploy to Cloudflare Workers

```bash
# Deploy to production
wrangler deploy --env production

# You'll see your worker URL:
# https://enginemarket-api.your-account.workers.dev
```

---

### Step 7: Set Environment Variables

In Cloudflare Dashboard:

1. Go to: https://dash.cloudflare.com
2. Click: **"Workers & Pages"**
3. Select: **"enginemarket-api"**
4. Click: **"Settings"**
5. Click: **"Environment variables"**
6. Add:
   - **DATABASE_URL**: Your PlanetScale connection string
   - **NODE_ENV**: `production`
7. Click: **"Save"**

---

### Step 8: Test Your API

```bash
# Test health endpoint
curl https://enginemarket-api.your-account.workers.dev/api/health

# Should return:
# {"status":"ok"}
```

---

## 🔗 Your API URL

After deployment:

```
https://enginemarket-api.your-account.workers.dev
```

Use this in your frontend!

---

## 📊 Architecture

```
Frontend (Cloudflare Pages)
        ↓
        ↓ API calls
        ↓
Backend (Cloudflare Workers)
        ↓
        ↓ Database queries
        ↓
Database (PlanetScale MySQL)
```

---

## 💰 Pricing

- **Cloudflare Workers**: FREE (100,000 requests/day)
- **Includes**: CPU time, memory, storage
- **Scaling**: Automatic
- **Cost**: FREE! 🎉

---

## ✅ Deployment Checklist

- [ ] Install Wrangler
- [ ] Login to Cloudflare
- [ ] Create worker project
- [ ] Update wrangler.toml
- [ ] Create API handler
- [ ] Deploy to Workers
- [ ] Set environment variables
- [ ] Test API endpoints

---

## 🆘 Troubleshooting

### Deployment Failed
- Check Wrangler version
- Verify Cloudflare login
- Check wrangler.toml syntax

### API Returns 500 Error
- Check environment variables
- Verify database connection string
- Check Cloudflare Workers logs

### CORS Errors
- Add CORS headers (already in code)
- Check frontend API URL
- Verify request headers

---

## 📝 Next Steps

1. ✅ PlanetScale database created
2. ⏳ Deploy backend to Cloudflare Workers
3. ⏳ Connect frontend to backend
4. ⏳ Test everything

**Ready to deploy?** Let me know! 🚀

