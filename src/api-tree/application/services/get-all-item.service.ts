import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ItemRepository } from 'src/api-tree/domain/ports/item.repository';
import Symbols from 'src/symbols';
import {
  GetAllItemsResponseDto,
  IGetAllItemsResponseDto,
} from '../dtos/get-all-items-response.dto';
import { DatabaseException } from '../exceptions/database-exception';

@Injectable()
export class GetAllItemsService {
  private logger = new Logger();
  constructor(
    private moduleRef: ModuleRef,
    @Inject(Symbols.ItemRepository)
    private itemRepository: ItemRepository,
  ) {}
  test(): string {
    return 'GetAllItemsService';
  }
  async execute(): Promise<IGetAllItemsResponseDto> {
    try {
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
