import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { IngredientUpdatedEvent } from '@sin-nombre/sinfood-common';
import { natsWrapper } from '../../nats-wrapper';
import { Ingredient } from '../../../models/ingredient';
import { IngredientUpdatedListener } from '../ingredient-updated-listener';

const setup = async () => {
  const listener = new IngredientUpdatedListener(natsWrapper.client);

  // Create and save ingredient
  const ingredient = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Ham',
    price: 5,
  }).save();

  // Create an update event payload
  const data: IngredientUpdatedEvent['data'] = {
    id: ingredient.id,
    name: 'new name',
    price: 7,
    version: ingredient.version + 1,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ingredient, msg };
};

it('should updated the ingredient', async () => {
  const { listener, data, ingredient, msg } = await setup();

  // call onMessage with the data object and fake msg object
  await listener.onMessage(data, msg);

  const updatedIngredient = await Ingredient.findById(ingredient.id);

  expect(updatedIngredient!.price).toEqual(data.price);
  expect(updatedIngredient!.name).toEqual(data.name);
  expect(updatedIngredient!.version).toEqual(data.version);
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
