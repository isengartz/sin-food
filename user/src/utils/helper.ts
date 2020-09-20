import jwt from "jsonwebtoken";
class Helper {
  static signToken(payload: { id: string; email: string }) {
    return jwt.sign(payload, process.env.JWT_KEY!); // add the ! to remove TS error
  }
  static serializeToken(jwt: string) {
    return { jwt };
  }
}
export { Helper };
