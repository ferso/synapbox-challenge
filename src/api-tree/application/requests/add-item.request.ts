import { EmptyValueException } from 'src/shared/exceptions/empty-value-exception';
import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';

export interface AddItemRequestDto {
  parent?: number;
  label: string;
}
export class AddItemRequest {
  parent: number;
  label: string;
  constructor(input: AddItemRequestDto) {
    if (!input.parent) {
      throw new ValidRequiredException('parent id is required');
    }
    if (!input.parent || input.label.length < 1) {
      throw new EmptyValueException('label arg is required');
    }
    this.parent = Number(input.parent);
    this.label = input.label;
  }
}
