import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { MenuItemCreatedEvent } from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { MenuItem } from '../../../models/menu-item';
import { MenuItemCreatedListener } from '../menu-item-created-listener';

const setup = async () => {
  const listener = new MenuItemCreatedListener(natsWrapper.client);

  const data: MenuItemCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Burger',
    base_price: 5,
    variations: [],
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('should create and save an MenuItem', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  const menuItem = await MenuItem.findById(data.id);

  expect(menuItem).toBeDefined();
  expect(menuItem!.base_price).toEqual(data.base_price);
  expect(menuItem!.name).toEqual(data.name);
  expect(menuItem!.version).toEqual(0);
});

it('should acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
