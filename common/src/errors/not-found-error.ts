import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor() {
    super("Route Not found");
    // Because we are extending a built in Class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: "Not Found",
      },
    ];
  }
}
