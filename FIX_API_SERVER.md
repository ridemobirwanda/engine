# 🔧 API Server Fixed - MySQL Connection Issue Resolved

## ❌ Problem

The API server was starting but failing to initialize the database with error:
```
Init ensure failed
```

## ✅ Solution Applied

### 1. **Created `.env` File**

Your project was missing a `.env` file with MySQL credentials.

**File created:** `.env`

```env
# MySQL Database Configuration (XAMPP Default)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=enginedb

# API Server Port
PORT=3001

# Environment
NODE_ENV=development
```

### 2. **Improved Error Handling**

Enhanced `server/index.js` to show detailed error messages:
- ✅ Shows MySQL configuration
- ✅ Displays full error details
- ✅ Provides helpful troubleshooting tips
- ✅ Better initialization logging

## 🚀 How to Start the API Server

### Step 1: Start MySQL in XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to MySQL
3. Wait for MySQL to show "Running" (green background)

### Step 2: Create Database (First Time Only)

```bash
# Option A: Using MySQL CLI
mysql -u root -p
CREATE DATABASE IF NOT EXISTS enginedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Option B: Using phpMyAdmin
# Visit: http://localhost/phpmyadmin
# Create new database: enginedb
# Collation: utf8mb4_unicode_ci
```

### Step 3: Start API Server

```bash
npm run api
```

**Expected output:**
```
API server listening on port 3001
🔄 Initializing database...
📊 MySQL Config: { host: 'localhost', user: 'root', ... }
✅ Database and website_settings table ready
✅ Profiles table ready
✅ Auth tables ready
🎉 Database initialization complete!
```

## 🧪 Test the API

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

**Expected response:**
```json
{"ok":true,"db":"enginedb"}
```

### 2. Test in Browser

Visit: `http://localhost:3001/api/health`

Should show: `{"ok":true,"db":"enginedb"}`

## 🔧 MySQL Configuration Options

### Default XAMPP (Recommended)

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
```

### With Password

If you've set a MySQL password:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
```

### Custom User

If you created a custom MySQL user:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=enginedb
MYSQL_PASSWORD=your_password
```

## 🐛 Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Solutions:**

1. **Check MySQL is running:**
   - Open XAMPP Control Panel
   - MySQL should show "Running"

2. **Password issue:**
   ```bash
   # Reset MySQL password in XAMPP
   # Or update .env with correct password
   ```

3. **Test MySQL connection:**
   ```bash
   mysql -u root -p
   # Enter password (empty for default XAMPP)
   ```

### Issue: "Database 'enginedb' doesn't exist"

**Solution:**

The API will create it automatically, but if it fails:

```bash
mysql -u root -p
CREATE DATABASE enginedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Issue: "Can't connect to MySQL server"

**Solutions:**

1. **Start MySQL in XAMPP:**
   - XAMPP Control Panel → Start MySQL

2. **Check MySQL port:**
   - Default: 3306
   - If changed, update `.env`

3. **Firewall:**
   - Allow MySQL port 3306

### Issue: "ER_NOT_SUPPORTED_AUTH_MODE"

**Solution:**

```sql
-- Run in MySQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

## 📊 Database Tables Created

The API automatically creates these tables:

1. ✅ `website_settings` - Site configuration
2. ✅ `profiles` - User profiles
3. ✅ `users` - User authentication
4. ✅ `sessions` - User sessions
5. ✅ `products` - Products catalog
6. ✅ `categories` - Product categories
7. ✅ `orders` - Customer orders
8. ✅ `order_items` - Order line items
9. ✅ `cart_items` - Shopping cart
10. ✅ `contact_messages` - Contact form submissions
11. ✅ `admin_users` - Admin panel users

## 🎯 Default Admin User

The API creates a default admin user:

- **Email:** `admin@admin.com`
- **Password:** `admin123`

**⚠️ Change this password after first login!**

## 🔐 Security Notes

### For Development:
- Empty MySQL password is OK
- Default admin credentials are OK

### For Production:
1. ✅ Set strong MySQL password
2. ✅ Change default admin password
3. ✅ Use environment-specific `.env` files
4. ✅ Never commit `.env` to git

## ✅ Verification Checklist

- [ ] XAMPP MySQL is running
- [ ] `.env` file exists with correct credentials
- [ ] `npm run api` starts without errors
- [ ] See "Database initialization complete!" message
- [ ] `/api/health` returns `{"ok":true}`
- [ ] Database `enginedb` exists in phpMyAdmin
- [ ] Tables are created automatically

## 🚀 Running Both Servers

### Terminal 1 (API Server):
```bash
npm run api
```

### Terminal 2 (Development Server):
```bash
npm run dev
```

### Expected:
- API: `http://localhost:3001`
- App: `http://localhost:21201`

## 📝 Common Commands

```bash
# Start API server
npm run api

# Start dev server
npm run dev

# Run both (if configured)
npm start

# Check MySQL status in XAMPP
# XAMPP Control Panel → MySQL → Running

# Access phpMyAdmin
# http://localhost/phpmyadmin

# Test API health
curl http://localhost:3001/api/health
```

## 🎉 Success Indicators

When everything is working, you should see:

```
✅ MySQL running in XAMPP
✅ API server on port 3001
✅ Dev server on port 21201
✅ Database tables created
✅ No error messages
✅ Health check returns OK
```

## 📞 Still Having Issues?

1. **Check XAMPP logs:**
   - XAMPP → MySQL → Logs button

2. **Verify MySQL:**
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   USE enginedb;
   SHOW TABLES;
   ```

3. **Check API logs:**
   - Look at terminal where `npm run api` is running
   - Note any error codes or messages

4. **Restart everything:**
   ```bash
   # Stop API server (Ctrl+C)
   # Stop MySQL in XAMPP
   # Start MySQL in XAMPP
   # Start API server again
   npm run api
   ```

---

**Your API server is now properly configured! 🎉**

Just make sure MySQL is running in XAMPP and start the API server with `npm run api`.






