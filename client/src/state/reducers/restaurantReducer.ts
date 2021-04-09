import { RestaurantAction } from '../actions';
import { RestaurantTypes } from '../action-types';
import { ErrorType } from '../../util/types/ErrorType';
import { RestaurantSearchFilters } from '../../util/interfaces/RestaurantSearchFilters';

interface RestaurantState {
  loading: boolean;
  errors: ErrorType;
  searchFilters: RestaurantSearchFilters;
  categories: {
    id: string;
    name: string;
  }[];
}

const initialState: RestaurantState = {
  categories: localStorage.getItem('restaurantCategories')
    ? JSON.parse(localStorage.getItem('restaurantCategories') as string)
    : [],
  loading: false,
  errors: [],
  searchFilters: {
    categories: [],
    address: '',
  },
};

const reducer = (state = initialState, action: RestaurantAction) => {
  switch (action.type) {
    case RestaurantTypes.GET_RESTAURANT_CATEGORIES_START:
      return { ...state, loading: true, errors: [] };
    case RestaurantTypes.GET_RESTAURANT_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    case RestaurantTypes.GET_RESTAURANT_CATEGORIES_ERROR:
      return { ...state, loading: false, errors: action.payload };
    case RestaurantTypes.SET_RESTAURANT_SEARCH_FILTERS:
      return { ...state, searchFilters: action.payload };
    default:
      return state;
  }
};

export default reducer;
