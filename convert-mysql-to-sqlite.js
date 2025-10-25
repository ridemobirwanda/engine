const fs = require('fs');
const path = require('path');

console.log('================================================');
console.log(' MySQL to SQLite Converter for Cloudflare D1');
console.log('================================================\n');

const inputFile = 'enginedb-cloudflare-export.sql';
const outputFile = 'cloudflare-d1-schema.sql';

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error('❌ ERROR: Input file not found:', inputFile);
  console.log('\nPlease run: export-database.bat first\n');
  process.exit(1);
}

console.log('📖 Reading MySQL dump:', inputFile);
let sql = fs.readFileSync(inputFile, 'utf8');

console.log('🔄 Converting MySQL syntax to SQLite...\n');

// Track conversions
const conversions = {
  autoIncrement: 0,
  dataTypes: 0,
  engines: 0,
  charset: 0,
  timestamps: 0,
  mysqlCommands: 0
};

// Convert AUTO_INCREMENT to AUTOINCREMENT
const autoIncrementMatches = sql.match(/AUTO_INCREMENT/gi);
if (autoIncrementMatches) {
  conversions.autoIncrement = autoIncrementMatches.length;
  sql = sql.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
}

// Remove ENGINE, CHARSET, COLLATE
const engineMatches = sql.match(/ENGINE=\w+/gi);
if (engineMatches) {
  conversions.engines = engineMatches.length;
  sql = sql.replace(/ENGINE=\w+/gi, '');
}

const charsetMatches = sql.match(/DEFAULT CHARSET=\w+/gi);
if (charsetMatches) {
  conversions.charset = charsetMatches.length;
  sql = sql.replace(/DEFAULT CHARSET=\w+/gi, '');
  sql = sql.replace(/COLLATE=\w+/gi, '');
}

// Remove UNSIGNED
sql = sql.replace(/UNSIGNED/gi, '');

// Convert data types
const dataTypePatterns = [
  [/` int\(/gi, '` INTEGER('],
  [/` bigint\(/gi, '` INTEGER('],
  [/` smallint\(/gi, '` INTEGER('],
  [/` tinyint\(/gi, '` INTEGER('],
  [/` varchar\(/gi, '` TEXT('],
  [/` text/gi, '` TEXT'],
  [/` longtext/gi, '` TEXT'],
  [/` mediumtext/gi, '` TEXT'],
  [/` datetime/gi, '` TEXT'],
  [/` timestamp/gi, '` TEXT'],
  [/` date/gi, '` TEXT'],
  [/` decimal\(/gi, '` REAL('],
  [/` float/gi, '` REAL'],
  [/` double/gi, '` REAL'],
];

dataTypePatterns.forEach(([pattern, replacement]) => {
  const matches = sql.match(pattern);
  if (matches) {
    conversions.dataTypes += matches.length;
    sql = sql.replace(pattern, replacement);
  }
});

// Convert CURRENT_TIMESTAMP
const timestampMatches = sql.match(/CURRENT_TIMESTAMP/gi);
if (timestampMatches) {
  conversions.timestamps = timestampMatches.length;
  sql = sql.replace(/CURRENT_TIMESTAMP/gi, "datetime('now')");
}

// Remove MySQL-specific commands
const mysqlCommands = [
  /\/\*!40\d+ .+? \*\/;/g,
  /\/\*!40\d+ .+? \*\//g,
  /SET .+?;/g,
  /LOCK TABLES .+?;/g,
  /UNLOCK TABLES;/g,
  /-- Dump completed on .+/g,
  /-- MySQL dump .+/g,
  /-- Host: .+/g,
  /-- Server version.+/g,
];

mysqlCommands.forEach(pattern => {
  const matches = sql.match(pattern);
  if (matches) {
    conversions.mysqlCommands += matches.length;
    sql = sql.replace(pattern, '');
  }
});

// Clean up extra blank lines
sql = sql.replace(/\n\n\n+/g, '\n\n');

// Add SQLite-specific pragmas at the beginning
const sqliteHeader = `-- Converted to SQLite for Cloudflare D1
-- Original: ${inputFile}
-- Converted: ${new Date().toISOString()}

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

`;

sql = sqliteHeader + sql;

// Write output
console.log('💾 Writing SQLite schema:', outputFile);
fs.writeFileSync(outputFile, sql);

// Get file sizes
const inputSize = fs.statSync(inputFile).size;
const outputSize = fs.statSync(outputFile).size;

console.log('\n================================================');
console.log(' ✅ Conversion Complete!');
console.log('================================================\n');

console.log('📊 Conversion Summary:');
console.log(`   AUTO_INCREMENT → AUTOINCREMENT: ${conversions.autoIncrement}`);
console.log(`   Data types converted: ${conversions.dataTypes}`);
console.log(`   ENGINE statements removed: ${conversions.engines}`);
console.log(`   CHARSET/COLLATE removed: ${conversions.charset}`);
console.log(`   CURRENT_TIMESTAMP converted: ${conversions.timestamps}`);
console.log(`   MySQL-specific commands removed: ${conversions.mysqlCommands}`);

console.log('\n📁 Files:');
console.log(`   Input:  ${inputFile} (${(inputSize / 1024).toFixed(2)} KB)`);
console.log(`   Output: ${outputFile} (${(outputSize / 1024).toFixed(2)} KB)`);

console.log('\n📋 Next Steps:');
console.log('   1. Install Wrangler: npm install -g wrangler');
console.log('   2. Login: wrangler login');
console.log('   3. Create D1 database: wrangler d1 create enginemarket-db');
console.log(`   4. Import data: wrangler d1 execute enginemarket-db --file=./${outputFile}`);
console.log('\n   See EXPORT_DATABASE_FOR_CLOUDFLARE.md for details\n');

