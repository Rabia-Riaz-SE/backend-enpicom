import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function initializeDatabase() {
  // Create a new data source instance
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env?.DB_HOST,
    port: Number(process.env?.DB_PORT),
    username: process.env?.DB_USER,
    password: process.env?.DB_PASS,
    synchronize: Boolean(process.env?.DB_SYNC),
  });

  // Initialize the data source
  await dataSource.initialize();

  // Check if the database exists
  const databaseName = process.env.DB_NAME;
  const dbExists = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [databaseName],
  );

  if (dbExists.length === 0) {
    await dataSource.query(`CREATE DATABASE ${databaseName}`);
    console.log(`Database "${databaseName}" created successfully.`);
  } else {
    console.log(`Database "${databaseName}" already exists.`);
  }

  // Close the data source connection
  await dataSource.destroy();
}

// Main entry point
(async () => {
  try {
    await initializeDatabase();
  } catch (err) {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  }
})();
