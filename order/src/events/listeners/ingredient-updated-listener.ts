import {
  Listener,
  IngredientUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ingredient } from '../../models/ingredient';

export class IngredientUpdatedListener extends Listener<
  IngredientUpdatedEvent
> {
  subject: Subjects.IngredientUpdated = Subjects.IngredientUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: IngredientUpdatedEvent['data'], msg: Message) {
    const { id, name, price, version } = data;
    const ingredient = await Ingredient.findByEvent({ id, version });

    if (!ingredient) {
      throw new Error('Menu Item not found');
    }

    ingredient.set({ name, price });
    await ingredient.save();
    msg.ack();
  }
}
