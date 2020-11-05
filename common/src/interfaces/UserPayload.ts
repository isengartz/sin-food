import { UserRole } from "..";

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}
