import request from 'supertest';
import mongoose from 'mongoose';
import { Subjects } from '@sin-nombre/sinfood-common';
import { app } from '../../../app';
import { API_ROOT_ENDPOINT } from '../../../utils/constants';
import { natsWrapper } from '../../../events/nats-wrapper';
import { MenuItemCategory } from '../../../models/menu-item-category';

it('should return 401 if user is not logged in', async () => {
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .send({})
    .expect(401);
});

it('should return 404 when Document does not exist', async () => {
  const cookie = global.signin();
  await request(app)
    .delete(`${API_ROOT_ENDPOINT}/menu/${mongoose.Types.ObjectId()}`)
    .set('Cookie', cookie)
    .send({})
    .expect(404);
});

it('should return 401 when user does not own the Document ', async () => {
  const cookie = global.signin();
  const cookieTwo = global.signin();

  const menuItemCategory = await MenuItemCategory.build({
    name: 'Burgers',
    userId: 'randomUserId',
  }).save();
  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({
      name: 'meat',
      userId: 'randomUserId',
      menu_category: menuItemCategory.id,
      base_price: 5,
    })
    .expect(201);
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`,
    )
    .set('Cookie', cookieTwo)
    .send({})
    .expect(401);
});

it('should return 204 when user doesnt own the Document but is Admin ', async () => {
  const cookie = global.signin();
  const cookieAdmin = global.signinAdmin();

  const menuItemCategory = await MenuItemCategory.build({
    name: 'Burgers',
    userId: 'randomUserId',
  }).save();
  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({
      name: 'meat',
      userId: 'randomUserId',
      menu_category: menuItemCategory.id,
      base_price: 5,
    })
    .expect(201);
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`,
    )
    .set('Cookie', cookieAdmin)
    .send({})
    .expect(204);
});

it('should return 204 when user owns the Document ', async () => {
  const cookie = global.signin();

  const menuItemCategory = await MenuItemCategory.build({
    name: 'Burgers',
    userId: 'randomUserId',
  }).save();
  const createResponse = await request(app)
    .post(`${API_ROOT_ENDPOINT}/menu`)
    .set('Cookie', cookie)
    .send({
      name: 'meat',
      userId: 'randomUserId',
      menu_category: menuItemCategory.id,
      base_price: 5,
    })
    .expect(201);
  await request(app)
    .delete(
      `${API_ROOT_ENDPOINT}/menu/${createResponse.body.data.menu_items.id}`,
    )
    .set('Cookie', cookie)
    .send({})
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventsPublished = (natsWrapper.client.publish as jest.Mock).mock.calls;

  // The Last Event from the end should be MenuItemDeleted
  expect(eventsPublished[eventsPublished.length - 1][0]).toEqual(
    Subjects.MenuItemDeleted,
  );
});
