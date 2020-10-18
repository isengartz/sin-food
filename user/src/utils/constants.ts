import { UserRole } from "@sin-nombre/sinfood-common";

export const API_ROOT_ENDPOINT = "/api/v1";

export const USER_CREATE_VALID_PAYLOAD = {
  email: "test@test.com",
  first_name: "Jon",
  last_name: "Smith",
  password: "test12345",
  password_confirm: "test12345",
  phone: "+306980000000",
  role: UserRole.User,
};

export const USER_ADDRESS_CREATE_VALID_PAYLOAD = {
  description: "Home Address",
  floor: "3",
  full_address: "White Tower , 54645, Thessaloniki, Greece",
  location: {
    coordinates: [12.12321312, -12.12321312],
  },
};
