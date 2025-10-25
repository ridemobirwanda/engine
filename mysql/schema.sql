-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS enginedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enginedb;

-- website_settings
CREATE TABLE IF NOT EXISTS website_settings (
	id INT AUTO_INCREMENT PRIMARY KEY,
	`key` VARCHAR(191) NOT NULL UNIQUE,
	`value` JSON NULL,
	description TEXT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(191) NOT NULL,
	email VARCHAR(191) NOT NULL,
	phone VARCHAR(64) NULL,
	subject VARCHAR(255) NOT NULL,
	message TEXT NOT NULL,
	status VARCHAR(50) NULL,
	admin_notes TEXT NULL,
	responded_at DATETIME NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- admin_users
CREATE TABLE IF NOT EXISTS admin_users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(64) NULL,
	email VARCHAR(191) NULL,
	role ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
	permissions JSON NULL,
	is_active TINYINT(1) NOT NULL DEFAULT 1,
	last_login DATETIME NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
	UNIQUE KEY uniq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- cart_items
CREATE TABLE IF NOT EXISTS cart_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(64) NOT NULL,
	product_id VARCHAR(64) NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
	KEY idx_cart_user (user_id),
	KEY idx_cart_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- orders
CREATE TABLE IF NOT EXISTS orders (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(64) NULL,
	order_number VARCHAR(64) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'pending',
	total_amount DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
	tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
	shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
	currency VARCHAR(10) NOT NULL DEFAULT 'USD',
	payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
	payment_method VARCHAR(50) NOT NULL,
	payment_intent_id VARCHAR(128) NULL,
	billing_address JSON NULL,
	shipping_address JSON NULL,
	notes TEXT NULL,
	guest_email VARCHAR(255) NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
	KEY idx_orders_user (user_id),
	UNIQUE KEY uniq_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- order_items
CREATE TABLE IF NOT EXISTS order_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	order_id INT NOT NULL,
	product_id VARCHAR(64) NOT NULL,
	quantity INT NOT NULL,
	unit_price DECIMAL(10,2) NOT NULL,
	total_price DECIMAL(10,2) NOT NULL,
	product_snapshot JSON NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
	KEY idx_items_order (order_id),
	CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- categories
CREATE TABLE IF NOT EXISTS categories (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(191) NOT NULL,
	description TEXT NULL,
	slug VARCHAR(191) NOT NULL UNIQUE,
	image_url TEXT NULL,
	is_active TINYINT(1) NOT NULL DEFAULT 1,
	sort_order INT NOT NULL DEFAULT 0,
	parent_id INT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- profiles (customer/user profiles)
CREATE TABLE IF NOT EXISTS profiles (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id VARCHAR(255) NOT NULL,
	first_name VARCHAR(255) NULL,
	last_name VARCHAR(255) NULL,
	phone VARCHAR(50) NULL,
	avatar_url TEXT NULL,
	device_name VARCHAR(255) NULL,
	device_address VARCHAR(255) NULL,
	location VARCHAR(255) NULL,
	device_join_date DATETIME NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- products
CREATE TABLE IF NOT EXISTS products (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT NULL,
	short_description TEXT NULL,
	price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
	compare_price DECIMAL(10,2) NULL,
	brand VARCHAR(191) NULL,
	model VARCHAR(191) NULL,
	engine_type VARCHAR(191) NULL,
	displacement VARCHAR(191) NULL,
	fuel_type VARCHAR(191) NULL,
	`condition` VARCHAR(50) NULL,
	stock_quantity INT NULL DEFAULT 0,
	is_active TINYINT(1) NOT NULL DEFAULT 1,
	is_featured TINYINT(1) NOT NULL DEFAULT 0,
	images LONGTEXT NULL,
	specifications LONGTEXT NULL,
	category_id INT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
	KEY idx_products_active (is_active),
	KEY idx_products_featured (is_featured),
	KEY idx_products_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
