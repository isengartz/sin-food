export interface UserAddressForm {
  description: string;
  floor: string;
  full_address: string;
  latitude: number;
  longitude: number;
}

export interface UserAddress {
  id: string;
  description: string;
  floor: string;
  full_address: string;
  location: {
    type: string;
    coordinates: number[];
  };
}
