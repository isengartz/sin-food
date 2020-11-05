import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  readonly statusCode = 401;

  constructor(public message = "Not Authorized to view this route") {
    super(message);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [
      {
        message: this.message,
      },
    ];
  }
}
