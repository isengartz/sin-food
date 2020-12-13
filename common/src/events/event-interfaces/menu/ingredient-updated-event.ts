import { Subjects } from '../../subjects';

export interface IngredientUpdatedEvent {
  subject: Subjects.IngredientUpdated;
  data: {
    id: string;
    name: string;
    price: number;
    version: number;
  };
}
