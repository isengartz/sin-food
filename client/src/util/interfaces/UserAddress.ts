export interface UserAddress {
  description: string;
  floor: string;
  full_address: string;
  location: {
    type: string;
    coordinates: number[];
  };
}
