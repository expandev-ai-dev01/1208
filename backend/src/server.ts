import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware/error';
import { notFoundMiddleware } from '@/middleware/notFound';
import apiRoutes from '@/routes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors(config.api.cors));

// Request processing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

/**
 * @api {get} /health Health Check
 * @apiName HealthCheck
 * @apiGroup System
 * @apiVersion 1.0.0
 *
 * @apiDescription Returns server health status
 *
 * @apiSuccess {String} status Server status
 * @apiSuccess {String} timestamp Current timestamp
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.api.version,
  });
});

// API Routes with versioning
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handling
app.use(errorMiddleware);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Server startup
const server = app.listen(config.api.port, () => {
  console.log(
    `Server running on port ${config.api.port} in ${process.env.NODE_ENV || 'development'} mode`
  );
  console.log(`API available at http://localhost:${config.api.port}/api/${config.api.version}`);
});

export default server;
