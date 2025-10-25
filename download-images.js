import 'dotenv/config';
import mysql from 'mysql2/promise';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { MYSQL_HOST = 'localhost', MYSQL_USER = 'root', MYSQL_PASSWORD, MYSQL_DATABASE = 'enginedb', MYSQL_PORT } = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
});

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadProductImages() {
  try {
    console.log('📥 Starting image download...\n');
    
    const [products] = await pool.query('SELECT id, name, images FROM products WHERE images IS NOT NULL AND images != "[]"');
    
    console.log(`Found ${products.length} products with images\n`);
    
    for (const product of products) {
      try {
        const images = JSON.parse(product.images);
        const localImages = [];
        
        console.log(`📦 Product: ${product.name}`);
        
        for (let i = 0; i < images.length; i++) {
          const imageUrl = images[i];
          
          // Extract filename from URL
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          const extension = path.extname(filename) || '.jpg';
          
          // Create a clean filename: productId_index_extension
          const localFilename = `product_${product.id}_${i}${extension}`;
          const localPath = path.join(__dirname, 'public', 'images', 'products', localFilename);
          const publicPath = `/images/products/${localFilename}`;
          
          try {
            console.log(`  ⬇️  Downloading image ${i + 1}/${images.length}...`);
            await downloadImage(imageUrl, localPath);
            localImages.push(publicPath);
            console.log(`  ✅ Saved: ${localFilename}`);
          } catch (error) {
            console.log(`  ❌ Failed: ${error.message}`);
            // Keep original URL if download fails
            localImages.push(imageUrl);
          }
        }
        
        // Update database with new local paths
        await pool.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify(localImages), product.id]
        );
        
        console.log(`  ✅ Database updated\n`);
        
      } catch (error) {
        console.error(`❌ Error processing product ${product.id}:`, error.message);
      }
    }
    
    console.log('\n🎉 Image download complete!');
    await pool.end();
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

downloadProductImages();

