import type { Reducer, Effect } from 'umi';
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/services/menu-categories';

export type MenuCategoriesStateType = {
  status?: 'success' | 'error';
  categories: MenuCategoryInterface[];
};

export interface MenuCategoryInterface {
  name: string;
  id: string;
}
export type MenuCategoryModelType = {
  namespace: string;
  state: MenuCategoriesStateType;
  effects: {
    getAll: Effect;
    create: Effect;
    delete: Effect;
    update: Effect;
  };
  reducers: {
    getAllCategories: Reducer<MenuCategoriesStateType>;
    createCategory: Reducer<MenuCategoriesStateType>;
    deleteCategory: Reducer<MenuCategoriesStateType>;
    updateCategory: Reducer<MenuCategoriesStateType>;
  };
};

const Model: MenuCategoryModelType = {
  namespace: 'menu_categories',

  state: {
    status: undefined,
    categories: [],
  },

  effects: {
    *getAll({ payload }, { call, put }) {
      const response = yield call(getAllCategories, payload);
      console.debug(response, payload);
      yield put({
        type: 'getAllCategories',
        payload: { status: response.status, categories: response.data.menu_item_categories },
      });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteCategory, payload.id);
      yield put({
        type: 'deleteCategory',
        payload: { status: response.status, categoryId: payload.id },
      });
    },
    *create({ payload }, { call, put }) {
      // @todo: Its not implemented yet
      const response = yield call(createCategory, payload);
      yield put({
        type: 'getAllCategories',
        payload: { status: response.status, categories: response.data.menu_item_categories },
      });
    },
    *update({ payload }, { call, put }) {
      // @todo: Its not implemented yet
      const response = yield call(updateCategory, payload);
      yield put({
        type: 'updateCategory',
        payload: { status: response.status, category: response.data.menu_item_categories },
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
    deleteCategory(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        categories: state!.categories.filter((category) => category.id !== payload.categoryId),
      };
    },
    createCategory(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        categories: [...state!.categories, ...payload.category],
      };
    },
    updateCategory(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        categories: state!.categories.map((category) => {
          return category.id === payload.category.id ? payload.category : category;
        }),
      };
    },
  },
};

export default Model;
