import { Subjects } from '../../subjects';

export interface MenuItemDeletedEvent {
  subject: Subjects.MenuItemDeleted;
  data: {
    id: string;
    version: number;
  };
}
