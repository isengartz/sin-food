import {
  handleListenerError,
  Listener,
  Subjects,
  UserAddressCreatedEvent,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { UserAddress } from '../../models/user-address';

export class UserAddressCreatedListener extends Listener<UserAddressCreatedEvent> {
  subject: Subjects.UserAddressCreated = Subjects.UserAddressCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: UserAddressCreatedEvent['data'], msg: Message) {
    try {
      const { id, location } = data;
      const userAddress = UserAddress.build({
        id,
        location,
      });

      await userAddress.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
