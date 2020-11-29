import {
  MenuItemCreatedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class MenuItemCreatedPublisher extends Publisher<MenuItemCreatedEvent> {
  readonly subject = Subjects.MenuItemCreated;
}
