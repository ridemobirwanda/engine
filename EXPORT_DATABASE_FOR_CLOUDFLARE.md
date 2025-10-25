# 📊 Export MySQL Database for Cloudflare

## Quick Export Commands

### Option 1: Export Entire Database (Recommended)
```bash
mysqldump -u root -p enginedb > enginedb-cloudflare-export.sql
```

### Option 2: Export with Compatibility Mode
```bash
mysqldump -u root -p --compatible=ansi --skip-extended-insert enginedb > enginedb-cloudflare.sql
```

### Option 3: Export Specific Tables
```bash
mysqldump -u root -p enginedb products categories orders customers > enginedb-core.sql
```

---

## For Cloudflare D1 (SQLite Format)

Since D1 uses SQLite, you need to convert MySQL to SQLite syntax:

### Step 1: Export MySQL
```bash
mysqldump -u root -p --compatible=ansi enginedb > mysql-export.sql
```

### Step 2: Convert to SQLite
Create `convert-mysql-to-sqlite.js`:

```javascript
const fs = require('fs');

// Read MySQL dump
let sql = fs.readFileSync('mysql-export.sql', 'utf8');

// Convert MySQL to SQLite syntax
sql = sql.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
sql = sql.replace(/ENGINE=\w+/gi, '');
sql = sql.replace(/DEFAULT CHARSET=\w+/gi, '');
sql = sql.replace(/COLLATE=\w+/gi, '');
sql = sql.replace(/UNSIGNED/gi, '');
sql = sql.replace(/` int\(/gi, '` INTEGER(');
sql = sql.replace(/` varchar\(/gi, '` TEXT(');
sql = sql.replace(/` text/gi, '` TEXT');
sql = sql.replace(/` datetime/gi, '` TEXT');
sql = sql.replace(/` timestamp/gi, '` TEXT');
sql = sql.replace(/CURRENT_TIMESTAMP/gi, "datetime('now')");

// Remove MySQL-specific commands
sql = sql.replace(/\/\*!40\d+ .+? \*\/;/g, '');
sql = sql.replace(/SET .+?;/g, '');
sql = sql.replace(/LOCK TABLES .+?;/g, '');
sql = sql.replace(/UNLOCK TABLES;/g, '');

// Write SQLite version
fs.writeFileSync('cloudflare-d1-schema.sql', sql);

console.log('✅ Converted to SQLite format: cloudflare-d1-schema.sql');
```

Run conversion:
```bash
node convert-mysql-to-sqlite.js
```

### Step 3: Upload to Cloudflare D1
```bash
wrangler d1 create enginemarket-db
wrangler d1 execute enginemarket-db --file=./cloudflare-d1-schema.sql
```

---

## For External MySQL (PlanetScale/Railway)

### Option 1: PlanetScale

1. **Create PlanetScale Account:**
   - Go to https://planetscale.com
   - Sign up (free tier available)

2. **Create Database:**
   ```bash
   # Install PlanetScale CLI
   npm install -g @planetscale/cli
   
   # Login
   pscale auth login
   
   # Create database
   pscale database create enginemarket
   ```

3. **Import Data:**
   ```bash
   # Create connection
   pscale connect enginemarket main --port 3309
   
   # Import in another terminal
   mysql -h 127.0.0.1 -P 3309 -u root < enginedb-cloudflare-export.sql
   ```

4. **Get Connection String:**
   ```bash
   pscale password create enginemarket main cloudflare-prod
   ```
   
   Copy the connection string:
   ```
   mysql://user:pass@aws.connect.psdb.cloud/enginemarket?ssl={"rejectUnauthorized":true}
   ```

### Option 2: Railway.app

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create MySQL Database:**
   - Click **"New Project"**
   - Select **"Provision MySQL"**

3. **Get Connection Details:**
   - Click on MySQL service
   - Copy connection URL:
   ```
   mysql://root:password@containers-us-west-123.railway.app:7654/railway
   ```

4. **Import Data:**
   ```bash
   mysql -h containers-us-west-123.railway.app -P 7654 -u root -p railway < enginedb-cloudflare-export.sql
   ```

### Option 3: Render.com PostgreSQL (Free)

1. **Create Render Account**
2. **Create PostgreSQL Database**
3. **Convert MySQL to PostgreSQL** (if needed)
4. **Import data**

---

## Export with Node.js Script

Create `export-for-cloudflare.js`:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');

async function exportDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'enginedb'
  });

  try {
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    let sqlDump = '';

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      
      // Get CREATE TABLE
      const [createTable] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      sqlDump += `\n-- Table: ${tableName}\n`;
      sqlDump += createTable[0]['Create Table'] + ';\n\n';
      
      // Get data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      
      if (rows.length > 0) {
        for (const row of rows) {
          const values = Object.values(row).map(v => 
            v === null ? 'NULL' : mysql.escape(v)
          ).join(', ');
          
          sqlDump += `INSERT INTO \`${tableName}\` VALUES (${values});\n`;
        }
        sqlDump += '\n';
      }
    }

    fs.writeFileSync('enginedb-export-full.sql', sqlDump);
    console.log('✅ Database exported successfully!');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await connection.end();
  }
}

exportDatabase();
```

Run:
```bash
node export-for-cloudflare.js
```

---

## Environment Variables for Cloudflare Pages

After deploying database, add these to Cloudflare:

```bash
# For PlanetScale
DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/enginemarket

# For Railway
DATABASE_URL=mysql://root:pass@containers.railway.app:7654/railway

# For Cloudflare D1
D1_DATABASE_ID=your-d1-database-id
```

Add in Cloudflare Dashboard:
1. Go to Pages project
2. Settings → Environment variables
3. Add each variable
4. Save and redeploy

---

## Test Database Connection

Create `test-cloudflare-db.js`:

```javascript
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log('✅ Database connected! Products:', rows[0].count);
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run:
```bash
DATABASE_URL="your-connection-string" node test-cloudflare-db.js
```

---

## Quick Command Reference

```bash
# Export database
mysqldump -u root -p enginedb > enginedb-export.sql

# Convert to SQLite (for D1)
node convert-mysql-to-sqlite.js

# Create D1 database
wrangler d1 create enginemarket-db

# Import to D1
wrangler d1 execute enginemarket-db --file=./cloudflare-d1-schema.sql

# List D1 databases
wrangler d1 list

# Query D1
wrangler d1 execute enginemarket-db --command="SELECT * FROM products LIMIT 5"
```

---

## Recommended Approach

**For Your Project, I recommend:**

1. **Frontend (React):** Cloudflare Pages (FREE)
2. **Backend API (Express):** Railway.app or Render.com (FREE tier)
3. **Database (MySQL):** PlanetScale (FREE tier, 5GB) or Railway MySQL

**Why?**
- Keeps MySQL compatibility (no conversion needed)
- Free tiers available
- Easy to set up
- Better for production use
- Cloudflare D1 is still in beta and uses SQLite (different from MySQL)

---

## Next Steps

1. ✅ Export your database: `mysqldump -u root -p enginedb > enginedb-export.sql`
2. ✅ Choose hosting: PlanetScale or Railway
3. ✅ Import data to chosen platform
4. ✅ Get connection string
5. ✅ Add to Cloudflare Pages environment variables
6. ✅ Deploy and test!

---

**Questions?** Check `deploy-to-cloudflare-guide.md` for full deployment workflow.

