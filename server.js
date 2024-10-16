import express from 'express';
import cors from 'cors';
import * as db from './src/db.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync('server.log', logMessage);
};

// Middleware to log all incoming requests
app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}`;
  console.log(logMessage);
  logToFile(logMessage);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorMessage = `Error: ${err.message}\nStack: ${err.stack}`;
  console.error(errorMessage);
  logToFile(errorMessage);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// API routes
app.get('/api/protocols', async (req, res, next) => {
  try {
    logToFile('Fetching protocols...');
    const protocols = await db.query('SELECT * FROM protocols ORDER BY id');
    logToFile(`Protocols fetched: ${JSON.stringify(protocols.rows)}`);
    res.json(protocols.rows);
  } catch (error) {
    logToFile(`Error fetching protocols: ${error.message}`);
    next(error);
  }
});

app.post('/api/protocols', async (req, res, next) => {
  try {
    const { name, date, number, secretary, rows } = req.body;

    // Проверка на наличие обязательных полей
    if (!name || !date || !number || !secretary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    logToFile(`Adding new protocol: ${JSON.stringify(req.body)}`);
    console.log('Adding new protocol:', req.body);

    // Выполняем вставку нового протокола в БД
    const result = await db.query(
        `INSERT INTO protocols (name, date, number, secretary, rows) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, date, number, secretary, rows]
    );

    logToFile(`Protocol added: ${JSON.stringify(result.rows[0])}`);
    console.log('Protocol added:', result.rows[0]);

    // Возвращаем добавленный протокол
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logToFile(`Error adding protocol: ${error.message}`);
    console.error('Error adding protocol:', error);
    next(error);
  }
});

app.get('/api/regions', async (req, res, next) => {
  try {
    logToFile('Fetching regions...');
    const regions = await db.query('SELECT * FROM regions ORDER BY id');
    logToFile(`Regions fetched: ${JSON.stringify(regions.rows)}`);
    res.json(regions.rows);
  } catch (error) {
    logToFile(`Error fetching regions: ${error.message}`);
    console.error('Error fetching regions:', error);
    next(error);
  }
});

app.post('/api/regions', async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Region name is required' });
    }

    const result = await db.query(
        'INSERT INTO regions (name) VALUES ($1) RETURNING *',
        [name]
    );

    res.status(201).json({ name: result.rows[0].name });  // Возвращаем только имя региона
  } catch (error) {
    console.error('Error adding region:', error);
    next(error);
  }
});

app.delete('/api/regions/:name', async (req, res, next) => {
  try {
    const { name } = req.params;

    const result = await db.query('DELETE FROM regions WHERE name = $1 RETURNING *', [name]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Region not found' });
    }

    res.status(200).json({ message: 'Region deleted' });
  } catch (error) {
    console.error('Error deleting region:', error);
    next(error);
  }
});


app.get('/api/executors', async (req, res, next) => {
  try {
    logToFile('Fetching executors...');
    const executors = await db.query('SELECT * FROM executors ORDER BY id');
    logToFile(`Executors fetched: ${JSON.stringify(executors.rows)}`);
    res.json(executors.rows);
  } catch (error) {
    logToFile(`Error fetching executors: ${error.message}`);
    console.error('Error fetching executors:', error);
    next(error);
  }
});

app.post('/api/executors', async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Executor name is required' });
    }

    const result = await db.query(
        'INSERT INTO executors (name) VALUES ($1) RETURNING *',
        [name]
    );

    res.status(201).json({ name: result.rows[0].name });  // Возвращаем только имя исполнителя
  } catch (error) {
    console.error('Error adding executor:', error);
    next(error);
  }
});

app.delete('/api/executors/:name', async (req, res, next) => {
  try {
    const { name } = req.params;

    const result = await db.query('DELETE FROM executors WHERE name = $1 RETURNING *', [name]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Executor not found' });
    }

    res.status(200).json({ message: 'Executor deleted' });
  } catch (error) {
    console.error('Error deleting executor:', error);
    next(error);
  }
});

// ... (rest of the routes remain the same)

// Initialize database and start server
const initApp = async () => {
  try {
    logToFile('Initializing database...');
    await db.initDB();
    logToFile('Database initialized successfully');
    
    logToFile('Testing database connection...');
    await db.testConnection();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      const startMessage = `Server running on port ${PORT}`;
      console.log(startMessage);
      logToFile(startMessage);
      logToFile('Environment variables:');
      logToFile(`DB_USER: ${process.env.DB_USER}`);
      logToFile(`DB_HOST: ${process.env.DB_HOST}`);
      logToFile(`DB_PORT: ${process.env.DB_PORT}`);
      logToFile(`DB_NAME: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    const errorMessage = `Failed to initialize application: ${error.message}`;
    console.error(errorMessage);
    logToFile(errorMessage);
    process.exit(1);
  }
};

initApp();