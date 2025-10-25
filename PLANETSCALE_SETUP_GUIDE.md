# 🗄️ PlanetScale Database Setup - Complete Guide

## 📋 Overview

PlanetScale is a MySQL-compatible database hosting service. We'll use the FREE tier for your EngineMarket database.

---

## ✅ Prerequisites

- GitHub account (you already have this)
- Cloudflare account (you already have this)
- 10 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Create PlanetScale Account

1. Go to: https://planetscale.com
2. Click: **"Sign up"** button
3. Choose: **"Sign up with GitHub"**
4. Click: **"Authorize planetscale"**
5. GitHub asks for permission
6. Click: **"Authorize"**
7. You're redirected to PlanetScale
8. Done! ✅

---

### Step 2: Create Your First Database

1. Go to: https://app.planetscale.com
2. Click: **"Create a database"** button
3. Fill in:
   - **Database name**: `enginemarket`
   - **Region**: Select closest to you (e.g., us-east, eu-west)
   - **Plan**: Select **"Free"**
4. Click: **"Create database"**
5. Wait 1-2 minutes for creation
6. You'll see your database in the dashboard

---

### Step 3: Get Your Connection String

This is important! You need this to connect your backend.

1. Go to your database: `enginemarket`
2. Click: **"Connect"** button
3. You'll see connection options:
   - **Node.js** ← Select this
   - Python
   - Go
   - etc.
4. Click: **"Node.js"**
5. You'll see a connection string like:

```
mysql://[username]:[password]@[host]/enginemarket?sslaccept=strict
```

6. **COPY this entire string**
7. **SAVE it somewhere safe** (you'll need it later)

---

### Step 4: Create Database Tables

Your database is empty. We need to create tables for your app.

#### Option A: Using PlanetScale Console

1. Go to your database
2. Click: **"Console"**
3. Paste your SQL commands
4. Click: **"Execute"**

#### Option B: Using MySQL CLI

```bash
# Install MySQL client (if needed)
# Then connect:
mysql -u [username] -p[password] -h [host] enginemarket

# Paste your SQL commands
```

---

### Step 5: Create Tables

Use these SQL commands to create your tables:

```sql
-- Products table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table
CREATE TABLE cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

### Step 6: Verify Tables Created

1. Go to PlanetScale console
2. Run: `SHOW TABLES;`
3. You should see all 6 tables
4. Done! ✅

---

## 🔑 Your Connection String

**Format:**
```
mysql://[username]:[password]@[host]/enginemarket?sslaccept=strict
```

**Example:**
```
mysql://root:abc123@aws.connect.psdb.cloud/enginemarket?sslaccept=strict
```

**Keep this safe!** You'll need it for:
- Cloudflare Workers environment variables
- Backend configuration
- Local testing

---

## 💡 PlanetScale Features

- ✓ MySQL 8.0 compatible
- ✓ Automatic backups
- ✓ SSL encryption
- ✓ Global regions
- ✓ FREE tier: 5GB storage
- ✓ Unlimited queries
- ✓ Easy scaling

---

## 📊 FREE Tier Limits

- **Storage**: 5GB
- **Queries**: Unlimited
- **Connections**: 1,000
- **Branches**: 1
- **Cost**: FREE! 🎉

---

## 🆘 Troubleshooting

### Can't Connect to Database
- Check connection string
- Verify username/password
- Check firewall settings
- Try from PlanetScale console first

### Tables Not Created
- Check SQL syntax
- Run one table at a time
- Check for errors in console

### Connection String Not Working
- Copy entire string including `?sslaccept=strict`
- Don't modify the string
- Check for typos

---

## 📝 Your Database Info

```
Database Name: enginemarket
Host: aws.connect.psdb.cloud (or your region)
Username: [from connection string]
Password: [from connection string]
Port: 3306
SSL: Required
Tables: 6 (products, categories, users, orders, order_items, cart)
```

---

## ✅ Checklist

- [ ] Create PlanetScale account
- [ ] Create database named "enginemarket"
- [ ] Get connection string
- [ ] Create tables using SQL
- [ ] Verify tables created
- [ ] Save connection string

---

## 🚀 Next Steps

1. ✅ PlanetScale database created
2. ⏳ Deploy backend to Cloudflare Workers
3. ⏳ Connect frontend to backend
4. ⏳ Test everything

**Ready to deploy to Cloudflare Workers?** Let me know! 🚀

