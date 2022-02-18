import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GetAllItemsResponseDto,
  IGetAllItemsResponseDto,
} from 'src/api-tree/application/dtos/get-all-items-response.dto';
import { UpdateItemRequest } from 'src/api-tree/application/requests/update-item.request';
import { AddItemsService } from 'src/api-tree/application/services/add-item.service';
import { DeleteItemsService } from 'src/api-tree/application/services/delete-item.service';
import { GetAllItemsService } from 'src/api-tree/application/services/get-all-item.service';
import { UpdateItemsService } from 'src/api-tree/application/services/update-item.service';
import { TreeController } from 'src/api-tree/infra/http/controllers/tree.controller';
import { ItemEntity } from 'src/api-tree/infra/typeorm/entities/item.entity';
import { ItemRepositoryAdapter } from 'src/api-tree/infra/typeorm/repositories/item.repository';
import { SeedingService } from 'src/api-tree/infra/typeorm/services/seeding.service';
import Symbols from 'src/symbols';
const dotenv = require('dotenv');
dotenv.config();

describe('TreeController', () => {
  let controller: TreeController;
  let getAllItemsService: GetAllItemsService;
  let seedingService: SeedingService;
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: '../db-test',
          logging: false,
          entities: [ItemEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ItemEntity]),
      ],
      controllers: [TreeController],
      providers: [
        {
          provide: Symbols.ItemRepository,
          useClass: ItemRepositoryAdapter,
        },
        {
          provide: Symbols.GetAllItemsService,
          useClass: GetAllItemsService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<TreeController>(TreeController);
  });

  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
