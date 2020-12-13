import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { MenuItemUpdatedEvent } from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { MenuItem } from '../../../models/menu-item';
import { MenuItemUpdatedListener } from '../menu-item-updated-listener';

const setup = async () => {
  const listener = new MenuItemUpdatedListener(natsWrapper.client);

  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Burger',
    base_price: 5,
    variations: [],
  }).save();

  const data: MenuItemUpdatedEvent['data'] = {
    id: menuItem.id!,
    name: 'Updated Burger',
    base_price: 10,
    variations: [],
    version: menuItem.version + 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, menuItem, msg };
};

it('should create and save an MenuItem', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  const menuItem = await MenuItem.findById(data.id);

  expect(menuItem).toBeDefined();
  expect(menuItem!.base_price).toEqual(data.base_price);
  expect(menuItem!.name).toEqual(data.name);
  expect(menuItem!.version).toEqual(data.version);
});

it('should acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('should not call ack if there is a version mismatch', async () => {
  const { data, listener, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
    // eslint-disable-next-line no-empty
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
