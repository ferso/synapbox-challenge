const fs = require('fs');
const path = require('path');
import Symbols from 'src/symbols';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllItemsService } from 'src/api-tree/application/services/get-all-item.service';
import { ItemEntity } from 'src/api-tree/infra/typeorm/entities/item.entity';
import { ItemRepositoryAdapter } from 'src/api-tree/infra/typeorm/repositories/item.repository';
import { SeedingService } from 'src/api-tree/infra/typeorm/services/seeding.service';
import Ajv from 'ajv';
import { AddItemsService } from 'src/api-tree/application/services/add-item.service';
import { ItemRepository } from 'src/api-tree/domain/ports/item.repository';
import { DeleteItemsService } from 'src/api-tree/application/services/delete-item.service';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
const dotenv = require('dotenv');
dotenv.config();

describe('AddItemsService specs', () => {
  const dbPath = process.env.DB_PATH_ADD_TEST;

  let getAllItemsService: GetAllItemsService;
  let addItemsService: AddItemsService;
  let seedingService: SeedingService;
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: dbPath,
          logging: false,
          entities: [ItemEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ItemEntity]),
      ],
      providers: [
        {
          provide: Symbols.ItemRepository,
          useClass: ItemRepositoryAdapter,
        },
        {
          provide: Symbols.GetAllItemsService,
          useClass: GetAllItemsService,
        },

        {
          provide: Symbols.AddItemsService,
          useClass: AddItemsService,
        },

        SeedingService,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    getAllItemsService = module.get<GetAllItemsService>(
      Symbols.GetAllItemsService,
    );
    addItemsService = module.get<AddItemsService>(Symbols.AddItemsService);
    seedingService = module.get<SeedingService>(SeedingService);
    await seedingService.seedSchemaTest();
  });

  afterAll(() => {
    try {
      fs.unlinkSync(path.resolve(dbPath));
    } catch (error) {}
  });

  it('validate add item  ', async () => {
    let result = await getAllItemsService.execute();
    expect(result.children).toHaveLength(3);
    result = await addItemsService.execute({
      parent: 1,
      label: 'lion',
    });
    expect(result.children).toHaveLength(4);
  });
});
