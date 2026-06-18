import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import pool from './config/database.js';

let server;

// Connect and verify database pool is healthy
const startServer = async () => {
  try {
    // Attempt database query check
    const dbCheck = await pool.query('SELECT NOW()');
    logger.info(`PostgreSQL database connected successfully. Current DB Time: ${dbCheck.rows[0].now}`);

    server = app.listen(env.PORT, () => {
      logger.info(`Server started running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Startup failed: Database connection could not be established.', error);
    process.exit(1);
  }
};

startServer();

// Handle uncaught exceptions (synchronous code errors)
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down server gracefully...', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle unhandled promise rejections (asynchronous code errors)
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down server gracefully...', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle termination signals for graceful cleanups (e.g. Docker, PM2)
const shutdownGracefully = (signal) => {
  logger.info(`${signal} received. Closing database pool and HTTP server...`);
  if (server) {
    server.close(async () => {
      await pool.end();
      logger.info('Database pool and HTTP server closed safely. Process exited.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdownGracefully('SIGTERM'));
process.on('SIGINT', () => shutdownGracefully('SIGINT'));

// Trigger nodemon reload after resolving port conflict
