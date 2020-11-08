export const API_ROOT_ENDPOINT = '/api/v1';
export const RESTAURANT_CREATE_VALID_PAYLOAD = {
  email: 'test@test.com',
  name: 'Super Delivery',
  description: 'Unique Pizza',
  full_address: 'Leoforos Megalou Alexandrou 12, Thessaloniki, 54651, Greece',
  logo: 'https://picsum.photos/300',
  password: 'test12345',
  password_confirm: 'test12345',
  phone: '+306981234567',
  location: {
    coordinates: [22.9492107, 40.6095628],
  },
  delivers_to: {
    coordinates: [
      [
        [22.95368, 40.615943],
        [22.9478039, 40.6041954],
        [22.9535116, 40.6087894],
        [22.95368, 40.615943],
      ],
    ],
  },
};
