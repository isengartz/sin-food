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
  minimum_order: 5,
  location: {
    coordinates: [22.9522107, 40.6095628],
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
  working_hours: [
    {
      day: 1,
      open: 0,
      close: 1440,
    },
    {
      day: 2,
      open: 0,
      close: 600,
    },
    {
      day: 2,
      open: 610,
      close: 1440,
    },
    {
      day: 3,
      open: 0,
      close: 1440,
    },
    {
      day: 4,
      open: 0,
      close: 1440,
    },
    {
      day: 5,
      open: 0,
      close: 1440,
    },
    {
      day: 6,
      open: 0,
      close: 1440,
    },
    {
      day: 0,
      open: 0,
      close: 1440,
    },
  ],
  holidays: [new Date('2020-11-10'), new Date('2020-11-11')],
};
export const REVIEW_CREATE_VALID_PAYLOAD_WITHOUT_RESTAURANT_ID = {
  orderId: 'test12345',
  userId: 'testUser',
  rating: 1.5,
  comment: 'You food sucks',
};
