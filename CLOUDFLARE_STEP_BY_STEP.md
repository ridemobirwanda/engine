# 🚀 Cloudflare Deployment - Step by Step

## Phase 1: Frontend Setup (Cloudflare Pages) - 10 minutes

### Step 1: Go to Cloudflare Pages

1. Visit https://pages.cloudflare.com
2. Click **"Connect to Git"**
3. Choose **GitHub**
4. Authorize Cloudflare to access your GitHub

### Step 2: Select Your Repository

1. Find your repository in the list
2. Click **"Begin setup"**
3. Select branch: **main** (or your default branch)

### Step 3: Configure Build Settings

**Project name:** `enginemarket` (or your choice)

**Build command:**
```
npm run build
```

**Build output directory:**
```
dist
```

**Root directory:** (leave empty)

### Step 4: Add Environment Variables

Click **"Environment variables"** and add:

```
VITE_API_URL = https://api.yourdomain.com
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_key
```

### Step 5: Deploy

1. Click **"Save and Deploy"**
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://enginemarket.pages.dev`
4. ✅ Frontend is live!

### Step 6: Add Custom Domain (Optional)

1. In your Pages project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter your domain: `yourdomain.com`
4. Update DNS records as shown
5. SSL is automatic! ✅

---

## Phase 2: Backend Setup (Cloudflare Workers) - 15 minutes

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authorize Wrangler.

### Step 3: Create wrangler.toml

In your project root, create `wrangler.toml`:

```toml
name = "enginemarket-api"
type = "javascript"
main = "server/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "enginemarket-api-prod"
route = "api.yourdomain.com/*"
zone_id = "your_zone_id"

[[env.production.vars]]
MYSQL_HOST = "your_mysql_host"
MYSQL_USER = "enginedb"
MYSQL_PASSWORD = "your_password"
MYSQL_DATABASE = "enginedb"
MYSQL_PORT = "3306"
NODE_ENV = "production"
```

### Step 4: Get Your Zone ID

1. Go to https://dash.cloudflare.com
2. Select your domain
3. Copy **Zone ID** from right sidebar
4. Paste into `wrangler.toml`

### Step 5: Deploy Backend

```bash
wrangler publish --env production
```

Wait for deployment to complete.

### Step 6: Get Your Worker URL

After deployment, you'll see:
```
✓ Uploaded enginemarket-api
✓ Published to https://api.yourdomain.com
```

✅ Backend is live!

---

## Phase 3: Database Setup - 10 minutes

### Option A: Use External MySQL (Recommended)

If you already have MySQL hosting:

1. Get your MySQL connection details
2. Add to `wrangler.toml`:
   ```toml
   MYSQL_HOST = "your_host"
   MYSQL_USER = "your_user"
   MYSQL_PASSWORD = "your_password"
   MYSQL_DATABASE = "your_db"
   ```
3. Deploy: `wrangler publish --env production`

### Option B: Use Cloudflare D1 (Beta)

```bash
# Create database
wrangler d1 create enginedb

# Import schema
wrangler d1 execute enginedb --file=./mysql/schema.sql

# Add to wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "enginedb"
database_id = "your_database_id"
```

---

## Phase 4: Connect Frontend to Backend - 5 minutes

### Step 1: Update Frontend Environment

In Cloudflare Pages project settings:

1. Go to **"Settings"** → **"Environment variables"**
2. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://api.yourdomain.com
   ```
3. Redeploy frontend

### Step 2: Test Connection

```bash
# Test API
curl https://api.yourdomain.com/api/health

# Should return:
# {"ok": true, "db": "enginedb"}
```

---

## Phase 5: Configure DNS - 5 minutes

### In Cloudflare Dashboard

1. Go to your domain
2. Click **"DNS"**
3. Add records:

```
Type    Name              Content
CNAME   yourdomain.com    enginemarket.pages.dev
CNAME   api               api.yourdomain.com (Workers)
```

Or use Cloudflare's automatic setup.

---

## Phase 6: Test Everything - 10 minutes

### Test Frontend

1. Visit `https://yourdomain.com`
2. Check if homepage loads
3. Check if products display
4. Check if images load

### Test API

```bash
# Health check
curl https://api.yourdomain.com/api/health

# Get products
curl https://api.yourdomain.com/api/products

# Get categories
curl https://api.yourdomain.com/api/categories
```

### Test Admin

1. Visit `https://yourdomain.com/admin`
2. Login with: `admin@admin.com` / `admin123`
3. Check dashboard
4. Test product management

---

## Phase 7: Monitoring - Ongoing

### View Frontend Logs

1. Go to Cloudflare Pages project
2. Click **"Deployments"**
3. Click latest deployment
4. View build logs

### View Backend Logs

```bash
wrangler tail
```

Or in Cloudflare dashboard:
1. Go to **"Workers"**
2. Click your service
3. View real-time logs

---

## Troubleshooting

### Frontend Build Fails
```bash
# Test locally first
npm run build

# Check for errors
npm run lint
```

### API Returns 500 Errors
```bash
# View logs
wrangler tail

# Check environment variables
wrangler env list
```

### Can't Connect to Database
- Verify MySQL credentials
- Check firewall allows Cloudflare IPs
- Test connection locally

### CORS Errors
Update in `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Quick Reference

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://yourdomain.com | ✅ |
| API | https://api.yourdomain.com | ✅ |
| Admin | https://yourdomain.com/admin | ✅ |

---

## Total Time: ~55 minutes

1. Frontend setup: 10 min
2. Backend setup: 15 min
3. Database setup: 10 min
4. Connect: 5 min
5. DNS: 5 min
6. Testing: 10 min

---

**Status**: ✅ READY TO DEPLOY
**Cost**: $5-20/month
**Uptime**: 99.9%+

