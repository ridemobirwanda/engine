# 🎯 Export ENTIRE Supabase Database - Complete Guide

## 🚀 **3 Methods to Export Your FULL Database**

Choose the method that works best for you:

---

## ⚡ **Method 1: Automated Script (Easiest!)**

Just double-click this file:
```
export-supabase-database.bat
```

**What it does:**
1. ✅ Installs Supabase CLI
2. ✅ Logs you into Supabase
3. ✅ Links to your project
4. ✅ Exports ALL data to `supabase_data.sql`
5. ✅ Exports schema to `supabase_schema.sql`

**Result:** You get your complete database in 2 SQL files!

---

## 💻 **Method 2: Manual Commands (More Control)**

### Step-by-Step:

#### 1. Install Supabase CLI
```powershell
npm install -g supabase
```

#### 2. Login to Supabase
```powershell
supabase login
```
*(Opens browser - login with your Supabase credentials)*

#### 3. Link Your Project
```powershell
supabase link --project-ref dfmbicodohmkyasuofov
```
*(Enter your database password when asked)*

#### 4. Export Everything
```powershell
# Export all data from all tables
npm run export:supabase:all
```

**OR use the full command:**
```powershell
supabase db dump -f complete_database.sql
```

**This creates:** `complete_database.sql` with:
- ✅ All table structures
- ✅ All data from all tables
- ✅ All indexes, constraints, functions
- ✅ Complete PostgreSQL dump

---

## 🌐 **Method 3: Supabase Dashboard (If CLI Fails)**

### If you can't use CLI:

1. **Go to Dashboard:**
   - Open: https://supabase.com/dashboard/project/dfmbicodohmkyasuofov

2. **Create Backup:**
   - Click **Database** (left sidebar)
   - Click **Backups** tab
   - Click **Create backup** button
   - Wait for backup to complete

3. **Download Backup:**
   - Click **Download** button next to your backup
   - Save the `.sql` file

**Result:** Full PostgreSQL backup file downloaded!

---

## 📊 **What You Get:**

After export, you'll have a file like `complete_database.sql` containing:

### All Tables:
- ✅ products (your 28 products)
- ✅ categories
- ✅ orders
- ✅ order_items
- ✅ cart_items
- ✅ website_settings
- ✅ contact_messages
- ✅ admin_users
- ✅ profiles
- ✅ Any other tables you created

### Plus:
- ✅ Table structures (CREATE TABLE statements)
- ✅ All data (INSERT statements)
- ✅ Indexes
- ✅ Foreign keys
- ✅ Constraints

---

## 🔄 **Convert PostgreSQL → MySQL**

Your export is in PostgreSQL format. Convert it to MySQL:

```powershell
node convert-postgres-to-mysql.js complete_database.sql mysql_ready.sql
```

**This creates:** `mysql_ready.sql` in MySQL-compatible format

---

## 📥 **Import to MySQL**

### Option A: phpMyAdmin (Recommended)

1. Open: http://localhost/phpmyadmin
2. Select `enginedb` database
3. Click **Import** tab
4. Choose file: `mysql_ready.sql`
5. Format: **SQL**
6. Click **Go**
7. Wait for completion ✅

### Option B: Command Line (Faster)

```powershell
mysql -u enginedb -p enginedb < mysql_ready.sql
```
Enter password: `yourpass`

---

## ✅ **Verify Import**

### 1. Check phpMyAdmin

- Go to: http://localhost/phpmyadmin
- Select `enginedb`
- Browse each table
- Confirm data is there

### 2. Check Admin Panel

```powershell
# Terminal 1 - Start API
$env:MYSQL_PASSWORD='yourpass'
npm run api

# Terminal 2 - Start Frontend
npm run dev
```

Then open:
- http://localhost:21201/admin/products ← See all 28 products?
- http://localhost:21201/admin/categories ← See categories?
- http://localhost:21201/admin/orders ← See orders?

**All working?** 🎉 Migration complete!

---

## 🆘 **Troubleshooting**

### ❌ "Service restricted due to quota exceeded"

**Problem:** Your Supabase project is over the free tier quota

**Solutions:**

1. **Wait for reset** - Quotas reset monthly
2. **Contact Supabase Support:**
   - https://supabase.help
   - Explain you need to export before quota reset
3. **Use sample data temporarily:**
   ```powershell
   npm run seed:clear
   ```
4. **Manual CSV export:**
   - Follow `MANUAL_MIGRATION_GUIDE.md`
   - Export each table individually as CSV

---

### ❌ "Supabase CLI not found"

**Solution:**
```powershell
npm install -g supabase
```

---

### ❌ "Authentication failed"

**Solution:**
1. Run: `supabase login`
2. Login in the browser window
3. Try the export again

---

### ❌ "Connection to database failed"

**Solution:**
1. Check your database password in Supabase
2. Settings → Database → Connection string
3. Use that password when linking project

---

### ❌ "Import failed - syntax error"

**Problem:** PostgreSQL syntax doesn't work in MySQL

**Solution:**
```powershell
# Convert first!
node convert-postgres-to-mysql.js your_export.sql mysql_compatible.sql

# Then import the converted file
```

---

## 📋 **Complete Workflow**

Here's the entire process from start to finish:

### 1️⃣ Export from Supabase
```powershell
# Install CLI (first time only)
npm install -g supabase

# Login (first time only)
supabase login

# Link project (first time only)
supabase link --project-ref dfmbicodohmkyasuofov

# Export everything
supabase db dump -f complete_database.sql
```

### 2️⃣ Convert to MySQL
```powershell
node convert-postgres-to-mysql.js complete_database.sql mysql_import.sql
```

### 3️⃣ Import to MySQL
```powershell
# Option A: Command line
mysql -u enginedb -p enginedb < mysql_import.sql

# Option B: Use phpMyAdmin
# (Upload mysql_import.sql via Import tab)
```

### 4️⃣ Start Your Application
```powershell
# Terminal 1
$env:MYSQL_PASSWORD='yourpass'
npm run api

# Terminal 2
npm run dev
```

### 5️⃣ Test Everything
- Admin: http://localhost:21201/admin
- Products: http://localhost:21201/products
- **Working?** 🎉 You're done!

---

## 🎊 **Success Checklist**

After import, verify:

- [ ] **products table** has 28 rows
- [ ] **categories table** has your categories
- [ ] **orders table** has customer orders
- [ ] **website_settings** has your settings
- [ ] **admin_users** has your admin account
- [ ] **Admin panel** shows all products
- [ ] **Frontend** displays products correctly
- [ ] **Cart system** works
- [ ] **Checkout** works

**All checked?** 🎉 Migration complete!

---

## 💾 **Backup Your New MySQL Database**

Don't forget to backup your MySQL database:

### Via phpMyAdmin:
1. http://localhost/phpmyadmin
2. Select `enginedb`
3. Click **Export**
4. Click **Go**
5. Save the `.sql` file

### Via Command Line:
```powershell
mysqldump -u enginedb -p enginedb > backup_mysql.sql
```

---

## 🚀 **Quick Commands Reference**

```powershell
# Export from Supabase
npm run export:supabase:all

# Convert to MySQL
node convert-postgres-to-mysql.js input.sql output.sql

# Import to MySQL
mysql -u enginedb -p enginedb < output.sql

# Start API
$env:MYSQL_PASSWORD='yourpass'
npm run api

# Start Frontend
npm run dev

# Create sample data (if needed)
npm run seed:clear

# Backup MySQL
mysqldump -u enginedb -p enginedb > backup.sql
```

---

## 📞 **Need Help?**

Check these guides:
- `EXPORT_ENTIRE_DATABASE.md` - Detailed export instructions
- `MANUAL_MIGRATION_GUIDE.md` - Step-by-step manual process
- `MIGRATION_CHECKLIST.md` - Printable checklist
- `QUICK_START.md` - Quick overview of all methods

---

**🎯 Recommended: Start with Method 1 (Automated Script)!**

Just double-click `export-supabase-database.bat` and let it do everything! 🚀

