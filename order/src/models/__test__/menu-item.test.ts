import mongoose from 'mongoose';
import { MenuItem } from '../menu-item';

it('should implements OOC', async (done) => {
  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  const firstInstance = await MenuItem.findById(menuItem.id);
  const secondInstance = await MenuItem.findById(menuItem.id);

  firstInstance!.set({ base_price: 6 });
  secondInstance!.set({ base_price: 7 });

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
  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  expect(menuItem.version).toEqual(0);
  await menuItem.save();
  expect(menuItem.version).toEqual(1);
  await menuItem.save();
  expect(menuItem.version).toEqual(2);
});
