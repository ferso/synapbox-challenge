const fs = require('fs');
const path = require('path');
import Symbols from 'src/symbols';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllItemsService } from 'src/api-tree/application/services/get-all-item.service';
import { ItemEntity } from 'src/api-tree/infra/typeorm/entities/item.entity';
import { SeedingService } from 'src/api-tree/infra/typeorm/services/seeding.service';
import Ajv from 'ajv';
import { AddItemsService } from 'src/api-tree/application/services/add-item.service';
import { DeleteItemsService } from 'src/api-tree/application/services/delete-item.service';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { ItemRepositoryAdapter } from 'src/api-tree/infra/typeorm/repositories/item.repository';
const dotenv = require('dotenv');
dotenv.config();

describe('DeleteItemsService specs', () => {
  const dbPath = process.env.DB_PATH_DELETE_TEST;

  const ajv = new Ajv();
  let getAllItemsService: GetAllItemsService;
  let addItemsService: AddItemsService;
  let deleteItemsService: DeleteItemsService;
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
          provide: Symbols.DeleteItemsService,
          useClass: DeleteItemsService,
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

    deleteItemsService = module.get<DeleteItemsService>(
      Symbols.DeleteItemsService,
    );
    seedingService = module.get<SeedingService>(SeedingService);
    await seedingService.seedSchemaTest();
  });

  afterAll(() => {
    try {
      fs.unlinkSync(path.resolve(dbPath));
    } catch (error) {}
  });

  it('validate delete item  ', async () => {
    let result = await getAllItemsService.execute();
    expect(result.children[1].children).toHaveLength(2);
    result = await deleteItemsService.execute({
      id: result.children[1].children[1].id,
    });
    expect(result.children[1].children).toHaveLength(1);
  });

  it('validate delete root item  ', async () => {
    await expect(async () => {
      await deleteItemsService.execute({ id: 1 });
    }).rejects.toThrow(NotValidActionException);
  });
});
