# 🔧 Fix MySQL Connection Error (ECONNREFUSED)

## ❌ Error You're Getting

```
Error code: ECONNREFUSED
```

This means the API server cannot connect to MySQL.

---

## ✅ **SOLUTION 1: Use Default XAMPP Credentials** (Recommended)

### Update your `.env` file:

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

**Important Changes:**
- ✅ `MYSQL_USER=root` (change from `enginedb`)
- ✅ `MYSQL_PASSWORD=` (leave empty - no password)

---

## ✅ **SOLUTION 2: Make Sure MySQL is Running**

### Check in XAMPP Control Panel:

1. Open **XAMPP Control Panel**
2. Look for **MySQL** row
3. Status should be **"Running"** (green)
4. If not, click **Start**

### Verify MySQL is Running:

Run the batch file I created:
```bash
check-mysql-port.bat
```

Or manually check:
```bash
netstat -ano | findstr :3306
```

If you see output, MySQL is running. If empty, MySQL is not running.

---

## ✅ **SOLUTION 3: Test MySQL Connection**

### Open MySQL Command Line:

1. Open XAMPP Control Panel
2. Click **Shell** button (bottom right)
3. Type:
```bash
mysql -u root -p
```
4. Press Enter (no password)
5. If you get `mysql>` prompt, it works!

### If it asks for password:

Your MySQL has a password set. Find it and update `.env`:
```env
MYSQL_PASSWORD=your_actual_password
```

---

## ✅ **SOLUTION 4: Create `enginedb` User** (Optional)

If you want to use `enginedb` user instead of `root`:

### 1. Connect to MySQL:
```bash
mysql -u root -p
```

### 2. Create user and database:
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS enginedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'enginedb'@'localhost' IDENTIFIED BY 'your_password_here';

-- Grant permissions
GRANT ALL PRIVILEGES ON enginedb.* TO 'enginedb'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW GRANTS FOR 'enginedb'@'localhost';

-- Exit
EXIT;
```

### 3. Update `.env`:
```env
MYSQL_USER=enginedb
MYSQL_PASSWORD=your_password_here
```

---

## 🧪 **Test After Fix**

### 1. Restart API Server:
```bash
npm run api
```

### 2. Expected Output:
```
API server listening on port 3001
🔄 Initializing database...
📊 MySQL Config: {
  host: 'localhost',
  user: 'root',
  database: 'enginedb',
  port: 3306,
  hasPassword: false
}
✅ Database and website_settings table ready
✅ Profiles table ready
✅ Auth tables ready
🎉 Database initialization complete!
```

### 3. Test Health Endpoint:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"ok":true,"db":"enginedb"}
```

---

## 🔍 **Common Issues**

### Issue: Port 3306 already in use

**Check what's using it:**
```bash
netstat -ano | findstr :3306
```

**Fix:**
1. Stop other MySQL instances
2. Or change port in XAMPP config
3. Update `.env` with new port

### Issue: MySQL won't start in XAMPP

**Solutions:**
1. Check XAMPP logs (MySQL → Logs button)
2. Port 3306 might be in use
3. Try changing MySQL port in XAMPP config

### Issue: Access denied for user 'root'@'localhost'

**Solution:**

You have a MySQL password set. Either:

**Option A: Find your password**
```env
MYSQL_PASSWORD=your_actual_password
```

**Option B: Reset MySQL password**
1. Stop MySQL in XAMPP
2. Edit `\xampp\mysql\bin\my.ini`
3. Add under `[mysqld]`:
   ```
   skip-grant-tables
   ```
4. Start MySQL
5. Run:
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY '';
   FLUSH PRIVILEGES;
   EXIT;
   ```
6. Remove `skip-grant-tables` from my.ini
7. Restart MySQL

### Issue: Can't find MySQL

**Check MySQL installation:**
1. XAMPP installed? Default: `C:\xampp`
2. MySQL folder exists? `C:\xampp\mysql`
3. Try reinstalling XAMPP

---

## 🎯 **Quick Checklist**

Run through this checklist:

- [ ] XAMPP is installed
- [ ] MySQL is running in XAMPP (green "Running")
- [ ] `.env` file exists in project root
- [ ] `.env` has `MYSQL_USER=root`
- [ ] `.env` has `MYSQL_PASSWORD=` (empty)
- [ ] Can connect via command line: `mysql -u root -p`
- [ ] Port 3306 is not blocked by firewall
- [ ] No other MySQL service is running

---

## 🚀 **Recommended: Fresh Start**

### 1. Stop Everything:
```bash
# Stop API server (Ctrl+C)
# Stop MySQL in XAMPP
```

### 2. Update `.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=enginedb
PORT=3001
NODE_ENV=development
```

### 3. Start MySQL in XAMPP:
- XAMPP Control Panel → Start MySQL
- Wait for "Running" status

### 4. Start API Server:
```bash
npm run api
```

### 5. Verify:
- Should see "Database initialization complete!"
- Visit: `http://localhost:3001/api/health`
- Should return: `{"ok":true,"db":"enginedb"}`

---

## 📞 **Still Not Working?**

### Get more info:

1. **Check MySQL error log:**
   - XAMPP Control Panel → MySQL → Logs

2. **Test MySQL directly:**
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

3. **Check what's in `.env`:**
   ```bash
   type .env
   ```

4. **Try phpMyAdmin:**
   - Visit: `http://localhost/phpmyadmin`
   - Login with: root / (no password)
   - If this works, MySQL is running!

5. **Check Windows Firewall:**
   - Allow port 3306
   - Or temporarily disable firewall to test

---

## ✅ **Success Indicators**

When everything works, you'll see:

```
✅ MySQL shows "Running" in XAMPP
✅ API server starts without errors
✅ "Database initialization complete!" message
✅ Health endpoint returns OK
✅ Can login to phpMyAdmin
✅ Database 'enginedb' exists
✅ Tables are created
```

---

**Most likely fix: Change `MYSQL_USER=root` and `MYSQL_PASSWORD=` (empty) in your `.env` file!** 🎯






