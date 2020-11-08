import { CustomError } from './custom-error';

export class RouteNotFoundError extends CustomError {
  readonly statusCode = 404;

  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, RouteNotFoundError.prototype); // Because we are extending a built in Class
  }

  serializeErrors() {
    return [
      {
        message: 'Route Not Found',
      },
    ];
  }
}
