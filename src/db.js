import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

let pool;

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync('server.log', logMessage);
};

const createPool = () => {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  };
  
  logToFile(`Creating pool with config: ${JSON.stringify({ ...config, password: '******' })}`);
  
  return new Pool(config);
};

export const getPool = () => {
  if (!pool) {
    pool = createPool();
    pool.on('error', (err) => {
      logToFile(`Unexpected error on idle client: ${err.message}`);
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
};

export const query = async (text, params) => {
  const client = await getPool().connect();
  try {
    logToFile(`Executing query: ${text} with params: ${JSON.stringify(params)}`);
    const start = Date.now();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    logToFile(`Executed query in ${duration}ms, rowCount: ${result.rowCount}`);
    return result;
  } catch (error) {
    logToFile(`Error executing query: ${error.message}`);
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getClient = () => getPool().connect();

export const initDB = async () => {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    logToFile('Creating protocols table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS protocols (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        name VARCHAR(255) NOT NULL,
        number INTEGER NOT NULL,
        secretary VARCHAR(255) NOT NULL,
        rows JSONB
      )
    `);

    logToFile('Creating regions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    logToFile('Creating executors table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS executors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    logToFile('Checking for existing regions...');
    const regionsCount = await client.query('SELECT COUNT(*) FROM regions');
    if (regionsCount.rows[0].count === '0') {
      logToFile('Inserting initial regions...');
      await client.query(`
        INSERT INTO regions (name) VALUES 
        ('Москва'), ('Санкт-Петербург'), ('Казань')
      `);
    }

    logToFile('Checking for existing executors...');
    const executorsCount = await client.query('SELECT COUNT(*) FROM executors');
    if (executorsCount.rows[0].count === '0') {
      logToFile('Inserting initial executors...');
      await client.query(`
        INSERT INTO executors (name) VALUES 
        ('Иванов И.И.'), ('Петров П.П.'), ('Сидоров С.С.')
      `);
    }

    await client.query('COMMIT');
    logToFile('Database initialization completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    logToFile(`Error initializing database: ${e.message}`);
    console.error('Error initializing database:', e);
    throw e;
  } finally {
    client.release();
  }
};

export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    logToFile(`Database connection successful: ${result.rows[0].now}`);
    console.log('Database connection successful:', result.rows[0].now);
  } catch (error) {
    logToFile(`Error connecting to database: ${error.message}`);
    console.error('Error connecting to database:', error);
    throw error;
  }
};