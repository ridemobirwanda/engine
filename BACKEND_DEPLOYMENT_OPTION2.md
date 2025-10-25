# 🚀 Backend Deployment - Option 2: Cloudflare Workers + PlanetScale

## 📋 Overview

Deploy your Express.js backend to **Cloudflare Workers** (FREE) and your MySQL database to **PlanetScale** (FREE tier).

---

## ✅ What You'll Get

- ✓ Serverless backend (Cloudflare Workers)
- ✓ Global API deployment
- ✓ MySQL database (PlanetScale)
- ✓ Auto-scaling
- ✓ FREE tier available
- ✓ Production-ready

---

## 🎯 Deployment Steps

### Step 1: Create PlanetScale Account

1. Go to: https://planetscale.com
2. Click: **"Sign up"**
3. Choose: **"Sign up with GitHub"**
4. Authorize PlanetScale
5. Create account
6. Done! ✅

---

### Step 2: Create Database on PlanetScale

1. Go to: https://app.planetscale.com
2. Click: **"Create a database"**
3. Name: `enginemarket`
4. Region: Choose closest to you
5. Click: **"Create database"**
6. Wait for creation (1-2 minutes)

---

### Step 3: Get Database Connection String

1. Go to your database
2. Click: **"Connect"**
3. Select: **"Node.js"**
4. Copy the connection string
5. Save it somewhere safe

Connection string format:
```
mysql://[username]:[password]@[host]/[database]
```

---

### Step 4: Create Cloudflare Workers Project

1. Go to: https://dash.cloudflare.com
2. Click: **"Workers & Pages"**
3. Click: **"Create application"**
4. Select: **"Create a Worker"**
5. Name: `enginemarket-api`
6. Click: **"Create"**

---

### Step 5: Deploy Backend to Cloudflare Workers

We'll use Wrangler (Cloudflare CLI tool):

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create new worker project
wrangler init enginemarket-api

# Copy your Express.js code
# Update to work with Cloudflare Workers

# Deploy
wrangler deploy
```

---

### Step 6: Configure Environment Variables

In Cloudflare Workers dashboard:

1. Go to your worker
2. Click: **"Settings"**
3. Click: **"Environment variables"**
4. Add:
   - `DATABASE_URL`: Your PlanetScale connection string
   - `NODE_ENV`: `production`
5. Click: **"Save"**

---

### Step 7: Update Frontend API URL

In your React frontend:

```javascript
// Update API URL to point to Cloudflare Workers
const API_URL = 'https://enginemarket-api.your-account.workers.dev';

// Or use environment variable
const API_URL = process.env.REACT_APP_API_URL;
```

---

### Step 8: Test Backend

1. Visit your API: `https://enginemarket-api.your-account.workers.dev/api/products`
2. Should return JSON data
3. Check browser console for errors
4. Test all endpoints

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

- **Cloudflare Workers**: FREE (up to 100,000 requests/day)
- **PlanetScale**: FREE tier (5GB storage, unlimited queries)
- **Total**: FREE! 🎉

---

## 🔗 Your URLs

After deployment:

```
Frontend: https://engine.pages.dev
Backend API: https://enginemarket-api.your-account.workers.dev
Database: PlanetScale dashboard
```

---

## ✅ Deployment Checklist

- [ ] Create PlanetScale account
- [ ] Create database on PlanetScale
- [ ] Get connection string
- [ ] Create Cloudflare Workers project
- [ ] Deploy backend to Workers
- [ ] Configure environment variables
- [ ] Update frontend API URL
- [ ] Test backend endpoints
- [ ] Verify database connection

---

## 🆘 Troubleshooting

### Database Connection Failed
- Check connection string
- Verify PlanetScale credentials
- Check firewall settings

### API Returns 500 Error
- Check Cloudflare Workers logs
- Verify environment variables
- Check database connection

### CORS Errors
- Add CORS headers to API
- Update frontend API URL
- Check browser console

---

## 📝 Next Steps

1. Create PlanetScale account
2. Create database
3. Get connection string
4. Deploy to Cloudflare Workers
5. Test everything
6. Update frontend

**Ready to start?** Let me know! 🚀

