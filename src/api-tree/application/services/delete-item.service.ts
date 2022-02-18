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
import {
  AddItemRequest,
  AddItemRequestDto,
} from '../requests/add-item.request';
import { DeleteItemRequest } from '../requests/delete-item.request';

@Injectable()
export class DeleteItemsService {
  private logger = new Logger();
  constructor(
    private moduleRef: ModuleRef,
    @Inject(Symbols.ItemRepository)
    private itemRepository: ItemRepository,
  ) {}
  async execute(input: DeleteItemRequest): Promise<IGetAllItemsResponseDto> {
    const item = new Item(input.id, null);
    item.protectRoot();
    try {
      await this.itemRepository.remove(item);
      const result = await this.itemRepository.getAll();
      return new GetAllItemsResponseDto(result).make();
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseException(
        'An error has ocurred when trying to add item',
      );
    }
  }
}
