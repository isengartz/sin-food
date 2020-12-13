import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { IngredientCreatedEvent } from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { Ingredient } from '../../../models/ingredient';
import { IngredientCreatedListener } from '../ingredient-created-listener';

const setup = async () => {
  const listener = new IngredientCreatedListener(natsWrapper.client);

  const data: IngredientCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Ham',
    price: 5,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('should create and save an ingredient', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  const ingredient = await Ingredient.findById(data.id);

  expect(ingredient).toBeDefined();
  expect(ingredient!.price).toEqual(data.price);
  expect(ingredient!.name).toEqual(data.name);
  expect(ingredient!.version).toEqual(0);
});

it('should acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
