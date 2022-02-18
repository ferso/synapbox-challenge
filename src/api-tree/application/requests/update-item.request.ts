import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';

export interface UpdateItemRequestDto {
  id?: any;
  newParent: any;
}
export class UpdateItemRequest {
  id: any;
  newParent: any;
  constructor(input: UpdateItemRequestDto) {
    this.isNumeric(input.id);
    this.isNumeric(input.newParent);

    if (!input.id || input.id === 0 || input.id.length === '') {
      throw new ValidRequiredException('id is required');
    }

    if (
      !input.newParent ||
      input.newParent.length === '' ||
      input.newParent === 0
    ) {
      throw new ValidRequiredException('parent id is required');
    }

    this.id = input.id;
    this.newParent = input.newParent;
  }

  isNumeric(value) {
    if (isNaN(value)) {
      throw new ValidRequiredException('parent id is required');
    }
  }
}
