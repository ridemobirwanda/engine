/**
 * Wrapper to run import with hardcoded environment variables
 */

// Set environment variables
process.env.MYSQL_HOST = 'localhost';
process.env.MYSQL_USER = 'enginedb';
process.env.MYSQL_PASSWORD = 'yourpass';
process.env.MYSQL_DATABASE = 'enginedb';
process.env.MYSQL_PORT = '3306';

console.log('🔧 Environment variables set:');
console.log(`   Host: ${process.env.MYSQL_HOST}`);
console.log(`   User: ${process.env.MYSQL_USER}`);
console.log(`   Database: ${process.env.MYSQL_DATABASE}`);
console.log('');

// Import and run the script
import('./recreate-and-import.js');

