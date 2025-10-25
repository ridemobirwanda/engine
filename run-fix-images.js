/**
 * Wrapper to run image fix with environment variables
 */

// Set environment variables
process.env.MYSQL_HOST = 'localhost';
process.env.MYSQL_USER = 'enginedb';
process.env.MYSQL_PASSWORD = 'yourpass';
process.env.MYSQL_DATABASE = 'enginedb';
process.env.MYSQL_PORT = '3306';

// Import and run the script
import('./fix-product-images.js');

