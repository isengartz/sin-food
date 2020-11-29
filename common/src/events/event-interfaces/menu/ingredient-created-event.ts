import { Subjects } from '../../subjects';

export interface IngredientCreatedEvent {
  subject: Subjects.IngredientCreated;
  data: {
    id: string;
    price: number;
  };
}
