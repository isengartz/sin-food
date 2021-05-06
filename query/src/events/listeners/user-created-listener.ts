import {
  handleListenerError,
  Listener,
  Subjects,
  UserCreatedEvent,
} from '@sin-nombre/sinfood-common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    try {
      const { id, first_name, last_name, email, phone, role } = data;
      const user = User.build({
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
      });

      await user.save();

      msg.ack();
    } catch (e) {
      handleListenerError(e, msg);
    }
  }
}
