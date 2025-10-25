/**
 * Convert PostgreSQL SQL dump to MySQL-compatible format
 * Handles Supabase exports for products table
 */

import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2] || 'products_rows.sql';
const outputFile = process.argv[3] || 'products_mysql.sql';

console.log('═══════════════════════════════════════════════════');
console.log('  POSTGRESQL → MYSQL CONVERTER');
console.log('═══════════════════════════════════════════════════\n');

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Error: Input file '${inputFile}' not found!`);
  console.log('\nUsage: node convert-postgres-to-mysql.js <input.sql> [output.sql]');
  console.log('Example: node convert-postgres-to-mysql.js products_rows.sql products_mysql.sql\n');
  process.exit(1);
}

try {
  console.log(`📥 Reading: ${inputFile}`);
  let sql = fs.readFileSync(inputFile, 'utf8');

  console.log('🔄 Converting PostgreSQL syntax to MySQL...\n');

  // 1. Replace "public"."products" with products (backticks for MySQL)
  sql = sql.replace(/"public"\."products"/g, '`products`');
  
  // 2. Replace all double quotes with backticks for column names
  sql = sql.replace(/"([a-z_]+)"/g, '`$1`');
  
  // 3. Replace PostgreSQL-specific types
  sql = sql.replace(/::uuid/g, '');
  sql = sql.replace(/::text/g, '');
  sql = sql.replace(/::jsonb/g, '');
  sql = sql.replace(/::json/g, '');
  sql = sql.replace(/::timestamp/g, '');
  sql = sql.replace(/::integer/g, '');
  sql = sql.replace(/::boolean/g, '');
  
  // 4. Replace UUID with AUTO_INCREMENT or remove UUID constraint
  // UUIDs need to be converted to integers or kept as VARCHAR
  // For now, we'll keep them as strings
  
  // 5. Replace 'true'/'false' with 1/0
  sql = sql.replace(/\btrue\b/gi, '1');
  sql = sql.replace(/\bfalse\b/gi, '0');
  
  // 6. Handle NULL values properly (PostgreSQL uses 'null' or NULL)
  // MySQL prefers NULL (uppercase)
  sql = sql.replace(/\bnull\b/g, 'NULL');
  
  // 7. Fix array syntax: PostgreSQL uses {item1,item2}, MySQL uses JSON
  // This is complex, so we'll handle it in the data
  
  // 8. Ensure proper INSERT syntax
  sql = sql.replace(/INSERT INTO/gi, 'INSERT INTO');
  
  // 9. Remove any PostgreSQL-specific commands
  sql = sql.replace(/BEGIN;/g, '');
  sql = sql.replace(/COMMIT;/g, '');
  sql = sql.replace(/SET.*;/g, '');
  
  // 10. Add MySQL-specific options
  sql = '-- Converted from PostgreSQL to MySQL format\n' +
        '-- Original file: ' + inputFile + '\n' +
        '-- Generated: ' + new Date().toISOString() + '\n\n' +
        'SET FOREIGN_KEY_CHECKS=0;\n' +
        'SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";\n\n' +
        sql;
  
  console.log('✅ Conversion complete!\n');
  
  // Write output
  console.log(`📤 Writing: ${outputFile}`);
  fs.writeFileSync(outputFile, sql, 'utf8');
  
  console.log(`\n✅ Successfully converted!`);
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Open phpMyAdmin: http://localhost/phpmyadmin`);
  console.log(`   2. Select 'enginedb' database`);
  console.log(`   3. Click 'Import' tab`);
  console.log(`   4. Choose file: ${outputFile}`);
  console.log(`   5. Click 'Go'\n`);
  console.log(`💡 Or use command line:`);
  console.log(`   mysql -u enginedb -p enginedb < ${outputFile}\n`);

} catch (error) {
  console.error('❌ Error converting file:', error.message);
  process.exit(1);
}

