const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';
const useSSL = process.env.DB_SSL === 'true';

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
    };

if (useSSL) {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

module.exports = pool;