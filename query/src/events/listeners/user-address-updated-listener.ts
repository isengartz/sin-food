import {
  Listener,
  Subjects,
  UserAddressUpdatedEvent,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { UserAddress } from '../../models/user-address';

export class UserAddressUpdatedListener extends Listener<UserAddressUpdatedEvent> {
  subject: Subjects.UserAddressUpdated = Subjects.UserAddressUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: UserAddressUpdatedEvent['data'], msg: Message) {
    const { id, version, location } = data;
    const userAddress = await UserAddress.findByEvent({
      id,
      version,
    });

    if (!userAddress) {
      throw new Error('User Address not found');
    }

    userAddress.set({ location });
    await userAddress.save();

    msg.ack();
  }
}
