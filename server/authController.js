import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from './db.js';

// Generate random session token
const generateToken = () => {
	return crypto.randomBytes(32).toString('hex');
};

// Create session (expires in 7 days)
const createSession = async (userId, userAgent = null, ipAddress = null) => {
	const token = generateToken();
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	await pool.query(
		'INSERT INTO sessions (user_id, token, expires_at, user_agent, ip_address) VALUES (?, ?, ?, ?, ?)',
		[userId, token, expiresAt, userAgent, ipAddress]
	);

	return { token, expiresAt };
};

// Verify session token
export const verifySession = async (token) => {
	if (!token) return null;

	try {
		const [[session]] = await pool.query(
			'SELECT s.*, u.id, u.email, u.full_name, u.avatar_url FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > NOW()',
			[token]
		);

		if (!session) return null;

		return {
			user: {
				id: session.user_id,
				email: session.email,
				full_name: session.full_name,
				avatar_url: session.avatar_url,
			},
			session: {
				token: session.token,
				expires_at: session.expires_at,
			}
		};
	} catch (error) {
		console.error('Session verification error:', error);
		return null;
	}
};

// Login
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		// Find user
		const [[user]] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password_hash);

		if (!isValidPassword) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		// Update last sign in
		await pool.query('UPDATE users SET last_sign_in_at = NOW() WHERE id = ?', [user.id]);

		// Create session
		const { token, expiresAt } = await createSession(
			user.id,
			req.headers['user-agent'],
			req.ip
		);

		res.json({
			user: {
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				avatar_url: user.avatar_url,
				email_verified: user.email_verified,
			},
			session: {
				access_token: token,
				expires_at: expiresAt,
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Login failed' });
	}
};

// Signup
export const signup = async (req, res) => {
	try {
		const { email, password, full_name } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		// Check if user exists
		const [[existing]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

		if (existing) {
			return res.status(409).json({ error: 'User already exists' });
		}

		// Hash password
		const password_hash = await bcrypt.hash(password, 10);

		// Create user
		const [result] = await pool.query(
			'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
			[email, password_hash, full_name || null]
		);

		const userId = result.insertId;

		// Create session
		const { token, expiresAt } = await createSession(
			userId,
			req.headers['user-agent'],
			req.ip
		);

		res.status(201).json({
			user: {
				id: userId,
				email,
				full_name: full_name || null,
				avatar_url: null,
				email_verified: false,
			},
			session: {
				access_token: token,
				expires_at: expiresAt,
			}
		});
	} catch (error) {
		console.error('Signup error:', error);
		res.status(500).json({ error: 'Signup failed' });
	}
};

// Logout
export const logout = async (req, res) => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '');

		if (token) {
			await pool.query('DELETE FROM sessions WHERE token = ?', [token]);
		}

		res.json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error('Logout error:', error);
		res.status(500).json({ error: 'Logout failed' });
	}
};

// Get current user
export const getCurrentUser = async (req, res) => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '');

		const sessionData = await verifySession(token);

		if (!sessionData) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		res.json(sessionData);
	} catch (error) {
		console.error('Get user error:', error);
		res.status(500).json({ error: 'Failed to get user' });
	}
};

// Update user
export const updateUser = async (req, res) => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '');
		const sessionData = await verifySession(token);

		if (!sessionData) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const { full_name, avatar_url } = req.body;
		const updates = [];
		const params = [];

		if (full_name !== undefined) {
			updates.push('full_name = ?');
			params.push(full_name);
		}

		if (avatar_url !== undefined) {
			updates.push('avatar_url = ?');
			params.push(avatar_url);
		}

		if (updates.length === 0) {
			return res.json(sessionData.user);
		}

		params.push(sessionData.user.id);

		await pool.query(
			`UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
			params
		);

		// Fetch updated user
		const [[user]] = await pool.query(
			'SELECT id, email, full_name, avatar_url, email_verified FROM users WHERE id = ?',
			[sessionData.user.id]
		);

		res.json({ user });
	} catch (error) {
		console.error('Update user error:', error);
		res.status(500).json({ error: 'Failed to update user' });
	}
};

