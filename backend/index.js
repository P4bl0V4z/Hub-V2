require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ time: result.rows[0] });
});

app.listen(port, () => {
  console.log(`Servidor backend en puerto ${port}`);
});
