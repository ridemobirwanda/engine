import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import pool from './db.js';
import * as authController from './authController.js';

const { MYSQL_HOST = 'localhost', MYSQL_USER = 'enginedb', MYSQL_PASSWORD, MYSQL_DATABASE = 'enginedb', MYSQL_PORT } = process.env;

async function ensureDatabase() {
	const conn = await mysql.createConnection({
		host: MYSQL_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
	});
	try {
		await conn.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
	} finally {
		await conn.end();
	}
}

async function ensureWebsiteSettingsTable() {
	await pool.query(`CREATE TABLE IF NOT EXISTS website_settings (
		id INT AUTO_INCREMENT PRIMARY KEY,
		\`key\` VARCHAR(191) NOT NULL UNIQUE,
		\`value\` LONGTEXT NULL,
		description TEXT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
}

async function ensureDatabaseAndWebsiteSettings() {
	await ensureDatabase();
	await ensureWebsiteSettingsTable();
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.json({ status: 'ok' });
});

app.get('/api/health', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT 1 as ok');
		res.json({ ok: rows?.[0]?.ok === 1, db: MYSQL_DATABASE });
	} catch (e) {
		res.status(500).json({ ok: false, error: e.message, code: e.code, db: MYSQL_DATABASE });
	}
});

app.get('/favicon.ico', (req, res) => {
	res.status(204).end();
});

// Authentication routes
app.post('/api/auth/login', authController.login);
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/user', authController.getCurrentUser);
app.put('/api/auth/user', authController.updateUser);

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
	try {
		// Get total products count
		const [productsCount] = await pool.query('SELECT COUNT(*) as count FROM products');
		const totalProducts = productsCount[0]?.count || 0;

		// Get total orders count and revenue
		const [ordersData] = await pool.query('SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders');
		const totalOrders = ordersData[0]?.count || 0;
		const totalRevenue = ordersData[0]?.revenue || 0;

		// Get low stock products count (stock_quantity <= 5)
		const [lowStockCount] = await pool.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity <= 5');
		const lowStockProducts = lowStockCount[0]?.count || 0;

		// Get pending orders count
		const [pendingCount] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = ?', ['pending']);
		const pendingOrders = pendingCount[0]?.count || 0;

		// Note: totalCustomers would require a customers/users table in MySQL
		// For now, returning 0 as placeholder
		const totalCustomers = 0;

		res.json({
			totalProducts,
			totalOrders,
			totalCustomers,
			totalRevenue,
			lowStockProducts,
			pendingOrders,
		});
	} catch (error) {
		console.error('GET /api/dashboard/stats error:', error);
		res.status(500).json({ 
			error: 'Failed to fetch dashboard stats', 
			details: error.message, 
			code: error.code 
		});
	}
});

// website_settings
app.get('/api/settings', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM website_settings');
		// Parse JSON values
		const parsedRows = rows.map(row => {
			try {
				return { ...row, value: JSON.parse(row.value) };
			} catch {
				return row; // Return as-is if not valid JSON
			}
		});
		res.json(parsedRows);
	} catch (e) {
		if (e && (e.code === 'ER_NO_SUCH_TABLE' || e.code === 'ER_BAD_DB_ERROR' || /doesn't exist/i.test(String(e?.message)))) {
			try {
				await ensureDatabaseAndWebsiteSettings();
				const [rows] = await pool.query('SELECT * FROM website_settings');
				const parsedRows = rows.map(row => {
					try {
						return { ...row, value: JSON.parse(row.value) };
					} catch {
						return row;
					}
				});
				return res.json(parsedRows);
			} catch (inner) {
				console.error('Auto-create website_settings failed:', inner);
				return res.status(500).json({ error: inner.message, code: inner.code });
			}
		}
		console.error('GET /api/settings error:', e);
		res.status(500).json({ error: e.message, code: e.code });
	}
});

app.get('/api/settings/:key', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM website_settings WHERE \`key\` = ?', [req.params.key]);
		if (rows[0]) {
			try {
				rows[0].value = JSON.parse(rows[0].value);
			} catch {
				// Keep as-is if not valid JSON
			}
		}
		res.json(rows[0] || null);
	} catch (e) {
		console.error('GET /api/settings/:key error:', e);
		res.status(500).json({ error: e.message, code: e.code });
	}
});

app.post('/api/settings', async (req, res) => {
	try {
		const { key, value, description } = req.body;
		const jsonValue = typeof value === 'string' ? value : JSON.stringify(value ?? null);
		await pool.query('INSERT INTO website_settings (\`key\`, \`value\`, \`description\`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), \`description\` = VALUES(\`description\`), updated_at = NOW()', [key, jsonValue, description || null]);
		res.json({ success: true });
	} catch (e) {
		if (e && (e.code === 'ER_NO_SUCH_TABLE' || e.code === 'ER_BAD_DB_ERROR' || /doesn't exist/i.test(String(e?.message)))) {
			try {
				await ensureDatabaseAndWebsiteSettings();
				const { key, value, description } = req.body;
				const jsonValue = typeof value === 'string' ? value : JSON.stringify(value ?? null);
				await pool.query('INSERT INTO website_settings (\`key\`, \`value\`, \`description\`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), \`description\` = VALUES(\`description\`), updated_at = NOW()', [key, jsonValue, description || null]);
				return res.json({ success: true });
			} catch (inner) {
				console.error('Auto-create + upsert website_settings failed:', inner);
				return res.status(500).json({ error: inner.message, code: inner.code });
			}
		}
		console.error('POST /api/settings error:', e);
		res.status(500).json({ error: e.message, code: e.code });
	}
});

app.delete('/api/settings/:id', async (req, res) => {
	try {
		await pool.query('DELETE FROM website_settings WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// contact_messages
app.get('/api/contact-messages', async (req, res) => {
	try {
		const page = Number(req.query.page || 1);
		const pageSize = Number(req.query.pageSize || 20);
		const status = req.query.status;
		const search = req.query.search;
		let sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM contact_messages';
		const params = [];
		const filters = [];
		if (status && status !== 'all') { filters.push('status = ?'); params.push(status); }
		if (search && String(search).trim().length > 0) {
			const likeStr = `%${String(search).trim()}%`;
			filters.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)');
			params.push(likeStr, likeStr, likeStr, likeStr);
		}
		if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
		sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
		params.push(pageSize, (page - 1) * pageSize);
		const [rows] = await pool.query(sql, params);
		const [[found]] = await pool.query('SELECT FOUND_ROWS() AS total');
		res.json({ messages: rows, total: found?.total || 0 });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/contact-messages', async (req, res) => {
	try {
		const { name, email, phone, subject, message, status, admin_notes } = req.body;
		await pool.query('INSERT INTO contact_messages (name, email, phone, subject, message, status, admin_notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [name, email, phone || null, subject, message, status || 'new', admin_notes || null]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/contact-messages/:id', async (req, res) => {
	try {
		const fields = req.body || {};
		const sets = [];
		const params = [];
		Object.entries(fields).forEach(([key, value]) => { sets.push(`${key} = ?`); params.push(value); });
		if (!sets.length) return res.json({ success: true });
		params.push(req.params.id);
		await pool.query(`UPDATE contact_messages SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/contact-messages/:id', async (req, res) => {
	try {
		await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// admin_users
app.get('/api/admin-users/find', async (req, res) => {
	try {
		const { email, user_id } = req.query;
		let sql = 'SELECT * FROM admin_users WHERE is_active = 1';
		const params = [];
		const conds = [];
		if (email) { conds.push('LOWER(email) = LOWER(?)'); params.push(String(email)); }
		// Note: admin_users table uses 'id' not 'user_id' after migration
		// We match by email primarily, user_id is legacy from Supabase
		if (conds.length === 0) return res.json(null);
		sql += ' AND (' + conds.join(' OR ') + ') LIMIT 1';
		const [rows] = await pool.query(sql, params);
		res.json(rows[0] || null);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/admin-users/:id/last-login', async (req, res) => {
	try {
		await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// CART endpoints
app.get('/api/cart', async (req, res) => {
	try {
		const { user_id } = req.query;
		if (!user_id) return res.status(400).json({ error: 'user_id required' });
		const [rows] = await pool.query('SELECT * FROM cart_items WHERE user_id = ?', [String(user_id)]);
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/cart', async (req, res) => {
	try {
		const { user_id, product_id, quantity } = req.body || {};
		if (!user_id || !product_id || typeof quantity !== 'number') {
			return res.status(400).json({ error: 'user_id, product_id and quantity required' });
		}
		const [existing] = await pool.query('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? LIMIT 1', [user_id, product_id]);
		if (existing[0]) {
			await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [existing[0].quantity + quantity, existing[0].id]);
		} else {
			await pool.query('INSERT INTO cart_items (user_id, product_id, quantity, created_at) VALUES (?, ?, ?, NOW())', [user_id, product_id, quantity]);
		}
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/cart/:id', async (req, res) => {
	try {
		const { quantity } = req.body || {};
		if (typeof quantity !== 'number') return res.status(400).json({ error: 'quantity required' });
		if (quantity <= 0) {
			await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
		} else {
			await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
		}
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/cart/:id', async (req, res) => {
	try {
		await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/cart/user/:userId', async (req, res) => {
	try {
		await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.params.userId]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/cart/sync', async (req, res) => {
	const conn = await pool.getConnection();
	try {
		const { user_id, items } = req.body || {};
		if (!user_id || !Array.isArray(items)) return res.status(400).json({ error: 'user_id and items[] required' });
		await conn.beginTransaction();
		await conn.query('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
		if (items.length) {
			const values = items.map((i) => [user_id, i.product_id, i.quantity]);
			await conn.query('INSERT INTO cart_items (user_id, product_id, quantity, created_at) VALUES ' + values.map(() => '(?, ?, ?, NOW())').join(', '), values.flat());
		}
		await conn.commit();
		res.json({ success: true });
	} catch (e) {
		await conn.rollback();
		res.status(500).json({ error: e.message });
	} finally {
		conn.release();
	}
});

// ORDERS endpoints
app.post('/api/orders', async (req, res) => {
	const conn = await pool.getConnection();
	try {
		const { order, items } = req.body || {};
		if (!order || !Array.isArray(items)) return res.status(400).json({ error: 'order and items[] required' });
		await conn.beginTransaction();
		const [result] = await conn.query(
			'INSERT INTO orders (user_id, order_number, status, total_amount, subtotal, tax_amount, shipping_amount, currency, payment_status, payment_method, payment_intent_id, billing_address, shipping_address, notes, guest_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
			[
				order.user_id || null,
				order.order_number,
				order.status || 'pending',
				order.total_amount,
				order.subtotal,
				order.tax_amount,
				order.shipping_amount,
				order.currency || 'USD',
				order.payment_status || 'pending',
				order.payment_method,
				order.payment_intent_id || null,
				JSON.stringify(order.billing_address || {}),
				JSON.stringify(order.shipping_address || {}),
				order.notes || null,
				order.guest_email || null,
			]
		);
		const orderId = result?.insertId;
		if (!orderId) throw new Error('Failed to get new order ID');
		if (items.length) {
			const values = items.map((it) => [orderId, it.product_id, it.quantity, it.unit_price, it.total_price, JSON.stringify(it.product_snapshot || {})]);
			await conn.query('INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, product_snapshot, created_at) VALUES ' + values.map(() => '(?, ?, ?, ?, ?, ?, NOW())').join(', '), values.flat());
		}
		await conn.commit();
		res.json({ id: String(orderId), ...order });
	} catch (e) {
		await conn.rollback();
		res.status(500).json({ error: e.message });
	} finally {
		conn.release();
	}
});

app.put('/api/orders/:id', async (req, res) => {
	try {
		const updateData = req.body || {};
		const sets = [];
		const params = [];
		Object.entries(updateData).forEach(([k, v]) => { sets.push(`${k} = ?`); params.push(k.endsWith('_address') ? JSON.stringify(v) : v); });
		if (!sets.length) return res.json({ success: true });
		params.push(req.params.id);
		await pool.query(`UPDATE orders SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/orders/payment-success', async (req, res) => {
	try {
		const { session_id, payment_intent } = req.query;
		
		let orders;
		if (session_id) {
			[orders] = await pool.query('SELECT * FROM orders WHERE stripe_session_id = ?', [session_id]);
		} else if (payment_intent) {
			[orders] = await pool.query('SELECT * FROM orders WHERE stripe_payment_intent_id = ?', [payment_intent]);
		} else {
			return res.status(400).json({ error: 'No payment reference provided' });
		}

		if (!orders || orders.length === 0) {
			return res.status(404).json({ error: 'Order not found' });
		}

		const order = orders[0];

		// Update order status to paid
		await pool.query(
			`UPDATE orders 
			SET payment_status = 'paid', 
				status = 'confirmed', 
				paid_at = NOW(),
				updated_at = NOW()
			WHERE id = ?`,
			[order.id]
		);

		// Return updated order
		const [updatedOrders] = await pool.query('SELECT * FROM orders WHERE id = ?', [order.id]);
		res.json(updatedOrders[0]);
	} catch (error) {
		console.error('POST /api/orders/payment-success error:', error);
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/orders/user/:userId', async (req, res) => {
	try {
		const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]);
		const orderIds = (orders || []).map((o) => o.id);
		let items = [];
		if (orderIds.length) {
			const [rows] = await pool.query('SELECT * FROM order_items WHERE order_id IN (' + orderIds.map(() => '?').join(',') + ')', orderIds);
			items = rows;
		}
		const byOrder = (items || []).reduce((acc, it) => { (acc[it.order_id] = acc[it.order_id] || []).push(it); return acc; }, {});
		const result = (orders || []).map((o) => ({ ...o, order_items: byOrder[o.id] || [] }));
		res.json(result);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Get all orders (for admin)
app.get('/api/orders/all', async (req, res) => {
	try {
		const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
		res.json(orders || []);
	} catch (error) {
		console.error('GET /api/orders/all error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Delete order
app.delete('/api/orders/:id', async (req, res) => {
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		// Delete order items first
		await conn.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
		// Delete order
		await conn.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
		await conn.commit();
		res.json({ success: true });
	} catch (error) {
		await conn.rollback();
		console.error('DELETE /api/orders/:id error:', error);
		res.status(500).json({ error: error.message });
	} finally {
		conn.release();
	}
});

app.get('/api/orders/:id', async (req, res) => {
	try {
		const [[order]] = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [req.params.id]);
		if (!order) return res.json(null);
		const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
		res.json({ ...order, order_items: items });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// CATEGORIES
app.get('/api/categories', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
		res.json(rows);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/categories', async (req, res) => {
	try {
		const { name, description, slug, image_url, is_active = true, sort_order = 0, parent_id = null } = req.body || {};
		await pool.query('INSERT INTO categories (name, description, slug, image_url, is_active, sort_order, parent_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [name, description || null, slug, image_url || null, is_active ? 1 : 0, Number(sort_order) || 0, parent_id || null]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/categories/:id', async (req, res) => {
	try {
		const { name, description, slug, image_url, is_active, sort_order, parent_id } = req.body || {};
		const sets = [];
		const params = [];
		if (name !== undefined) { sets.push('name = ?'); params.push(name); }
		if (description !== undefined) { sets.push('description = ?'); params.push(description); }
		if (slug !== undefined) { sets.push('slug = ?'); params.push(slug); }
		if (image_url !== undefined) { sets.push('image_url = ?'); params.push(image_url); }
		if (is_active !== undefined) { sets.push('is_active = ?'); params.push(is_active ? 1 : 0); }
		if (sort_order !== undefined) { sets.push('sort_order = ?'); params.push(Number(sort_order) || 0); }
		if (parent_id !== undefined) { sets.push('parent_id = ?'); params.push(parent_id || null); }
		if (!sets.length) return res.json({ success: true });
		params.push(req.params.id);
		await pool.query(`UPDATE categories SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/categories/:id', async (req, res) => {
	try {
		await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.get('/api/categories/by-slug/:slug', async (req, res) => {
	try {
		const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ? AND is_active = 1 LIMIT 1', [req.params.slug]);
		res.json(rows[0] || null);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
	try {
		const { is_active, is_featured, category_id, limit = 50, max_stock } = req.query;
		let sql = 'SELECT * FROM products WHERE 1=1';
		const params = [];
		if (is_active !== undefined) { sql += ' AND is_active = ?'; params.push(String(is_active) === 'true' ? 1 : 0); }
		if (is_featured !== undefined) { sql += ' AND is_featured = ?'; params.push(String(is_featured) === 'true' ? 1 : 0); }
		if (category_id) { sql += ' AND category_id = ?'; params.push(category_id); }
		if (max_stock !== undefined) { sql += ' AND stock_quantity <= ?'; params.push(Number(max_stock) || 0); }
		sql += ' ORDER BY created_at DESC LIMIT ?'; params.push(Number(limit) || 50);
		const [rows] = await pool.query(sql, params);

		// Normalize image URLs to absolute paths if a base is provided
		const IMAGE_BASE_URL = (process.env.IMAGE_BASE_URL || '').replace(/\/+$/, '');
		const normalizeUrl = (u) => {
			if (!u) return '/placeholder.svg';
			if (typeof u !== 'string') return '/placeholder.svg';
			if (/^https?:\/\//i.test(u)) return u; // Already absolute URL
			if (IMAGE_BASE_URL) return `${IMAGE_BASE_URL}/${u.replace(/^\/+/, '')}`;
			return u; // leave relative if no base configured
		};
		
		// Parse JSON columns (images, specifications) and convert numeric fields
		const products = rows.map(row => {
			let images = [];
			let specifications = null;
			
			// Parse images
			if (row.images) {
				if (typeof row.images === 'string') {
					try {
						images = JSON.parse(row.images);
					} catch (e) {
						console.error('Failed to parse images for product', row.id, e.message);
						images = [];
					}
				} else {
					images = row.images;
				}
			}

			// Normalize images to absolute URLs (supports array of strings or objects { url })
			if (Array.isArray(images)) {
				images = images
					.map((img) => (typeof img === 'string' ? img : (img && img.url) || ''))
					.filter(Boolean)
					.map(normalizeUrl);
			} else if (images && typeof images === 'object' && images.url) {
				images = [normalizeUrl(images.url)];
			}
			
			// Parse specifications
			if (row.specifications) {
				if (typeof row.specifications === 'string') {
					try {
						specifications = JSON.parse(row.specifications);
					} catch (e) {
						console.error('Failed to parse specifications for product', row.id, e.message);
						specifications = null;
					}
				} else {
					specifications = row.specifications;
				}
			}
			
			return {
				...row,
				images,
				specifications,
				// Convert numeric string fields to numbers
				price: row.price ? parseFloat(row.price) : 0,
				compare_price: row.compare_price ? parseFloat(row.compare_price) : null,
				cost_price: row.cost_price ? parseFloat(row.cost_price) : null,
				stock_quantity: row.stock_quantity ? parseInt(row.stock_quantity, 10) : 0,
				low_stock_threshold: row.low_stock_threshold ? parseInt(row.low_stock_threshold, 10) : null,
				weight: row.weight ? parseFloat(row.weight) : null,
			};
		});
		
		res.json(products);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.post('/api/products', async (req, res) => {
	try {
		const p = req.body || {};
		const images = Array.isArray(p.images) ? JSON.stringify(p.images) : (typeof p.images === 'string' ? p.images : null);
		const specs = p.specifications ? (typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications)) : null;
		await pool.query(
			'INSERT INTO products (name, description, short_description, price, compare_price, brand, model, engine_type, displacement, fuel_type, `condition`, stock_quantity, is_active, is_featured, images, specifications, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
			[
				p.name, p.description || null, p.short_description || null, Number(p.price) || 0, p.compare_price != null ? Number(p.compare_price) : null,
				p.brand || null, p.model || null, p.engine_type || null, p.displacement || null, p.fuel_type || null, p.condition || null,
				p.stock_quantity != null ? Number(p.stock_quantity) : 0, p.is_active ? 1 : 0, p.is_featured ? 1 : 0, images, specs, p.category_id || null
			]
		);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.put('/api/products/:id', async (req, res) => {
	try {
		const p = req.body || {};
		const sets = [];
		const params = [];
		const push = (k, v) => { sets.push(`${k} = ?`); params.push(v); };
		if (p.name !== undefined) push('name', p.name);
		if (p.description !== undefined) push('description', p.description);
		if (p.short_description !== undefined) push('short_description', p.short_description);
		if (p.price !== undefined) push('price', Number(p.price) || 0);
		if (p.compare_price !== undefined) push('compare_price', p.compare_price != null ? Number(p.compare_price) : null);
		if (p.brand !== undefined) push('brand', p.brand);
		if (p.model !== undefined) push('model', p.model);
		if (p.engine_type !== undefined) push('engine_type', p.engine_type);
		if (p.displacement !== undefined) push('displacement', p.displacement);
		if (p.fuel_type !== undefined) push('fuel_type', p.fuel_type);
		if (p.condition !== undefined) push('`condition`', p.condition);
		if (p.stock_quantity !== undefined) push('stock_quantity', Number(p.stock_quantity) || 0);
		if (p.is_active !== undefined) push('is_active', p.is_active ? 1 : 0);
		if (p.is_featured !== undefined) push('is_featured', p.is_featured ? 1 : 0);
		if (p.images !== undefined) push('images', Array.isArray(p.images) ? JSON.stringify(p.images) : (typeof p.images === 'string' ? p.images : null));
		if (p.specifications !== undefined) push('specifications', p.specifications ? (typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications)) : null);
		if (p.category_id !== undefined) push('category_id', p.category_id || null);
		if (!sets.length) return res.json({ success: true });
		params.push(req.params.id);
		await pool.query(`UPDATE products SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

app.delete('/api/products/:id', async (req, res) => {
	try {
		await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

// Profiles/Customers API
app.get('/api/profiles', async (req, res) => {
	try {
		const { sortBy = 'created_at', sortOrder = 'desc' } = req.query;
		const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC';
		const [rows] = await pool.query(`SELECT * FROM profiles ORDER BY ${sortBy} ${orderDir}`);
		res.json(rows || []);
	} catch (error) {
		console.error('GET /api/profiles error:', error);
		res.status(500).json({ error: error.message });
	}
});

app.get('/api/profiles/:id', async (req, res) => {
	try {
		const [[row]] = await pool.query('SELECT * FROM profiles WHERE id = ? LIMIT 1', [req.params.id]);
		res.json(row || null);
	} catch (error) {
		console.error('GET /api/profiles/:id error:', error);
		res.status(500).json({ error: error.message });
	}
});

app.put('/api/profiles/:id', async (req, res) => {
	try {
		const data = req.body || {};
		const sets = [];
		const params = [];
		if (data.first_name !== undefined) { sets.push('first_name = ?'); params.push(data.first_name); }
		if (data.last_name !== undefined) { sets.push('last_name = ?'); params.push(data.last_name); }
		if (data.phone !== undefined) { sets.push('phone = ?'); params.push(data.phone); }
		if (data.device_name !== undefined) { sets.push('device_name = ?'); params.push(data.device_name); }
		if (data.device_address !== undefined) { sets.push('device_address = ?'); params.push(data.device_address); }
		if (data.location !== undefined) { sets.push('location = ?'); params.push(data.location); }
		if (!sets.length) return res.json({ success: true });
		params.push(req.params.id);
		await pool.query(`UPDATE profiles SET ${sets.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
		res.json({ success: true });
	} catch (error) {
		console.error('PUT /api/profiles/:id error:', error);
		res.status(500).json({ error: error.message });
	}
});

async function ensureProfilesTable() {
	await pool.query(`CREATE TABLE IF NOT EXISTS profiles (
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table profiles ensured.');
}

async function ensureAuthTables() {
	// Users table
	await pool.query(`CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		full_name VARCHAR(255) NULL,
		avatar_url TEXT NULL,
		email_verified BOOLEAN DEFAULT FALSE,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		last_sign_in_at DATETIME NULL,
		INDEX idx_email (email)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table users ensured.');

	// Sessions table
	await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		token VARCHAR(500) UNIQUE NOT NULL,
		expires_at DATETIME NOT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		user_agent TEXT NULL,
		ip_address VARCHAR(45) NULL,
		INDEX idx_token (token),
		INDEX idx_user_id (user_id),
		INDEX idx_expires_at (expires_at),
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table sessions ensured.');

	// Admin users table
	await pool.query(`CREATE TABLE IF NOT EXISTS admin_users (
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table admin_users ensured.');

	// Insert default admin user if not exists
	const [[existingAdmin]] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@admin.com']);
	if (!existingAdmin) {
		// Password: admin123 (hashed with bcrypt)
		const bcrypt = await import('bcryptjs');
		const hashedPassword = await bcrypt.default.hash('admin123', 10);
		await pool.query(
			'INSERT INTO users (email, password_hash, full_name, email_verified) VALUES (?, ?, ?, ?)',
			['admin@admin.com', hashedPassword, 'Admin User', true]
		);
		console.log('Default admin user created (email: admin@admin.com, password: admin123)');
	}

	// Insert default admin_users entry if not exists
	const [[existingAdminUser]] = await pool.query('SELECT id FROM admin_users WHERE email = ?', ['admin@admin.com']);
	if (!existingAdminUser) {
		const permissions = JSON.stringify([
			"manage_products", "manage_categories", "manage_orders", 
			"manage_customers", "manage_settings", "view_analytics", 
			"manage_users", "manage_content", "manage_payments", 
			"manage_media", "full_access"
		]);
		await pool.query(
			'INSERT INTO admin_users (email, role, permissions, is_active, created_at) VALUES (?, ?, ?, ?, NOW())',
			['admin@admin.com', 'super_admin', permissions, 1]
		);
		console.log('Default admin_users entry created');
	}
}

async function ensureCategoriesTable() {
	await pool.query(`CREATE TABLE IF NOT EXISTS categories (
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table categories ensured.');
}

async function ensureProductsTable() {
	await pool.query(`CREATE TABLE IF NOT EXISTS products (
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
		\`condition\` VARCHAR(50) NULL,
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table products ensured.');
}

async function ensureOrdersTables() {
	await pool.query(`CREATE TABLE IF NOT EXISTS orders (
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table orders ensured.');

	await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
	console.log('Table order_items ensured.');
}

const port = process.env.PORT || 3001;

// Initialize database with better error handling
async function initializeServer() {
	try {
		console.log('🔄 Initializing database...');
		console.log('📊 MySQL Config:', {
			host: MYSQL_HOST,
			user: MYSQL_USER,
			database: MYSQL_DATABASE,
			port: MYSQL_PORT || 3306,
			hasPassword: !!MYSQL_PASSWORD
		});
		
		await ensureDatabaseAndWebsiteSettings();
		console.log('✅ Database and website_settings table ready');
		
		await ensureProfilesTable();
		console.log('✅ Profiles table ready');
		
		await ensureAuthTables();
		console.log('✅ Auth tables ready');
		
		await ensureCategoriesTable();
		console.log('✅ Categories table ready');
		
		await ensureProductsTable();
		console.log('✅ Products table ready');
		
		await ensureOrdersTables();
		console.log('✅ Orders tables ready');
		
		console.log('🎉 Database initialization complete!');
	} catch (error) {
		console.error('❌ Database initialization failed!');
		console.error('Error details:', error);
		console.error('Error message:', error.message);
		console.error('Error code:', error.code);
		console.error('\n⚠️  Please check:');
		console.error('1. MySQL server is running (XAMPP Control Panel)');
		console.error('2. MySQL credentials are correct in .env file');
		console.error('3. MySQL user has necessary permissions');
		console.error('\nCurrent MySQL config:');
		console.error(`  Host: ${MYSQL_HOST}`);
		console.error(`  Port: ${MYSQL_PORT || 3306}`);
		console.error(`  User: ${MYSQL_USER}`);
		console.error(`  Database: ${MYSQL_DATABASE}`);
		console.error(`  Password: ${MYSQL_PASSWORD ? '***set***' : '***NOT SET***'}\n`);
	}
}

// Start server
app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
	initializeServer();
});

