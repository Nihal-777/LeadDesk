// Load environment variables immediately at startup, before importing route modules.
// This ensures that controllers and middlewares can resolve env variables correctly.
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

/**
 * Security Middleware:
 * Helmet helps secure the Express app by setting various HTTP response headers.
 */
app.use(helmet());

/**
 * Cross-Origin Resource Sharing (CORS):
 * Restricts access to the API endpoints to client requests originating from the CLIENT_URL.
 */
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

/**
 * Body Parsing Middlewares:
 * Allows the server to parse JSON payloads and URL-encoded query parameters.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Request Logging:
 * Logs HTTP requests in dev format for local readability or combined format for production.
 */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

/**
 * API Rate Limiting:
 * Prevents denial-of-service (DDoS) and brute-force attempts.
 * Limits each IP address to 200 requests per 15-minute window.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

/**
 * Application Routes:
 * Register public and protected routes for auth session validation and lead CRUD operations.
 */
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

/**
 * Health Check Endpoint:
 * Used by hosting environments (e.g., Render, Kubernetes) to monitor server status.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: process.env.NODE_ENV });
});

/**
 * Global Centralized Error Handling:
 * Intercepts all unhandled errors thrown inside controller routes and formats them cleanly.
 */
app.use(errorHandler);

export default app;
