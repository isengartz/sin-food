import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const selectRestaurants = (state: RootState) => state.restaurants;

export const selectRestaurantCategories = createSelector(
  selectRestaurants,
  (restaurants) => restaurants.categories,
);

export const selectRestaurantFilters = createSelector(
  selectRestaurants,
  (restaurants) => restaurants.searchFilters,
);

export const selectRestaurantSearchIsLoading = createSelector(
  selectRestaurants,
  (restaurants) => restaurants.loading,
);
