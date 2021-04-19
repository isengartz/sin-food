import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import {
  ClearRestaurantErrors,
  RestaurantAction,
  SetRestaurantSearchFilters,
} from '../actions';
import { RestaurantTypes } from '../action-types';
import axiosRestaurantService from '../../apis/instances/restaurant';
import axiosQueryService from '../../apis/instances/query';
import { handleAxiosErrorMessage } from '../../util/handleAxiosErrorMessage';
import { RestaurantSearchFilters } from '../../util/interfaces/RestaurantSearchFilters';

/**
 * Fetch Restaurant Categories
 */
export const getRestaurantCategories = (): AppThunk => {
  return async (dispatch: Dispatch<RestaurantAction>) => {
    dispatch({ type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_START });
    try {
      const {
        data: {
          data: { restaurant_categories },
        },
      } = await axiosRestaurantService.get('/categories');
      dispatch({
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_SUCCESS,
        payload: restaurant_categories,
      });
      localStorage.setItem(
        'restaurantCategories',
        JSON.stringify(restaurant_categories),
      );
    } catch (e) {
      dispatch({
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Set up Search Filters
 * @param filters
 */
export const setRestaurantSearchFilters = (
  filters: RestaurantSearchFilters,
): SetRestaurantSearchFilters => ({
  type: RestaurantTypes.SET_RESTAURANT_SEARCH_FILTERS,
  payload: filters,
});

/**
 * Clear Restaurant Errors
 */
export const clearRestaurantErrors = (): ClearRestaurantErrors => ({
  type: RestaurantTypes.CLEAR_RESTAURANT_ERROR,
});

/**
 * Fetches Restaurants based on filters
 * @param filterString
 */
export const searchRestaurants = (filterString: string): AppThunk => {
  return async (dispatch: Dispatch<RestaurantAction>) => {
    dispatch({ type: RestaurantTypes.SEARCH_RESTAURANTS_START });
    try {
      const {
        data: {
          data: { restaurants },
        },
      } = await axiosQueryService.get(`/restaurants?${filterString}`);
      dispatch({
        type: RestaurantTypes.SEARCH_RESTAURANTS_SUCCESS,
        payload: restaurants,
      });
    } catch (e) {
      dispatch({
        type: RestaurantTypes.SEARCH_RESTAURANTS_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};

/**
 * Get the information of a restaurant
 * @param id
 */
export const getRestaurant = (id: string): AppThunk => {
  return async (dispatch: Dispatch<RestaurantAction>) => {
    dispatch({ type: RestaurantTypes.GET_RESTAURANT_START });
    try {
      const {
        data: {
          data: { restaurant },
        },
      } = await axiosRestaurantService.get(`/${id}`);
      dispatch({
        type: RestaurantTypes.GET_RESTAURANT_SUCCESS,
        payload: restaurant,
      });
    } catch (e) {
      dispatch({
        type: RestaurantTypes.GET_RESTAURANT_ERROR,
        payload: handleAxiosErrorMessage(e),
      });
    }
  };
};
