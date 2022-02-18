import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/api-tree/domain/model/item.model';
import { ItemRepository } from 'src/api-tree/domain/ports/item.repository';
import { Repository } from 'typeorm';
import { ItemEntity } from '../entities/item.entity';
import { ItemEntityMapper } from '../mappers/item-entity.mapper';
import { UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class ItemRepositoryAdapter implements ItemRepository {
  private readonly logger = new Logger();
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}
  async findOne(item: Item): Promise<Item> {
    let results = await this.itemRepository.findOne(item.id.value);
    if (results) {
      const mapper = new ItemEntityMapper([results]);
      return mapper.makeOne();
    }
    return null;
  }
  async add(item: Item): Promise<Item> {
    let ob: ItemEntity = {
      label: item.label,
    };
    if (item?.parent?.id) {
      ob.parent = {
        id: item?.parent?.id?.getValue(),
      };
    }
    let results = await this.itemRepository.save(ob);
    const mapper = new ItemEntityMapper([results]);
    return mapper.makeOne();
  }
  async addByParentLabel(item: Item, label: string): Promise<Item> {
    let parent = await this.itemRepository.findOne({ label });
    if (parent) {
      let ob: ItemEntity = {
        label: item.label,
        parent: {
          id: parent.id,
        },
      };

      let results = await this.itemRepository.save(ob);
      const mapper = new ItemEntityMapper([results]);
      return mapper.makeOne();
    }

    return null;
  }

  async remove(item: Item): Promise<DeleteResult> {
    return await this.itemRepository.delete(item.id.value);
  }

  async update(item: Item): Promise<UpdateResult> {
    let itemUpdate: ItemEntity = {
      id: item.id.value,
      label: item.label,
    };
    if (item?.parent?.id) {
      itemUpdate.parent = {
        id: item?.parent?.id?.getValue(),
      };
    }
    return await this.itemRepository.update(item.id.value, itemUpdate);
  }

  async getAll(): Promise<Item[]> {
    let results = await this.itemRepository.find({
      relations: ['parent'],
      order: { id: 'ASC' },
    });
    const mapper = new ItemEntityMapper(results);
    return mapper.makeMany();
  }
}
