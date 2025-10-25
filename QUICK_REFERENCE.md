# ⚡ QUICK REFERENCE - DEPLOYMENT

## 🎯 The Simple Truth

| What | Where | Size |
|-----|-------|------|
| **Source Code** | GitHub (master) | ~40MB ✅ |
| **node_modules** | Your machine only | 900MB ❌ |
| **dist/** | Your machine only | 40MB ❌ |
| **.wrangler/** | Your machine only | Cache ❌ |

## 📝 Daily Workflow

```bash
# 1. Make changes to src/ files
# 2. Test locally
npm run dev

# 3. Build locally (creates dist/)
npm run build

# 4. Push to GitHub (ONLY source code)
git add .
git commit -m "Your message"
git push origin master

# 5. Cloudflare auto-deploys (2-3 minutes)
# Check: https://engine-9dr.pages.dev/
```

## 🚀 What Gets Pushed to GitHub

✅ `src/` - Your React code
✅ `public/` - Static files
✅ `functions/` - Cloudflare Functions
✅ `package.json` - Dependencies list
✅ `vite.config.ts` - Build config
✅ `wrangler.json` - Cloudflare Pages config
✅ `wrangler.toml` - Cloudflare Workers config

## ❌ What Does NOT Get Pushed

❌ `node_modules/` - Excluded by .gitignore
❌ `dist/` - Excluded by .gitignore
❌ `.wrangler/` - Excluded by .gitignore
❌ `.env` - Excluded by .gitignore

## 🔄 Deployment Happens Automatically

1. You push to GitHub
2. Cloudflare webhook triggers
3. Cloudflare runs: `npm install && npm run build`
4. Cloudflare deploys `dist/` folder
5. Website updates at https://engine-9dr.pages.dev/

## 🐛 Troubleshooting

**Q: Why isn't my change showing up?**
- A: Wait 2-3 minutes for Cloudflare to build and deploy
- A: Clear browser cache (Ctrl+Shift+Delete)
- A: Hard refresh (Ctrl+Shift+R)

**Q: How do I check if deployment succeeded?**
- A: Go to https://dash.cloudflare.com/ → Pages → Deployments

**Q: Can I push dist/ to GitHub?**
- A: No! It's in .gitignore. Cloudflare builds it automatically.

**Q: What if I need to change build settings?**
- A: Edit `wrangler.json` and push to GitHub

## 📊 Repository Status

```bash
# Check current status
git status

# Should show: "nothing to commit, working tree clean"

# Check what's tracked
git ls-files | wc -l

# Should be ~200-300 files (source code only)
```

## 🎯 Remember

- **Push to master** = Automatic deployment
- **Only source code** in GitHub
- **Cloudflare builds** from source
- **No more 900MB** repository
- **No more confusion** about what's deployed

---

**That's it! Simple and clean.** ✨

