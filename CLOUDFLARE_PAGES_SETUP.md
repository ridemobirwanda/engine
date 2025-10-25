# ☁️ Cloudflare Pages Setup Instructions

## 🚨 IMPORTANT: Manual Dashboard Configuration Required

The website won't work until you configure Cloudflare Pages through the dashboard. Here's what to do:

## Step 1: Go to Cloudflare Dashboard

1. Visit: https://dash.cloudflare.com/
2. Log in with your account
3. Select your domain or Pages project

## Step 2: Configure Build Settings

1. Go to **Pages** → **engine-9dr**
2. Click **Settings** → **Build & Deployments**
3. Set the following:

   **Build Command**: `npm run build`
   **Build Output Directory**: `dist`
   **Root Directory**: `/` (leave empty or /)

## Step 3: Configure Environment Variables (if needed)

1. Go to **Settings** → **Environment Variables**
2. Add any environment variables your app needs
3. Click **Save**

## Step 4: Trigger a New Deployment

1. Go to **Deployments** tab
2. Click **Retry Build** on the latest deployment
3. OR push a new commit to GitHub to trigger auto-deployment

## Step 5: Verify Deployment

1. Wait 2-3 minutes for build to complete
2. Check **Deployments** tab for build logs
3. Visit https://engine-9dr.pages.dev/
4. Check browser console (F12) for errors

## 📁 File Structure

```
project/
├── public/
│   ├── _worker.js          ← SPA routing handler
│   ├── _redirects          ← Redirect rules
│   ├── _headers            ← HTTP headers
│   └── cloudflare-bypass.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── ...
├── dist/                   ← Built files (generated)
├── index.html              ← Entry point
├── vite.config.ts
├── wrangler.json           ← Pages config
├── wrangler.toml           ← Workers config
└── package.json
```

## 🔧 Key Files

### `public/_worker.js`
- Handles SPA routing
- Serves index.html for all non-static routes
- Allows React Router to work

### `public/_redirects`
- Backup routing rules
- Syntax: `/* /index.html 200`

### `wrangler.json`
- Cloudflare Pages configuration
- Build command and output directory

### `index.html`
- Vite entry point
- Loads React app

## ✅ Checklist

- [ ] Logged into Cloudflare dashboard
- [ ] Found Pages project (engine-9dr)
- [ ] Set Build Command: `npm run build`
- [ ] Set Build Output: `dist`
- [ ] Triggered new deployment
- [ ] Waited 2-3 minutes
- [ ] Visited https://engine-9dr.pages.dev/
- [ ] Website loads successfully

## 🐛 Troubleshooting

### Still Getting 500 Error?

1. **Check build logs**:
   - Go to Deployments tab
   - Click on latest deployment
   - Look for error messages

2. **Check _worker.js**:
   - Make sure it exists in public/
   - Make sure it's valid JavaScript

3. **Check _redirects**:
   - Should contain: `/* /index.html 200`

4. **Clear cache**:
   - Ctrl+Shift+Delete (browser cache)
   - Ctrl+Shift+R (hard refresh)

### Build Failing?

1. Check if `npm run build` works locally
2. Check if all dependencies are installed
3. Check for TypeScript errors
4. Check build logs in Cloudflare dashboard

### Website Loads But Pages Don't Work?

1. Check browser console (F12)
2. Look for JavaScript errors
3. Check Network tab for failed requests
4. Verify React is loading

## 📞 Support

If still not working:
1. Check Cloudflare status page
2. Check GitHub Actions logs
3. Try manual deployment retry
4. Check browser console for errors

---

**Status**: Configuration files ready, awaiting dashboard setup
**Next Step**: Configure in Cloudflare dashboard

