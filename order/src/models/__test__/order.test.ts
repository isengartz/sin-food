import mongoose from 'mongoose';
import { MenuItem } from '../menu-item';
import { Ingredient } from '../ingredient';
import { Order } from '../order';
import { ADDRESS_INFO_PAYLOAD } from '../../utils/constants';

it('should implements OOC', async (done) => {
  const ingredient = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 5,
    name: 'Bacon',
  }).save();

  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  //@ts-ignore
  const order = await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    restaurantId: new mongoose.Types.ObjectId().toHexString(),
    address_info: ADDRESS_INFO_PAYLOAD,
    menu_items: [
      {
        item: menuItem.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredient.id],
          quantity: 1,
          variation: 'Small Size',
        },
      },
    ],
  }).save();

  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);

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

  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  //@ts-ignore
  const order = await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    restaurantId: new mongoose.Types.ObjectId().toHexString(),
    address_info: ADDRESS_INFO_PAYLOAD,
    menu_items: [
      {
        item: menuItem.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredient.id],
          quantity: 1,
          variation: 'Small Size',
        },
      },
    ],
  }).save();

  expect(order.version).toEqual(0);
  await order.save();
  expect(order.version).toEqual(1);
  await order.save();
  expect(order.version).toEqual(2);
});

it('should correctly calculate the order price', async () => {
  const ingredientBacon = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 1,
    name: 'Bacon',
  }).save();

  const ingredientHam = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 2,
    name: 'Ham',
  }).save();

  const ingredientCheese = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 0.5,
    name: 'Cheese',
  }).save();

  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  const menuItemTwo = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger Two',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 3 },
      { name: 'Large Size', price: 5 },
    ],
  }).save();

  const order = await Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    restaurantId: new mongoose.Types.ObjectId().toHexString(),
    address_info: ADDRESS_INFO_PAYLOAD,
    menu_items: [
      {
        item: menuItem.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [
            ingredientBacon.id, // 1
            ingredientCheese.id, // 0.5
            ingredientHam.id, // 2
          ],
          quantity: 1,
          variation: 'Small Size', // 5
        },
      },
      {
        item: menuItemTwo.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredientBacon.id, ingredientCheese.id], // 1 + 0,5
          quantity: 3,
          variation: 'Small Size', // 3
        },
      },
      {
        item: menuItemTwo.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredientBacon.id, ingredientCheese.id], // 1 + 0,5
          quantity: 2,
        },
      },
    ],
  }).save();
  // Formula (base_price/variation_price + ingredient_sum_price) * quantity
  // first one cost (5 + 3.5) * 1 = 8.5
  // second one cost (3 + 1.5) * 3 = 13.5
  // third one cost ( 5 + 1.5 ) * 2 = 13

  expect(order.price).toEqual(35);
});
