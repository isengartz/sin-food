import { Ingredient } from '../ingredient';
import { IngredientCategory } from '../ingredient-category';

it('should implements optimistic concurrency control', async (done) => {
  const ingredientCategory = await IngredientCategory.build({
    userId: 'uui12345',
    name: 'Meat',
  }).save();

  const ingredient = await Ingredient.build({
    userId: 'uui12345',
    name: 'Bacon',
    defaultPrice: 5,
    category: ingredientCategory.id!,
  }).save();

  // Get 2 instances
  const firstInstance = await Ingredient.findById(ingredient.id);
  const secondInstance = await Ingredient.findById(ingredient.id);

  firstInstance!.set({ defaultPrice: 6 });
  secondInstance!.set({ defaultPrice: 7 });

  // save first instance
  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (e) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('should increments the version number on multiple saves', async () => {
  const ingredientCategory = await IngredientCategory.build({
    userId: 'uui12345',
    name: 'Meat',
  }).save();

  const ingredient = Ingredient.build({
    userId: 'uui12345',
    name: 'Bacon',
    defaultPrice: 5,
    category: ingredientCategory.id!,
  });
  await ingredient.save();
  expect(ingredient.version).toEqual(0);
  await ingredient.save();
  expect(ingredient.version).toEqual(1);
  await ingredient.save();
  expect(ingredient.version).toEqual(2);
});
