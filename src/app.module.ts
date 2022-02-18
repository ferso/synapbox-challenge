import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ApiTreeModule } from './api-tree/api-tree.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from 'ormconfig';
import { RawBodyMiddleware } from './shared/infra/rawBody.middleware';
import { JsonBodyMiddleware } from './shared/infra/jsonBodyMiddleware';
import { SeedingService } from './api-tree/infra/typeorm/services/seeding.service';
import { ItemEntity } from './api-tree/infra/typeorm/entities/item.entity';

@Module({
  imports: [
    ApiTreeModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db',
      logging: false,
      entities: [ItemEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// TypeOrmModule.forRoot({
//   ...ormconfig,
//   autoLoadEntities: true,
//   keepConnectionAlive: true,
// }),
