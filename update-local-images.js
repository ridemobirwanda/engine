/**
 * Update products to use local images from public/images/products/
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Set environment variables
process.env.MYSQL_HOST = 'localhost';
process.env.MYSQL_USER = 'enginedb';
process.env.MYSQL_PASSWORD = 'yourpass';
process.env.MYSQL_DATABASE = 'enginedb';
process.env.MYSQL_PORT = '3306';

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT, 10);

const IMAGES_DIR = './public/images/products';

async function updateImages() {
  console.log('🖼️  Updating products with local images...\n');

  // Get all image files
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i))
    .sort();

  console.log(`📁 Found ${imageFiles.length} images in ${IMAGES_DIR}\n`);

  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });

  console.log('✅ Connected to MySQL\n');

  // Get all products
  const [products] = await connection.query('SELECT id, name FROM products ORDER BY id');

  console.log(`📦 Found ${products.length} products\n`);

  // Helper function to normalize string for matching
  function normalize(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 30); // First 30 chars
  }

  // Helper function to find matching image
  function findMatchingImage(productName) {
    const normalizedProduct = normalize(productName);
    
    // Try to find exact or partial match
    for (const imgFile of imageFiles) {
      const normalizedImg = normalize(imgFile);
      
      // Check if product name is in image filename or vice versa
      if (normalizedImg.includes(normalizedProduct.substring(0, 15)) ||
          normalizedProduct.includes(normalizedImg.substring(0, 15))) {
        return imgFile;
      }
    }
    
    // Check for specific keywords
    const keywords = productName.toLowerCase().match(/22re|22r|20r|2tr|3rz|5vze|2rz|rocker|head|timing|cylinder/gi);
    if (keywords && keywords.length > 0) {
      for (const keyword of keywords) {
        for (const imgFile of imageFiles) {
          if (imgFile.toLowerCase().includes(keyword.toLowerCase())) {
            return imgFile;
          }
        }
      }
    }
    
    return null;
  }

  let updated = 0;
  let matched = 0;
  let unmatched = 0;
  const unmatchedProducts = [];
  let imageIndex = 0;

  console.log('🔄 Matching products to images...\n');

  for (const product of products) {
    try {
      // Try to find a matching image
      let matchedImage = findMatchingImage(product.name);
      
      if (matchedImage) {
        matched++;
        console.log(`✅ Matched: "${product.name}" → ${matchedImage}`);
      } else {
        // Assign images sequentially to unmatched products
        if (imageIndex < imageFiles.length) {
          matchedImage = imageFiles[imageIndex];
          imageIndex++;
          unmatched++;
          unmatchedProducts.push(product.name);
          console.log(`⚠️  No match for "${product.name}" - using: ${matchedImage}`);
        } else {
          // Use a default fallback image
          matchedImage = imageFiles[0];
          console.log(`⚠️  No match for "${product.name}" - using fallback: ${matchedImage}`);
        }
      }

      // Create image URL
      const imageUrl = `/images/products/${matchedImage}`;
      const imagesJson = JSON.stringify([imageUrl]);

      // Update product
      await connection.query('UPDATE products SET images = ? WHERE id = ?', [imagesJson, product.id]);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${product.name}:`, error.message);
    }
  }

  await connection.end();

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Total products updated: ${updated}`);
  console.log(`   ✅ Matched by name: ${matched}`);
  console.log(`   ⚠️  Assigned sequentially: ${unmatched}`);
  
  if (unmatchedProducts.length > 0 && unmatchedProducts.length <= 10) {
    console.log(`\n⚠️  Products without name match:`);
    unmatchedProducts.forEach(name => console.log(`   - ${name}`));
  }

  console.log(`\n✅ All products now use local images!`);
  console.log(`\n💡 Refresh your browser to see the changes!\n`);
}

updateImages().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

