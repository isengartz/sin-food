/**
 * Responses
 */
import { UserRole } from '@sin-nombre/sinfood-common';

export const mockedUserSignInResponse = {
  id: '6042e13ae9ebbb001a3a3ecc',
  email: 'test@test.com',
  role: UserRole.User,
  first_name: 'Test',
};

export const mockedUserRegisterResponse = {
  role: UserRole.User,
  email: 'test@test.com',
  first_name: 'Test',
  last_name: 'Test',
  phone: '+301234567890',
  id: '6042e13ae9ebbb001a3a3ecc',
};

export const mockedUserGetAddressesResponse = [
  {
    location: { type: 'Point', coordinates: [22.9584529, 40.6135547] },
    full_address: 'Xenofontos 17, Thessaloniki 546 41, Greece',
    floor: '3',
    description: 'House',
    user_id: '605876d6ec31900019b38803',
    version: 0,
    id: '605876d6ec31900019b38804',
  },
  {
    location: { type: 'Point', coordinates: [22.4099135, 39.6335901] },
    full_address: 'Mpampi Aninou 21, Larisa 412 56, Greece',
    floor: '6',
    description: 'House',
    user_id: '605876d6ec31900019b38803',
    version: 0,
    id: '605876d6ec31900019b38805',
  },
];

/**
 * Requests
 */

export const mockedUserSignInRequest = {
  email: 'test@test.com',
  password: 'testPassword',
};

export const mockedUserRegisterRequest = {
  email: 'test@test.com',
  first_name: 'Test',
  last_name: 'Test',
  password: 'testPassword',
  password_confirm: 'testPassword',
  role: UserRole.User,
  phone: '+301234567890',
};

export const mockedCreateAddressRequest = {
  location: { coordinates: [22.9584529, 40.6135547] },
  full_address: 'Xenofontos 17, Thessaloniki 546 41, Greece',
  floor: '3',
  description: 'House',
};
