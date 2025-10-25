# 🚀 Quick Start: Import Your Supabase Data

## 📝 **Before You Start:**

1. ✅ MySQL is running (XAMPP started)
2. ✅ Database `enginedb` exists
3. ✅ Password is set: `$env:MYSQL_PASSWORD='yourpass'`

---

## 🎯 **Option 1: Automatic Import (If Supabase is accessible)**

```powershell
# Set password
$env:MYSQL_PASSWORD='yourpass'

# Try automatic migration
npm run migrate:clear
```

**If this works:** ✅ Done! Skip to "Test Your Site" below.

**If quota error:** ⬇️ Use Option 2 or 3 below.

---

## 🎯 **Option 2: Import from SQL Files (Recommended)**

**If you have `.sql` files from Supabase:**

1. Put your SQL files in: `F:\xampp\htdocs\enginecore\`
   - Example: `products_rows.sql`, `categories.sql`, etc.

2. Run:
```powershell
$env:MYSQL_PASSWORD='yourpass'
npm run import:sql:clear products_rows.sql
```

3. Repeat for each table (categories, orders, etc.)

---

## 🎯 **Option 3: Manual Import via CSV**

**Step-by-step guide:** Open `MANUAL_MIGRATION_GUIDE.md` in this folder!

**Quick version:**

1. **Export from Supabase:**
   - Go to: https://supabase.com/dashboard
   - Table Editor → Click each table → Export → CSV
   - Save: `categories.csv`, `products.csv`, etc.

2. **Import to MySQL:**
   - Go to: http://localhost/phpmyadmin
   - Select `enginedb` database
   - Click each table → Import → Choose CSV file → Go

**Order matters!** Import in this order:
1. categories ← First!
2. products
3. website_settings
4. contact_messages
5. admin_users
6. profiles
7. orders
8. order_items
9. cart_items

---

## 🎯 **Option 4: Use Sample Data (For Testing)**

**If you just want to test with sample products:**

```powershell
$env:MYSQL_PASSWORD='yourpass'
npm run seed:clear
```

**Creates:**
- 5 categories
- 28 sample products (engines)
- Ready to use immediately!

---

## ✅ **Test Your Site**

### 1. Start API Server (Terminal 1):
```powershell
$env:MYSQL_PASSWORD='yourpass'
npm run api
```

**Keep this running!** ⚠️

### 2. Start Frontend (Terminal 2):
```powershell
npm run dev
```

**Keep this running too!** ⚠️

### 3. Test Admin Panel:
- Go to: http://localhost:21201/admin/login
- Login: `admin@admin.com` / `admin123`
- Check: http://localhost:21201/admin/products
- **See your products?** 🎉 Success!

### 4. Test Frontend:
- Go to: http://localhost:21201/
- Browse products
- Add to cart
- **Working?** 🎉 Complete!

---

## 🆘 **Troubleshooting**

### ❌ "Access denied for user 'enginedb'"
```powershell
# Make sure password is set:
$env:MYSQL_PASSWORD='yourpass'
npm run api
```

### ❌ "Connection refused" or "Failed to fetch"
- Is API server running? Check Terminal 1
- Run: `npm run api`

### ❌ "Table doesn't exist"
- Tables weren't created
- Run: `npm run api` (creates tables automatically)
- Or import `mysql/schema.sql` in phpMyAdmin

### ❌ Products page is empty
- No data imported yet
- Use Option 2, 3, or 4 above to import data

### ❌ Supabase quota exceeded
- Can't export from Supabase right now
- **Solution:** Use Option 4 (sample data) for now
- Or wait for quota reset (usually next month)

---

## 📁 **Important Files**

| File | Purpose |
|------|---------|
| `MANUAL_MIGRATION_GUIDE.md` | Detailed step-by-step migration guide |
| `MIGRATION_CHECKLIST.md` | Printable checklist |
| `mysql/schema.sql` | MySQL database schema |
| `mysql/auth_schema.sql` | Authentication tables schema |
| `server/index.js` | Express API server |
| `.env` | MySQL credentials (create this!) |

---

## 💡 **Tips**

1. **Always set password first:**
   ```powershell
   $env:MYSQL_PASSWORD='yourpass'
   ```

2. **Use `.env` file for permanent config:**
   Create `.env` file in project root:
   ```
   MYSQL_HOST=localhost
   MYSQL_USER=enginedb
   MYSQL_PASSWORD=yourpass
   MYSQL_DATABASE=enginedb
   MYSQL_PORT=3306
   ```

3. **Backup your data:**
   - phpMyAdmin → Export → Go
   - Save the `.sql` file!

4. **Two terminals needed:**
   - Terminal 1: `npm run api` ← Keep running
   - Terminal 2: `npm run dev` ← Keep running

---

## 🎊 **You're All Set!**

Your project now uses MySQL instead of Supabase!

**Next:** Start importing your real data using the options above! 🚀
