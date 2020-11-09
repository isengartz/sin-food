import { RelationInterface } from '@sin-nombre/sinfood-common';

const restaurantCategoryRelation: RelationInterface = {
  model: 'Restaurant',
  parentIdentifier: 'restaurants',
  childIdentifier: 'categories',
};

export const restaurantCategoryRelationships: RelationInterface[] = [
  restaurantCategoryRelation,
];
