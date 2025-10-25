import mysql from 'mysql2/promise';

const {
	MYSQL_HOST = 'localhost',
	MYSQL_USER = 'enginedb',
	MYSQL_PASSWORD,
	MYSQL_DATABASE = 'enginedb',
	MYSQL_PORT
} = process.env;

const pool = mysql.createPool({
	host: MYSQL_HOST,
	user: MYSQL_USER,
	database: MYSQL_DATABASE,
	password: MYSQL_PASSWORD,
	port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export default pool;

