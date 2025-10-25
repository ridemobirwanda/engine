# 🔄 GitHub Account Switcher Guide

## You Have Multiple GitHub Accounts

When you have multiple GitHub accounts on the same computer, you need to choose which one to use for each repository.

---

## 🎯 Quick Solution (Easiest)

### Method 1: Clear Credentials & Login Fresh

**Step 1: Clear Windows Credential Manager**
1. Press `Windows Key`
2. Search: **"Credential Manager"**
3. Click **"Windows Credentials"**
4. Find entries with **"git:https://github.com"**
5. Click each one → **Remove**

**Step 2: Push (Git will ask for login)**
```bash
cd ..\enginemarkets-deploy
git remote add origin https://github.com/mobiride123/enginemarkets.git
git push -u origin main
```

When prompted:
- **Username:** mobiride123
- **Password:** Your Personal Access Token or Password

---

## 🔐 Personal Access Token (Recommended)

If you have 2FA enabled OR want more security:

### Create Token:
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Classic"**
3. Name: `Cloudflare Deploy`
4. Expiration: `90 days` (or your choice)
5. Select scopes:
   - ✅ **repo** (all permissions)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (won't see it again!)

### Use Token:
When Git asks for password, paste the token instead!

---

## 🎭 Method 2: Specify Account Per Repository

```bash
cd ..\enginemarkets-deploy

# Set user for THIS repository only
git config user.name "mobiride123"
git config user.email "your-email@example.com"

# Add remote
git remote add origin https://mobiride123@github.com/mobiride123/enginemarkets.git

# Push (will ask for password/token)
git push -u origin main
```

**Note:** Including username in URL helps Git know which account to use!

---

## 🔧 Method 3: Use Git Credential Manager

Windows Git Credential Manager allows account selection:

```bash
# Install Git Credential Manager (if not installed)
winget install --id Git.Git -e --source winget

# Configure to always ask
git config --global credential.helper manager

# Push
git push -u origin main
```

Git will show a popup to:
- Choose browser/device code
- Login to specific GitHub account
- Save credentials for later

---

## ⚡ Quick Commands for Your Situation

**Right now, run these:**

```bash
cd ..\enginemarkets-deploy

# Remove any existing remote
git remote remove origin

# Add remote with username
git remote add origin https://mobiride123@github.com/mobiride123/enginemarkets.git

# Check remote
git remote -v

# Push (will ask for password/token)
git push -u origin main --force
```

When it asks for password:
- If NO 2FA: Use your GitHub password
- If 2FA enabled: Use Personal Access Token

---

## 🆘 Troubleshooting

### "Authentication failed"
- ✅ Use Personal Access Token instead of password
- ✅ Check username is correct: `mobiride123`
- ✅ Clear credentials and try again

### "Repository not found"
- ✅ Verify repository exists: https://github.com/mobiride123/enginemarkets
- ✅ Check you have push permissions
- ✅ Try with username in URL

### "Permission denied"
- ✅ Make sure you're logged into correct account
- ✅ Check repository access settings
- ✅ Create Personal Access Token with `repo` permissions

### "Another account is signed in"
- ✅ Clear Credential Manager (see Method 1)
- ✅ Use incognito browser for GitHub login
- ✅ Use Git Credential Manager

---

## 📋 Complete Workflow

1. ✅ **Build** (DONE - you have dist folder)
2. ✅ **Copy to deploy folder** (DONE)
3. 🔄 **Choose account** (NOW)
4. ⏳ **Push to GitHub** (NEXT)
5. ⏳ **Connect Cloudflare** (AFTER)

---

## 🚀 Ready to Push?

**Run this script:**
```bash
PUSH-WITH-ACCOUNT-CHOICE.bat
```

OR **Manual commands:**
```bash
cd ..\enginemarkets-deploy
git remote add origin https://mobiride123@github.com/mobiride123/enginemarkets.git
git push -u origin main --force
```

Enter your credentials when asked!

---

## ✅ After Successful Push

Once you see: `✓✓✓ SUCCESS!`

**Next step: Connect to Cloudflare**
1. Go to: https://dash.cloudflare.com
2. **Workers & Pages** → **Create Application** → **Pages**
3. **Connect to Git**
4. Select: **enginemarkets** repository
5. Build settings: Leave all EMPTY
6. **Deploy!**

Your site will be live at: `https://enginemarkets.pages.dev`

---

**Need help?** Run the script or follow the manual commands!

