import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Aluno } from '../entities/aluno.entity';

const isTest = process.env.NODE_ENV === 'test';
const dbType = process.env.DB_TYPE || (isTest ? 'sqljs' : 'postgres');
const isSqljs = dbType === 'sqljs';

function buildOptions(): DataSourceOptions {
  if (dbType === 'sqljs') {
    return {
      type: 'sqljs',
      autoSave: false,
      entities: [Aluno],
      synchronize: isTest || isSqljs,
      dropSchema: isTest,
      logging: false
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'pulse_uc13',
    entities: [Aluno],
    synchronize: isTest,
    dropSchema: isTest,
    logging: false
  };
}

export const AppDataSource = new DataSource(buildOptions());

export async function initializeDatabase(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return AppDataSource;
}
