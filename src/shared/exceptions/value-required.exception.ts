import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class ValidRequiredException extends BaseErrorException {
  constructor(message: string) {
    super(message);
  }
}
