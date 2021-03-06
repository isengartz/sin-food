import axios from 'axios';
import faker from 'faker';
import { BASE_API_URL } from '../utils/const';

const NUMBER_OF_RECORDS = 20;

/**
 *
 * @param categories
 * @param alwaysOpen
 */
export const seedRestaurants = async (
  categories: { id: string; name: string }[],
  alwaysOpen = false,
) => {
  const result = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
    const categoryOneIndex = Math.floor(Math.random() * categories.length);
    let categoryTwoIndex;
    do {
      categoryTwoIndex = Math.floor(Math.random() * categories.length);
    } while (categoryOneIndex === categoryTwoIndex);

    const payload = {
      email: faker.internet.email(),
      password: 'testpass',
      password_confirm: 'testpass',
      name: faker.company.companyName(),
      description: faker.company.catchPhrase(),
      full_address: faker.address.streetAddress(true),
      logo: faker.image.business(),
      phone: '+306981234567',
      location: {
        coordinates: [
          parseFloat(faker.address.longitude(22.94, 22.93)),
          parseFloat(faker.address.longitude(22.94, 22.93)),
        ],
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
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 2,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 3,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 4,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 5,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 6,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
        {
          day: 0,
          open: 0,
          close: alwaysOpen ? 1440 : Math.floor(Math.random() * 1440),
        },
      ],
      holidays: [
        new Date(faker.date.soon().setUTCHours(0, 0, 0, 0)),
        new Date(faker.date.soon().setUTCHours(0, 0, 0, 0)),
      ],
      categories: [
        categories[categoryOneIndex].id,
        categories[categoryTwoIndex].id,
      ],
      minimum_order: Math.floor(Math.random() * 5),
    };

    const {
      // @ts-ignore
      data: {
        data: { user },
      },
      // eslint-disable-next-line no-await-in-loop
    } = await axios
      .post(`${BASE_API_URL}/restaurants`, payload)
      .catch((err) => console.log(err.response.data || err.message));

    result.push(user);
  }
  return result;
};
