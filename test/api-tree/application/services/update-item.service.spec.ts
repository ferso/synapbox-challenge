const fs = require('fs');
const path = require('path');
import Symbols from 'src/symbols';
import Ajv from 'ajv';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetAllItemsService } from 'src/api-tree/application/services/get-all-item.service';
import { ItemEntity } from 'src/api-tree/infra/typeorm/entities/item.entity';
import { SeedingService } from 'src/api-tree/infra/typeorm/services/seeding.service';
import { AddItemsService } from 'src/api-tree/application/services/add-item.service';
import { ItemRepositoryAdapter } from 'src/api-tree/infra/typeorm/repositories/item.repository';
import { UpdateItemsService } from 'src/api-tree/application/services/update-item.service';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { UpdateItemRequest } from 'src/api-tree/application/requests/update-item.request';
import { ParentNotExistsException } from 'src/api-tree/application/exceptions/parent-not-exist-exception';
const dotenv = require('dotenv');
dotenv.config();

describe('UpdateItemsService specs', () => {
  const dbPath = process.env.DB_PATH_UPDATE_TEST;
  const ajv = new Ajv();
  let getAllItemsService: GetAllItemsService;
  let updateItemsService: UpdateItemsService;
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
          provide: Symbols.UpdateItemsService,
          useClass: UpdateItemsService,
        },
        {
          provide: Symbols.AddItemsService,
          useClass: AddItemsService,
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

    updateItemsService = module.get<UpdateItemsService>(
      Symbols.UpdateItemsService,
    );

    addItemsService = module.get<AddItemsService>(Symbols.AddItemsService);

    seedingService = module.get<SeedingService>(SeedingService);
    await seedingService.seedSchemaTest();
  });

  afterAll(() => {
    try {
      module.close();
      fs.unlinkSync(path.resolve(dbPath));
    } catch (error) {}
  });

  it('validate update item parent does not exist', async () => {
    await expect(async () => {
      await updateItemsService.execute(
        new UpdateItemRequest({
          id: 2,
          newParent: 12,
        }),
      );
    }).rejects.toThrow(ParentNotExistsException);
  });

  it('validate update item ', async () => {
    let result = await addItemsService.execute({ parent: 1, label: 'lion' });
    result = await addItemsService.execute({ parent: 1, label: 'tiger' });

    //expect 5 in root node
    expect(result.children).toHaveLength(5);
    //expect 0 in ant node
    expect(result.children[0].children).toHaveLength(0);

    result = await updateItemsService.execute(
      new UpdateItemRequest({
        newParent: 2,
        id: result.children[4].id,
      }),
    );

    //expect 4 in root node
    expect(result.children).toHaveLength(4);
    //expect 1 in ant node
    expect(result.children[0].children).toHaveLength(1);
  });

  it('validate update root item', async () => {
    await expect(async () => {
      let result = await updateItemsService.execute(
        new UpdateItemRequest({
          id: 1,
          newParent: 2,
        }),
      );
    }).rejects.toThrow(NotValidActionException);
  });
});
