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
import {
  AddItemRequest,
  AddItemRequestDto,
} from '../requests/add-item.request';

@Injectable()
export class AddItemsService {
  private logger = new Logger();
  constructor(
    private moduleRef: ModuleRef,
    @Inject(Symbols.ItemRepository)
    private itemRepository: ItemRepository,
  ) {}
  async execute(input: AddItemRequest): Promise<IGetAllItemsResponseDto> {
    const item = new Item(null, input.label);
    item.addParent(new Item(input.parent, null));
    await this.findParentNode(item);

    try {
      await this.itemRepository.add(item);
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
      throw new ParentNotExistsException('parent id does not exist');
    }
    return dbParentItem;
  }
}
