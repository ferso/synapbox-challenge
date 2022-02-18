import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeController } from 'src/api-tree/infra/http/controllers/tree.controller';
import Symbols from 'src/symbols';
import { AddItemsService } from './application/services/add-item.service';
import { DeleteItemsService } from './application/services/delete-item.service';
import { GetAllItemsService } from './application/services/get-all-item.service';
import { UpdateItemsService } from './application/services/update-item.service';
import { ItemEntity } from './infra/typeorm/entities/item.entity';
import { ItemRepositoryAdapter } from './infra/typeorm/repositories/item.repository';
import { SeedingService } from './infra/typeorm/services/seeding.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
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
    {
      provide: Symbols.AddItemsService,
      useClass: AddItemsService,
    },
    {
      provide: Symbols.DeleteItemsService,
      useClass: DeleteItemsService,
    },

    {
      provide: Symbols.UpdateItemsService,
      useClass: UpdateItemsService,
    },
    SeedingService,
  ],
})
export class ApiTreeModule implements OnApplicationBootstrap {
  constructor(private readonly seedingService: SeedingService) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.seedingService.seedSchemaTest();
  }
}
