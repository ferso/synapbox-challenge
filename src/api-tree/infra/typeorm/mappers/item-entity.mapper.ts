import { Item } from 'src/api-tree/domain/model/item.model';
import { ItemEntity } from '../entities/item.entity';

export class ItemEntityMapper {
  private items: ItemEntity[];
  constructor(items?: ItemEntity[]) {
    this.items = items;
  }
  makeOne(): Item {
    return new Item(this.items[0].id, this.items[0].label);
  }
  makeMany(): Item[] {
    let items = [];
    for (let x in this.items) {
      let item = new Item(this.items[x].id, this.items[x].label);
      if (this.items[x].parent) {
        let parent = new Item(
          this.items[x]?.parent.id,
          this.items[x]?.parent.label,
        );
        item.addParent(parent);
      }
      items.push(item);
    }
    return items;
  }
  getChilds(item: ItemEntity) {}
}
