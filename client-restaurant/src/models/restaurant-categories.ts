import type { Reducer, Effect } from 'umi';
import { getAllCategories } from '@/services/restaurant-categories';

export type RestaurantCategoriesStateType = {
  status?: 'success' | 'error';
  categories: RestaurantCategory[];
};

export interface RestaurantCategory {
  name: string;
  id: string;
}
export type RestaurantCategoryModelType = {
  namespace: string;
  state: RestaurantCategoriesStateType;
  effects: {
    getAll: Effect;
  };
  reducers: {
    getAllCategories: Reducer<RestaurantCategoriesStateType>;
  };
};

const Model: RestaurantCategoryModelType = {
  namespace: 'restaurant_categories',

  state: {
    status: undefined,
    categories: [],
  },

  effects: {
    *getAll({ payload }, { call, put }) {
      const response = yield call(getAllCategories, payload);
      yield put({
        type: 'getAllCategories',
        payload: { status: response.status, categories: response.data.restaurant_categories },
      });
    },
  },

  reducers: {
    getAllCategories(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        categories: payload.categories,
      };
    },
  },
};

export default Model;
