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
    const protocol = url.startsWith('https') ? https : require('http');
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// ====== ADD YOUR IMAGE URLS HERE ======
const imageMapping = [
  // Example format:
  // { productName: "Toyota 22R", imageUrl: "https://example.com/image.jpg" },
  // Add more entries here...
];

async function addManualImages() {
  try {
    console.log('📥 Adding images manually...\n');
    
    const [products] = await pool.query('SELECT id, name FROM products');
    console.log(`Found ${products.length} products in database\n`);
    
    for (const mapping of imageMapping) {
      // Find product by partial name match
      const product = products.find(p => 
        p.name.toLowerCase().includes(mapping.productName.toLowerCase())
      );
      
      if (!product) {
        console.log(`❌ Product not found: ${mapping.productName}`);
        continue;
      }
      
      console.log(`📦 ${product.name}`);
      
      try {
        const extension = path.extname(mapping.imageUrl) || '.jpg';
        const localFilename = `product_${product.id}_0${extension}`;
        const localPath = path.join(__dirname, 'public', 'images', 'products', localFilename);
        const publicPath = `/images/products/${localFilename}`;
        
        console.log(`  ⬇️  Downloading...`);
        await downloadImage(mapping.imageUrl, localPath);
        console.log(`  ✅ Saved: ${localFilename}`);
        
        // Update database
        await pool.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify([publicPath]), product.id]
        );
        console.log(`  ✅ Database updated\n`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
      }
    }
    
    console.log('🎉 Done!');
    await pool.end();
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// If imageMapping is empty, show instructions
if (imageMapping.length === 0) {
  console.log(`
📝 HOW TO USE:

1. Open this file: add-images-manual.js

2. Add your image URLs in the imageMapping array like this:

const imageMapping = [
  { productName: "Toyota 22R", imageUrl: "https://your-site.com/image1.jpg" },
  { productName: "Subaru WRX", imageUrl: "https://your-site.com/image2.jpg" },
  { productName: "Nissan", imageUrl: "https://your-site.com/image3.jpg" },
];

3. Run: node add-images-manual.js

The script will:
✅ Match products by name
✅ Download images
✅ Save to public/images/products/
✅ Update database with local paths

Current products in database:
`);
  
  pool.query('SELECT id, name FROM products ORDER BY name').then(([products]) => {
    products.forEach(p => {
      console.log(`  - ${p.name}`);
    });
    pool.end();
  });
} else {
  addManualImages();
}

