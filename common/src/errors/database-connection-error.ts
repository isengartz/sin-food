import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  readonly statusCode = 500;

  reason = 'Error Connecting to database';

  constructor() {
    super('Database connection Error');
    // Because we are extending a built in Class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
