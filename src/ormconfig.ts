import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';


export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  schema: process.env.DB_SCHEMA,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '/**/**.entity{.ts,.js}')],
  synchronize: false,
  extra: { trustServerCertificate: true },
  // logging: ['query'],
  migrations: [join(__dirname, '/migrations/*{.js,.ts}'), join(__dirname, '/migrations-test/*{.js,.ts}')],
  // cli: {
  //   migrationsDir: 'src/migrations'
  // },
  autoLoadEntities: true
};



export const dataSource = new DataSource({
  type: config.type,
  username: config.username,
  password: process.env.DB_PASSWORD,
  host: config.host,
  schema: config.schema,
  port: config.port,
  database: config.database,
  synchronize: config.synchronize,
  extra: config.extra,
  entities: ['/app/dist/**/**.entity{.ts,.js}'],
  migrations: [join(__dirname, '/migrations/*{.js,.ts}'), join(__dirname, '/migrations-test/*{.js,.ts}')]
});
