import { Client, ClientConfig } from 'pg';
import { DataSource } from 'typeorm';
import * as Entities from '@/entities';
import * as dotenv from 'dotenv';
dotenv.config();

const entitiesArray = Object.values(Entities);

async function createDatabaseIfNotExists() {
    const config : ClientConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: 'postgres', // Conectarse a base default para crear la otra
  }
  
  const client = new Client(config);
  

  await client.connect();
  const dbName = process.env.DB_NAME;

  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [dbName]);
  if (res.rowCount === 0) {
    console.log(`Creando base de datos ${dbName}...`);
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos creada.`);
  } else {
    console.log(`Base de datos ${dbName} ya existe.`);
  }
  await client.end();
}

async function createTables() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: entitiesArray, // tus entidades
    synchronize: true, // sincroniza el esquema (cuidado en producción)
  });

  await dataSource.initialize();
  console.log('Tablas creadas o sincronizadas');
  await dataSource.destroy();
}

void (async () => {
  try {
    await createDatabaseIfNotExists();
    await createTables();
    process.exit(0);
  } catch (error) {
    console.error('Error creando base de datos y tablas:', error);
    process.exit(1);
  }
})();
