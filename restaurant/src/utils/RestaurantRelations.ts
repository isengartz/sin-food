import { RelationInterface } from '@sin-nombre/sinfood-common';

const restaurantCatRelation: RelationInterface = {
  model: 'Restaurant_Category',
  parentIdentifier: 'categories',
  childIdentifier: 'restaurants',
};

export const restaurantRelationships: RelationInterface[] = [
  restaurantCatRelation,
];
