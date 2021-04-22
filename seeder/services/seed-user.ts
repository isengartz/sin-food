import axios from 'axios';
import faker from 'faker';
import { BASE_API_URL } from '../utils/const';

/**
 * Create a simple user
 */
export const seedUser = async () => {
  const userEmail = 'test@test.com';
  const password = 'testpass';

  const payload = {
    email: userEmail,
    password: password,
    password_confirm: password,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    full_address: faker.address.streetAddress(true),
    phone: '+306981234567',
    addresses: [
      {
        description: 'Home Address',
        floor: '3',
        full_address: 'Agiou Serafim 1, Thessaloniki 546 43',
        location: {
          coordinates: [22.9517725, 40.6089942],
        },
      },
    ],
  };

  const {
    // @ts-ignore
    data: {
      data: { user },
    },
    // eslint-disable-next-line no-await-in-loop
  } = await axios
    .post(`${BASE_API_URL}/users/signup`, payload)
    .catch((err) => console.log(err.response.data || err.message));

  if (user) {
    console.log(`User Created with Credentials: ${userEmail} ${password}`);
  }
};
