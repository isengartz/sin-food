import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = "Error Connecting to database";
  readonly statusCode = 500;

  constructor() {
    super("Database connection Error");

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
