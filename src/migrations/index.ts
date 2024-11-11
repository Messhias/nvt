import { connectDB } from '../database/connection';
import fs from 'fs';
import path from 'path';

export const runMigrations = async () => {
  const db = await connectDB();
  const migrationsPath = path.join(__dirname, 'initial_migration.sql');
  const migrations = fs.readFileSync(migrationsPath, 'utf8');
  await db.exec(migrations);
  console.log('Migrations applied successfully');
};
