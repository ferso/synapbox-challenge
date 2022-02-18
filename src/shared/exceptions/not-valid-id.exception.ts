import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class NotValidId extends BaseErrorException {
  constructor(message: string) {
    super(message);
  }
}
