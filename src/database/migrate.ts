import fs from 'fs';
import path from 'path';
import { pool } from './connection';

async function migrate(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Aplicando ${file}...`);
    await pool.query(sql);
  }

  await pool.end();
  console.log('Migrations concluidas.');
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
