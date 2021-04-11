export const API_ROOT_ENDPOINT = '/api/v1';

export const RESTAURANT_CREATE_VALID_PAYLOAD = {
  id: '6071a18af7ad010019403014',
  name: 'Test',
  enabled: true,
  minimum_order: 5,
  logo: '',
  categories: ['category1', 'category2'],
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
      close: 1440,
    },
    {
      day: 2,
      open: 0,
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
