import { Subjects } from '@sin-nombre/sinfood-common';
import {
  EventStatus,
  InternalEventsDoc,
  InternalEventsModel,
} from '../models/user-events';

export abstract class AbstractInternalEventHandler<
  M extends InternalEventsModel,
  D extends InternalEventsDoc
> {
  protected model;

  constructor(model: M) {
    this.model = model;
  }

  /**
   * It selects unsent events and publish them to nats
   * On success marks events as sent
   */
  public async handle() {
    console.log('----- Handling events -----');

    // Select unsent events
    const newEvents = await this.model.find({ status: EventStatus.PENDING });
    console.log(newEvents);
    newEvents.forEach(async (event: InternalEventsDoc) => {
      try {
        const publisher = this.selectPublisher(event.name as Subjects);
        // @ts-ignore
        await publisher.publish(event.data);
        await event.set({ status: EventStatus.COMPLETED }).save();
      } catch (e) {
        console.log(e.message);
      }
    });
  }

  abstract selectPublisher(subject: Subjects): any;
}
