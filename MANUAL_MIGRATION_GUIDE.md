# 📦 Complete Manual Migration Guide: Supabase → MySQL

## Step-by-Step: Export ALL Tables from Supabase and Import to MySQL

---

## 📋 **Tables to Migrate:**

Based on your project, you need to migrate these tables:

1. ✅ **products** - Your 28 products
2. ✅ **categories** - Product categories
3. ✅ **orders** - Customer orders
4. ✅ **order_items** - Order line items
5. ✅ **cart_items** - Shopping cart data
6. ✅ **website_settings** - Site configuration
7. ✅ **contact_messages** - Contact form submissions
8. ✅ **admin_users** - Admin user accounts
9. ✅ **profiles** - Customer profiles
10. ⚠️ **auth.users** - (Optional, if migrating auth)

---

## 🎯 **STEP 1: Export from Supabase Dashboard**

### A. Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Login to your account
3. Select your project: **dfmbicodohmkyasuofov**

---

### B. Export Each Table (One by One)

#### **Table 1: Categories (Export First - Products depend on this)**

1. Click **Table Editor** (left sidebar)
2. Click **`categories`** table
3. Click **Export** button (top right corner, looks like ⬇️)
4. Choose format: **CSV** (easier) or **SQL** (more complete)
5. Click **Download**
6. Save as: `categories.csv` (or `categories.sql`)

**✅ Downloaded: `categories.csv`**

---

#### **Table 2: Products**

1. Still in **Table Editor**
2. Click **`products`** table
3. Click **Export** → **CSV** (or SQL)
4. Download
5. Save as: `products.csv`

**✅ Downloaded: `products.csv`**

---

#### **Table 3: Website Settings**

1. Click **`website_settings`** table
2. Export → CSV
3. Save as: `website_settings.csv`

**✅ Downloaded: `website_settings.csv`**

---

#### **Table 4: Contact Messages**

1. Click **`contact_messages`** table
2. Export → CSV
3. Save as: `contact_messages.csv`

**✅ Downloaded: `contact_messages.csv`**

---

#### **Table 5: Admin Users**

1. Click **`admin_users`** table
2. Export → CSV
3. Save as: `admin_users.csv`

**✅ Downloaded: `admin_users.csv`**

---

#### **Table 6: Orders**

1. Click **`orders`** table
2. Export → CSV
3. Save as: `orders.csv`

**✅ Downloaded: `orders.csv`**

---

#### **Table 7: Order Items**

1. Click **`order_items`** table
2. Export → CSV
3. Save as: `order_items.csv`

**✅ Downloaded: `order_items.csv`**

---

#### **Table 8: Cart Items**

1. Click **`cart_items`** table
2. Export → CSV
3. Save as: `cart_items.csv`

**✅ Downloaded: `cart_items.csv`**

---

#### **Table 9: Profiles (Customer Data)**

1. Click **`profiles`** table
2. Export → CSV
3. Save as: `profiles.csv`

**✅ Downloaded: `profiles.csv`**

---

### 📁 **Your Downloads Folder Should Now Have:**

```
✅ categories.csv
✅ products.csv
✅ website_settings.csv
✅ contact_messages.csv
✅ admin_users.csv
✅ orders.csv
✅ order_items.csv
✅ cart_items.csv
✅ profiles.csv
```

---

## 🎯 **STEP 2: Prepare Files for Import**

### Move All CSV Files to Your Project

1. Open **File Explorer**
2. Go to your **Downloads** folder
3. Select ALL the CSV files you just downloaded
4. **Copy** them
5. Navigate to: `F:\xampp\htdocs\enginecore\`
6. **Paste** all files there

---

## 🎯 **STEP 3: Import to MySQL (phpMyAdmin)**

### A. Open phpMyAdmin

1. Open browser: http://localhost/phpmyadmin
2. Login (usually no password for XAMPP)
3. Click **`enginedb`** database (left sidebar)

---

### B. Import Each Table (In Order!)

**⚠️ IMPORTANT: Import in this order to respect foreign key relationships!**

---

#### **Import 1: Categories (FIRST!)**

1. In phpMyAdmin, click **`categories`** table (left sidebar)
2. Click **Import** tab (top menu)
3. Click **Choose File**
4. Select: `categories.csv`
5. **Format:** CSV
6. **Format-specific options:**
   - Columns separated with: `,` (comma)
   - Columns enclosed with: `"` (double quote)
   - Columns escaped with: `\` (backslash)
   - Lines terminated with: `auto`
   - **Column names in first row:** ✅ Check this!
7. Scroll down, click **Go** (bottom right)

**✅ Wait for "Import has been successfully finished"**

Check: You should see rows in the `categories` table!

---

#### **Import 2: Products**

1. Click **`products`** table (left sidebar)
2. Click **Import** tab
3. Choose File: `products.csv`
4. Format: **CSV**
5. **Column names in first row:** ✅ Check this!
6. Click **Go**

**⚠️ If you get an error about category_id:**
- This means the CSV has UUID category IDs
- You'll need to update them manually or use the import script I created

**✅ Success? Great! Check the products table for rows.**

---

#### **Import 3: Website Settings**

1. Click **`website_settings`** table
2. Import tab
3. Choose: `website_settings.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 4: Contact Messages**

1. Click **`contact_messages`** table
2. Import tab
3. Choose: `contact_messages.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 5: Admin Users**

1. Click **`admin_users`** table
2. Import tab
3. Choose: `admin_users.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 6: Profiles**

1. Click **`profiles`** table
2. Import tab
3. Choose: `profiles.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 7: Orders**

1. Click **`orders`** table
2. Import tab
3. Choose: `orders.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 8: Order Items**

1. Click **`order_items`** table
2. Import tab
3. Choose: `order_items.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

#### **Import 9: Cart Items**

1. Click **`cart_items`** table
2. Import tab
3. Choose: `cart_items.csv`
4. Format: CSV
5. Column names in first row: ✅
6. Go

**✅ Imported!**

---

## 🎯 **STEP 4: Verify Your Data**

### Check Each Table

1. In phpMyAdmin, click each table
2. Click **Browse** tab
3. You should see your data!

**Expected Results:**

| Table | Expected Rows |
|-------|---------------|
| categories | ~5+ categories |
| products | 28 products |
| website_settings | ~10+ settings |
| contact_messages | Any contact form submissions |
| admin_users | Your admin accounts |
| profiles | Customer profiles |
| orders | Customer orders |
| order_items | Order line items |
| cart_items | Shopping cart data |

---

## 🎯 **STEP 5: Test Your Admin Panel**

### A. Make Sure API is Running

```powershell
# In terminal (if not already running):
$env:MYSQL_PASSWORD='yourpass'
npm run api
```

### B. Open Admin Panel

1. Go to: http://localhost:21201/admin/products
2. **You should see all 28 products!** 🎉

### C. Test Other Pages

- **Categories:** http://localhost:21201/admin/categories
- **Orders:** http://localhost:21201/admin/orders
- **Contact Messages:** http://localhost:21201/admin/contact-messages
- **Settings:** http://localhost:21201/admin/settings
- **Customers:** http://localhost:21201/admin/customers

---

## ⚠️ **Troubleshooting Common Issues**

### Issue 1: "Column count doesn't match value count"

**Solution:**
- The CSV has different columns than your MySQL table
- Check that your MySQL tables were created with the correct schema
- Use the SQL import method instead of CSV

---

### Issue 2: "Incorrect integer value for column 'category_id'"

**Cause:** Supabase uses UUIDs, MySQL uses integers

**Solution:**
1. After importing categories, note their new MySQL IDs (1, 2, 3, etc.)
2. Before importing products, you need to map old UUID category_ids to new integer IDs
3. **Best solution:** Use my import script instead:

```powershell
npm run import:sql:clear products_rows.sql
```

---

### Issue 3: "Duplicate entry for key 'PRIMARY'"

**Solution:**
- Clear the table first
- In phpMyAdmin: Click table → Operations → Empty table
- Then try import again

---

### Issue 4: Can't export from Supabase (quota exceeded)

**Solution A:** Wait for quota reset (usually next month)

**Solution B:** Use SQL query method:
1. In Supabase, click **SQL Editor**
2. Run: `SELECT * FROM products;`
3. Click **Download** to get results as CSV

**Solution C:** Use sample data:
```powershell
npm run seed:clear
```

---

## 🎊 **You're Done!**

Once all tables are imported:

✅ All your products are in MySQL  
✅ All categories are in MySQL  
✅ All settings are in MySQL  
✅ All customer data is in MySQL  
✅ Your admin panel shows everything  
✅ Your frontend displays products  
✅ **100% independent from Supabase!**

---

## 📞 **Next Steps**

1. **Test everything** in your admin panel
2. **Test the frontend** - browse products, add to cart, checkout
3. **Backup your MySQL database:**
   - phpMyAdmin → Export → Go
   - Save the SQL file as backup!

4. **Optional:** Cancel Supabase subscription (you don't need it anymore!)

---

## 💡 **Quick Commands Reference**

```powershell
# Start API server
$env:MYSQL_PASSWORD='yourpass'
npm run api

# Start frontend dev server
npm run dev

# Import products from SQL dump
npm run import:sql:clear products_rows.sql

# Seed sample data (if needed)
npm run seed:clear

# Backup MySQL database via command line
mysqldump -u enginedb -p enginedb > backup.sql
```

---

**Good luck with your migration! 🚀**

