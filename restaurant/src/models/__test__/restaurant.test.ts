import { Restaurant } from '../restaurant';
import { RESTAURANT_CREATE_VALID_PAYLOAD } from '../../utils/constants';

it('should implements OOC', async (done) => {
  const restaurant = await Restaurant.build(
    RESTAURANT_CREATE_VALID_PAYLOAD,
  ).save();

  const firstInstance = await Restaurant.findById(restaurant.id);
  const secondInstance = await Restaurant.findById(restaurant.id);

  firstInstance!.set({ minimum_order: 6 });
  secondInstance!.set({ minimum_order: 7 });

  // save first instance
  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (e) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('should increment the version number on multiple saves', async () => {
  const restaurant = await Restaurant.build(
    RESTAURANT_CREATE_VALID_PAYLOAD,
  ).save();

  expect(restaurant.version).toEqual(0);
  await restaurant.save();
  expect(restaurant.version).toEqual(1);
  await restaurant.save();
  expect(restaurant.version).toEqual(2);
});
