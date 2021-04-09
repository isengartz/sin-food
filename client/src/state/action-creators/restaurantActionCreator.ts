import { AppThunk } from '../../util/types/AppThunk';
import { Dispatch } from 'redux';
import { RestaurantAction, SetRestaurantSearchFilters } from '../actions';
import { RestaurantTypes } from '../action-types';
import axios from '../../apis/instances/restaurant';
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
