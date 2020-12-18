import mongoose from 'mongoose';
import { Ingredient } from '../ingredient';

it('should implements OOC', async (done) => {
  const ingredient = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 5,
    name: 'Bacon',
  }).save();

  const firstInstance = await Ingredient.findById(ingredient.id);
  const secondInstance = await Ingredient.findById(ingredient.id);

  firstInstance!.set({ price: 6 });
  secondInstance!.set({ price: 7 });

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
  const ingredient = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 5,
    name: 'Bacon',
  }).save();

  expect(ingredient.version).toEqual(0);
  await ingredient.save();
  expect(ingredient.version).toEqual(1);
  await ingredient.save();
  expect(ingredient.version).toEqual(2);
});
