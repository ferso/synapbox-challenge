import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class NotValid extends BaseErrorException {
  statusCode: 411;
  constructor(message: string) {
    super(message);
  }
}
