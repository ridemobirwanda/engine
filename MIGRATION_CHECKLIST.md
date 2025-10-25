# ✅ Migration Checklist: Supabase → MySQL

Print this out or keep it open while you migrate!

---

## 📥 **EXPORT FROM SUPABASE** (https://supabase.com/dashboard)

Go to **Table Editor** and export each table as CSV:

- [ ] **1. categories** → Save as `categories.csv`
- [ ] **2. products** → Save as `products.csv`  
- [ ] **3. website_settings** → Save as `website_settings.csv`
- [ ] **4. contact_messages** → Save as `contact_messages.csv`
- [ ] **5. admin_users** → Save as `admin_users.csv`
- [ ] **6. profiles** → Save as `profiles.csv`
- [ ] **7. orders** → Save as `orders.csv`
- [ ] **8. order_items** → Save as `order_items.csv`
- [ ] **9. cart_items** → Save as `cart_items.csv`

**All files downloaded?** ✅ Move to `F:\xampp\htdocs\enginecore\`

---

## 📤 **IMPORT TO MYSQL** (http://localhost/phpmyadmin)

Select `enginedb` database, then import each table:

**⚠️ Import in THIS ORDER (dependencies matter!):**

- [ ] **1. categories** ← Products depend on this!
  - Import → Choose File: `categories.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **2. products**
  - Import → Choose File: `products.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **3. website_settings**
  - Import → Choose File: `website_settings.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **4. contact_messages**
  - Import → Choose File: `contact_messages.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **5. admin_users**
  - Import → Choose File: `admin_users.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **6. profiles**
  - Import → Choose File: `profiles.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **7. orders**
  - Import → Choose File: `orders.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **8. order_items**
  - Import → Choose File: `order_items.csv` → Format: CSV → ✅ Column names in first row → Go
  
- [ ] **9. cart_items**
  - Import → Choose File: `cart_items.csv` → Format: CSV → ✅ Column names in first row → Go

---

## ✅ **VERIFY DATA**

Check each table in phpMyAdmin (Browse tab):

- [ ] categories has rows
- [ ] products has 28 rows
- [ ] website_settings has rows
- [ ] contact_messages has rows
- [ ] admin_users has your admin accounts
- [ ] profiles has customer data
- [ ] orders has order data
- [ ] order_items has order line items
- [ ] cart_items has cart data

---

## 🧪 **TEST EVERYTHING**

- [ ] **Start API:** `npm run api` (in terminal with `$env:MYSQL_PASSWORD='yourpass'`)
- [ ] **Start Frontend:** `npm run dev` (in another terminal)

**Test Admin Panel:**

- [ ] http://localhost:21201/admin/products ← See all 28 products?
- [ ] http://localhost:21201/admin/categories ← See categories?
- [ ] http://localhost:21201/admin/orders ← See orders?
- [ ] http://localhost:21201/admin/contact-messages ← See messages?
- [ ] http://localhost:21201/admin/settings ← Settings load?
- [ ] http://localhost:21201/admin/customers ← See customers?

**Test Frontend:**

- [ ] http://localhost:21201/products ← Products display?
- [ ] http://localhost:21201/ ← Homepage works?
- [ ] Add product to cart ← Works?
- [ ] View cart ← Shows items?

---

## 🎉 **MIGRATION COMPLETE!**

- [ ] **All data migrated** ✅
- [ ] **Admin panel working** ✅
- [ ] **Frontend working** ✅
- [ ] **Backup created** (phpMyAdmin → Export → Go)
- [ ] **Supabase can be cancelled** (optional)

---

## 🆘 **If Something Goes Wrong:**

### ❌ Can't export from Supabase (quota exceeded)

**Quick Fix:** Use sample data instead:
```powershell
npm run seed:clear
```

### ❌ CSV import fails with errors

**Quick Fix:** Use SQL import script:
```powershell
npm run import:sql:clear your-file.sql
```

### ❌ Products don't show in admin panel

**Check:**
1. API server running? `npm run api`
2. MySQL password set? `$env:MYSQL_PASSWORD='yourpass'`
3. Check browser console for errors (F12)

### ❌ "Column count doesn't match"

**Fix:**
1. Clear the table in phpMyAdmin (Empty table)
2. Make sure CSV has column names in first row
3. Try again

---

## 📞 **Important Commands**

```powershell
# Start API (keep running)
$env:MYSQL_PASSWORD='yourpass'
npm run api

# Start Frontend (keep running)
npm run dev

# Import from SQL file
npm run import:sql:clear products.sql

# Create sample data
npm run seed:clear

# Backup MySQL
# In phpMyAdmin: Export → Go
```

---

**🎊 Good luck with your migration!**

