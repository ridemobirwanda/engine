# 📦 Export ENTIRE Supabase Database at Once

## 🎯 **Method 1: Supabase CLI (Recommended - Exports Everything!)**

### Step 1: Install Supabase CLI

```powershell
# Install Supabase CLI globally
npm install -g supabase
```

Wait for installation to complete...

---

### Step 2: Login to Supabase

```powershell
# Login to your Supabase account
supabase login
```

This will open a browser window. Login with your Supabase credentials.

---

### Step 3: Link to Your Project

```powershell
# Link to your Supabase project
supabase link --project-ref dfmbicodohmkyasuofov
```

Enter your database password when prompted (from Supabase project settings).

---

### Step 4: Export Entire Database

```powershell
# Export all data from all tables
supabase db dump --data-only -f supabase_full_export.sql
```

**This creates:** `supabase_full_export.sql` with ALL your data from ALL tables! 🎉

---

### Step 5: Also Export Schema (Optional but Recommended)

```powershell
# Export table structure (schema)
supabase db dump -f supabase_schema.sql
```

---

## 🎯 **Method 2: Supabase Dashboard (Backup Feature)**

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard/project/dfmbicodohmkyasuofov
2. Click **Database** (left sidebar)
3. Click **Backups** tab

---

### Step 2: Create Manual Backup

1. Click **Create backup** button
2. Wait for backup to complete
3. Click **Download** next to your backup

**Downloads:** Full PostgreSQL dump file (.sql)

---

### Step 3: Download the Backup

1. The backup downloads as: `backup-YYYYMMDD.sql` or similar
2. Save it to: `F:\xampp\htdocs\enginecore\`

---

## 🎯 **Method 3: PostgreSQL pg_dump (Direct Export)**

**If you have PostgreSQL connection details:**

### Get Connection String

1. Go to: https://supabase.com/dashboard/project/dfmbicodohmkyasuofov
2. Click **Settings** (left sidebar)
3. Click **Database**
4. Copy the **Connection string** (URI format)

It looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.dfmbicodohmkyasuofov.supabase.co:5432/postgres
```

---

### Export Using pg_dump

**If you have PostgreSQL tools installed:**

```powershell
# Export all data (replace [YOUR-PASSWORD])
pg_dump "postgresql://postgres:[YOUR-PASSWORD]@db.dfmbicodohmkyasuofov.supabase.co:5432/postgres" --data-only --no-owner --no-privileges -f supabase_data.sql

# Export schema
pg_dump "postgresql://postgres:[YOUR-PASSWORD]@db.dfmbicodohmkyasuofov.supabase.co:5432/postgres" --schema-only --no-owner --no-privileges -f supabase_schema.sql
```

---

## 🎯 **Method 4: Supabase SQL Editor (For Small Databases)**

### Export Each Table via SQL

1. Go to: https://supabase.com/dashboard/project/dfmbicodohmkyasuofov
2. Click **SQL Editor**
3. Run this query for each table:

```sql
-- Copy result and save as CSV
SELECT * FROM products;
```

4. Click **Download** icon to save as CSV
5. Repeat for all tables

**Tables to export:**
- products
- categories
- orders
- order_items
- cart_items
- website_settings
- contact_messages
- admin_users
- profiles

---

## 📥 **After You Have the Full Database Export:**

### Now Import to MySQL

You'll have one of these files:
- `supabase_full_export.sql` (from Supabase CLI)
- `backup-YYYYMMDD.sql` (from Supabase Backup)
- `supabase_data.sql` (from pg_dump)

---

## 🔄 **Convert PostgreSQL Dump to MySQL Format**

### Use My Converter Script

1. Put your SQL file in: `F:\xampp\htdocs\enginecore\`
2. Run:

```powershell
# Convert the PostgreSQL dump to MySQL format
node convert-postgres-to-mysql.js supabase_full_export.sql full_mysql.sql
```

**This creates:** `full_mysql.sql` in MySQL-compatible format

---

## 📤 **Import to MySQL**

### Option A: phpMyAdmin (GUI)

1. Open: http://localhost/phpmyadmin
2. Select `enginedb` database
3. Click **Import** tab
4. Choose file: `full_mysql.sql`
5. Format: **SQL**
6. Click **Go**

**Wait for import to complete...** ✅

---

### Option B: Command Line (Faster for Large Files)

```powershell
# Import the converted SQL file
mysql -u enginedb -p enginedb < full_mysql.sql
```

Enter password: `yourpass`

---

## ✅ **Verify Import**

### Check in phpMyAdmin

1. Go to: http://localhost/phpmyadmin
2. Select `enginedb` database
3. Check each table has data:
   - products (should have 28 rows)
   - categories (should have rows)
   - orders (should have rows)
   - etc.

---

### Check in Admin Panel

1. Start API: `npm run api`
2. Start Frontend: `npm run dev`
3. Go to: http://localhost:21201/admin/products
4. **See all 28 products?** 🎉 Success!

---

## 🆘 **If Quota Exceeded (Can't Export)**

**Your Supabase project is over quota, so exports might be blocked.**

### Workaround 1: Wait for Reset
- Quotas usually reset monthly
- Check your Supabase billing page for reset date

### Workaround 2: Contact Supabase Support
1. Go to: https://supabase.help
2. Explain you need to export data but quota is exceeded
3. They may temporarily lift the limit

### Workaround 3: Create New Free Project
1. Create a new Supabase project (free tier)
2. Use database connection to copy data
3. Export from new project

### Workaround 4: Use Sample Data (Temporary)
```powershell
# Create sample data in MySQL for testing
npm run seed:clear
```

---

## 🎊 **Recommended Approach**

**Based on your situation (quota exceeded), here's what I recommend:**

### **Plan A: Supabase CLI** (Try this first!)
```powershell
npm install -g supabase
supabase login
supabase link --project-ref dfmbicodohmkyasuofov
supabase db dump --data-only -f supabase_full_export.sql
```

**If this works despite quota:** ✅ You have your full database!

---

### **Plan B: Use Sample Data Now, Export Later**
```powershell
# Use sample data to test everything
npm run seed:clear

# Start using your site with MySQL
npm run api
npm run dev

# When Supabase quota resets, export real data
# Then import it to replace sample data
```

---

### **Plan C: Manual Export (One Table at a Time)**

If CLI doesn't work, follow the `MANUAL_MIGRATION_GUIDE.md`:
- Export each table as CSV from Supabase Dashboard
- Import each CSV to phpMyAdmin
- Takes longer but always works!

---

## 📋 **Complete Command Sequence**

```powershell
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project
supabase link --project-ref dfmbicodohmkyasuofov

# 4. Export full database
supabase db dump --data-only -f supabase_export.sql

# 5. Convert to MySQL (if needed)
node convert-postgres-to-mysql.js supabase_export.sql mysql_export.sql

# 6. Import to MySQL
# Option A: Use phpMyAdmin (GUI)
# Option B: Command line
mysql -u enginedb -p enginedb < mysql_export.sql

# 7. Start your servers
$env:MYSQL_PASSWORD='yourpass'
npm run api

# In another terminal
npm run dev

# 8. Test
# Go to: http://localhost:21201/admin/products
```

---

## 💡 **Tips**

1. **Export both data AND schema:**
   ```powershell
   supabase db dump --data-only -f data.sql
   supabase db dump -f schema.sql
   ```

2. **Backup before import:**
   - Always backup your MySQL database first
   - phpMyAdmin → Export → Go

3. **Large files:**
   - If file is huge (>50MB), use command line import
   - Faster than phpMyAdmin

4. **Check foreign keys:**
   - Import order matters for tables with relationships
   - categories before products
   - orders before order_items

---

**Start with Plan A (Supabase CLI)!** It's the fastest way to get your entire database! 🚀

