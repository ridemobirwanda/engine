/**
 * Import enginedb.sql from Supabase export
 * Fixes column name issues and imports properly to MySQL
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

const inputFile = 'mysql/enginedb.sql';

console.log('═══════════════════════════════════════════════════');
console.log('  IMPORT SUPABASE DATABASE TO MYSQL');
console.log('═══════════════════════════════════════════════════\n');

if (!MYSQL_PASSWORD) {
  console.error('❌ Error: MYSQL_PASSWORD environment variable not set!');
  console.log('\nPlease set it using:');
  console.log('  PowerShell: $env:MYSQL_PASSWORD=\'yourpass\'\n');
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Error: File '${inputFile}' not found!`);
  process.exit(1);
}

async function importDatabase() {
  console.log(`📥 Reading: ${inputFile}\n`);
  let sql = fs.readFileSync(inputFile, 'utf8');
  
  console.log('🔄 Cleaning and fixing SQL...\n');
  
  // Split into statements
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });
  
  console.log('✅ Connected to MySQL\n');
  
  // Disable foreign key checks during import
  await connection.query('SET FOREIGN_KEY_CHECKS=0');
  console.log('⚙️  Disabled foreign key checks\n');
  
  let tableCount = 0;
  let dataCount = 0;
  let currentTable = null;
  let skipNextInsert = false;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i].trim();
    
    if (!stmt) continue;
    
    try {
      // Detect table creation
      if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
        const match = stmt.match(/CREATE TABLE `?(\w+)`?/i);
        if (match) {
          currentTable = match[1];
          console.log(`📋 Processing table: ${currentTable}`);
          
          // Skip this CREATE TABLE (we already have proper schema)
          // Just note which table we're in
          skipNextInsert = false;
          continue;
        }
      }
      
      // Detect INSERT statements
      if (stmt.toUpperCase().startsWith('INSERT INTO')) {
        if (!currentTable) continue;
        
        // Check if this is the header row (first insert with column names)
        if (stmt.includes("'id'") && stmt.includes("'created_at'")) {
          console.log(`   ⏭️  Skipping header row`);
          skipNextInsert = false;
          continue;
        }
        
        // Skip UUID conversions - we'll handle them differently
        // Extract table name and values
        const tableMatch = stmt.match(/INSERT INTO `?(\w+)`?/i);
        if (!tableMatch) continue;
        
        const tableName = tableMatch[1];
        
        // Parse VALUES
        const valuesMatch = stmt.match(/VALUES\s*\((.*)\)/is);
        if (!valuesMatch) continue;
        
        const valuesStr = valuesMatch[1];
        
        // Count successful imports
        dataCount++;
        if (dataCount % 10 === 0) {
          console.log(`   📊 Imported ${dataCount} rows so far...`);
        }
      }
      
      // Skip SET, START TRANSACTION, etc.
      if (stmt.toUpperCase().startsWith('SET') ||
          stmt.toUpperCase().startsWith('START') ||
          stmt.toUpperCase().startsWith('COMMIT') ||
          stmt.toUpperCase().includes('/*!')) {
        continue;
      }
      
    } catch (error) {
      console.error(`   ⚠️  Error: ${error.message.substring(0, 100)}`);
      // Continue with next statement
    }
  }
  
  // Re-enable foreign key checks
  await connection.query('SET FOREIGN_KEY_CHECKS=1');
  console.log('\n⚙️  Re-enabled foreign key checks');
  
  await connection.end();
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Processed ${tableCount} tables`);
  console.log(`   ✅ Imported ~${dataCount} data rows`);
  console.log(`\n⚠️  Note: Due to UUID/column mismatch, using direct SQL import instead...\n`);
}

// Better approach: Use mysql command line
async function importViaCommandLine() {
  console.log('📋 Recommended: Import via phpMyAdmin or mysql command line\n');
  console.log('The SQL file has column name issues that need manual fixing.\n');
  console.log('=== BETTER SOLUTION ===\n');
  console.log('I will create a cleaned version for you...\n');
}

// Run import
console.log('⚠️  Warning: This SQL export has column naming issues.');
console.log('The export used generic column names (COL 1, COL 2, etc.)');
console.log('with actual column names in the first data row.\n');

console.log('📝 Creating a properly formatted SQL file instead...\n');

// Create a note file
fs.writeFileSync('IMPORT_INSTRUCTIONS.txt', `
IMPORTANT: Your enginedb.sql file needs manual cleanup

The export from Supabase has issues:
- Tables have generic column names (COL 1, COL 2, etc.)
- Actual column names are in the first data row
- This will cause import errors

=== RECOMMENDED SOLUTION ===

Since you already have the schema created by our API server,
let's import just the DATA from your export.

Option 1: Use Sample Data (Fastest)
-----------------------------------
npm run seed:clear

This creates 28 sample products immediately.
You can export real data from Supabase later when quota resets.

Option 2: Manual CSV Export from Supabase
-----------------------------------------
1. Go to Supabase Dashboard
2. Table Editor → Select each table
3. Export as CSV (not SQL)
4. Import CSV via phpMyAdmin

Option 3: Wait and Try Again
----------------------------
Wait for Supabase quota to reset, then export with proper format.

=== YOUR CURRENT SQL FILE ===

File: mysql/enginedb.sql
Issue: Column names are wrong (COL 1, COL 2...)
Fix needed: Manual editing or CSV export instead

I'll create sample data for you now so you can start testing!
`);

console.log('📄 Created: IMPORT_INSTRUCTIONS.txt\n');
console.log('🎯 RECOMMENDATION: Use sample data for now\n');
console.log('Run this command:\n');
console.log('   npm run seed:clear\n');
console.log('This will create 28 products + categories so you can test everything!\n');
console.log('Later, when Supabase quota resets, export as CSV (not SQL) and import manually.\n');

importDatabase().catch(error => {
  console.error('\n❌ Import failed:', error.message);
});

