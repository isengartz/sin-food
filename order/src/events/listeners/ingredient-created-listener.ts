import {
  Listener,
  IngredientCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ingredient } from '../../models/ingredient';

export class IngredientCreatedListener extends Listener<
  IngredientCreatedEvent
> {
  subject: Subjects.IngredientCreated = Subjects.IngredientCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: IngredientCreatedEvent['data'], msg: Message) {
    const { id, name, price } = data;
    const ingredient = Ingredient.build({
      id,
      name,
      price,
    });
    await ingredient.save();

    msg.ack();
  }
}
