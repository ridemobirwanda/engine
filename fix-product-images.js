/**
 * Replace Supabase storage URLs with placeholder images
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

process.env.MYSQL_HOST = 'localhost';
process.env.MYSQL_USER = 'enginedb';
process.env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'yourpass';
process.env.MYSQL_DATABASE = 'enginedb';
process.env.MYSQL_PORT = '3306';

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT, 10);

async function fixImages() {
  console.log('🖼️  Fixing product images...\n');

  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });

  console.log('✅ Connected to MySQL\n');

  // Get all products
  const [products] = await connection.query('SELECT id, name, images FROM products');

  console.log(`Found ${products.length} products\n`);

  let updated = 0;

  for (const product of products) {
    try {
      let images = product.images;
      
      // Skip if no images
      if (!images) continue;

      // Parse if it's a JSON string
      if (typeof images === 'string') {
        try {
          images = JSON.parse(images);
        } catch (e) {
          console.log(`⏭️  Skipping ${product.name} - invalid JSON`);
          continue;
        }
      }

      // Check if images contain Supabase URLs
      if (Array.isArray(images) && images.length > 0) {
        const hasSupabaseUrl = images.some(img => img && img.includes('supabase.co'));
        
        if (hasSupabaseUrl) {
          // Replace with placeholder images from Unsplash
          const placeholderImages = [
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop'
          ];
          
          const newImages = JSON.stringify([placeholderImages[0]]);
          
          await connection.query('UPDATE products SET images = ? WHERE id = ?', [newImages, product.id]);
          
          console.log(`✅ Updated: ${product.name}`);
          updated++;
        }
      }
    } catch (error) {
      console.error(`❌ Error updating ${product.name}:`, error.message);
    }
  }

  await connection.end();

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated ${updated} products with placeholder images`);
  console.log(`\n💡 Next: Upload your real product images to /public/images/products/\n`);
}

fixImages().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

