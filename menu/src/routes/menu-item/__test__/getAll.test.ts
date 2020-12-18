import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { MenuItemCategory } from '../../../models/menu-item-category';
import { MenuItem } from '../../../models/menu-item';

it('should return 200 and no payload when there is not one', async () => {
  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .send({})
    .expect(200);
  expect(response.body.data.menu_items).toEqual(null);
});

it('should return 2 results', async () => {
  const menuItemCategory = await MenuItemCategory.build({
    userId: 'random1234',
    name: 'Cheese',
  }).save();

  const menuItemOne = await MenuItem.build({
    userId: 'random1234',
    name: 'Super Burger',
    description: 'Test yo',
    base_price: 5,
    main_ingredients: [],
    variations: [],
    menu_category: menuItemCategory.id!,
    extra_ingredient_groups: [],
  }).save();

  const menuItemTwo = await MenuItem.build({
    userId: 'random1234',
    name: 'Super Burger Two',
    description: 'Test yo',
    base_price: 5,
    main_ingredients: [],
    variations: [],
    menu_category: menuItemCategory.id!,
    extra_ingredient_groups: [],
  }).save();

  const response = await request(app)
    .get(`${API_ROOT_ENDPOINT}/menu`)
    .send({})
    .expect(200);
  expect(response.body.data.menu_items.length).toEqual(2);
});
