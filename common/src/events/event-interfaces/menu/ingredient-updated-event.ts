import { Subjects } from '../../subjects';

export interface IngredientUpdatedEvent {
  subject: Subjects.IngredientUpdated;
  data: {
    id: string;
    price: number;
    version: number;
  };
}
