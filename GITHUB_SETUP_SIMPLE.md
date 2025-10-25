# 🚀 GitHub Setup - Simple Steps

## ⚡ Quick Start (5 Minutes)

### Step 1: Create GitHub Account (if needed)
- Go to https://github.com/signup
- Create account
- Verify email

### Step 2: Create Repository
- Go to https://github.com/new
- **Name**: `enginemarket`
- **Public** (anyone can see)
- **DO NOT** check "Initialize with README"
- Click **"Create repository"**

### Step 3: Get Personal Access Token
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. **Token name**: `Deploy Token`
4. **Select**: `repo` (full control)
5. Click **"Generate token"**
6. **COPY the token** (you won't see it again!)

### Step 4: Run the Script
1. Open PowerShell in your project folder
2. Run: `.\push-dist-to-github.bat`
3. Enter your GitHub repository URL:
   ```
   https://github.com/YOUR_USERNAME/enginemarket.git
   ```
4. When asked for password, paste your Personal Access Token
5. Done! ✅

---

## 📋 What You Need

### 1. GitHub Username
- Example: `john_doe`

### 2. Repository URL
- Format: `https://github.com/YOUR_USERNAME/enginemarket.git`
- Example: `https://github.com/john_doe/enginemarket.git`

### 3. Personal Access Token
- Go to: https://github.com/settings/tokens
- Generate new token (classic)
- Select: `repo`
- Copy token

---

## 🎯 Step-by-Step

### Step 1: GitHub Account
```
1. Go to https://github.com/signup
2. Enter email
3. Create password
4. Choose username
5. Verify email
```

### Step 2: Create Repository
```
1. Go to https://github.com/new
2. Repository name: enginemarket
3. Description: EngineMarket Production Build
4. Public
5. Create repository
```

### Step 3: Get Token
```
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Token name: Deploy Token
4. Check: repo (full control)
5. Generate token
6. COPY IT!
```

### Step 4: Push to GitHub
```
1. Open PowerShell
2. Go to your project folder
3. Run: .\push-dist-to-github.bat
4. Enter GitHub URL
5. Enter Personal Access Token when asked
6. Done!
```

---

## 🔑 Personal Access Token

### How to Create:
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Fill in:
   - **Token name**: `Deploy Token`
   - **Expiration**: 90 days (or longer)
   - **Select scopes**: Check `repo`
4. Click **"Generate token"**
5. **COPY the token immediately** (you won't see it again!)

### How to Use:
- When script asks for "password", paste the token
- Don't use your GitHub password!

---

## 📝 Example

### Your GitHub Info:
```
Username: john_doe
Repository: enginemarket
URL: https://github.com/john_doe/enginemarket.git
Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### When Running Script:
```
Enter your GitHub repository URL: https://github.com/john_doe/enginemarket.git
[Enter pressed]
[Script asks for password]
[Paste your token]
[Enter pressed]
✅ Done!
```

---

## ✅ Verification

After running the script:

1. Go to https://github.com/YOUR_USERNAME/enginemarket
2. You should see your files there!
3. Check the `dist` folder contents

---

## 🆘 Troubleshooting

### "dist folder not found"
```bash
npm run build
```
Then run the script again.

### "Authentication failed"
- Make sure you're using Personal Access Token (not password)
- Token must have `repo` permission
- Token must not be expired

### "fatal: remote origin already exists"
- The script will handle this automatically
- Just run it again

### "fatal: not a git repository"
- The script will initialize Git
- Just run it again

---

## 🎉 After Pushing

Your `dist` folder is now on GitHub!

### Next Steps:
1. ✅ Go to https://pages.cloudflare.com
2. ✅ Click "Connect to Git"
3. ✅ Select your GitHub repository
4. ✅ Deploy!

---

## 📚 Files Created

- **GITHUB_DIST_SETUP.md** - Detailed guide
- **push-dist-to-github.bat** - Automated script
- **GITHUB_SETUP_SIMPLE.md** - This file

---

## 🚀 Ready?

1. Create GitHub account (if needed)
2. Create repository
3. Get Personal Access Token
4. Run: `.\push-dist-to-github.bat`
5. Done! ✅

---

**Questions? Let me know!**

