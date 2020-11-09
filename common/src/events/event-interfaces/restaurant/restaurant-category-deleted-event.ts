import { Subjects } from '../../subjects';

export interface RestaurantCategoryDeletedEvent {
  subject: Subjects.RestaurantCategoryDeleted;
  data: {
    id: string;
  };
}
