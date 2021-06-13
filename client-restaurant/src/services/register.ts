import { RestaurantWorkingHours } from '@/models/user';
import request from '@/utils/request';
import { UserRole } from '@sin-nombre/sinfood-common';

export type RegisterParamsType = {
  email: string;
  password: string;
  name: string;
  description: string;
  full_address: string;
  minimum_order: number;
  logo?: string;
  categories?: string[];
  location: {
    type?: string;
    coordinates: number[];
  };
  delivers_to: {
    type?: string;
    coordinates: number[][][];
  };
  phone: string;
  role?: UserRole;
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
};

export async function registerAccount(params: RegisterParamsType) {
  return request(`/restaurants`, {
    method: 'POST',
    data: params,
  });
}
