const mysql = require('mysql2/promise');
const config = require('./config/recurso');
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: config.base,
  user: config.usuarioDB,
  password: process.env.DB_PASSWORD,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 5000
});
module.exports = pool;
