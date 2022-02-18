import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class ParentNotExistsException extends BaseErrorException {
  statusCode: 400;
  constructor(message: string) {
    super(message);
  }
}
