import 'dotenv/config';
import mysql from 'mysql2/promise';
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

function normalizeText(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1, str2) {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  // Check for common keywords
  const keywords = s1.split(' ').filter(word => word.length > 2);
  let matches = 0;
  
  for (const keyword of keywords) {
    if (s2.includes(keyword)) {
      matches++;
    }
  }
  
  return matches / keywords.length;
}

async function matchLocalImages() {
  try {
    console.log('🔍 Matching local images to products...\n');
    
    // Get all images from folder
    const imagesDir = path.join(__dirname, 'public', 'images', 'products');
    const imageFiles = fs.readdirSync(imagesDir).filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );
    
    console.log(`Found ${imageFiles.length} images in folder\n`);
    
    // Get all products
    const [products] = await pool.query('SELECT id, name FROM products ORDER BY name');
    console.log(`Found ${products.length} products in database\n`);
    
    let matched = 0;
    let updated = 0;
    
    for (const product of products) {
      // Find best matching images
      const matches = imageFiles.map(filename => ({
        filename,
        score: calculateSimilarity(filename, product.name)
      }))
      .filter(m => m.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4); // Take top 4 matches
      
      if (matches.length > 0) {
        const imagePaths = matches.map(m => `/images/products/${m.filename}`);
        
        console.log(`✅ ${product.name}`);
        console.log(`   Matched ${matches.length} image(s):`);
        matches.forEach((m, i) => {
          console.log(`   ${i + 1}. ${m.filename} (score: ${(m.score * 100).toFixed(0)}%)`);
        });
        
        // Update database
        await pool.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify(imagePaths), product.id]
        );
        
        matched++;
        updated++;
        console.log('');
      } else {
        console.log(`⚠️  ${product.name} - No matching images found\n`);
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`   ✅ Matched: ${matched} products`);
    console.log(`   📝 Updated: ${updated} products`);
    console.log(`   ❌ No match: ${products.length - matched} products`);
    
    await pool.end();
    console.log('\n🎉 Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

matchLocalImages();

