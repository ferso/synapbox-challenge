import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormconfig from 'ormconfig';

export const ormconfigcli: TypeOrmModuleOptions = {
  ...ormconfig,
  entities: ['src/infra/typeorm/entities/*.entity.ts'],
};

export default ormconfigcli;
