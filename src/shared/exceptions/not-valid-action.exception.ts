import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class NotValidActionException extends BaseErrorException {
  statusCode: 416;
  constructor(message: string) {
    super(message);
  }
}
