# 📦 Migrate Your 28 Products from Supabase to MySQL

## 🎯 What This Does:

This will copy all your existing data from Supabase (products, categories) to your new MySQL database, so you can see everything in your admin panel just like before!

## 🚀 How to Migrate:

### Step 1: Set MySQL Password
```powershell
$env:MYSQL_PASSWORD='yourpass'
```

### Step 2: Run Migration
```bash
npm run migrate
```

**This will:**
- ✅ Connect to your Supabase database
- ✅ Fetch all 28 products
- ✅ Fetch all categories
- ✅ Import them into MySQL
- ✅ Preserve all data (names, prices, images, descriptions, etc.)

### Step 3: Check Results
Go to: http://localhost:21201/admin/products

You should see all your 28 products! 🎉

---

## 🔧 Options:

### Clear Existing Data First (Recommended for first run):
```bash
npm run migrate:clear
```
This will:
1. Delete existing products/categories in MySQL
2. Import fresh data from Supabase
3. Avoid duplicates

### Keep Existing Data (Add to current data):
```bash
npm run migrate
```
This will add Supabase data to what's already in MySQL.

---

## 📋 What Gets Migrated:

### ✅ Products:
- Name, description, short description
- Price, compare price
- Brand, model
- Engine type, displacement, fuel type
- Condition, stock quantity
- Images (all image URLs)
- Active/featured status
- Categories
- Created/updated dates

### ✅ Categories:
- Name, slug, description
- Image URL
- Active status
- Display order
- Parent category (if any)

---

## 🐛 Troubleshooting:

### "Error: MYSQL_PASSWORD environment variable not set"
**Solution:**
```powershell
$env:MYSQL_PASSWORD='yourpass'
```

### "Error fetching from Supabase: 402 Payment Required"
**Solution:** Your Supabase is over quota, but the migration script will try to fetch what it can. If it fails, you can:
1. Wait for Supabase quota to reset
2. Create a new Supabase project temporarily
3. Manually export data from Supabase dashboard

### "No products found in Supabase"
**Check:**
- Is your Supabase URL correct in the script?
- Do you have products in Supabase?
- Try viewing in Supabase dashboard

---

## 📊 Example Output:

```
═══════════════════════════════════════════════════
  SUPABASE → MYSQL MIGRATION TOOL
═══════════════════════════════════════════════════

✅ Connected to MySQL

📥 Fetching categories from Supabase...
✅ Found 5 categories in Supabase

📤 Inserting categories into MySQL...

✅ Migrated: Engines
✅ Migrated: Parts
✅ Migrated: Rebuilt
✅ Migrated: Used
✅ Migrated: Accessories

📊 Category Migration Summary:
   ✅ Successfully migrated: 5 categories
   ❌ Failed: 0 categories

🚀 Starting product migration from Supabase to MySQL...

✅ Connected to MySQL

📥 Fetching products from Supabase...
✅ Found 28 products in Supabase

📤 Inserting products into MySQL...

✅ Migrated: Sample Engine 2.0L
✅ Migrated: V6 Engine 3.5L
✅ Migrated: Turbo Engine 1.8L
... (25 more products)

📊 Migration Summary:
   ✅ Successfully migrated: 28 products
   ❌ Failed: 0 products

🎉 Migration complete!

✨ All migrations completed successfully!

💡 Tip: Visit http://localhost:21201/admin/products to see your migrated products!
```

---

## ✅ After Migration:

1. **Check Admin Panel:**
   - Go to http://localhost:21201/admin/products
   - You should see all 28 products

2. **Check Categories:**
   - Go to http://localhost:21201/admin/categories
   - You should see all your categories

3. **Check MySQL Database:**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Select `enginedb` database
   - Browse `products` table
   - You should see 28 rows!

4. **Test Frontend:**
   - Go to http://localhost:21201/products
   - Your products should appear!

---

## 🎊 Success!

Once migration is complete, your entire system will be:
- ✅ All products in MySQL
- ✅ All categories in MySQL
- ✅ All data preserved
- ✅ Admin panel showing all products
- ✅ Frontend displaying products
- ✅ 100% independent from Supabase!

**Run the migration now:** `npm run migrate:clear`

