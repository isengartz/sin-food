import { UserRole } from '../enums/user-roles';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}
