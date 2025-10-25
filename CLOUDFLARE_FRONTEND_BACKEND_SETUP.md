# 🚀 Cloudflare - Frontend & Backend Complete Setup

## Overview
Deploy your entire EngineMarket on Cloudflare:
- **Frontend**: Cloudflare Pages (React)
- **Backend**: Cloudflare Workers (Express API)
- **Database**: External MySQL (Railway or PlanetScale)

---

## Part 1: Frontend Deployment (Cloudflare Pages)

### Step 1: Build Your Frontend

```bash
npm run build
```

This creates a `dist` folder with your optimized React app.

### Step 2: Deploy to Cloudflare Pages

#### Option A: Using GitHub (Recommended)

1. Go to https://pages.cloudflare.com
2. Click **"Connect to Git"**
3. Select **GitHub** and authorize
4. Choose your repository
5. Click **"Begin setup"**

**Configure:**
- **Project name**: `enginemarket`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: (leave empty)

**Environment Variables:**
```
VITE_API_URL = https://api.yourdomain.com
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_key
```

6. Click **"Save and Deploy"**
7. Wait 2-3 minutes for build
8. ✅ Frontend is live!

#### Option B: Using Wrangler CLI

```bash
npm install -g wrangler
wrangler pages deploy dist --project-name=enginemarket
```

### Step 3: Add Custom Domain (Optional)

1. In Cloudflare Pages project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain: `yourdomain.com`
4. Update DNS records as shown
5. SSL is automatic! ✅

---

## Part 2: Backend Deployment (Cloudflare Workers)

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This opens your browser to authorize.

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
zone_id = "YOUR_ZONE_ID"

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

✅ Backend is live at: `https://api.yourdomain.com`

---

## Part 3: Database Setup

### Option A: Railway MySQL (Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Create **New Project** → **Provision MySQL**
4. Copy connection details:
   - Host
   - User
   - Password
   - Database
   - Port

5. Add to `wrangler.toml`:
```toml
MYSQL_HOST = "railway_host"
MYSQL_USER = "railway_user"
MYSQL_PASSWORD = "railway_password"
MYSQL_DATABASE = "railway_db"
MYSQL_PORT = "3306"
```

6. Import your database:
```bash
mysqldump -u enginedb -p enginedb > backup.sql
mysql -h [RAILWAY_HOST] -u [USER] -p [PASSWORD] [DB] < backup.sql
```

### Option B: PlanetScale MySQL

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create new database
4. Copy connection string
5. Add to `wrangler.toml`

---

## Part 4: Connect Everything

### Step 1: Update Frontend Environment

In Cloudflare Pages project settings:

1. Go to **"Settings"** → **"Environment variables"**
2. Update `VITE_API_URL`:
   ```
   VITE_API_URL = https://api.yourdomain.com
   ```
3. Redeploy frontend

### Step 2: Configure CORS

In `server/index.js`, update CORS:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Step 3: Redeploy Backend

```bash
wrangler publish --env production
```

---

## Part 5: Configure DNS

In Cloudflare DNS settings:

```
Type    Name              Content
CNAME   yourdomain.com    enginemarket.pages.dev
CNAME   api               api.yourdomain.com
```

Or let Cloudflare auto-configure.

---

## Part 6: Test Everything

### Test Frontend

```bash
curl https://yourdomain.com
```

Should return HTML of your homepage.

### Test API

```bash
curl https://api.yourdomain.com/api/health
```

Should return:
```json
{"ok": true, "db": "enginedb"}
```

### Test Admin

1. Visit `https://yourdomain.com/admin`
2. Login: `admin@admin.com` / `admin123`
3. Check dashboard

---

## Part 7: Monitoring

### View Frontend Logs

1. Go to Cloudflare Pages project
2. Click **"Deployments"**
3. View build logs

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
npm run build
npm run lint
```

### API Returns 500 Errors
```bash
wrangler tail
```

### Can't Connect to Database
- Verify MySQL credentials
- Check firewall allows Cloudflare IPs
- Test connection locally

### CORS Errors
Update `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Cloudflare Pages | FREE |
| Cloudflare Workers | $5/month |
| MySQL (Railway) | $5-15/month |
| **Total** | **$10-20/month** |

---

## Quick Commands

```bash
# Build frontend
npm run build

# Deploy backend
wrangler publish --env production

# View logs
wrangler tail

# Test API
curl https://api.yourdomain.com/api/health
```

---

**Status**: ✅ READY TO DEPLOY
**Time**: ~1 hour total
**Uptime**: 99.9%+

