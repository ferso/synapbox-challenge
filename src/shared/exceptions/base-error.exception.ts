export default class BaseErrorException extends Error {
  statusCode = 406;
  constructor(message: string) {
    super(message);
  }
}
