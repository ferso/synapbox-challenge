import BaseErrorException from 'src/shared/exceptions/base-error.exception';

export class ParentRequiredException extends BaseErrorException {
  constructor(message: string) {
    super(message);
  }
}
