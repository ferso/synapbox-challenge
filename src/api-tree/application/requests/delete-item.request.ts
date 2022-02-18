import { ValidRequiredException } from 'src/shared/exceptions/value-required.exception';

export interface DeletetemResponseDto {
  id: any;
}
export class DeleteItemRequest {
  id: number;
  constructor(input: DeletetemResponseDto) {
    if (!input.id || input.id.length === 0) {
      throw new ValidRequiredException('Id is requiered');
    }

    this.id = input.id;
  }
}
