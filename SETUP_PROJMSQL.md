# 🚀 Engine Core - MySQL Version Setup

## 📁 **Project Location**
```
F:\xampp\htdocs\enginecore\projmsql
```

This is your clean MySQL-only version of the project!

---

## ✅ **What's Included**

### **Core Files**
- ✅ **93 files** copied
- ✅ **Source code** (src/ - 100+ files)
- ✅ **Server** (server/)
- ✅ **Public files** (public/)
- ✅ **Product images** (33 images - 205MB)
- ✅ **MySQL schemas** (mysql/)
- ✅ **Configuration** (package.json, vite.config.ts, etc.)
- ✅ **All scripts** (.bat, .js files)
- ✅ **Documentation** (all .md files)

### **Database**
- ✅ **Type:** MySQL
- ✅ **Name:** enginedb
- ✅ **Products:** 27 products
- ✅ **Admin user:** admin@admin.com / admin123

### **Images**
- ✅ **Location:** /public/images/products/
- ✅ **Count:** 33 files (32 images + 1 video)
- ✅ **Size:** 205MB total

---

## 🔧 **Setup Instructions**

### **Step 1: Install Dependencies**

```bash
cd F:\xampp\htdocs\enginecore\projmsql
npm install
```

This will install all required packages (may take 2-3 minutes).

---

### **Step 2: Configure Database**

The `.env` file is already created with these settings:

```env
MYSQL_HOST=localhost
MYSQL_USER=enginedb
MYSQL_PASSWORD=yourpass
MYSQL_DATABASE=enginedb
MYSQL_PORT=3306

VITE_API_URL=http://localhost:3001
```

**✅ Database already exists in your XAMPP MySQL!**

---

### **Step 3: Start API Server**

**Terminal 1:**
```bash
cd F:\xampp\htdocs\enginecore\projmsql
npm run api
```

You should see:
```
API server listening on port 3001
Table profiles ensured.
Table users ensured.
Table sessions ensured.
```

---

### **Step 4: Start Development Server**

**Terminal 2:**
```bash
cd F:\xampp\htdocs\enginecore\projmsql
npm run dev
```

You should see:
```
VITE v7.1.7  ready in XXXXms

➜  Local:   http://localhost:21201/
➜  Network: http://192.168.8.104:21201/
```

---

### **Step 5: Open in Browser**

1. Go to: **http://localhost:21201/**
2. Click **Admin** in the menu
3. Login with:
   - **Email:** `admin@admin.com`
   - **Password:** `admin123`

---

## 🎯 **Features Working**

- ✅ **Authentication** - MySQL users/sessions
- ✅ **Products** - 27 products with images
- ✅ **Images** - Local file serving
- ✅ **Orders** - Full CRUD
- ✅ **Customers** - Management
- ✅ **Cart** - Add to cart, checkout
- ✅ **Settings** - Website configuration
- ✅ **Contact Messages** - Inbox
- ✅ **Categories** - Product categories
- ✅ **Admin Panel** - Full access control

---

## 📊 **Project Structure**

```
projmsql/
├── src/                    ← React source code
│   ├── components/         ← UI components
│   ├── pages/             ← Page components
│   ├── services/          ← API services (MySQL)
│   ├── hooks/             ← Custom hooks
│   └── utils/             ← Utilities
│
├── server/                ← Express API server
│   ├── index.js          ← Main API routes
│   ├── db.js             ← MySQL connection
│   └── authController.js ← Auth logic
│
├── public/               ← Static files
│   └── images/
│       └── products/     ← 33 product images
│
├── mysql/                ← Database schemas
│   ├── schema.sql        ← Main tables
│   └── auth_schema.sql   ← Auth tables
│
├── package.json          ← Dependencies
├── vite.config.ts        ← Vite configuration
└── .env                  ← Environment variables
```

---

## 🔐 **Login Credentials**

### **Admin Login**
- **URL:** http://localhost:21201/admin/login
- **Email:** admin@admin.com
- **Password:** admin123
- **Role:** Super Admin (full access)

---

## 🛠️ **Available Scripts**

```bash
# Development
npm run dev          # Start dev server (port 21201)
npm run api          # Start API server (port 3001)

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Database
npm run import:full  # Re-import database from enginedb.sql
npm run seed         # Seed sample data

# Images
npm run update:images  # Update product images from /public/images/products/
```

---

## 📝 **Important Files**

| File | Purpose |
|------|---------|
| `.env` | MySQL connection settings |
| `package.json` | Project dependencies |
| `server/index.js` | API routes and logic |
| `src/services/authService.ts` | Frontend auth |
| `LOGIN_INSTRUCTIONS.md` | Login guide |
| `SUPABASE_CLEANUP_COMPLETE.md` | Migration details |

---

## 🔥 **Quick Commands**

### **Full Restart**
```bash
# Kill old processes and start fresh
cd F:\xampp\htdocs\enginecore\projmsql
KILL-AND-RESTART-API.bat
```

### **Re-import Database**
```bash
cd F:\xampp\htdocs\enginecore\projmsql
FINAL-IMPORT.bat
```

### **Update Images**
```bash
cd F:\xampp\htdocs\enginecore\projmsql
UPDATE-IMAGES.bat
```

---

## 🐛 **Troubleshooting**

### **Problem: Port 3001 already in use**
```bash
# Kill the process using port 3001
netstat -ano | findstr :3001
taskkill /F /PID [PID_NUMBER]
```

### **Problem: Port 21201 already in use**
```bash
# Kill the process using port 21201
netstat -ano | findstr :21201
taskkill /F /PID [PID_NUMBER]
```

### **Problem: Images not loading**
1. Check: `F:\xampp\htdocs\enginecore\projmsql\public\images\products\`
2. Restart API server
3. Hard refresh browser (Ctrl+Shift+R)

### **Problem: Login not working**
1. Check API server is running (port 3001)
2. Clear browser localStorage: `F12` → Console → `localStorage.clear()`
3. Refresh page

---

## ✅ **Verification Checklist**

- [ ] `npm install` completed successfully
- [ ] API server running on port 3001
- [ ] Dev server running on port 21201
- [ ] Can open http://localhost:21201/
- [ ] Can see products with images
- [ ] Can login to admin panel
- [ ] No console errors

---

## 📚 **Documentation**

Included documentation files:
- `README.md` - This file
- `LOGIN_INSTRUCTIONS.md` - Login guide
- `SUPABASE_CLEANUP_COMPLETE.md` - What was cleaned
- `CLEANUP-SUCCESS.md` - Migration success
- `IMAGE_FIX_COMPLETE.md` - Image setup
- `IMPORT_INSTRUCTIONS_FINAL.md` - Database import

---

## 🎉 **You're All Set!**

Your clean MySQL project is ready to use!

**No Supabase. No quota limits. Full control.**

---

**Created:** October 10, 2025  
**Location:** F:\xampp\htdocs\enginecore\projmsql  
**Status:** ✅ **READY TO USE**


