import { Item } from '../model/item.model';

export interface ItemRepository {
  findOne(item: Item): Promise<Item>;
  add(item: Item): Promise<Item>;
  remove(item: Item): Promise<unknown>;
  update(item: Item): Promise<unknown>;
  addByParentLabel(item: Item, label: string): Promise<unknown>;
  getAll(): Promise<Item[]>;
}
