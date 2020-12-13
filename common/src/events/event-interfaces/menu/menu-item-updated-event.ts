import { Subjects } from '../../subjects';

export interface MenuItemUpdatedEvent {
  subject: Subjects.MenuItemUpdated;
  data: {
    id: string;
    name: string;
    base_price: number;
    variations: { name: string; price: number }[];
    version: number;
  };
}
