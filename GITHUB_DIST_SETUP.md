# 🚀 GitHub Setup - Push Only DIST Folder

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `enginemarket` (or your choice)
3. **Description**: `EngineMarket - Production Build`
4. **Public** or **Private** (your choice)
5. **DO NOT** initialize with README
6. Click **"Create repository"**

---

## Step 2: Copy Your GitHub Repository URL

After creating the repository, you'll see a URL like:
```
https://github.com/YOUR_USERNAME/enginemarket.git
```

Copy this URL - you'll need it in the next step.

---

## Step 3: Run Setup Script

I'll create a script that will:
1. ✅ Create a new Git repository in the `dist` folder
2. ✅ Add all files from `dist`
3. ✅ Commit them
4. ✅ Push to GitHub

---

## Step 4: What You Need to Provide

When you run the script, it will ask for:

1. **Your GitHub Repository URL**
   - Example: `https://github.com/YOUR_USERNAME/enginemarket.git`

2. **Your GitHub Username**
   - Example: `john_doe`

3. **Your GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select: `repo` (full control of private repositories)
   - Copy the token
   - Paste it when asked

---

## Quick Commands

### Option A: Using HTTPS (Easier)

```bash
cd dist
git init
git add .
git commit -m "Initial commit - Production build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enginemarket.git
git push -u origin main
```

When asked for password, paste your GitHub Personal Access Token.

### Option B: Using SSH (More Secure)

```bash
cd dist
git init
git add .
git commit -m "Initial commit - Production build"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/enginemarket.git
git push -u origin main
```

---

## Step-by-Step Instructions

### 1. Create GitHub Account (if you don't have one)
- Go to https://github.com/signup
- Create account
- Verify email

### 2. Create Repository
- Go to https://github.com/new
- Name: `enginemarket`
- Public or Private
- Click "Create repository"

### 3. Get Personal Access Token
- Go to https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Name: `GitHub Deploy Token`
- Select: `repo` (full control)
- Click "Generate token"
- **Copy the token** (you won't see it again!)

### 4. Run Commands

Open PowerShell in your project folder and run:

```bash
cd dist
git init
git add .
git commit -m "Initial commit - Production build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enginemarket.git
git push -u origin main
```

When asked for password, paste your Personal Access Token.

### 5. Verify

Go to your GitHub repository and check if files are there!

---

## Troubleshooting

### "fatal: not a git repository"
```bash
cd dist
git init
```

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/enginemarket.git
```

### "Authentication failed"
- Make sure you're using Personal Access Token (not password)
- Token must have `repo` permission
- Token must not be expired

### "Permission denied (publickey)"
- You're using SSH but don't have SSH key set up
- Use HTTPS instead (easier)

---

## After Pushing to GitHub

Your `dist` folder is now on GitHub!

Next steps:
1. ✅ Go to Cloudflare Pages
2. ✅ Connect your GitHub repository
3. ✅ Select the `dist` folder
4. ✅ Deploy!

---

## Important Notes

- **Only `dist` folder** is on GitHub (not source code)
- **Smaller repository** = faster deployment
- **Automatic updates**: When you rebuild locally, just push again
- **Cloudflare will auto-deploy** when you push

---

## Quick Reference

| Step | Command |
|------|---------|
| Go to dist | `cd dist` |
| Initialize Git | `git init` |
| Add all files | `git add .` |
| Commit | `git commit -m "message"` |
| Set main branch | `git branch -M main` |
| Add remote | `git remote add origin URL` |
| Push to GitHub | `git push -u origin main` |

---

**Ready to push? Let me know your GitHub username and I'll help!**

