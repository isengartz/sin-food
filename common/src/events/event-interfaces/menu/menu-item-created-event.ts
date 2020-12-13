import { Subjects } from '../../subjects';

export interface MenuItemCreatedEvent {
  subject: Subjects.MenuItemCreated;
  data: {
    id: string;
    name: string;
    base_price: number;
    variations: { name: string; price: number }[];
  };
}
