export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message); // In order to print it to the server logs
    // Because we are extending a built in Class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
