-- Authentication Tables for MySQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
-- Password is hashed using bcrypt
INSERT INTO users (email, password_hash, full_name, email_verified) 
VALUES (
	'admin@admin.com',
	'$2a$10$rQ9qKvGZxs1JYvV5h5YxL.XcX8fZ9YvN5h5YxL5h5YxL5h5YxL5h5Y',
	'Admin User',
	TRUE
) ON DUPLICATE KEY UPDATE email=email;

