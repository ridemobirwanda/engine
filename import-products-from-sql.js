/**
 * Import products from PostgreSQL SQL dump into MySQL
 * Parses INSERT statements and converts data properly
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

const inputFile = process.argv[2] || 'products_rows.sql';

console.log('═══════════════════════════════════════════════════');
console.log('  IMPORT PRODUCTS FROM SQL DUMP');
console.log('═══════════════════════════════════════════════════\n');

if (!MYSQL_PASSWORD) {
  console.error('❌ Error: MYSQL_PASSWORD environment variable not set!');
  console.log('\nPlease set it using:');
  console.log('  PowerShell: $env:MYSQL_PASSWORD=\'yourpass\'');
  console.log('  Or in .env file: MYSQL_PASSWORD=yourpass\n');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Error: Input file '${inputFile}' not found!`);
  console.log('\nUsage: node import-products-from-sql.js <file.sql>');
  console.log('Example: node import-products-from-sql.js products_rows.sql\n');
  process.exit(1);
}

// Parse PostgreSQL INSERT statement
function parseInsertValues(sql) {
  const products = [];
  
  // Match INSERT INTO statements with VALUES
  const insertPattern = /INSERT INTO .* VALUES\s*\((.*?)\);/gs;
  const matches = sql.matchAll(insertPattern);
  
  for (const match of matches) {
    const valuesStr = match[1];
    
    // Split by comma, but respect quotes and brackets
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    let inBrackets = 0;
    let quoteChar = '';
    
    for (let i = 0; i < valuesStr.length; i++) {
      const char = valuesStr[i];
      
      if ((char === "'" || char === '"') && valuesStr[i - 1] !== '\\') {
        if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuotes = false;
        }
      }
      
      if (char === '[' && !inQuotes) inBrackets++;
      if (char === ']' && !inQuotes) inBrackets--;
      
      if (char === ',' && !inQuotes && inBrackets === 0) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    if (currentValue) {
      values.push(currentValue.trim());
    }
    
    products.push(values);
  }
  
  return products;
}

// Clean and convert value
function cleanValue(value) {
  if (!value) return null;
  
  value = value.trim();
  
  // Handle NULL
  if (value.toLowerCase() === 'null') return null;
  
  // Remove quotes
  if ((value.startsWith("'") && value.endsWith("'")) || 
      (value.startsWith('"') && value.endsWith('"'))) {
    value = value.slice(1, -1);
  }
  
  // Unescape quotes
  value = value.replace(/\\'/g, "'").replace(/\\"/g, '"');
  
  return value;
}

async function importProducts() {
  console.log(`📥 Reading: ${inputFile}\n`);
  const sql = fs.readFileSync(inputFile, 'utf8');
  
  console.log('🔍 Parsing SQL dump...\n');
  const productRows = parseInsertValues(sql);
  
  if (productRows.length === 0) {
    console.error('❌ No product data found in SQL file!');
    console.log('\n💡 Make sure your SQL file contains INSERT INTO statements\n');
    return;
  }
  
  console.log(`✅ Found ${productRows.length} products to import\n`);
  
  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });
  
  console.log('✅ Connected to MySQL\n');
  
  // Clear existing products?
  if (process.argv.includes('--clear')) {
    console.log('🗑️  Clearing existing products...');
    await connection.query('DELETE FROM products');
    console.log('✅ Cleared\n');
  }
  
  console.log('📤 Importing products...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  // Expected column order from Supabase products table:
  // id, name, description, short_description, sku, price, compare_price, cost_price,
  // category_id, brand, model, year_from, year_to, engine_type, displacement,
  // fuel_type, condition, stock_quantity, low_stock_threshold, weight, dimensions,
  // images, specifications, is_featured, is_active, meta_title, meta_description,
  // tags, created_at, updated_at
  
  for (const row of productRows) {
    try {
      // Extract and clean values
      const name = cleanValue(row[1]);
      const description = cleanValue(row[2]);
      const short_description = cleanValue(row[3]);
      const price = cleanValue(row[5]) || '0';
      const compare_price = cleanValue(row[6]);
      const brand = cleanValue(row[9]);
      const model = cleanValue(row[10]);
      const engine_type = cleanValue(row[13]);
      const displacement = cleanValue(row[14]);
      const fuel_type = cleanValue(row[15]);
      const condition = cleanValue(row[16]);
      const stock_quantity = cleanValue(row[17]) || '0';
      const images = cleanValue(row[21]);
      const specifications = cleanValue(row[22]);
      const is_featured = cleanValue(row[23]) === 'true' ? 1 : 0;
      const is_active = cleanValue(row[24]) === 'true' ? 1 : 0;
      
      // Default category_id to 1 if invalid UUID
      let category_id = 1;
      
      await connection.query(
        `INSERT INTO products (
          name, description, short_description, price, compare_price,
          brand, model, engine_type, displacement, fuel_type,
          \`condition\`, stock_quantity, is_active, is_featured,
          images, specifications, category_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description,
          short_description,
          price,
          compare_price,
          brand,
          model,
          engine_type,
          displacement,
          fuel_type,
          condition,
          stock_quantity,
          is_active,
          is_featured,
          images,
          specifications,
          category_id,
        ]
      );
      
      successCount++;
      console.log(`✅ Imported: ${name}`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Error importing product: ${error.message}`);
    }
  }
  
  await connection.end();
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Successfully imported: ${successCount} products`);
  console.log(`   ❌ Failed: ${errorCount} products`);
  console.log(`\n🎉 Import complete!`);
  console.log(`\n💡 Visit http://localhost:21201/admin/products to see your products!\n`);
}

importProducts().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});

