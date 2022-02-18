import { Item } from 'src/api-tree/domain/model/item.model';

export interface IGetAllItemsResponseDto {
  id: number;
  label: string;
  children?: IGetAllItemsResponseDto[];
}
export class GetAllItemsResponseDto {
  id: number;
  label: string;
  children?: GetAllItemsResponseDto[];
  constructor(private items: Item[]) {}
  make() {
    var elements = [];
    for (let x in this.items) {
      let item = this.items[x];
      elements[item.id.value] = item;
      //if this item has a parent then is a child
      if (item?.parent) {
        elements[item.parent.id.value].addChild(item);
      }
    }
    return elements
      .map((item: Item) => {
        let result = item?.serialize();
        return result;
      })
      .filter((item) => {
        return item;
      })[0];
  }
}
