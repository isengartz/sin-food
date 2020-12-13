import {
  Listener,
  MenuItemCreatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { MenuItem } from '../../models/menu-item';

export class MenuItemCreatedListener extends Listener<MenuItemCreatedEvent> {
  subject: Subjects.MenuItemCreated = Subjects.MenuItemCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: MenuItemCreatedEvent['data'], msg: Message) {
    const { id, name, base_price, variations } = data;
    const menuItem = MenuItem.build({
      id,
      name,
      base_price,
      variations,
    });
    await menuItem.save();

    msg.ack();
  }
}
