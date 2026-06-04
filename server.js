import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeHandler from './api/analyze.js';
import chatHandler from './api/chat.js';
import searchSubsidiesHandler from './api/search-subsidies.js';

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Bind the Vercel serverless function handlers to Express routes
app.post('/api/analyze', analyzeHandler);
app.post('/api/chat', chatHandler);
app.post('/api/search-subsidies', searchSubsidiesHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Local Dev API Server running at: http://localhost:${PORT}`);
  console.log(`- POST http://localhost:${PORT}/api/analyze`);
  console.log(`- POST http://localhost:${PORT}/api/chat`);
  console.log(`- POST http://localhost:${PORT}/api/search-subsidies`);
  console.log(`==================================================\n`);
});

