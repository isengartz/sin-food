import { RestaurantTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';
import { RestaurantListItemInterface } from '../../util/interfaces/RestaurantListItemInterface';
import { RestaurantInterface } from '../../util/interfaces/RestaurantInterface';

export type RestaurantAction =
  | GetRestaurantCategoriesStart
  | GetRestaurantCategoriesSuccess
  | GetRestaurantCategoriesError
  | SetRestaurantSearchFilters
  | SearchRestaurantsStart
  | SearchRestaurantsSuccess
  | SearchRestaurantsError
  | ClearRestaurantErrors
  | GetRestaurantStart
  | GetRestaurantSuccess
  | GetRestaurantError;

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

export interface SearchRestaurantsStart {
  type: RestaurantTypes.SEARCH_RESTAURANTS_START;
}

export interface SearchRestaurantsSuccess {
  type: RestaurantTypes.SEARCH_RESTAURANTS_SUCCESS;
  payload: {
    open: RestaurantListItemInterface[];
    closed: RestaurantListItemInterface[];
  };
}
export interface SearchRestaurantsError {
  type: RestaurantTypes.SEARCH_RESTAURANTS_ERROR;
  payload: ErrorType;
}

export interface ClearRestaurantErrors {
  type: RestaurantTypes.CLEAR_RESTAURANT_ERROR;
}

export interface GetRestaurantStart {
  type: RestaurantTypes.GET_RESTAURANT_START;
}

export interface GetRestaurantSuccess {
  type: RestaurantTypes.GET_RESTAURANT_SUCCESS;
  payload: RestaurantInterface;
}

export interface GetRestaurantError {
  type: RestaurantTypes.GET_RESTAURANT_ERROR;
  payload: ErrorType;
}
