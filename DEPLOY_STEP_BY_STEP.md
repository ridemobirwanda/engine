# 📝 Deploy to GitHub - Step by Step Manual Guide

## Your GitHub Repository
```
git@github.com:mobiride123/enginemarkets.git
```

---

## STEP 1: Build Production Files (2-5 minutes)

Open Command Prompt in your project folder and run:

```bash
npm run build
```

**⏰ This takes 2-5 minutes. Be patient!**

You'll see output like:
- `transforming (1) src\main.tsx`
- `transforming (50) src\components\...`
- `transforming (200) src\...`
- `✓ built in 2m 30s`

When done, you'll have a `dist` folder.

---

## STEP 2: Create Deployment Folder

```bash
cd ..
mkdir enginemarkets-deploy
cd enginemarkets-deploy
```

---

## STEP 3: Copy Dist Files

```bash
xcopy /E /I ..\projmsql\dist\* .
```

This copies all production files to the deployment folder.

---

## STEP 4: Create README and Config Files

Create `README.md`:
```
# EngineMarkets

Production build of EngineMarkets application.

Deployed to Cloudflare Pages.
```

Create `_redirects` (for React Router to work):
```
/*    /index.html    200
```

Create `.gitignore`:
```
.DS_Store
Thumbs.db
*.log
```

---

## STEP 5: Initialize Git

```bash
git init
git add .
git commit -m "Initial production build"
git branch -M main
```

---

## STEP 6: Connect to Your GitHub

```bash
git remote add origin git@github.com:mobiride123/enginemarkets.git
```

---

## STEP 7: Push to GitHub

**Option A: If repository is NEW/EMPTY:**
```bash
git push -u origin main
```

**Option B: If repository already has content:**
```bash
git push -u origin main --force
```
(This overwrites existing content with your dist files)

---

## ✅ Done!

Your code is now on GitHub at:
```
https://github.com/mobiride123/enginemarkets
```

---

## Next: Deploy to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Sign up or log in
3. Click **Workers & Pages**
4. Click **Create Application**
5. Select **Pages**
6. Click **Connect to Git**
7. Authorize GitHub
8. Select repository: **enginemarkets**
9. Configure:
   - **Project name:** enginemarkets
   - **Production branch:** main
   - **Build command:** (leave empty)
   - **Build output directory:** / (or leave empty)
10. Click **Save and Deploy**

**Wait 1-2 minutes...**

✅ Your site will be live at: `https://enginemarkets.pages.dev`

---

## For Future Updates

After making changes to your code:

1. **Rebuild:**
   ```bash
   cd F:\xampp\htdocs\enginecore\projmsql
   npm run build
   ```

2. **Update deployment:**
   ```bash
   cd ..\enginemarkets-deploy
   del /Q *
   xcopy /E /I ..\projmsql\dist\* .
   git add .
   git commit -m "Update"
   git push
   ```

Cloudflare auto-deploys in 1-2 minutes!

---

## Troubleshooting

### "Permission denied (publickey)"
You need to set up SSH key with GitHub:
1. Run: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Copy key: `type %USERPROFILE%\.ssh\id_ed25519.pub`
3. Add to GitHub: Settings → SSH Keys → New SSH Key

OR use HTTPS instead:
```bash
git remote set-url origin https://github.com/mobiride123/enginemarkets.git
git push -u origin main
```

### "Repository not found"
- Check repository exists at: https://github.com/mobiride123/enginemarkets
- Make sure you have access rights
- Try HTTPS URL instead of SSH

### "Build taking too long"
This is normal for first build. Wait it out. Next builds are faster.

---

## Quick Reference Commands

```bash
# Build
npm run build

# Check if dist exists
dir dist

# Go to deployment folder
cd ..\enginemarkets-deploy

# Check git status
git status

# Push changes
git push

# View remote
git remote -v
```

---

## Alternative: Use the Automated Script

Once the build completes, just run:
```bash
deploy-to-my-github.bat
```

It does all these steps automatically!

---

**Need help?** Check the other guides:
- `CLOUDFLARE_QUICK_START.md`
- `deploy-to-cloudflare-guide.md`

