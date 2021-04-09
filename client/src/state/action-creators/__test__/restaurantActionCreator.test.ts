import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { axiosUserInstance } from '../../../apis/instances/restaurant';
import { RestaurantTypes } from '../../action-types';
import { getRestaurantCategories } from '../restaurantActionCreator';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const mock = new MockAdapter(axiosUserInstance);
const store = mockStore();

describe('tests the Restaurant Action Creator', () => {
  beforeEach(() => {
    localStorage.clear();
    store.clearActions();
  });

  it('should fetch restaurant categories', async () => {
    // Mock Axios Post Request
    mock.onGet('/categories').reply(200, {
      data: {
        restaurant_categories: [
          { id: '1', name: 'Pizza' },
          { id: '2', name: 'Burger' },
        ],
      },
    });

    const expectedActions = [
      {
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_START,
      },
      {
        type: RestaurantTypes.GET_RESTAURANT_CATEGORIES_SUCCESS,
        payload: [
          { id: '1', name: 'Pizza' },
          { id: '2', name: 'Burger' },
        ],
      },
    ];

    // @ts-ignore
    await store.dispatch(getRestaurantCategories());
    // expect(localStorage.getItem('restaurantCategories')).toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });
});
