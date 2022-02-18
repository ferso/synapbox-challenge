import { AddItemRequest } from 'src/api-tree/application/requests/add-item.request';
import { Item } from 'src/api-tree/domain/model/item.model';
import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { NotValidActionException } from 'src/shared/exceptions/not-valid-action.exception';
import { NotValidId } from 'src/shared/exceptions/not-valid-id.exception';
import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';
const dotenv = require('dotenv');
dotenv.config();

describe('AddItemRequest specs', () => {
  it('validate input requests values', async () => {
    let input = { parent: 123, label: 'qee' };
    let request = new AddItemRequest(input);
    expect(request.label).toEqual(input.label);
    expect(request.parent).toEqual(input.parent);
  });

  it('validate input requests values', async () => {
    let input = { parent: 123, label: 'qee' };
    let request = new AddItemRequest(input);
    expect(request.label).toEqual(input.label);
    expect(request.parent).toEqual(input.parent);
  });

  it('validate input with bad values', async () => {
    await expect(async () => {
      new AddItemRequest({ label: 'qee' });
    }).rejects.toThrow(ValidRequiredException);

    await expect(async () => {
      new AddItemRequest({ parent: 1, label: '' });
    }).rejects.toThrow(EmptyValueException);
  });
});
