import { Restaurant } from '../restaurant';
import { RESTAURANT_CREATE_VALID_PAYLOAD } from '../../utils/constants';

it('should implement OOC', async (done) => {
  await Restaurant.build(RESTAURANT_CREATE_VALID_PAYLOAD).save();

  const firstInstance = await Restaurant.findById(
    RESTAURANT_CREATE_VALID_PAYLOAD.id,
  );
  const secondInstance = await Restaurant.findById(
    RESTAURANT_CREATE_VALID_PAYLOAD.id,
  );

  firstInstance!.set({ name: 'Test Instance One' });
  secondInstance!.set({ name: 'Test Instance Two' });

  // save first instance
  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (e) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('should increment version on multiple saves', async () => {
  const restaurant = await Restaurant.build(
    RESTAURANT_CREATE_VALID_PAYLOAD,
  ).save();

  expect(restaurant.version).toEqual(0);
  await restaurant.save();
  expect(restaurant.version).toEqual(1);
  await restaurant.save();
  expect(restaurant.version).toEqual(2);
});
