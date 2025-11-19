#!/usr/bin/env node
/*
  Usage (run from backend/):
    node scripts/create-admin.js <username> <password>

  The script reads DB connection settings from environment variables (use your existing .env in backend/),
  hashes the provided password with bcryptjs and inserts a new row into `admins` table.

  Make sure the `admins` table has columns `username` and `password_hash` as expected by the app.
*/

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Usage: node scripts/create-admin.js <username> <password>');
  process.exit(1);
}

(async () => {
  try {
    const password_hash = bcrypt.hashSync(password, 10);

    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      connectionLimit: 5,
    });

    const insertSql = 'INSERT INTO admin (username, password) VALUES (?, ?)';
    const [result] = await pool.execute(insertSql, [username, password_hash]);

    console.log('Admin created:', { username, insertId: result.insertId || null });

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(2);
  }
})();
