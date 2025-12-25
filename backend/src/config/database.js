const { Pool } = require('pg');
const dbConfig = require('./db');

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.warn('Database connection error (optional for development):', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};