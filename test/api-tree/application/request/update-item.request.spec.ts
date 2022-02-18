import { AddItemRequest } from 'src/api-tree/application/requests/add-item.request';
import { DeleteItemRequest } from 'src/api-tree/application/requests/delete-item.request';
import { UpdateItemRequest } from 'src/api-tree/application/requests/update-item.request';
import { Item } from 'src/api-tree/domain/model/item.model';
import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { NotValidId } from 'src/shared/exceptions/not-valid-id.exception';
import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';
const dotenv = require('dotenv');
dotenv.config();

describe('UpdateItemRequest specs', () => {
  it('validate input requests values', async () => {
    let input = { id: 1, newParent: 123 };
    let request = new UpdateItemRequest(input);
    expect(request.id).toEqual(input.id);
    expect(request.newParent).toEqual(input.newParent);
  });

  it('validate input with bad values', async () => {
    await expect(async () => {
      new UpdateItemRequest({ id: null, newParent: null });
    }).rejects.toThrow(ValidRequiredException);
  });
  it('validate input with no numeric id', async () => {
    await expect(async () => {
      new UpdateItemRequest({ id: 'null', newParent: 'null' });
    }).rejects.toThrow(ValidRequiredException);
  });
});
