import { RestaurantTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';

export type RestaurantAction =
  | GetRestaurantCategoriesStart
  | GetRestaurantCategoriesSuccess
  | GetRestaurantCategoriesError
  | SetRestaurantSearchFilters;

interface GetRestaurantCategoriesStart {
  type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_START;
}

interface GetRestaurantCategoriesSuccess {
  type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_SUCCESS;
  payload: {
    id: string;
    name: string;
  }[];
}
interface GetRestaurantCategoriesError {
  type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_ERROR;
  payload: ErrorType;
}

export interface SetRestaurantSearchFilters {
  type: RestaurantTypes.SET_RESTAURANT_SEARCH_FILTERS;
  payload: {
    address: string;
    categories: string[];
  };
}
