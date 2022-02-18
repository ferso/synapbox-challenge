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
const dotenv = require('dotenv');
dotenv.config();

describe('GetAllItemsService specs', () => {
  const dbPath = process.env.DB_PATH_GETALL_TEST;
  const ajv = new Ajv();
  let getAllItemsService: GetAllItemsService;
  let addItemsService: AddItemsService;
  let seedingService: SeedingService;
  let itemRepository: ItemRepository;
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

    itemRepository = module.get<ItemRepository>(Symbols.ItemRepository);

    getAllItemsService = module.get<GetAllItemsService>(
      Symbols.GetAllItemsService,
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

  it('validate schema tree ', async () => {
    const schema = {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
        },
        label: {
          type: 'string',
        },
        children: {
          type: 'array',
          minItems: 1,
          items: { type: 'object' },
        },
      },

      required: ['id', 'label'],
    };

    let result = await getAllItemsService.execute();
    const validate = ajv.compile(schema);
    expect(validate(result)).toBe(true);
  });
});
