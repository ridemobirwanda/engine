/**
 * Migrate data from Supabase to MySQL
 * This script exports data from Supabase and imports it into MySQL
 */

import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dfmbicodohmkyasuofov.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWJpY29kb2hta3lhc3VvZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjQwMDMsImV4cCI6MjA2OTgwMDAwM30.ZXHovVGDHiDcjaPOGZFN4oU2_HAi_ueN2CjZZjp5kbE';

// MySQL configuration
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_USER = process.env.MYSQL_USER || 'enginedb';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'enginedb';
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrateProducts() {
  console.log('🚀 Starting product migration from Supabase to MySQL...\n');

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });

  console.log('✅ Connected to MySQL\n');

  try {
    // Fetch all products from Supabase
    console.log('📥 Fetching products from Supabase...');
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching from Supabase:', error);
      return;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No products found in Supabase');
      return;
    }

    console.log(`✅ Found ${products.length} products in Supabase\n`);

    // Clear existing products in MySQL (optional)
    const clearChoice = process.argv.includes('--clear');
    if (clearChoice) {
      console.log('🗑️  Clearing existing products in MySQL...');
      await connection.query('DELETE FROM products');
      console.log('✅ Cleared\n');
    }

    // Insert products into MySQL
    console.log('📤 Inserting products into MySQL...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const images = Array.isArray(product.images) 
          ? JSON.stringify(product.images) 
          : (product.images ? product.images : null);

        const specifications = product.specifications 
          ? (typeof product.specifications === 'string' ? product.specifications : JSON.stringify(product.specifications))
          : null;

        await connection.query(
          `INSERT INTO products (
            name, description, short_description, price, compare_price,
            brand, model, engine_type, displacement, fuel_type,
            \`condition\`, stock_quantity, is_active, is_featured,
            images, specifications, category_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.description,
            product.short_description,
            product.price,
            product.compare_price,
            product.brand,
            product.model,
            product.engine_type,
            product.displacement,
            product.fuel_type,
            product.condition,
            product.stock_quantity || 0,
            product.is_active ? 1 : 0,
            product.is_featured ? 1 : 0,
            images,
            specifications,
            product.category_id,
            product.created_at,
            product.updated_at,
          ]
        );

        successCount++;
        console.log(`✅ Migrated: ${product.name}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating ${product.name}:`, error.message);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${successCount} products`);
    console.log(`   ❌ Failed: ${errorCount} products`);
    console.log(`\n🎉 Migration complete!`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
    console.log('\n👋 MySQL connection closed');
  }
}

async function migrateCategories() {
  console.log('\n🚀 Starting category migration from Supabase to MySQL...\n');

  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    port: MYSQL_PORT,
  });

  try {
    // Fetch all categories from Supabase
    console.log('📥 Fetching categories from Supabase...');
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching categories from Supabase:', error);
      return;
    }

    if (!categories || categories.length === 0) {
      console.log('⚠️  No categories found in Supabase');
      return;
    }

    console.log(`✅ Found ${categories.length} categories in Supabase\n`);

    // Clear existing categories in MySQL (optional)
    const clearChoice = process.argv.includes('--clear');
    if (clearChoice) {
      console.log('🗑️  Clearing existing categories in MySQL...');
      await connection.query('DELETE FROM categories');
      console.log('✅ Cleared\n');
    }

    // Insert categories into MySQL
    console.log('📤 Inserting categories into MySQL...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const category of categories) {
      try {
        await connection.query(
          `INSERT INTO categories (
            name, slug, description, image_url, is_active, display_order, parent_id, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            category.name,
            category.slug,
            category.description,
            category.image_url,
            category.is_active ? 1 : 0,
            category.display_order || 0,
            category.parent_id,
            category.created_at,
            category.updated_at,
          ]
        );

        successCount++;
        console.log(`✅ Migrated: ${category.name}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrating ${category.name}:`, error.message);
      }
    }

    console.log(`\n📊 Category Migration Summary:`);
    console.log(`   ✅ Successfully migrated: ${successCount} categories`);
    console.log(`   ❌ Failed: ${errorCount} categories`);

  } catch (error) {
    console.error('❌ Category migration failed:', error);
  } finally {
    await connection.end();
  }
}

// Run migrations
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  SUPABASE → MYSQL MIGRATION TOOL');
  console.log('═══════════════════════════════════════════════════\n');

  if (!MYSQL_PASSWORD) {
    console.error('❌ Error: MYSQL_PASSWORD environment variable not set!');
    console.log('\nPlease set it using:');
    console.log('  PowerShell: $env:MYSQL_PASSWORD=\'yourpass\'');
    console.log('  CMD: set MYSQL_PASSWORD=yourpass');
    console.log('  Or create a .env file with: MYSQL_PASSWORD=yourpass\n');
    process.exit(1);
  }

  try {
    await migrateCategories();
    await migrateProducts();
    console.log('\n✨ All migrations completed successfully!');
    console.log('\n💡 Tip: Visit http://localhost:21201/admin/products to see your migrated products!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();

