import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import {
  ClearRestaurantErrors,
  RestaurantAction,
  SetRestaurantSearchFilters,
} from '../actions';
import { RestaurantTypes } from '../action-types';
import axios from '../../apis/instances/restaurant';
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
      } = await axios.get('/categories');
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

export const setRestaurantSearchFilters = (
  filters: RestaurantSearchFilters,
): SetRestaurantSearchFilters => ({
  type: RestaurantTypes.SET_RESTAURANT_SEARCH_FILTERS,
  payload: filters,
});

export const clearRestaurantErrors = (): ClearRestaurantErrors => ({
  type: RestaurantTypes.CLEAR_RESTAURANT_ERROR,
});

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
