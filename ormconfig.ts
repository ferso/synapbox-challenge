import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(<string>process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  synchronize: true,
  migrationsRun: true,
  logging: false,
  migrations: [__dirname + '/migrations/**/*.ts'],
  cli: { migrationsDir: __dirname + '/migrations' },
};

export default ormconfig;
