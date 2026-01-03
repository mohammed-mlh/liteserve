import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import initSqlJs, { Database } from 'sql.js';
import * as fs from 'fs';
import dotenv from "dotenv";
import { rowsToObjects, saveDatabase } from './db-utils';
import { DatabaseError, ValidationError, AuthenticationError } from './utils/errors';
import { errorHandler } from './utils/error-handler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

const DB_FILE = process.env.DB_FILE!;
const API_TOKEN = process.env.API_TOKEN!;

// Initialize SQL.js and load database
let db: Database;

async function initializeDatabase(): Promise<void> {
  try {
    const SQL = await initSqlJs();
    const filebuffer = fs.existsSync(DB_FILE) ? fs.readFileSync(DB_FILE) : undefined;
    db = new SQL.Database(filebuffer);
    console.log(`Database initialized from ${DB_FILE || 'new database'}`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check API token
app.use((req: Request, res: Response, next: NextFunction) => {
  // Check both Authorization header (Bearer token) and x-api-token header
  const authToken = req.headers['authorization']?.split(' ')[1];
  const apiToken = req.headers['x-api-token'] as string;
  const token = authToken || apiToken;
  
  if (token !== API_TOKEN) {
    return next(new AuthenticationError('Invalid or missing API token'));
  }
  next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, Express with TypeScript!' });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    database: db ? 'initialized' : 'not initialized'
  });
});

// Query endpoint
app.post("/query", (req, res, next) => {
  try {
    const { sql } = req.body;
    
    // Validate input
    if (!sql) {
      throw new ValidationError("SQL query is required");
    }
    
    if (typeof sql !== 'string') {
      throw new ValidationError("SQL query must be a string");
    }

    if (!db) {
      throw new DatabaseError("Database not initialized", 503);
    }

    // Determine query type (read or write)
    const firstWord = sql.trim().split(/\s+/)[0].toLowerCase();
    const isReadQuery = firstWord === "select" || firstWord === "show" || firstWord === "pragma";

    try {
      if (isReadQuery) {
        const result = db.exec(sql);
        const rows = rowsToObjects(result);
        res.json(rows);
      } else {
        db.run(sql);
        // Save database to file after write operations
        saveDatabase(db, DB_FILE);
        res.json({ success: true });
      }
    } catch (dbError: any) {
      // Wrap database errors with context
      throw new DatabaseError(
        `Database query failed: ${dbError.message || 'Unknown error'}`,
        500,
        dbError
      );
    }
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
})

// Start server after database initialization
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Error handler must be last middleware
app.use(errorHandler);

startServer();

