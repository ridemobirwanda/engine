# 🚀 Cloudflare Complete Setup - Frontend & Backend

## Overview
Deploy your entire EngineMarket (React frontend + Express API + MySQL) on Cloudflare.

---

## Part 1: Frontend Deployment (Cloudflare Pages)

### Step 1: Connect GitHub to Cloudflare Pages

1. Go to https://pages.cloudflare.com
2. Click **"Connect to Git"**
3. Select **GitHub** and authorize
4. Select your repository
5. Click **"Begin setup"**

### Step 2: Configure Build Settings

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

**Environment variables:**
```
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Step 3: Deploy

1. Click **"Save and Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your frontend is live! 🎉

### Step 4: Add Custom Domain

1. In Cloudflare Pages project settings
2. Go to **"Custom domains"**
3. Add your domain (e.g., `yourdomain.com`)
4. Update DNS records as instructed
5. SSL is automatic!

---

## Part 2: Backend Deployment (Cloudflare Workers)

### Option A: Using Wrangler CLI (Recommended)

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Create wrangler.toml

Create file `wrangler.toml` in your project root:

```toml
name = "enginemarket-api"
type = "javascript"
account_id = "your_account_id"
workers_dev = true
route = "api.yourdomain.com/*"
zone_id = "your_zone_id"

[env.production]
vars = { ENVIRONMENT = "production" }

[build]
command = "npm install"
cwd = "./server"
main = "server/index.js"
```

#### Step 3: Configure Environment Variables

```bash
wrangler secret put MYSQL_HOST
wrangler secret put MYSQL_USER
wrangler secret put MYSQL_PASSWORD
wrangler secret put MYSQL_DATABASE
wrangler secret put MYSQL_PORT
```

#### Step 4: Deploy

```bash
wrangler publish
```

---

### Option B: Using Cloudflare Workers UI (Easier)

#### Step 1: Create Worker

1. Go to https://dash.cloudflare.com
2. Select your domain
3. Go to **"Workers"** → **"Create a Service"**
4. Name it: `enginemarket-api`
5. Click **"Create Service"**

#### Step 2: Add Your API Code

1. Click **"Quick Edit"**
2. Paste your Express server code
3. Click **"Save and Deploy"**

---

## Part 3: Database Setup (Cloudflare D1)

### Step 1: Create D1 Database

```bash
wrangler d1 create enginedb
```

### Step 2: Import Your Database

```bash
wrangler d1 execute enginedb --file=./mysql/schema.sql
```

### Step 3: Update Connection String

In your API code, use D1 connection:

```javascript
import { D1Database } from '@cloudflare/workers-types';

export default {
  async fetch(request, env) {
    const db = env.DB;
    const result = await db.prepare('SELECT * FROM products').all();
    return new Response(JSON.stringify(result));
  }
};
```

---

## Part 4: Connect Everything

### Step 1: Update Frontend API URL

In `.env` or `vite.config.ts`:

```env
VITE_API_URL=https://api.yourdomain.com
```

### Step 2: Configure CORS

In your API (server/index.js):

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Step 3: Update DNS Records

In Cloudflare DNS settings:

```
yourdomain.com          → Cloudflare Pages
api.yourdomain.com      → Cloudflare Workers
```

---

## Part 5: Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Backend (wrangler.toml)
```toml
[env.production]
vars = {
  MYSQL_HOST = "your_mysql_host"
  MYSQL_USER = "enginedb"
  MYSQL_PASSWORD = "your_password"
  MYSQL_DATABASE = "enginedb"
  MYSQL_PORT = "3306"
  NODE_ENV = "production"
}
```

---

## Part 6: Testing

### Test Frontend
```bash
curl https://yourdomain.com
```

### Test API
```bash
curl https://api.yourdomain.com/api/health
```

Expected response:
```json
{"ok": true, "db": "enginedb"}
```

---

## Part 7: Monitoring & Logs

### View Logs

**Frontend (Pages):**
1. Go to Cloudflare Pages project
2. Click **"Deployments"**
3. View build logs

**Backend (Workers):**
1. Go to Cloudflare Workers
2. Click your service
3. View real-time logs

---

## Troubleshooting

### Frontend Build Fails
- Check `npm run build` works locally
- Verify environment variables
- Check Node.js version compatibility

### API Returns 500 Errors
- Check database connection
- Verify environment variables
- Check CORS settings
- View Worker logs

### Can't Connect to Database
- Verify MySQL credentials
- Check database is accessible
- Verify firewall rules
- Test connection locally

### CORS Errors
- Update CORS origin in API
- Verify frontend domain
- Check headers

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Cloudflare Pages | FREE |
| Cloudflare Workers | $5/month (50M requests) |
| Cloudflare D1 | FREE (beta) |
| MySQL (external) | $5-15/month |
| **Total** | **$10-20/month** |

---

## Quick Commands

```bash
# Build frontend
npm run build

# Deploy frontend
# (automatic via GitHub)

# Deploy backend
wrangler publish

# View logs
wrangler tail

# Create database
wrangler d1 create enginedb

# Execute SQL
wrangler d1 execute enginedb --file=schema.sql
```

---

## Next Steps

1. ✅ Deploy frontend to Cloudflare Pages
2. ✅ Deploy backend to Cloudflare Workers
3. ✅ Set up D1 database
4. ✅ Configure DNS records
5. ✅ Test everything
6. ✅ Monitor logs

---

**Status**: Ready to deploy
**Frontend**: Cloudflare Pages
**Backend**: Cloudflare Workers
**Database**: Cloudflare D1 or External MySQL

