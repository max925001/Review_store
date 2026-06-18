import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    logger.info('Starting database migrations...');
    const migrationsDir = path.join(__dirname, '../../migrations');

    // Read all sql files and sort them to run in sequential order
    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      logger.info(`Executing migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
    }

    logger.info('Database migrations completed successfully! All tables updated.');
    process.exit(0);
  } catch (error) {
    logger.error('Migration execution failed:', error);
    process.exit(1);
  }
};

runMigrations();
