import {
  Listener,
  Subjects,
  UserAddressDeletedEvent,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { UserAddress } from '../../models/user-address';

export class UserAddressDeletedListener extends Listener<UserAddressDeletedEvent> {
  subject: Subjects.UserAddressDeleted = Subjects.UserAddressDeleted;

  queueGroupName = queueGroupName;

  async onMessage(data: UserAddressDeletedEvent['data'], msg: Message) {
    const { id, version } = data;
    const userAddress = await UserAddress.findByEvent({
      id,
      version,
    });

    if (!userAddress) {
      throw new Error('User Address not found');
    }

    await userAddress.remove();

    msg.ack();
  }
}
