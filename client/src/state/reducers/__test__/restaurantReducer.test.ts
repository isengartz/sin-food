import reducer from '../restaurantReducer';
import { RestaurantTypes } from '../../action-types';

const initialState = {
  categories: [],
  loading: false,
  errors: [],
  searchFilters: {
    categories: [],
    address: '',
  },
};

describe('Tests the Restaurant Reducer', () => {
  it('should return the initial state', () => {
    // @ts-ignore
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle get restaurant categories', () => {
    expect(
      reducer(undefined, {
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_START,
      }),
    ).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('should handle get restaurant categories success', () => {
    expect(
      reducer(undefined, {
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_SUCCESS,
        payload: [{ id: '123asd', name: 'Pizza' }],
      }),
    ).toEqual({
      ...initialState,
      categories: [{ id: '123asd', name: 'Pizza' }],
    });
  });

  it('should handle get restaurant categories error', () => {
    expect(
      reducer(undefined, {
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_ERROR,
        payload: [{ message: 'Error' }],
      }),
    ).toEqual({
      ...initialState,
      errors: [{ message: 'Error' }],
    });
  });

  it('should handle set restaurant filters', () => {
    expect(
      reducer(undefined, {
        type: RestaurantTypes.SET_RESTAURANT_SEARCH_FILTERS,
        payload: {
          address: 'asd12314',
          categories: ['asds123'],
        },
      }),
    ).toEqual({
      ...initialState,
      searchFilters: {
        address: 'asd12314',
        categories: ['asds123'],
      },
    });
  });
});
