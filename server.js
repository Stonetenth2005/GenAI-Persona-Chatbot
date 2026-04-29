/**
 * Server Entry Point
 *
 * Initialises Express, mounts middleware and routes, and starts the server.
 * All business logic lives in src/routes and src/config.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './src/routes/chat.js';

dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --------------- Routes ------------------
app.use('/api/chat', chatRouter);

// --------------- Health check -------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Start server ------------
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
