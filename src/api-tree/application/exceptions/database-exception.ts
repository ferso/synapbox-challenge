import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class DatabaseException extends BaseErrorException {
  statusCode: 500;
  constructor(message: string) {
    super(message);
  }
}
