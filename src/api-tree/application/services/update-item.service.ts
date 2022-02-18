import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Item } from 'src/api-tree/domain/model/item.model';
import { ItemRepository } from 'src/api-tree/domain/ports/item.repository';
import Symbols from 'src/symbols';
import {
  GetAllItemsResponseDto,
  IGetAllItemsResponseDto,
} from '../dtos/get-all-items-response.dto';
import { DatabaseException } from '../exceptions/database-exception';
import { ParentNotExistsException } from '../exceptions/parent-not-exist-exception';
import { UpdateItemRequest } from '../requests/update-item.request';

@Injectable()
export class UpdateItemsService {
  private logger = new Logger();
  constructor(
    private moduleRef: ModuleRef,
    @Inject(Symbols.ItemRepository)
    private itemRepository: ItemRepository,
  ) {}

  async test() {
    console.log('UpdateItemsService');
  }
  async execute(input: UpdateItemRequest): Promise<IGetAllItemsResponseDto> {
    const item = new Item(input.id, null);
    item.protectRoot();
    item.addParent(new Item(input.newParent, null));

    await this.findNode(item);
    await this.findParentNode(item);

    try {
      await this.itemRepository.update(item);
      const result = await this.itemRepository.getAll();
      return new GetAllItemsResponseDto(result).make();
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseException(
        'An error has ocurred when trying to add item',
      );
    }
  }

  async findParentNode(item) {
    //find parent node in database
    const dbParentItem = await this.itemRepository.findOne(item.parent);
    if (!dbParentItem) {
      throw new ParentNotExistsException(
        'the parent id that you are trying to change does not exist',
      );
    }
    return dbParentItem;
  }
  async findNode(item) {
    //find parent node in database
    const dbParentItem = await this.itemRepository.findOne(item);
    if (!dbParentItem) {
      throw new ParentNotExistsException(
        'the item id that you are trying to update does not exist',
      );
    }
    return dbParentItem;
  }
}
