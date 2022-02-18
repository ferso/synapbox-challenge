import { AddItemRequest } from 'src/api-tree/application/requests/add-item.request';
import { DeleteItemRequest } from 'src/api-tree/application/requests/delete-item.request';
import { Item } from 'src/api-tree/domain/model/item.model';
import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { NotValidId } from 'src/shared/exceptions/not-valid-id.exception';
import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';
const dotenv = require('dotenv');
dotenv.config();

describe('DeleteItemRequest specs', () => {
  it('validate input requests values', async () => {
    let input = { id: 1 };
    let request = new DeleteItemRequest(input);
    expect(request.id).toEqual(input.id);
  });

  it('validate input with bad values', async () => {
    await expect(async () => {
      new DeleteItemRequest({ id: null });
    }).rejects.toThrow(ValidRequiredException);

    await expect(async () => {
      new DeleteItemRequest({ id: '' });
    }).rejects.toThrow(ValidRequiredException);
  });
});
