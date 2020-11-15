import { RelationInterface } from '@sin-nombre/sinfood-common';

const ingredientRelation: RelationInterface = {
  model: 'Restaurant_Category',
  parentIdentifier: 'categories',
  childIdentifier: 'restaurants',
};
