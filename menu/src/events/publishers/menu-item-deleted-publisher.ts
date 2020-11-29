import {
  MenuItemDeletedEvent,
  Publisher,
  Subjects,
} from '@sin-nombre/sinfood-common';

export class MenuItemDeletedPublisher extends Publisher<MenuItemDeletedEvent> {
  readonly subject = Subjects.MenuItemDeleted;
}
