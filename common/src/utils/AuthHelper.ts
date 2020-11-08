import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../interfaces/UserPayload';

class AuthHelper {
  // Sign the User Token
  static signToken(payload: UserPayload) {
    return jwt.sign(payload, process.env.JWT_KEY!); // add the ! to remove TS error
  }

  // Creates a JWT object with the token
  static serializeToken(token: string): { jwt: string } {
    return { jwt: token };
  }

  // Sign Serialize create cookie and send the request
  static createSendToken(
    user: UserPayload,
    statusCode: number,
    res: Response,
  ): void {
    // Create Token
    const token = AuthHelper.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  }
}
export { AuthHelper };
