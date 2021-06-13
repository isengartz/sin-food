import type { Reducer, Effect } from 'umi';
import { history } from 'umi';
import { registerAccount } from '@/services/register';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

export type RegisterStateType = {
  status?: 'success' | 'error';
};

export type RegisterModelType = {
  namespace: string;
  state: RegisterStateType;
  effects: {
    register: Effect;
  };
  reducers: {
    registerUser: Reducer<RegisterStateType>;
  };
};

const Model: RegisterModelType = {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(registerAccount, payload);
      yield put({
        type: 'registerUser',
        payload: response,
      });
      // Login successfully
      if (response.status === 'success') {
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('Success！Please wait until redirect finishes!');
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/');
            }
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },
  },

  reducers: {
    registerUser(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
