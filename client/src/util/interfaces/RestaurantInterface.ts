import { UserRole } from '@sin-nombre/sinfood-common';
import { WorkingHoursInterface } from './WorkingHoursInterface';

export interface RestaurantInterface {
  id: string;
  version: number;
  email: string;
  password?: string;
  name: string;
  description: string;
  full_address: string;
  minimum_order: number;
  logo: string | null;
  location: {
    type: string;
    coordinates: number[];
  };
  delivers_to: {
    type: string;
    coordinates: number[][][];
  };
  categories: string[];
  phone: string;
  enabled: boolean;
  role: UserRole;
  working_hours: WorkingHoursInterface[];
  holidays: Date[];
}
