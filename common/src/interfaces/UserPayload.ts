import { UserRole } from '../enums/user-roles';

export interface UserPayload {
  id: string;
  email: string;
  first_name: string;
  role: UserRole;
}
