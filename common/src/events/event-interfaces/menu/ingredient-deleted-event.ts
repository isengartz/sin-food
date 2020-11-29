import { Subjects } from '../../subjects';

export interface IngredientDeletedEvent {
  subject: Subjects.IngredientDeleted;
  data: {
    id: string;
    version: number;
  };
}
