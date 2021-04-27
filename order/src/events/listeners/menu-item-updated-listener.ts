import {
  handleListenerError,
  Listener,
  MenuItemUpdatedEvent,
  Subjects,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { MenuItem } from '../../models/menu-item';

export class MenuItemUpdatedListener extends Listener<MenuItemUpdatedEvent> {
  subject: Subjects.MenuItemUpdated = Subjects.MenuItemUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: MenuItemUpdatedEvent['data'], msg: Message) {
    try {
      const { id, name, base_price, variations, version } = data;
      const menuItem = await MenuItem.findByEvent({ id, version });

      if (!menuItem) {
        throw new Error('Menu Item not found');
      }

      menuItem.set({ name, base_price, variations });
      await menuItem.save();
      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
