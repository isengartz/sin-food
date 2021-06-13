import type { Effect, Reducer } from 'umi';
import { UserRole, Weekdays } from '@sin-nombre/sinfood-common';
import { queryCurrent, query as queryUsers } from '@/services/user';

export interface RestaurantWorkingHours {
  day: Weekdays;
  open: number;
  close: number;
}

export type CurrentUser = {
  id: string;
  version: number;
  email: string;
  password?: string;
  name: string;
  description: string;
  full_address: string;
  minimum_order: number;
  logo: string | null;
  location: {
    type: string;
    coordinates: number[];
  };
  delivers_to: {
    type: string;
    coordinates: number[][][];
  };
  categories: string[];
  phone: string;
  enabled: boolean;
  role: UserRole;
  working_hours: RestaurantWorkingHours[];
  holidays: Date[];
  ratingsAverage: Number;
  ratingsQuantity: Number;
};

export type UserModelState = {
  currentUser?: CurrentUser;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    // @ts-ignore
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const userCached = localStorage.getItem('currentUser');
      let payload;
      if (!userCached) {
        const response = yield call(queryCurrent);
        payload = response.data.currentUser;
      } else {
        payload = JSON.parse(userCached);
      }
      yield put({
        type: 'saveCurrentUser',
        payload: payload,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
