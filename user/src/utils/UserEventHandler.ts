/* eslint-disable @typescript-eslint/indent */
import { Subjects } from '@sin-nombre/sinfood-common';
import { AbstractInternalEventHandler } from './AbstractEventHandler';
import { InternalEventsModel, InternalEventsDoc } from '../models/user-events';
import { natsWrapper } from '../events/nats-wrapper';
import { UserAddressCreatedPublisher } from '../events/publishers/user-address-created-publisher';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { UserAddressUpdatedPublisher } from '../events/publishers/user-address-updated-publisher';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { UserAddressDeletedPublisher } from '../events/publishers/user-address-deleted-publisher';

export class UserEventHandler extends AbstractInternalEventHandler<
  InternalEventsModel,
  InternalEventsDoc
> {
  /**
   * Selects the correct publisher based on Subject
   * @param subject
   */
  selectPublisher(subject: Subjects) {
    switch (subject) {
      case Subjects.UserAddressCreated:
        return new UserAddressCreatedPublisher(natsWrapper.client);
      case Subjects.UserAddressUpdated:
        return new UserAddressUpdatedPublisher(natsWrapper.client);
      case Subjects.UserAddressDeleted:
        return new UserAddressDeletedPublisher(natsWrapper.client);
      case Subjects.UserCreated:
        return new UserCreatedPublisher(natsWrapper.client);
      case Subjects.UserUpdated:
        return new UserUpdatedPublisher(natsWrapper.client);
      default:
        throw new Error('Publisher Not defined');
    }
  }
}
