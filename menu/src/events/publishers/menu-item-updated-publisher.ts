import {
  MenuItemUpdatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class MenuItemUpdatedPublisher extends Publisher<MenuItemUpdatedEvent> {
  readonly subject = Subjects.MenuItemUpdated;
}
