import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype); // Because we are extending a built in Class
  }

  serializeErrors() {
    return [
      {
        message: this.message,
      },
    ];
  }
}
