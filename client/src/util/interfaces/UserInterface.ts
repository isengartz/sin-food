import { UserAddress } from './UserAddress';

export interface UserInterface {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  addresses: UserAddress[];
}
