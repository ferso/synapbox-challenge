import { Inject, Injectable, Logger } from '@nestjs/common';
import { Item } from 'src/api-tree/domain/model/item.model';
import { ItemRepository } from 'src/api-tree/domain/ports/item.repository';
import Symbols from 'src/symbols';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeedingService {
  constructor(
    @Inject(Symbols.ItemRepository)
    private itemRepository: ItemRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async seed(): Promise<void> {
    let seedItem = new Item(Number(process.env.ROOT_NODE), 'root');
    let result = await this.itemRepository.findOne(seedItem);
    if (!result) {
      await this.itemRepository.add(seedItem);
    }
  }
  async seedSchemaTest(): Promise<void> {
    let seedItem = new Item(Number(process.env.ROOT_NODE), 'root');
    let result = await this.itemRepository.findOne(seedItem);
    if (!result) {
      await this.itemRepository.add(seedItem);
      await this.itemRepository.addByParentLabel(new Item(null, 'ant'), 'root');
      await this.itemRepository.addByParentLabel(
        new Item(null, 'bear'),
        'root',
      );
      await this.itemRepository.addByParentLabel(new Item(null, 'cat'), 'bear');
      await this.itemRepository.addByParentLabel(new Item(null, 'dog'), 'bear');
      await this.itemRepository.addByParentLabel(
        new Item(null, 'elephant'),
        'dog',
      );
      await this.itemRepository.addByParentLabel(
        new Item(null, 'frog'),
        'root',
      );
    }
  }
}
