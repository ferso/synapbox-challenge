import { Id } from 'src/shared/value-objects/id.value-object';
import { SubItem } from './subitem.model';
import { EmptyValueException } from '../../../shared/exceptions/empty-value-exception';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';

export interface ItemProps {
  id?: Id;
  label: string;
  parent?: Item;
  children: SubItem[];
}

export class Item implements ItemProps {
  id?: Id;
  parent?: Item;
  label: string;
  children: SubItem[];

  constructor(id?: number, label?: string) {
    let idHelper = new Id(id);
    this.setId(idHelper);
    this.setLabel(label);
  }

  public setId(id: Id) {
    this.id = id;
  }

  public setLabel(label: string) {
    if (label != null) {
      if (label.length === 0) {
        // console.log(this.id.value, '-> label si -> ', label.length);
        throw new EmptyValueException(
          'label need to be a valid string, string is empty',
        );
      }
    }
    this.label = label;
  }
  public addChild(subitem: SubItem): void {
    if (!this.children) {
      this.children = [];
    }
    this.children?.push(subitem);
  }

  public addParent(item: Item): void {
    this.parent = item;
  }

  public serialize() {
    let children = [];
    for (let x in this.children) {
      children.push(this.children[x].serialize());
    }
    return {
      id: this.id?.getValue(),
      label: this.label,
      children: children,
    };
  }
  protectRoot() {
    if (this.id.value === Number(process.env.ROOT_NODE)) {
      throw new NotValidActionException(
        'You can not performance any action with the root item',
      );
    }
    return false;
  }
}
