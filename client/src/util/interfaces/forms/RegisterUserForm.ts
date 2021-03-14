import { UserAddress } from '../UserAddress';

export interface RegisterUserForm {
  email: string;
  password: string;
  password_confirm: string;
  phone: string;
  prefix: string;
  addresses: UserAddress[];
}

export interface RegisterUserAddressForm {
  description: string;
  floor: string;
  full_address: string;
  latitude: number;
  longitude: number;
}
