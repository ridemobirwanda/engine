/**
 * Smart importer for enginedb.sql
 * Handles the column name issues and imports data properly
 */

import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_USER = process.env.MYSQL_USER || 'enginedb';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'enginedb';
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);

console.log('═══════════════════════════════════════════════════');
console.log('  SMART IMPORT: enginedb.sql → MySQL');
console.log('═══════════════════════════════════════════════════\n');

if (!MYSQL_PASSWORD) {
  console.error('❌ Error: MYSQL_PASSWORD not set!');
  console.log('\nSet it: $env:MYSQL_PASSWORD=\'yourpass\'\n');
  process.exit(1);
}

async function importData() {
  console.log('📥 Reading mysql/enginedb.sql...\n');
  const sql = fs.readFileSync('mysql/enginedb.sql', 'utf8');
  
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });
  
  console.log('✅ Connected to MySQL\n');
  
  await connection.query('SET FOREIGN_KEY_CHECKS=0');
  
  // Extract data for each table
  const tables = {
    categories: {
      pattern: /-- Dumping data for table `categories`.*?INSERT INTO `categories`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    },
    products: {
      pattern: /-- Dumping data for table `products`.*?INSERT INTO `products`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    },
    admin_users: {
      pattern: /-- Dumping data for table `admin_users`.*?INSERT INTO `admin_users`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    },
    contact_messages: {
      pattern: /-- Dumping data for table `contact_messages`.*?INSERT INTO `contact_messages`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    },
    orders: {
      pattern: /-- Dumping data for table `orders`.*?INSERT INTO `orders`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    },
    website_settings: {
      pattern: /-- Dumping data for table `website_settings`.*?INSERT INTO `website_settings`.*?VALUES\s*\((.*?)\);/s,
      columns: []
    }
  };
  
  // Helper function to parse CSV-like values respecting quotes
  function parseValues(str) {
    const values = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const prevChar = str[i - 1];
      
      if ((char === "'" || char === '"') && prevChar !== '\\') {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        }
      }
      
      if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current) values.push(current.trim());
    
    return values.map(v => {
      v = v.trim();
      // Remove quotes
      if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
        v = v.slice(1, -1);
      }
      // Handle escaped quotes
      v = v.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      return v === '' ? null : v;
    });
  }
  
  // Process each table
  for (const [tableName, tableInfo] of Object.entries(tables)) {
    console.log(`\n📋 Processing: ${tableName}`);
    
    const match = sql.match(tableInfo.pattern);
    if (!match) {
      console.log(`   ⏭️  No data found, skipping`);
      continue;
    }
    
    // Split by '),\n(' to get individual rows
    const rowsStr = match[1];
    const rowMatches = rowsStr.split(/\),\s*\(/);
    
    if (rowMatches.length === 0) {
      console.log(`   ⏭️  No rows found`);
      continue;
    }
    
    // First row is column names
    let columnNames = parseValues(rowMatches[0].replace(/^\(/, '').replace(/\)$/, ''));
    console.log(`   📊 Columns: ${columnNames.join(', ')}`);
    
    // Rest are data rows
    let imported = 0;
    let skipped = 0;
    
    for (let i = 1; i < rowMatches.length; i++) {
      try {
        const rowStr = rowMatches[i].replace(/^\(/, '').replace(/\)$/, '');
        const values = parseValues(rowStr);
        
        if (values.length !== columnNames.length) {
          console.log(`   ⚠️  Row ${i}: column count mismatch (${values.length} vs ${columnNames.length})`);
          skipped++;
          continue;
        }
        
        // Build INSERT query with proper column names
        const columns = columnNames.filter(c => c !== 'id'); // Skip UUID id
        const data = {};
        
        for (let j = 0; j < columnNames.length; j++) {
          if (columnNames[j] !== 'id') {
            data[columnNames[j]] = values[j];
          }
        }
        
        // Skip if no valid data
        if (Object.keys(data).length === 0) {
          skipped++;
          continue;
        }
        
        // Special handling for different tables
        if (tableName === 'categories') {
          // Map category_id (ignore UUIDs, use auto-increment)
          delete data.id;
        }
        
        if (tableName === 'products') {
          // Set category_id to 1 for now (default category)
          data.category_id = 1;
          // Convert boolean strings
          data.is_active = (data.is_active === 'true' || data.is_active === '1') ? 1 : 0;
          data.is_featured = (data.is_featured === 'true' || data.is_featured === '1') ? 1 : 0;
        }
        
        if (tableName === 'admin_users') {
          delete data.id;
          delete data.user_id; // Will use auto-increment instead
          data.is_active = (data.is_active === 'true' || data.is_active === '1') ? 1 : 0;
        }
        
        if (tableName === 'contact_messages') {
          delete data.id;
        }
        
        if (tableName === 'orders') {
          delete data.id;
          delete data.user_id; // Keep as string for now
        }
        
        if (tableName === 'website_settings') {
          delete data.id;
        }
        
        // Build INSERT query
        const cols = Object.keys(data);
        const vals = Object.values(data);
        const placeholders = cols.map(() => '?').join(', ');
        
        const query = `INSERT INTO \`${tableName}\` (\`${cols.join('`, `')}\`) VALUES (${placeholders})`;
        
        await connection.query(query, vals);
        imported++;
        
        if (imported % 10 === 0 && imported > 0) {
          process.stdout.write(`\r   ✅ Imported: ${imported} rows...`);
        }
        
      } catch (error) {
        console.log(`\n   ⚠️  Row ${i} error: ${error.message.substring(0, 80)}...`);
        skipped++;
      }
    }
    
    console.log(`\n   📊 Total: ${imported} imported, ${skipped} skipped`);
  }
  
  await connection.query('SET FOREIGN_KEY_CHECKS=1');
  await connection.end();
  
  console.log(`\n\n🎉 Import complete!`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Start API: npm run api`);
  console.log(`   2. Start frontend: npm run dev`);
  console.log(`   3. Visit: http://localhost:21201/admin/products\n`);
}

importData().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});

