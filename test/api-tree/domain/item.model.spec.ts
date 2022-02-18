import { Item } from 'src/api-tree/domain/model/item.model';
import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { NotValidId } from 'src/shared/exceptions/not-valid-id.exception';
const dotenv = require('dotenv');
dotenv.config();

describe('Item Model specs', () => {
  it('validate referenced id value', async () => {
    await expect(async () => {
      const item = new Item(Number('asd'), 'root');
    }).rejects.toThrow(NotValidId);
  });

  it('validate label value', () => {
    const item = new Item(1, 'ok');
    expect(item.label).toEqual('ok');
  });
  it('validate label is empty ', async () => {
    const item = new Item(2);
    await expect(async () => {
      const item = new Item(2, '');
    }).rejects.toThrow(EmptyValueException);
  });

  it('validate root node protect method ', async () => {
    await expect(async () => {
      const item = new Item(Number(process.env.ROOT_NODE), 'root');
      item.protectRoot();
    }).rejects.toThrow(NotValidActionException);
  });
});
