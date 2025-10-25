import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'enginedb',
  database: 'enginedb',
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
