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

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --------------- Routes ------------------
app.use('/api/chat', chatRouter);

// --------------- Health check -------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Start server ------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
