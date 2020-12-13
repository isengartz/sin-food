import { MenuItem } from '../menu-item';
import { MenuItemCategory } from '../menu-item-category';

it('should implements optimistic concurrency control', async (done) => {
  const menuItemCategory = await MenuItemCategory.build({
    userId: 'uui12345',
    name: 'Meat',
  }).save();

  const menuItem = await MenuItem.build({
    userId: 'uui12345',
    description: 'super burger',
    name: 'Super Mexican Burger',
    base_price: 5,
    menu_category: menuItemCategory.id!,
    variations: [],
    main_ingredients: [],
    extra_ingredient_groups: [],
  }).save();

  // Get 2 instances
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

it('should increments the version number on multiple saves', async () => {
  const menuItemCategory = await MenuItemCategory.build({
    userId: 'uui12345',
    name: 'Meat',
  }).save();

  const menuItem = MenuItem.build({
    userId: 'uui12345',
    description: 'super burger',
    name: 'Super Mexican Burger',
    base_price: 5,
    menu_category: menuItemCategory.id!,
    variations: [],
    main_ingredients: [],
    extra_ingredient_groups: [],
  });

  await menuItem.save();
  expect(menuItem.version).toEqual(0);
  await menuItem.save();
  expect(menuItem.version).toEqual(1);
  await menuItem.save();
  expect(menuItem.version).toEqual(2);
});
